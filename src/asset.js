class Asset {
  constructor(asset, vGroupID) {
    this.asset = asset
    this.vGroupID = vGroupID
  }

  getAsset() {
    return this.asset
  }

  getVGroupID() {
    return this.vGroupID
  }

  setVGroupID(vGroupID) {
    this.vGroupID = vGroupID
  }
}

export default Asset
