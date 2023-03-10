const jwt = require("jsonwebtoken");
require("dotenv").config();
const { User } = require("../models");

/* const validateToken = (req, res, next) => {
	const accessToken = req.header("accessToken");

	if (!accessToken) return res.json({ error: "User not logged in!" });

	try {
		const validToken = verify(accessToken, "importantsecret");

		if (validToken) {
			return next();
		}
	} catch (err) {
		return res.json({ error: err });
	}
}; */

const { TokenExpiredError } = jwt;

const catchError = (err, res) => {
	if (err instanceof TokenExpiredError) {
		return res.status(401).send({ message: "Unauthorized! Access Token was expired!" });
	}
	return res.sendStatus(401).send({ message: "Unauthorized!" });
}

const validateToken = (req, res, next) => {
	let token = req.headers["access-token"];

	if (!token) {
		return res.status(403).send({ message: "No token provided!" });
	}

	jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
		if (err) {
			return catchError(err, res);
		}
		req.userId = decoded.id;
		next();
	});
};

const isAdmin = (req, res, next) => {
	User.findByPk(req.userId).then(user => {
		user.getRoles().then(roles => {
			for (let i = 0; i < roles.length; i++) {
				if (roles[i].dataValues.name === "ADMIN") {
					next();
				}
			}
			res.status(403).send({
				message: "Require Admin Role!"
			});
		});
	});
  };
  
const isModerator = (req, res, next) => {
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
};

module.exports = { 
	validateToken,
	isModeratorOrAdmin,
	isAdmin,
	isModerator
 };



 