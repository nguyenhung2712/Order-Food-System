const express = require("express");
const cors = require("cors");
const multer = require('multer');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const passport = require('passport');
const expressSession = require('express-session');

require("dotenv").config()
require('./connectdb')

const app = express();
app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"]
}));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(expressSession({ secret: 'keyboard cat', resave: true, 
saveUninitialized: true }));

/* app.use(
    cookieSession({ name: "session", keys: ["lama"], maxAge: 24 * 60 * 60 * 100 })
); */
//init passportjs
app.use(passport.initialize());
app.use(passport.session());

//routes
const initRoutes = require("./src/routes");
initRoutes(app);

const PORT = process.env.PORT || 8888;
const listener = app.listen(PORT, () => {
    console.log('Server is running on the port ' + listener.address().port);
})