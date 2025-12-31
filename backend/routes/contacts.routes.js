const express = require("express")
const router = express.Router()
const {createContact,
    getAllContactMessages,
    getContactMessageById,
    deleteContactMessage
       } = require("./../controllers/contacts.controls")

//Contact routes

// Route to create a new contact message
router.post("/", (req,res,next)=>{console.log("Main route working"),next()},createContact)

// Route to get all contact messages
router.get('/', getAllContactMessages);

// Route to get a specific contact message by ID
router.get('/:id', getContactMessageById);

// Route to delete a contact message by ID
router.delete('/:id', deleteContactMessage);



module.exports = router