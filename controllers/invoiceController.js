const invoiceModel = require('../models/invoiceModel');


//get-invoices
const getInvoiceController = async (req, res) => {
    try {
        const invoices = await invoiceModel.find();
        res.send(invoices);
    } catch (error) {
        console.log(error);
    }
};

//add-Invoice
const addInvoiceController = async (req, res) => {
    try {
        const newInvoice = new invoiceModel(req.body)
        await newInvoice.save()
        res.send('Invoice Created Succesfuly!!');
    } catch (error) {
        res.send("Something went Wrong!!");
        console.log(error)
    }
};


// Get total number of invoices
const getTotalInvoicesController = async (req, res) => {
    try {
        const totalInvoices = await invoiceModel.countDocuments();
        res.json(totalInvoices);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
};

// // //update-invoice

// const editInvoiceController = async (req, res) => {
//     try {
//         await invoiceModel.findByIdAndUpdate({ _id: req.body.invoiceId }, req.body)
//         res.status(201).send("Invoice updated!");
//     } catch (error) {
//         res.status(400).send("error", error);
//         console.log(error)

//     }
// }

// // //Delete-invoice

// const deleteInvoiceController = async (req, res) => {
//     try {
//         const { invoiceId } = req.body;

//         await invoiceModel.findOneAndDelete({ _id: invoiceId })

//         res.status(200).json("Invoice Deleted");

//     } catch (error) {
//         res.status(400).send("error", error);
//         console.log(error)
//     }
// }

module.exports = { addInvoiceController, getInvoiceController, getTotalInvoicesController };

