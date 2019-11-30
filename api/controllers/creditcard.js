const db = require('../models');
const cardValidator = require('card-validator');

function listCards(req, res) {
    listCardsAsync(req, res);
}

async function listCardsAsync(req, res) {
    res.json(await db.card.findAll({
        where: {
            userId: req.user.id
        }
    }));
}

function storeCard(req, res) {
    storeCardAsync(req, res);
}

function storeCardAsync(req, res) {
    let cardInfo = req.swagger.params.cardinfo.value;

    try {
        await validateCreditCard(cardInfo, req.user.id);
    } catch (error) {
        res.status(400).send({
            message: error.message
        });await

    if(cardInfo.default === 'true' || cardInfo.default === true)
    {
        // set the default value on all cards to false
        let cards = await db.card.findAll({
            where: {
                userId: req.user.id
            }
        });

       await Promise.all(cards.map(async card => {
            card.default = false;
            return card.save();
        }));
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
        monthlyLimit: cardInfo.monthlyLimit || 0
    });
}

function updateCard(req, res) {
    updateCardAsync(req, res);
}

function updateCardAsync(req, res) {
    
}

function removeCard(req, res) {
    removeCardAsync(req, res);
}

function removeCardAsync(req, res) {
    
}

async function validateCreditCard({ cardNumber, expirationDate }, userId = undefined)
{
    let validNumber = cardValidator.number(cardNumber);
    if(!validNumber.isPotentiallyValid) {
        throw Error('Invalid card number!');
    }

    let validExpiration = cardValidator.expirationDate(expirationDate);
    if(!validExpiration.isPotentiallyValid) {
        throw Error('Invalid expiration date.');
    }

    if(userId) {
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

module.exports = {
    listCards,
    storeCard,
    updateCard,
    removeCard
}