const jwt = require('jsonwebtoken');

module.exports = {
    swaggerSecurityHandlers: {
        keySecurity: async function(req, authOrSecDef, scopesOrApiKey, next) {
            if(authOrSecDef) {
                if(scopesOrApiKey)
                {
                    let token = ''
                    if(scopesOrApiKey.match(/Bearer .*/i))
                    {
                        token = scopesOrApiKey.replace('Bearer ', '');
                    }
                    else
                    {
                        token = scopesOrApiKey;
                    }

                    jwt.verify(
                        token, 
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