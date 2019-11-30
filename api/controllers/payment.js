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

    if(paymentDetails.cardId)
    {
        card = await db.card.findOne({
            where: {
                id: paymentDetails.cardId,
                userId: req.user.id
            }
        });
    }
    else
    {
        card = await getDefaultCard(req.user.id);
    }

    if(!card)
    {
        res.status(400).send({
            message: 'No card found.'
        });
        return;
    }

    if(!await isInLimits(card.id, paymentDetails.amount))
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
        accepted: result
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

function vignettePurchaseAsync(req, res) {

}

function listPayments(req, res) {
    listPaymentsAsync(req, res);
}

function listPaymentsAsync(req, res) {

}

async function getDefaultCard(userId) {

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