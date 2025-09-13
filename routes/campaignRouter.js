const express = require('express');
const router = express.Router();
const { getCampaigns, previewAudience, createCampaign } = require('../controller/campaignController');

// Define the routes for campaign management
router.get('/', getCampaigns);
router.post('/preview', previewAudience);
router.post('/', createCampaign);

module.exports = router;
