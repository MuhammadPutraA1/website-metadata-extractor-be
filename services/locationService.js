const axios = require('axios');

const findLocation = async (query) => {
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: query,
        format: 'jsonv2',
        addressdetails: 1
      },
      headers: {
        'User-Agent': 'DataAcquisitionEngine/1.0 (contact@example.com)'
      },
      timeout: 10000 // 10 seconds timeout
    });

    const data = response.data;
    
    if (!data || data.length === 0) {
      throw new Error('Location not found');
    }
    const bestMatch = data[0];

    return {
      display_name: bestMatch.display_name || '',
      latitude: bestMatch.lat || '',
      longitude: bestMatch.lon || '',
      importance: bestMatch.importance || '',
      osm_type: bestMatch.osm_type || '',
      address: bestMatch.address || {}
    };

  } catch (error) {
    throw new Error(`Failed to extract location: ${error.message}`);
  }
};

module.exports = {
  findLocation
};
