const db = require('../models');
const jwt = require('jsonwebtoken');
const hashPassword = require('../helpers/hasher');

function signup(req, res) {
    signupAsync(req, res);
}

async function signupAsync(req, res) {
    let { emailAddress, password, name, addressInfo } = req.swagger.params.credentials.value;

    let exists = await db.user.findOne({
        where: {
            emailAddress
        }
    })

    if(exists)
    {
        res.status(400).json({
            message: 'This e-mail address is already registered.'
        });

        return;
    }

    if(password.length < 6)
    {
        res.status(400).json({
            message: 'The password does not meet our password policy. '+  
                     'Please specify a password with at least 6 characters.'
        });

        return;
    }

    await db.user.create({
        emailAddress,
        password: hashPassword(password),
        name,
        addressInfo
    });

    res.header('content-type', 'application/json').status(200).send();
}

function login(req, res) {
    loginAsync(req, res);
}

async function loginAsync(req, res) {
    let { emailAddress, password } = req.swagger.params.credentials.value;
    console.log(req.swagger.params.credentials);

    let user = await db.user.findOne({
        where: {
            emailAddress, password: hashPassword(password)
        }
    })

    if(user)
    {
        console.log('Signing token');
        jwt.sign({ 
            id: user.id, 
            emailAddress: 
            user.emailAddress, 
            addressInfo: user.addressInfo,
            // exp = expires claim:
            // the token will expire after 15 minutes
            exp: Math.floor(Date.now() / 1000) + (15 * 60)
        }, process.env.SECRET, (err, token) => {
            
            console.log({token});
            if(err)
            {
                res.status(500).send({
                    message: 'An internal server error occurred.'
                });
                return;
            }

            res.status(200).header('content-type', 'application/json').json(token);
        });
    }
    else
    {
        res.status(401).send({
            message: 'Invalid credentials'
        });
    }
}

module.exports = {
    signup,
    login
}