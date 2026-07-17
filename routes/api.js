const express = require('express');
const router = express.Router();
const extractController = require('../controllers/extractController');

// Challenge 1: Website Metadata Extractor
router.post('/extract/website', extractController.extractWebsite);

module.exports = router;
