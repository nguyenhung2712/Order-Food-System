const middlewares = {
    Auth: require('./Auth'),
    VerifyExists: require('./VerifyExists'),
    VerifySignup: require('./VerifySignup'),
}

module.exports = middlewares;