const app = getApp()
const { removeJWT } = app

Page({
  data: {

  },
  onShow () {
    const { jwt } = app.globalData
    if (jwt) {
      this.setData({
        ...jwt
      })
    }
  },
  onTapLogoutButton () {
    removeJWT()
    this.setData({
      user_nicename: '',
      user_email: '',
      user_avatar: {},
      user_caps: {}
    })
  },
  onTapLoginButton () {
    wx.navigateTo({
      url: '/pages/users/login'
    })
  }
})
