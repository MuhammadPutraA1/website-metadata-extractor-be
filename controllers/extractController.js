const websiteService = require('../services/websiteService');
const domainService = require('../services/domainService');

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
  },

  extractDomain: async (req, res, next) => {
    try {
      const { domain } = req.body;
      if (!domain) {
        return res.status(400).json({ status: 'error', message: 'Domain is required' });
      }

      const domainInfo = await domainService.extractDomainInfo(domain);
      res.json(domainInfo);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = extractController;
