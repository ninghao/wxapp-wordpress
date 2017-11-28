const app = getApp()
const { setJWT } = app

const API_BASE = 'https://wp-dev.ninghao.net/wp-json'
const API_ROUTE = 'jwt-auth/v1/token'
const API_ROUTE_USER_REGISTER = 'users/v1/register'

Page({
  data: {
    username: '',
    email: '',
    password: '',
    showMessage: false,
    message: ''
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

        // if (data.hasOwnProperty('code')) {
        //   switch (data.code) {
        //     case '[jwt_auth] invalid_username':
        //       this.setData({
        //         message: '用户名不对'
        //       })
        //       break
        //     case '[jwt_auth] incorrect_password':
        //       this.setData({
        //         message: '密码错了'
        //       })
        //       break
        //     default:
        //       this.setData({
        //         message: '请检查用户名或密码'
        //       })
        //   }
        // }
        //
        // switch (statusCode) {
        //   case 403:
        //     this.setData({
        //       showMessage: true
        //     })
        //
        //     setTimeout(() => {
        //       this.setData({
        //         showMessage: false
        //       })
        //     }, 3000)
        //     break
        //   case 200:
        //     setJWT(response.data)
        //     wx.switchTab({
        //       url: '/pages/users/show'
        //     })
        //     break
        //   default:
        //     console.log(response)
        // }
      }
    })
  }
})
