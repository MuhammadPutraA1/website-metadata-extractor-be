const axios = require('axios');

const extractDomainInfo = async (domain) => {
  try {
    let cleanDomain = domain.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];

    const response = await axios.get(`https://rdap.org/domain/${cleanDomain}`, {
      timeout: 10000 
    });
    
    const data = response.data;
    
    let registrar = '';
    if (data.entities && Array.isArray(data.entities)) {
      const registrarEntity = data.entities.find(e => e.roles && e.roles.includes('registrar'));
      if (registrarEntity && registrarEntity.vcardArray && registrarEntity.vcardArray[1]) {
        const fnProp = registrarEntity.vcardArray[1].find(prop => prop[0] === 'fn');
        if (fnProp) {
          registrar = fnProp[3];
        }
      }
    }

    let registered_at = '';
    let expired_at = '';
    let last_updated = '';

    if (data.events && Array.isArray(data.events)) {
      const regEvent = data.events.find(e => e.eventAction === 'registration');
      if (regEvent) registered_at = regEvent.eventDate;

      const expEvent = data.events.find(e => e.eventAction === 'expiration');
      if (expEvent) expired_at = expEvent.eventDate;

      const updEvent = data.events.find(e => e.eventAction === 'last changed');
      if (updEvent) last_updated = updEvent.eventDate;
    }

    const status = data.status || [];

    const nameservers = [];
    if (data.nameservers && Array.isArray(data.nameservers)) {
      data.nameservers.forEach(ns => {
        if (ns.ldhName) nameservers.push(ns.ldhName);
      });
    }

    return {
      domain: cleanDomain,
      registrar: registrar,
      registered_at: registered_at,
      expired_at: expired_at,
      last_updated: last_updated,
      status: status,
      nameservers: nameservers
    };

  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error('Domain not found in RDAP database');
    }
    throw new Error(`Failed to extract domain info: ${error.message}`);
  }
};

module.exports = {
  extractDomainInfo
};
