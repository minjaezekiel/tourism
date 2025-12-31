const express = require('express');
const router = express.Router();
const {
  trackVisit,
  getAnalytics
} = require('../controllers/analytics.controller');

router.post('/track', trackVisit);
router.get('/', getAnalytics);

module.exports = router;
