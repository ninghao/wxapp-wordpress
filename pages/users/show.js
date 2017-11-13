const app = getApp()

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
  }
})
