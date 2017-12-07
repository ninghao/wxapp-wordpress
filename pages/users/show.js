import { weixinLogin } from '../../libs/weixin'

const app = getApp()
const { removeJWT } = app

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
                this.weixinBind({
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
    weixinLogin()
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
  },
  weixinBind ({ userInfo, userId, token } = obj) {
    wx.login({
      success: (login) => {
        wx.request({
          url: `${ API_BASE }/${ API_ROUTE_WEIXIN_BIND }`,
          method: 'POST',
          header: {
            'Authorization': `Bearer ${ token }`
          },
          data: {
            code: login.code,
            userInfo,
            userId
          },
          success: (response) => {
            console.log(response)
          }
        })
      }
    })
  }
})
