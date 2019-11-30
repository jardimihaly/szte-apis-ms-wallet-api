const { readFile } = require('fs');
const { promisify } = require('util');
const path = require('path');

const readFileAsync = promisify(readFile);

function listVendors(req, res)
{
    listVendorsAsync(req, res);
}

async function listVendorsAsync(req, res)
{
    let vendors = JSON.parse(
        (
            await readFileAsync(
                path.resolve(
                    __dirname, 
                    '../', 
                    'vendors.json'
                )
            )
        ).toString()
    );
    
    res.json(vendors);
}

module.exports = {
    listVendors
}