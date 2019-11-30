const vendorService = require('../services/vendorService');

function listVendors(req, res)
{
    listVendorsAsync(req, res);
}

async function listVendorsAsync(req, res)
{
    res.json(await vendorService.getVendors());
}

module.exports = {
    listVendors
}