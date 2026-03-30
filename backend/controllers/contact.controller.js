// controllers/contact.controller.js
const { Contact } = require('../models/models');

// --- Create a new contact message ---
const createContact = async (req, res) => {
  try {
    const { fullname, email, phone, tour, message } = req.body;

    // Basic validation
    if (!fullname || !email || !message) {
      return res.status(400).json({ 
        message: 'Please provide fullname, email, and message.' 
      });
    }

    // Create the contact entry
    const contactEntry = await Contact.create({
      fullname,
      email,
      phone,
      tour,
      message
    });

    res.status(201).json({
      message: 'Message sent successfully!',
      // .get({ plain: true }) returns a plain JSON object without Sequelize metadata
      contact: contactEntry.get({ plain: true })
    });

  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// --- Get all contact messages (Admin only) ---
const getAllContactMessages = async (req, res) => {
  try {
    // Sequelize uses findAll with the 'order' option
    const messages = await Contact.findAll({
      order: [['created_at', 'DESC']]
    });

    // Convert instances to JSON for the response.
    // res.json automatically calls toJSON, but we can map it explicitly if desired.
    // Using .get({ plain: true }) ensures we only get the data values.
    res.status(200).json(messages.map(m => m.get({ plain: true })));
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// --- Get a single contact message by ID (Admin only) ---
const getContactMessageById = async (req, res) => {
  try {
    const { id } = req.params;

    // Sequelize uses findByPk for searching by Primary Key
    const message = await Contact.findByPk(id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found.' });
    }

    res.status(200).json(message.get({ plain: true }));
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// --- Delete a contact message (Admin only) ---
const deleteContactMessage = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the message first
    const message = await Contact.findByPk(id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found.' });
    }

    // Sequelize uses .destroy() to delete an instance
    await message.destroy();

    res.status(200).json({ message: 'Message deleted successfully.' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

module.exports = {
  createContact,
  getAllContactMessages,
  getContactMessageById,
  deleteContactMessage
};