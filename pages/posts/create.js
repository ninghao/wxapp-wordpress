const app = getApp()

const API_BASE = 'https://wp-dev.ninghao.net/wp-json'
const API_ROUTE = 'wp/v2/posts'

Page({
  data: {
    entity: {},
    jwt: {},
    isLoading: false,
    images: []
  },
  onShow () {
    const { jwt } = app.globalData
    this.setData({
      jwt: {
        ...jwt
      }
    })
  },
  onChooseImage () {
    wx.chooseImage({
      count: 1,
      sizeType: ['original'],
      sourceType: ['album', 'camera'],
      success: (response) => {
        this.setData({
          images: response.tempFilePaths
        })
      }
    })
  },
  onPreviewImage (event) {
    wx.previewImage({
      current: event.target.dataset.src,
      urls: this.data.images
    })
  },
  onInputTitle (event) {
    this.setData({
      ['entity.title']: event.detail.value
    })
  },
  onInputContent (event) {
    this.setData({
      ['entity.content']: event.detail.value
    })
  },
  onChangeStatus (event) {
    this.setData({
      ['entity.status']: event.detail.value ? 'publish' : ''
    })
  },
  onTapSubmitButton () {
    console.log(this.data.entity)

    this.setData({
      isLoading: true
    })

    wx.request({
      url: `${ API_BASE }/${ API_ROUTE }`,
      method: 'POST',
      header: {
        'Authorization': `Bearer ${ this.data.jwt.token }`
      },
      data: {
        ...this.data.entity
      },
      success: (response) => {
        switch (response.statusCode) {
          case 201:
            this.setData({
              entity: {}
            })

            wx.navigateTo({
              url: `/pages/posts/show?id=${ response.data.id }`
            })
            break
          default:
            console.log(response)
        }
      },
      complete: () => {
        this.setData({
          isLoading: false
        })
      }
    })
  }
})
