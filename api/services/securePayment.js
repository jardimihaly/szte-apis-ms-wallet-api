module.exports = {
    async startPayment(card, paymentInfo) {
        console.log('Starting secure payment...');
        console.log(`Payment to ${paymentInfo.vendor.name} by userId:${card.userId} (${paymentInfo.referenceNumber}) with ${card.cardNumber}.`);
        await sleep(2500);
        let success = Math.random() > .5;
        console.log(`Payment was ${success ? 'successful' : 'unsuccessful'}.`);
        return success;
    }
}

function sleep(ms)
{
    return new Promise(resolve => setTimeout(resolve, ms));
}