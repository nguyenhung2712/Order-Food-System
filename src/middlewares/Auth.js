const jwt = require("jsonwebtoken");
require("dotenv").config();
const { User, Tracker, AdminStaff } = require("../models");
const admin = require('firebase-admin');

const serviceAccount = require("../utils/serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://react-chat-test-d4d3b-default-rtdb.asia-southeast1.firebasedatabase.app'
});

const { TokenExpiredError } = jwt;

const catchError = (err, res) => {
    if (err instanceof TokenExpiredError) {
        return res.status(401).send({ message: "Access Token đã hết hạn" });
    }
    return res.status(401).send({ message: "Không được phép" });
}

const validateToken = (req, res, next) => {
    let token = req.headers["authorization"].split(' ')[1];

    if (!token) {
        return res.status(403).send({ message: "Token không tồn tại" });
    }
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {

        if (err) {
            admin.auth().verifyIdToken(token)
                .then((decodedToken) => {
                    const user = User.findOne({ where: { email: decodedToken.email } });
                    req.userId = user.id;
                    next();
                })
                .catch((error) => {
                    return catchError(err, res);
                });
        } else {
            let id = decoded.id;
            req.userId = id;
            next();
        }
        /* console.log(decoded, req.statusCode); */

        /* req.headers['if-none-match'] = 'no-match-for-this';
        res.on('finish', async () => {
            let typeApi = req.method;
            let ipAddress = req.ip;
            let statusCode = res.statusCode;
            let admin = await AdminStaff.findByPk(id);
            let user = await User.findByPk(id);
            let apiText = req.originalUrl;
            let apiParts = apiText.split("/");
            if (apiParts[apiParts.length - 1].length === 36) {
                apiParts[apiParts.length - 1] = ":id";
            }
            apiText = apiParts.join("/");
            await Tracker.create({
                typeApi, apiText, statusCode, ipAddress,
                userId: user ? user.id : null,
                adminId: admin ? admin.id : null,
            });
        }); */
    });
};

/* const isAdmin = (req, res, next) => {
    User.findByPk(req.userId).then(user => {
        user.getRoles().then(roles => {
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].dataValues.name === "ADMIN") {
                    next();
                }
            }
            return res.status(403).send({
                message: "Require Admin Role!"
            });
        });
    });
}; */

/* const isModerator = (req, res, next) => {
    User.findByPk(req.userId).then(user => {
        user.getRoles().then(roles => {
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].dataValues.name === "MODERATOR") {
                    next();
                }
            }
            res.status(403).send({
                message: "Require Moderator Role!"
            });
        });
    });
};
  
const isModeratorOrAdmin = (req, res, next) => {
    User.findByPk(req.userId).then(user => {
        user.getRoles().then(roles => {
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].dataValues.name === "MODERATOR") {
                    next();
                }
                if (roles[i].dataValues.name === "ADMIN") {
                    next();
                }
            }
            res.status(403).send({
                message: "Require Moderator or Admin Role!"
            });
        });
    });
}; */

module.exports = {
    validateToken,
    /* isAdmin, */
    /* isModeratorOrAdmin,
    isModerator */
};



