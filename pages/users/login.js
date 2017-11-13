const API_BASE = 'https://wp-dev.ninghao.net/wp-json'
const API_ROUTE = 'jwt-auth/v1/token'

Page({
  data: {
    username: '',
    password: ''
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
  onTapSubmitButton () {
    console.log(this.data.username, this.data.password)

    wx.request({
      url: `${ API_BASE }/${ API_ROUTE }`,
      method: 'POST',
      data: {
        username: this.data.username,
        password: this.data.password
      },
      success: (response) => {
        console.log(response)
      }
    })
  }
})
