module.exports = {
    async startPayment(card, paymentInfo) {
        console.log('Starting secure payment...');
        console.log(`Payment to ${paymentInfo.vendor.name} by userId:${card.userId} (${paymentInfo.referenceNumber}) with ${card.cardNumber}.`);
        await sleep(2500);
        let success = Math.random() > .5;
        console.log(`Payment was ${success ? 'successful' : 'unsuccessful'}.`);
        return success;
    },
    async purchaseVignette(card, paymentInfo) {
        console.log('Starting vignette purchase...');
        console.log(`Vignette purchase by userId:${card.userId} for vehicle: ${paymentInfo.plateNumber}, category: ${paymentInfo.vehicleCategory} at the price of ${paymentInfo.amount}`);
        await sleep(2500);
        let success = Math.random() > .5;
        let refNo = Math.floor(Math.random() * 100000000).toString();
        console.log(`Vignette purchase was ${success ? 'successful' : 'unsuccessful'}.`);
        return { success, refNo };
    }
}

function sleep(ms)
{
    return new Promise(resolve => setTimeout(resolve, ms));
}