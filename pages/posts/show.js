import {
  API_BASE,
  API_ROUTE_POSTS,
  API_ROUTE_COMMENTS
} from '../../config/api'

import moment from '../../vendor/moment/moment'
import '../../vendor/moment/locale/zh-cn'
moment.locale('zh-cn')

const app = getApp()
const { towxml } = app

Page({
  data: {
    title: '',
    content: {},
    featured_media: '',
    author: {},
    isLoading: true,
    comments: [],
    total: 0,
    totalPages: 0,
    currentPage: 1,
    isEarth: false,
    comment: {},
    placeholder: '',
    focus: false,
    jwt: {}
  },
  onLoad (options) {
    // const id = options.id
    const id = 64

    const { jwt } = app.globalData

    this.setData({
      jwt
    })

    this.getPost(id)
    this.getComments(id)
  },
  onInputComment (event) {
    this.setData({
      ['comment.content']: event.detail.value
    })
  },
  onSubmitComment () {
    wx.request({
      url: `${ API_BASE }/${ API_ROUTE_COMMENTS }`,
      method: 'POST',
      data: {
        content: this.data.comment.content,
        post: this.data.id
      },
      header: {
        'Authorization': `Bearer ${ this.data.jwt.token }`
      },
      success: (response) => {
        if (response.statusCode === 201) {
          this.getComments(this.data.id)
          this.setData({
            comment: {}
          })
        }
      }
    })
  },
  onPullDownRefresh () {
    const id = this.data.id

    this.getPost(id, () => {
      this.getComments(id, () => {
        wx.stopPullDownRefresh()
      })
    })
  },
  transformComments (comments) {
    return comments.map((item) => {
      const content = {
        ...item.content,
        wxml: towxml.toJson(item.content.rendered, 'html')
      }

      const fromNow = moment.utc(item.date).local().fromNow()

      let comment = {
        ...item,
        content,
        fromNow
      }

      if (item.parent !== 0) {
        const inReplyTo = item._embedded['in-reply-to'][0]

        const reply = {
          ...inReplyTo,
          wxml: towxml.toJson(inReplyTo.content.rendered, 'html'),
          fromNow: moment.utc(inReplyTo.date).local().fromNow()
        }

        comment = {
          ...comment,
          reply
        }
      }

      return comment
    })
  },
  getComments (postId, callback = () => {

  }) {
    wx.request({
      url: `${ API_BASE }/${ API_ROUTE_COMMENTS }?post=${ postId }&_embed=true`,
      success: (response) => {
        console.log(response)
        const comments = this.transformComments(response.data)
        if (comments.length > 0) {
          this.setData({
            comments,
            isLoading: false,
            total: response.header['x-wp-total'],
            totalPages: response.header['x-wp-totalpages'],
            currentPage: 1,
            isEarth: false
          })
        }

        callback(response)
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
      url: `${ API_BASE }/${ API_ROUTE_COMMENTS }?_embed=true&page=${ currentPage }`,
      success: (response) => {
        let comments = this.transformComments(response.data)

        comments = [...this.data.comments, ...comments]

        this.setData({
          comments,
          currentPage,
          isLoading: false,
          total: response.header['x-wp-total'],
          totalPages: response.header['x-wp-totalpages'],
          isEarth: currentPage >= totalPages
        })
      }
    })
  },
  getPost (id, callback = () => {

  }) {
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

        callback(response)
      }
    })
  }
})
