import {
  API_BASE,
  API_ROUTE_POSTS
} from '../../config/api'

const app = getApp()

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
      url: `${ API_BASE }/${ API_ROUTE_POSTS }?_embed=${ this.data.embed }`,
      success: (response) => {
        console.log(response)
        const entities = response.data
        const total = response.header['X-WP-Total'] || response.header['x-wp-total']
        const totalPages = response.header['X-WP-TotalPages'] || response.header['x-wp-totalpages']

        this.setData({
          entities,
          isLoading: false,
          total,
          totalPages,
          currentPage: 1,
          isEarth: false
        })
      }
    })
  },
  onPullDownRefresh () {
    wx.request({
      url: `${ API_BASE }/${ API_ROUTE_POSTS }?_embed=${ this.data.embed }`,
      success: (response) => {
        console.log(response)
        const entities = response.data
        const total = response.header['X-WP-Total'] || response.header['x-wp-total']
        const totalPages = response.header['X-WP-TotalPages'] || response.header['x-wp-totalpages']

        this.setData({
          entities,
          isLoading: false,
          total,
          totalPages,
          currentPage: 1,
          isEarth: false
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
      url: `${ API_BASE }/${ API_ROUTE_POSTS }?_embed=${ this.data.embed }&page=${ currentPage }`,
      success: (response) => {
        console.log(response)
        const entities = [...this.data.entities, ...response.data]
        const total = response.header['X-WP-Total'] || response.header['x-wp-total']
        const totalPages = response.header['X-WP-TotalPages'] || response.header['x-wp-totalpages']

        this.setData({
          entities,
          currentPage,
          isLoading: false,
          total,
          totalPages,
          isEarth: currentPage >= totalPages
        })
      }
    })
  }
})
