const express = require('express');
const morgan = require('morgan');
const bodyparser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
require('colors');
const connectDb = require('./config/config');

//dotenv config
dotenv.config();

//DB config
connectDb();

//rest object
const app = express();

//midlleware
app.use(cors());
app.use(express.json());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(morgan("dev"));

//routes
app.use('/api/items', require("./routes/itemRoutes"));
app.use('/api/Users', require("./routes/userRoutes"));
app.use('/api/invoices', require("./routes/invoiceRoutes"));
app.use('/api/profomas', require("./routes/profomaRoutes"));


//port
const PORT = process.env.PORT || 8080;

//listen
app.listen(PORT, () => {
    console.log(`Server Running On Port ${PORT}`.bgCyan.white);
});