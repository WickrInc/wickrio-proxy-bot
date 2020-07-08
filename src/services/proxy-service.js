import fs from 'fs';

class ProxyService {
  constructor() {
  }

  static readCredentialFile() {
    const creds = { credentials } = JSON.parse(fs.readFile('credentials.json'));
    return credentials;
  }

  static findUserByProxy(proxyid) {
    const findUserByProxy = this.readCredentialFile.find((usercredential) => usercredential.proxyid === proxyid);
    return findUserByProxy;
  }

  static findUserByID(userid) {
    const findUserByID = this.readCredentialFile.find((usercredential) => usercredential.userid === userid);
    return findUserByID;
  }

  static getUserID(proxyid) {
    const user = this.findUserByProxy(proxyid);
    if (user) {
      const { userid } = user;
      return userid;
    }
  }

  static getProxyID(userid) {
    const user = this.findUserByID(userid);
    if (user) {
      const { proxyid } = user;
      return proxyid;
    }
  }

  static addProxyID(userid, proxyid) {
    const user = this.findUserByID(userid);
    const creds = this.readCredentialFile();

    // if we find the user
    user
      // add proxy to the cedentials
      ? creds.find((usercredential) => usercredential.userid === userid).proxyid.append(proxyid)
      // if not, add the user and proxy
      : creds.append({
        userid,
        proxyid,
      });

    fs.writeFile('credentials.json', creds, (err) => {
      if (err) return console.log(err);
    });
  }

  static list(userid) {
    const creds = this.readCredentialFile;
    const user = creds.find((usercredential) => usercredential.userid === userid);

    return `${user.userid}: ${user.proxyid}`;
  }
}

export default ProxyService;

// create the service for the user
// let psMe = ProxyService('Alex')

// // set a proxy for user 1
// // set a second proxy for user 1
// ps.addProxyID('Pelican')
// ps.addProxyID('Lizard')

// // set a proxy for user 2
// let psYou = ProxyService('Toren')
// psYou.addProxyID('Eagle')

// // return list of proxies for the user
// psMe.list()
// alane: ['pelican', 'lizard']
