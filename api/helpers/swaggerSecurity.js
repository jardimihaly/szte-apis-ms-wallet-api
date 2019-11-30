const jwt = require('jsonwebtoken');

module.exports = {
    swaggerSecurityHandlers: {
        keySecurity: async function(req, authOrSecDef, scopesOrApiKey, next) {
            if(authOrSecDef) {
                if(scopesOrApiKey)
                {
                    jwt.verify(
                        scopesOrApiKey, 
                        process.env.SECRET,
                        (err, decoded) => {
                            if(err)
                            {
                                next(new Error('Invalid JWT!'));
                            }
                            else
                            {
                                req.user = decoded;
                                next();
                            }
                        }
                    )
                }
                else
                {
                    next(new Error('No JWT specified'));
                }
            }
        }
    }
}