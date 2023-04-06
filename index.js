const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
require("dotenv").config()
require('./connectdb')

const app = express();
app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"]
}));
app.use(express.json());
/* app.use(express.urlencoded({ extended: true })); */
app.use(bodyParser.urlencoded({ extended: true })); //this line is already mentioned above
app.use(bodyParser.json());

//routes
const initRoutes = require("./src/routes");
initRoutes(app);

const PORT = process.env.PORT || 8888;
const listener = app.listen(PORT, () => {
    console.log('Server is running on the port ' + listener.address().port);
})