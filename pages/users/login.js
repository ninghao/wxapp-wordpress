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
  }
})
