import Towxml from '/towxml/main'

App({
  towxml: new Towxml(),
  onLaunch (options) {
    const jwt = wx.getStorageSync('jwt')
    if (jwt) {
      this.globalData.jwt = JSON.parse(jwt)
    }
  },
  onShow (options) {
  },
  onHide () {
  },
  onError (error) {
  },
  setJWT (token) {
    const _token = JSON.stringify(token)
    wx.setStorageSync('jwt', _token)
    this.globalData.jwt = token
  },
  removeJWT () {
    wx.removeStorageSync('jwt')
    this.globalData.jwt = {}
  },
  globalData: {
    jwt: {}
  }
})
