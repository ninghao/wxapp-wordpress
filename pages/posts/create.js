const app = getApp()

const API_BASE = 'https://wp-dev.ninghao.net/wp-json'
const API_ROUTE = 'wp/v2/posts'

Page({
  data: {
    entity: {},
    jwt: {}
  },
  onShow () {
    const { jwt } = app.globalData
    this.setData({
      jwt: {
        ...jwt
      }
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
      }
    })
  }
})
