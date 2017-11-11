const app = getApp()

const API_BASE = 'https://wp-dev.ninghao.net/wp-json'
const API_ROUTE = 'wp/v2/posts'

Page({
  data: {
    entities: []
  },
  onLoad () {
    wx.request({
      url: `${ API_BASE }/${ API_ROUTE }`,
      success: (response) => {
        console.log(response)
        const entities = response.data
        this.setData({
          entities
        })
      }
    })
  }
})
