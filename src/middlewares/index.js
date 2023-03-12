const middlewares = {
    Auth: require('./Auth'),
    VerifyExists: require('./VerifyExisted'),
    VerifySignup: require('./VerifySignup'),
}

module.exports = middlewares;