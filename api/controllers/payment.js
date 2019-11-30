const db = require('../models');
const vendorService = require('../services/vendorService');
const securePayment = require('../services/securePayment');
const Op = db.Sequelize.Op;

function genericPayment(req, res) {
    genericPaymentAsync(req, res);
}

async function genericPaymentAsync(req, res) {
    let paymentDetails = req.swagger.params.paymentDetails.value;

    let card = null;
    try {
        card = await getCard(req.user.id, paymentDetails.cardId);
    } catch (error) {
        res.status(400).send({
            message: error.message
        })
        return;
    }

    if(!(await isInLimits(card.id, paymentDetails.amount)))
    {
        res.status(400).send({
            message: 'Card limit reached.'
        });
        return;
    }

    let vendors = await vendorService.getVendors();

    let vendor = vendors.filter(vendor => vendor.id === paymentDetails.vendorId);

    if(vendor.length === 0)
    {
        res.status(400).send({
            message: 'Vendor not found'
        });
        return;
    }
    else
    {
        vendor = vendor[0];
    }

    let date = new Date().toISOString().replace(/T/,' ').replace(/\..+/, '');

    let result = await securePayment.startPayment(card, {
        vendor,
        amount: paymentDetails.amount,
        referenceNumber: paymentDetails.referenceNumber
    });

    await db.payment.create({
        vendorId: vendor.id,
        amount: paymentDetails.amount,
        referenceNumber: paymentDetails.referenceNumber,
        remarks: `Paid ${paymentDetails.amount}€ to ${vendor.name} on ${date}.`,
        accepted: result,
        cardId: card.id
    });

    if(result)
    {
        res.status(200).json();
    }
    else
    {
        res.status(400).send({
            message: 'Payment rejected.'
        })
    }
}

function vignettePurchase(req, res) {
    vignettePurchaseAsync(req, res);
}

async function vignettePurchaseAsync(req, res) {
    const pricing = {
        D1: {
            weekly: 10,
            monthly: 20,
        },
        D2: {
            weekly: 25,
            monthly: 35
        }, 
        B2: {
            weekly: 60,
            monthly: 75,
        },
        D1m: {
            weekly: 5,
            monthly: 9
        },
        U: {
            weekly: 10,
            monthly: 15
        }
    }

    let order = req.swagger.params.order.value;

    let price = pricing[order.vehicleCategory][order.vignetteType];

    let card = null;
    try {
        card = await getCard(req.user.id, order.cardId);
    } catch (error) {
        res.status(400).send({
            message: error.message
        })
        return;
    }

    if(!(await isInLimits(card.id, price)))
    {
        res.status(400).send({
            message: 'Card limit reached.'
        });
        return;
    }

    let date = new Date().toISOString().replace(/T/,' ').replace(/\..+/, '');

    let result = await securePayment.purchaseVignette(card, {
        plateNumber: order.plateNumber,
        vehicleCategory: order.vehicleCategory,
        amount: price,
    });

    let vendors = await vendorService.getVendors();

    let vendor = vendors.filter(vendor => vendor.name === 'Magyar Közút Nonprofit Zrt.');
    if(vendor.length > 0)
    {
        vendor = vendor[0];
    }
    else
    {
        console.error('"Magyar Közút Zrt." (hard coded vendor) not found. Please verify that vendors.json exists.');
        process.exit(1);
    }

    await db.payment.create({
        vendorId: vendor.id,
        amount: price,
        referenceNumber: result.refNo,
        remarks: `${order.vignetteType} vignette purchase for ${price}€ to ${vendor.name} on ${date} for vehile ${order.plateNumber}.`,
        accepted: result.success,
        cardId: card.id
    });

    if(result.success)
    {
        res.status(200).json();
    }
    else
    {
        res.status(400).send({
            message: 'Payment rejected.'
        })
    }
}

async function getCard(userId, cardId = null) {
    if(cardId)
    {
        card = await db.card.findOne({
            where: {
                id: cardId,
                userId: userId
            }
        });
    }
    else
    {
        card = await getDefaultCard(userId);

        // this may be kind of retarded now that I think about it,
        // but I just want to make this junk work
        if(!card)
        {
            card = await db.card.findOne({
                where: {
                    userId: userId
                }
            });
        }
    }

    if(!card)
    {
        throw Error('No card found.');
    }

    return card;
}

function listPayments(req, res) {
    listPaymentsAsync(req, res);
}

async function listPaymentsAsync(req, res) {
    let cardId = req.swagger.params.cardid;

    let payments;

    if(cardId)
    {
        let card = await db.card.findOne({
            where: {
                id: cardId,
                userId: req.user.id
            }
        });

        if(!card)
        {
            res.status(400).send({
                message: 'Card not found'
            })
        }

        payments = await db.payment.findAll({
            where: {
                cardId
            }
        });
    }
    else
    {
        let cardsOfUser = await db.card.findAll({
            where: {
                userId: req.user.id
            }
        });

        cardsOfUser = cardsOfUser.map(card => card.id);

        payments = await db.payment.findAll({
            where: {
                cardId: {
                    [Op.in]: cardsOfUser
                }
            }
        });
    }

    payments = payments.map(payment => payment.dataValues)

    return res.status(200).send(payments);
}

async function getDefaultCard(userId) {
    return await db.card.findOne({
        where: {
            default: true,
            userId
        }
    })
}

async function isInLimits(cardId, amount)
{
    return isInDailyLimit(cardId, amount) && isInMonthlyLimit(cardId, amount);
}

async function isInDailyLimit(cardId, amount)
{
    let card = await db.card.findOne({
        where:{
            id: cardId
        }
    });

    let dailyLimit = card.dailyLimit;

    let currentDate = new Date();
    let today00 = new Date(
        currentDate.getFullYear(), 
        currentDate.getMonth(),
        currentDate.getDay(),
        0,
        0,
        0
    );

    let today2359 = new Date(
        currentDate.getFullYear(), 
        currentDate.getMonth(),
        currentDate.getDay(),
        23,
        59,
        59
    );

    let paymentsToday = await db.payment.findAll({
        where: {
            createdAt: {
                [Op.between]: [today00, today2359],
            },
            accepted: true
        }
    });

    let paymentsSum = paymentsToday.map(
        payment => payment.amount)
        .reduce(
            (sum, amount) => sum + amount,
            0
        );

    return (paymentsSum + amount) < dailyLimit;
}

async function isInMonthlyLimit(cardId, amount)
{
    let card = await db.card.findOne({
        where:{
            id: cardId
        }
    });

    let monthlyLimit = card.monthlyLimit;

    if(monthlyLimit === 0)
    {
        return true;
    }

    let currentDate = new Date();
    let firstDayOfMonth = new Date(
        currentDate.getFullYear(), 
        currentDate.getMonth(),
        1,
        0,
        0,
        0
    );

    let lastDayOfMonth = new Date(
        currentDate.getFullYear(), 
        currentDate.getMonth(),
        0,
        23,
        59,
        59
    );

    let paymentsThisMonth = await db.payment.findAll({
        where: {
            createdAt: { 
                [Op.between]: [firstDayOfMonth, lastDayOfMonth] 
            },
            accepted: true
        }
    });

    let paymentsSum = paymentsThisMonth.map(
        payment => payment.amount)
        .reduce(
            (sum, amount) => sum + amount,
            0
        );

    return (paymentsSum + amount) < monthlyLimit;
}

module.exports = {
    genericPayment,
    vignettePurchase,
    listPayments
}