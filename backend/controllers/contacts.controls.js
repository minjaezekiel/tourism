const contact = require("./../models/contacts");

// Create a new contact message (existing function)
const createContact = async (req, res) => {
  try {
    // Receive data from client and destructure
    const { name, email, phone, tour, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required fields'
      });
    }

    // Log the received data to debug
    console.log("Received form data:", { name, email, phone, tour, message });

    // Save user contact data to db
    const newContact = await contact.create({
      fullname: name,
      email: email,
      phone: phone,
      tour: tour,
      message: message
    });

    // Display upon successfully saving data
    console.log(`Contact saved successfully, ${newContact.fullname}`);

    // Send a success response to the client
    res.status(201).json({
      success: true,
      message: 'Contact saved successfully!',
      data: newContact
    });

  } catch (error) {
    console.error(`Error saving contact \n ${error.message}`);

    // Send a generic 500 Internal Server Error response to the client
    res.status(500).json({
      success: false,
      message: 'An internal server error occurred. Please try again later.'
    });
  }
};

// Get all contact messages
const getAllContactMessages = async (req, res) => {
  try {
    // Fetch all contacts from the database, sorted by creation date (newest first)
    const contacts = await contact.find({}).sort({ createdAt: -1 });

    // If no contacts found
    if (!contacts || contacts.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No contact messages found'
      });
    }

    // Return the contacts
    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts
    });

  } catch (error) {
    console.error(`Error fetching contact messages: ${error.message}`);
    
    res.status(500).json({
      success: false,
      message: 'An internal server error occurred while fetching contact messages'
    });
  }
};

// Get a single contact message by ID
const getContactMessageById = async (req, res) => {
  try {
    // Extract ID from request parameters
    const { id } = req.params;

    // Validate ID format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid contact message ID format'
      });
    }

    // Find the contact by ID
    const contactMessage = await contact.findById(id);

    // If contact not found
    if (!contactMessage) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    // Return the contact message
    res.status(200).json({
      success: true,
      data: contactMessage
    });

  } catch (error) {
    console.error(`Error fetching contact message: ${error.message}`);
    
    res.status(500).json({
      success: false,
      message: 'An internal server error occurred while fetching the contact message'
    });
  }
};

// Delete a contact message by ID
const deleteContactMessage = async (req, res) => {
  try {
    // Extract ID from request parameters
    const { id } = req.params;

    // Validate ID format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid contact message ID format'
      });
    }

    // Find and delete the contact
    const deletedContact = await contact.findByIdAndDelete(id);

    // If contact not found
    if (!deletedContact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Contact message deleted successfully',
      data: deletedContact
    });

  } catch (error) {
    console.error(`Error deleting contact message: ${error.message}`);
    
    res.status(500).json({
      success: false,
      message: 'An internal server error occurred while deleting the contact message'
    });
  }
};

module.exports = {
  createContact,
  getAllContactMessages,
  getContactMessageById,
  deleteContactMessage
};