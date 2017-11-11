const app = getApp()

const API_BASE = 'https://wp-dev.ninghao.net/wp-json'
const API_ROUTE = 'wp/v2/posts'

Page({
  data: {
    entities: [],
    embed: true,
    total: 0,
    totalPages: 0,
    currentPage: 1
  },
  onLoad () {
    wx.request({
      url: `${ API_BASE }/${ API_ROUTE }?_embed=${ this.data.embed }`,
      success: (response) => {
        console.log(response)
        const entities = response.data
        this.setData({
          entities,
          total: response.header['x-wp-total'],
          totalPages: response.header['x-wp-totalpages']
        })
      }
    })
  }
})
