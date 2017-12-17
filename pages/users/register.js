import {
  API_BASE,
  API_ROUTE_USER_REGISTER,
  API_ROUTE_JWT_TOKEN
} from '../../config/api'

import { weixinBind } from '../../libs/weixin'

const app = getApp()
const { setJWT } = app

Page({
  data: {
    username: '',
    email: '',
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
  onInputEmail (event) {
    this.setData({
      email: event.detail.value
    })
  },
  onInputPassword (event) {
    this.setData({
      password: event.detail.value
    })
  },
  onTapSubmitButton () {
    const { username, password, email } = this.data

    wx.request({
      url: `${ API_BASE }/${ API_ROUTE_USER_REGISTER }`,
      method: 'POST',
      data: {
        username,
        password,
        email
      },
      success: (response) => {
        console.log(response)
        const { data, statusCode } = response

        if (data.hasOwnProperty('code')) {
          this.setData({
            message: data.message
          })
        }

        switch (statusCode) {
          case 500:
            this.setData({
              showMessage: true
            })

            setTimeout(() => {
              this.setData({
                showMessage: false
              })
            }, 3000)
            break
          case 400:
            this.setData({
              showMessage: true
            })

            setTimeout(() => {
              this.setData({
                showMessage: false
              })
            }, 3000)
            break
          case 201:
            wx.request({
              url: `${ API_BASE }/${ API_ROUTE_JWT_TOKEN }`,
              method: 'POST',
              data: {
                username,
                password
              },
              success: (response) => {
                if (response.statusCode === 200) {
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

                  const flash = JSON.stringify(
                    {
                      action: 'bindWeixin',
                      message: '绑定微信帐号'
                    }
                  )

                  wx.setStorageSync('flash', flash)

                  wx.switchTab({
                    url: '/pages/users/show'
                  })
                }
              }
            })

            break
          default:
            console.log(response)
        }
      }
    })
  }
})
