import {
  API_BASE,
  API_ROUTE_JWT_TOKEN
} from '../../config/api'

import { weixinBind } from '../../libs/weixin'

const app = getApp()
const { setJWT } = app

Page({
  data: {
    username: '',
    password: '',
    showMessage: false,
    message: '',
    bind: false
  },
  onLoad (options) {
    const bind = options.bind ? true : false
    this.setData({
      bind
    })
  },
  onInputUsername (event) {
    this.setData({
      username: event.detail.value
    })
  },
  onInputPassword (event) {
    this.setData({
      password: event.detail.value
    })
  },
  onTapRegisterButton () {
    wx.navigateTo({
      url: '/pages/users/register?bind=true'
    })
  },
  onTapSubmitButton () {
    console.log(this.data.username, this.data.password)

    wx.request({
      url: `${ API_BASE }/${ API_ROUTE_JWT_TOKEN }`,
      method: 'POST',
      data: {
        username: this.data.username,
        password: this.data.password
      },
      success: (response) => {
        console.log(response)
        const { data, statusCode } = response

        if (data.hasOwnProperty('code')) {
          switch (data.code) {
            case '[jwt_auth] invalid_username':
              this.setData({
                message: '用户名不对'
              })
              break
            case '[jwt_auth] incorrect_password':
              this.setData({
                message: '密码错了'
              })
              break
            default:
              this.setData({
                message: '请检查用户名或密码'
              })
          }
        }

        switch (statusCode) {
          case 403:
            this.setData({
              showMessage: true
            })

            setTimeout(() => {
              this.setData({
                showMessage: false
              })
            }, 3000)
            break
          case 200:
            setJWT(response.data)

            if (this.data.bind) {
              wx.getUserInfo({
                success: (userInfo) => {
                  if (userInfo) {
                    weixinBind({
                      userInfo,
                      userId: response.data.user_id,
                      token: response.data.token
                    })
                  }
                }
              })
            }

            wx.switchTab({
              url: '/pages/users/show'
            })
            break
          default:
            console.log(response)
        }
      }
    })
  }
})
