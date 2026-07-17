const websiteService = require('../services/websiteService');

const extractController = {
  extractWebsite: async (req, res, next) => {
    try {
      const { url } = req.body;
      if (!url) {
        return res.status(400).json({ status: 'error', message: 'URL is required' });
      }

      const metadata = await websiteService.extractWebsiteMetadata(url);
      res.json(metadata);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = extractController;
