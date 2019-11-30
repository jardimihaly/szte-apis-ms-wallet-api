const crypto = require('crypto');

module.exports = function(password) {
    return hash = crypto.createHash('sha256').update(password).digest('base64');
}