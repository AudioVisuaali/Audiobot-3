import dns from "dns";

const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

export const networkUtils = {
  getIPOfDomain(domain: string) {
    return new Promise<string>((resolve, reject) => {
      dns.lookup(domain, (err, address) => {
        if (err) {
          reject(err);
        }

        resolve(address);
      });
    });
  },

  validateIPaddress(ipaddress: string) {
    return !!ipRegex.test(ipaddress);
  },
};
