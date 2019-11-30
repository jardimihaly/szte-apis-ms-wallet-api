const { readFile } = require('fs');
const { promisify } = require('util');
const path = require('path');

const readFileAsync = promisify(readFile);

module.exports = {
    async getVendors() {
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
        
        return vendors;
    }
}