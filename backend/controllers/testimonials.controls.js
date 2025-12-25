const Testimonial = require('../models/testimonials');

/**
 * @desc    Create a testimonial
 * @route   POST /api/testimonials
 * @access  Public
 */
exports.createTestimonial = async (req, res) => {
  try {
    const { fullname, content, country } = req.body;

    if (!fullname || !content || !country) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    const testimonial = new Testimonial({
      fullname,
      content,
      country
    });

    const savedTestimonial = await testimonial.save();

    res.status(201).json({
      success: true,
      data: savedTestimonial
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get all testimonials
 * @route   GET /api/testimonials
 * @access  Public
 */
exports.getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: testimonials.length,
      data: testimonials
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get single testimonial
 * @route   GET /api/testimonials/:id
 * @access  Public
 */
exports.getTestimonialById = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    res.status(200).json({
      success: true,
      data: testimonial
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Invalid ID'
    });
  }
};

/**
 * @desc    Update testimonial (SAFE WAY)
 * @route   PUT /api/testimonials/:id
 * @access  Public
 */
exports.updateTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    testimonial.fullname = req.body.fullname || testimonial.fullname;
    testimonial.content = req.body.content || testimonial.content;
    testimonial.country = req.body.country || testimonial.country;

    const updatedTestimonial = await testimonial.save();

    res.status(200).json({
      success: true,
      data: updatedTestimonial
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Delete testimonial (SAFE WAY)
 * @route   DELETE /api/testimonials/:id
 * @access  Public
 */
exports.deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    await testimonial.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Testimonial deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Invalid ID'
    });
  }
};
