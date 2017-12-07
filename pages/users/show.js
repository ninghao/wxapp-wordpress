import { weixinLogin, weixinBind } from '../../libs/weixin'

const app = getApp()
const { removeJWT, setJWT } = app

const API_BASE = 'https://wp-dev.ninghao.net/wp-json'
const API_ROUTE_WEIXIN_BIND = 'weixin/v1/bind'

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
                weixinBind({
                  userInfo: response,
                  userId: this.data.user_id,
                  token: this.data.token
                })
              }
            }
          })
        }
      }
    })
  },
  onTapWeixinLoginButton () {
    weixinLogin((response) => {
      switch (response.statusCode) {
        case 201:
          setJWT(response.data)
          this.setData({
            ...response.data
          })
          break
        case 404:
          wx.navigateTo({
            url: '/pages/users/login?bind=true'
          })
          break
        default:
          console.log(response)
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
