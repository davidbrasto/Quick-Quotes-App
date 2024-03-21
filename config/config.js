const mongoose = require('mongoose');
require('colors')

//connect DB function

const connectDb = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Conected ${conn.connection.host}`.yellow);
    } catch (error) {
        console.log(`Error : ${error.message}`.bgRed);
        process.exit(1);
    }
};

//export

module.exports = connectDb;
