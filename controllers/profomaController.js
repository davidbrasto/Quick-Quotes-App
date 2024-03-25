const profomaModel = require('../models/profomaModel');


//get-invoices
const getProfomaController = async (req, res) => {
    try {
        const profomas = await profomaModel.find();
        res.send(profomas);
    } catch (error) {
        console.log(error);
    }
};

//add-Invoice
const addProfomaController = async (req, res) => {
    try {
        const newProfoma = new profomaModel(req.body)
        await newProfoma.save()
        res.send('Profoma Created Succesfuly!!');
    } catch (error) {
        res.send("Something went Wrong!!");
        console.log(error)
    }
};

module.exports = { addProfomaController, getProfomaController, };

