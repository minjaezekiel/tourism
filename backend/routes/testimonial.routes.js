const express = require('express');
const router = express.Router();

const {
  createTestimonial,
  getAllTestimonials,
  getTestimonialById,
  updateTestimonial,
  deleteTestimonial
} = require('../controllers/testimonials.controls');

//create route
router.post('/', createTestimonial);

//get route
router.get('/', getAllTestimonials);

//get route by id
router.get('/:id', getTestimonialById);

//update route by id
router.put('/:id', updateTestimonial);

//delete route by id
router.delete('/:id', deleteTestimonial);

module.exports = router;
