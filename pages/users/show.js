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

    wx.showModal({
      title: '绑定微信帐号',
      content: '绑定以后，可以直接用微信帐号登录。',
      success: (response) => {
        if (response.confirm) {
          // console.log(response)
          wx.getUserInfo({
            success: (response) => {
              if (response) {
                console.log(response)
              }
            }
          })
        }
      }
    })
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
  },
  onTapRegisterButton () {
    wx.navigateTo({
      url: '/pages/users/register'
    })
  }
})
