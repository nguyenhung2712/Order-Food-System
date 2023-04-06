const middlewares = {
    Auth: require('./Auth'),
    VerifyExists: require('./VerifyExisted'),
    VerifyUserUpsert: require('./VerifyUserUpsert'),
    VerifyAdminUpsert: require('./VerifyAdminUpsert'),
}

module.exports = middlewares;