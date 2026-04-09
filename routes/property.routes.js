const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/property.controller');

// View the Bihar Genesis Map
router.get('/', propertyController.getAllProperties);

// Execute a Deed Purchase
router.post('/buy', propertyController.buyProperty);

module.exports = router;
