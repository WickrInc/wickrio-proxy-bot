class Proxy {
  constructor(userID, proxyID) {
    this.userID = userID
    this.proxyID = proxyID
  }

  getUserID() {
    return this.userID
  }

  getProxyID() {
    return this.proxyID
  }

  setProxyID(proxyID) {
    this.proxyID = proxyID
  }
}

export default Proxy
