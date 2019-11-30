const db = require('../models');
const cardValidator = require('card-validator');

function listCards(req, res) {
    listCardsAsync(req, res);
}

async function listCardsAsync(req, res) {
    let cards = (await db.card.findAll({
        where: {
            userId: req.user.id
        },
        attributes: [
            'cardNumber', 
            'nameOfBank', 
            'nameOnCard',
            'expiry',
            'payPass',
            'dailyLimit',
            'cvv',
            'default',
            'id'
        ],
        order: [
            ['default', 'desc']
        ]
    })).map(card => card.dataValues);

    res.json(cards);
}

function storeCard(req, res) {
    storeCardAsync(req, res);
}

async function storeCardAsync(req, res) {
    let cardInfo = req.swagger.params.cardinfo.value;

    try {
        await validateCreditCard(cardInfo, req.user.id);
    } catch (error) {
        res.status(400).send({
            message: error.message
        });
        return;
    }

    if(cardInfo.default === 'true' || cardInfo.default === true)
    {
        await setAllCardsAsNonDefault(req.user.id);
    }

    await db.card.create({
        cardNumber: cardInfo.cardNumber,
        nameOfBank: cardInfo.nameOfBank,
        nameOnCard: cardInfo.nameOnCard,
        expiry: cardInfo.expiry,
        payPass: cardInfo.payPass,
        dailyLimit: cardInfo.dailyLimit,
        cvv: cardInfo.cvv,
        default: cardInfo.default,
        monthlyLimit: cardInfo.monthlyLimit || 0,
        userId: req.user.id
    });

    res.status(200).json();
}

function updateCard(req, res) {
    updateCardAsync(req, res);
}

async function updateCardAsync(req, res) {
    let cardId = req.swagger.params.cardid.value;

    let cardInfo = req.swagger.params.cardinfo.value;

    let card = await db.card.findOne({
        where: {
            id: cardId
        }
    });

    if(!card)
    {
        res.status(404).send({
            message: 'Card not found'
        });

        return;
    }

    if(card.userId !== req.user.id)
    {
        res.status(403).send({
            message: 'User tried to update a card which does not belong to them'
        });

        return;
    }

    try {
        console.log(cardInfo.cardNumber, card.cardNumber);
        validateCreditCard(
            cardInfo, 
            req.user.id, 
            card.cardNumber !== cardInfo.cardNumber
        );
    } catch (error) {
        res.status(400).send({
            message: error.message
        })

        return;
    }

    if(cardInfo.default === 'true' || cardInfo.default === true)
    {
        await setAllCardsAsNonDefault(req.user.id);
    }

    Object.keys(cardInfo).forEach(key => {
        card[key] = cardInfo[key];
    })

    await card.save();

    res.status(200).json();
}

function removeCard(req, res) {
    removeCardAsync(req, res);
}

async function removeCardAsync(req, res) {
    let cardId = req.swagger.params.cardid.value;

    let card = await db.card.findOne({
        where: {
            userId: req.user.id,
            id: cardId
        }
    });

    if(!card)
    {
        res.status(404).send({
            message: 'Card not found'
        })
        
        return;
    }

    await card.destroy();

    res.status(200).json();
}

async function validateCreditCard({ cardNumber, expiry }, userId = undefined, checkForExistingCardNumber = true)
{
    let validNumber = cardValidator.number(cardNumber);
    if(!validNumber.isPotentiallyValid) {
        throw Error('Invalid card number!');
    }

    let validExpiration = cardValidator.expirationDate(expiry);
    if(!validExpiration.isPotentiallyValid) {
        throw Error('Invalid expiration date!');
    }

    if(userId && checkForExistingCardNumber) {
        let cards = await db.card.findAll({
            where: {
                cardNumber,
                userId
            }
        });
        
        if(cards.length > 0)
        {
            throw Error('Credit card with the same card number already exists for this user.');
        }
    }
    
}

async function setAllCardsAsNonDefault(userId)
{
    let cards = await db.card.findAll({
        where: {
            userId
        }
    });

    await Promise.all(cards.map(async card => {
        card.default = false;
        await card.save();
    }));
}

module.exports = {
    listCards,
    storeCard,
    updateCard,
    removeCard
}