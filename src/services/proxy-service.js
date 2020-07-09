import fs from 'fs'
class ProxyService {
  static readCredentialFile() {
    const creds = JSON.parse(fs.readFile('credentials.json'))
    return creds
  }

  static findUserByProxy(proxyid) {
    const findUserByProxy = this.readCredentialFile.credentials.find(
      usercredential => usercredential.proxyid === proxyid
    )
    return findUserByProxy
  }

  static findUserByID(userid) {
    const findUserByID = this.readCredentialFile.credentials.find(
      usercredential => usercredential.userid === userid
    )
    return findUserByID
  }

  static getUserID(proxyid) {
    const user = this.findUserByProxy(proxyid)
    if (user) {
      const userid = user.userid
      return userid
    }
  }

  static getProxyID(userid) {
    const user = this.findUserByID(userid)
    if (user) {
      const proxyid = user.proxyid
      return proxyid
    }
  }

  static addProxyID(userid, proxyid) {
    const user = this.findUserByID(userid)
    const creds = this.readCredentialFile()

    // if we find the user
    user
      ? // add proxy to the cedentials
        creds.credentials
          .find(usercredential => usercredential.userid === userid)
          .proxyid.append(proxyid)
      : // if not, add the user and proxy
        creds.credentials.append({
          userid: userid,
          proxyid: proxyid,
        })

    fs.writeFile('credentials.json', creds, function writeJSON(err) {
      if (err) return console.log(err)
    })
  }

  static list(userid) {
    const creds = this.readCredentialFile()
    const user = creds.credentials.find(
      usercredential => usercredential.userid === userid
    )

    return `${user.userid}: ${user.proxyid}`
  }
}

export default ProxyService
