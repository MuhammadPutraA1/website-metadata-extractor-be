const axios = require('axios');
const cheerio = require('cheerio');

const extractWebsiteMetadata = async (url) => {
  try {
    // Pastikan URL valid dan menggunakan protokol http/https
    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url;
    }

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
      timeout: 10000 // 10 seconds timeout
    });

    const html = response.data;
    const $ = cheerio.load(html);

    // Extracting basic metadata
    const title = $('title').text() || $('meta[property="og:title"]').attr('content') || '';
    const description = $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || '';
    
    let canonical = $('link[rel="canonical"]').attr('href') || '';
    if (canonical && !canonical.startsWith('http')) {
      // Resolve relative canonical URL if necessary
      try {
        canonical = new URL(canonical, url).href;
      } catch (e) {
        // Fallback if URL parsing fails
      }
    }

    let favicon = $('link[rel="icon"]').attr('href') || $('link[rel="shortcut icon"]').attr('href') || '';
    if (favicon && !favicon.startsWith('http')) {
      try {
        favicon = new URL(favicon, url).href;
      } catch (e) {
        // Fallback
      }
    }

    // Extracting Open Graph data
    const open_graph = {
      title: $('meta[property="og:title"]').attr('content') || title,
      description: $('meta[property="og:description"]').attr('content') || description,
      image: $('meta[property="og:image"]').attr('content') || ''
    };
    if (open_graph.image && !open_graph.image.startsWith('http')) {
       try {
         open_graph.image = new URL(open_graph.image, url).href;
       } catch (e) {}
    }

    // Extracting Emails, Phones, and Social Media
    const emails = new Set();
    const phones = new Set();
    const social_media = new Set();

    // Regex patterns
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const phoneRegex = /(?:\+62|62|0)[2-9][0-9]{7,11}/g; 
    const socialMediaDomains = ['facebook.com', 'twitter.com', 'instagram.com', 'linkedin.com', 'youtube.com', 'tiktok.com'];

    // Extract from href attributes
    $('a').each((i, el) => {
      const href = $(el).attr('href');
      if (href) {
        if (href.startsWith('mailto:')) {
          emails.add(href.replace('mailto:', '').split('?')[0].trim());
        } else if (href.startsWith('tel:')) {
          phones.add(href.replace('tel:', '').trim());
        } else {
          // Check for social media links
          for (const domain of socialMediaDomains) {
            if (href.includes(domain)) {
              social_media.add(href.trim());
              break;
            }
          }
        }
      }
    });

    // Extract from text body (Optional enhancement, might be noisy but good for catching things missed in hrefs)
    const bodyText = $('body').text();
    const foundEmails = bodyText.match(emailRegex);
    if (foundEmails) {
      foundEmails.forEach(e => emails.add(e));
    }
    
    // We can also extract phones from text but it might result in false positives, 
    // sticking mainly to standard formats or tel links is safer, but let's try a conservative regex for Indonesian numbers or standard ones.
    const foundPhones = bodyText.match(phoneRegex);
    if (foundPhones) {
      foundPhones.forEach(p => phones.add(p));
    }

    return {
      url: url,
      title: title,
      description: description,
      canonical: canonical,
      favicon: favicon,
      emails: Array.from(emails),
      phones: Array.from(phones),
      social_media: Array.from(social_media),
      open_graph: open_graph
    };

  } catch (error) {
    throw new Error(`Failed to extract website metadata: ${error.message}`);
  }
};

module.exports = {
  extractWebsiteMetadata
};
