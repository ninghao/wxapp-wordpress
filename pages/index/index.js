const app = getApp()

const API_BASE = 'https://wp-dev.ninghao.net/wp-json'
const API_ROUTE = 'wp/v2/posts'

Page({
  data: {
    entities: [],
    embed: true,
    total: 0,
    totalPages: 0,
    currentPage: 1,
    isLoading: true,
    isEarth: false
  },
  onLoad () {
    wx.request({
      url: `${ API_BASE }/${ API_ROUTE }?_embed=${ this.data.embed }`,
      success: (response) => {
        console.log(response)
        const entities = response.data
        this.setData({
          entities,
          isLoading: false,
          total: response.header['x-wp-total'],
          totalPages: response.header['x-wp-totalpages']
        })
      }
    })
  },
  onPullDownRefresh () {
    wx.request({
      url: `${ API_BASE }/${ API_ROUTE }?_embed=${ this.data.embed }`,
      success: (response) => {
        console.log(response)
        const entities = response.data
        this.setData({
          entities,
          isLoading: false,
          total: response.header['x-wp-total'],
          totalPages: response.header['x-wp-totalpages']
        })
        wx.stopPullDownRefresh()
      }
    })
  },
  onReachBottom () {
    let { currentPage, totalPages, isLoading } = this.data

    if (currentPage >= totalPages || isLoading) {
      return
    }

    this.setData({
      isLoading: true
    })

    currentPage = currentPage + 1

    wx.request({
      url: `${ API_BASE }/${ API_ROUTE }?_embed=${ this.data.embed }&page=${ currentPage }`,
      success: (response) => {
        console.log(response)
        const entities = [...this.data.entities, ...response.data]
        this.setData({
          entities,
          currentPage,
          isLoading: false,
          total: response.header['x-wp-total'],
          totalPages: response.header['x-wp-totalpages'],
          isEarth: currentPage >= totalPages
        })
      }
    })
  }
})
