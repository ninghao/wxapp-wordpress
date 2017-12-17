import {
  API_BASE,
  API_ROUTE_POSTS,
  API_ROUTE_COMMENTS
} from '../../config/api'

const app = getApp()
const { towxml } = app

Page({
  data: {
    title: '',
    content: {},
    featured_media: '',
    author: {},
    isLoading: true,
    comments: []
  },
  onLoad (options) {
    // const id = options.id
    const id = 64

    this.getPost(id)
    this.getComments(id)
  },
  transformComments (comments) {
    return comments.map((item) => {
      const content = {
        ...item.content,
        wxml: towxml.toJson(item.content.rendered, 'html')
      }

      let comment = {
        ...item,
        content
      }

      return comment
    })
  },
  getComments (postId) {
    wx.request({
      url: `${ API_BASE }/${ API_ROUTE_COMMENTS }?post=${ postId }&_embed=true`,
      success: (response) => {
        console.log(response)
        const comments = this.transformComments(response.data)
        if (comments.length > 0) {
          this.setData({
            comments
          })
        }
      }
    })
  },
  getPost (id) {
    wx.request({
      url: `${ API_BASE }/${ API_ROUTE_POSTS }/${ id }?_embed=true`,
      success: (response) => {
        const entity = response.data
        const title = entity.title.rendered
        // const content = entity.content.rendered
        const content = towxml.toJson(entity.content.rendered, 'html')
        const featuredMedia =
          entity.featured_media ? entity._embedded['wp:featuredmedia'][0].media_details.sizes.medium_large.source_url : ''
        const author = entity._embedded.author[0]

        this.setData({
          ...entity,
          title,
          content,
          featuredMedia,
          author,
          isLoading: false
        })

        wx.setNavigationBarTitle({
          title
        })
      }
    })
  }
})
