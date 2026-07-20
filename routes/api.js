const express = require('express');
const router = express.Router();
const extractController = require('../controllers/extractController');


router.post('/extract/website', extractController.extractWebsite);
router.post('/extract/domain', extractController.extractDomain);
router.post('/extract/location', extractController.extractLocation);
router.get('/company-information', extractController.getCompanyInformation);
module.exports = router;
