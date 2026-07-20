const express = require('express');
const router = express.Router();
const extractController = require('../controllers/extractController');

// Challenge 1: Website Metadata Extractor
router.post('/extract/website', extractController.extractWebsite);

// Challenge 2: Domain Intelligence
router.post('/extract/domain', extractController.extractDomain);

// Challenge 3: Company Location Finder
router.post('/extract/location', extractController.extractLocation);

module.exports = router;
