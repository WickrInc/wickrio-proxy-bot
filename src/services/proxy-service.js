class ProxyService {
  constructor() {}

  static readCredentialFile() {
    let creds = JSON.parse(fs.readFile("credentials.json"));
    return creds;
  }

  static findUserByProxy(proxyid) {
    let findUserByProxy = this.readCredentialFile.credentials.find(
      (usercredential) => usercredential.proxyid === proxyid
    );
    return findUserByProxy;
  }

  static findUserByID(userid) {
    let findUserByID = this.readCredentialFile.credentials.find(
      (usercredential) => usercredential.userid === userid
    );
    return findUserByID;
  }

  static getUserID(proxyid) {
    let user = this.findUserByProxy(proxyid);
    if (user) {
      let userid = user.userid;
      return userid;
    }
  }

  static getProxyID(userid) {
    let user = this.findUserByID(userid);
    if (user) {
      let proxyid = user.proxyid;
      return proxyid;
    }
  }

  static addProxyID(userid, proxyid) {
    let user = this.findUserByID(userid);
    let creds = this.readCredentialFile();

    // if we find the user
    user
      ? // add proxy to the cedentials
        creds.credentials
          .find((usercredential) => usercredential.userid === userid)
          .proxyid.append(proxyid)
      : // if not, add the user and proxy
        creds.credentials.append({
          userid: userid,
          proxyid: proxyid,
        });

    fs.writeFile("credentials.json", creds, function writeJSON(err) {
      if (err) return console.log(err);
    });
  }

  static list(userid) {
    let creds = this.readCredentialFile();
    let user = creds.credentials.find(
      (usercredential) => usercredential.userid === userid
    );

    return `${user.userid}: ${user.proxyid}`;
  }
}

export default ProxyService;
