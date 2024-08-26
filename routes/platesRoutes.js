const express = require('express');
const router = express.Router();
const { processImages, findPlate } = require('../controller/plateController');

// Route to process all images
router.post('/process', processImages);

// Route to find a specific plate
router.get('/plate/:plateText', findPlate);

module.exports = router;