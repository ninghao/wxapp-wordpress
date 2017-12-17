import {
  API_BASE,
  API_ROUTE_POSTS,
  API_ROUTE_MEDIA
} from '../../config/api'

import { validateToken } from '../../libs/auth-jwt'
const app = getApp()

Page({
  data: {
    entity: {},
    jwt: {},
    isLoading: false,
    images: [],
    progress: []
  },
  onShow () {
    const { jwt } = app.globalData

    validateToken(jwt, (result) => {
      if (!result) {
        wx.navigateTo({
          url: '/pages/users/login'
        })
      }
    })

    this.setData({
      jwt: {
        ...jwt
      }
    })
  },
  destroyImage (id) {
    wx.request({
      url: `${ API_BASE }/${ API_ROUTE_MEDIA }/${ id }?force=true`,
      method: 'DELETE',
      header: {
        'Authorization': `Bearer ${ this.data.jwt.token }`
      },
      success: (response) => {
        const images = this.data.images.filter((image) => {
          return image.id !== id
        })

        this.setData({
          images
        })
      }
    })
  },
  onLongpressImage (event) {
    const id = event.currentTarget.dataset.id

    wx.showActionSheet({
      itemList: ['删除图片'],
      success: (response) => {
        switch (response.tapIndex) {
          case 0:
            this.destroyImage(id)
            break
          default:
            console.log(response)
        }
      }
    })
  },
  onChooseImage () {
    wx.chooseImage({
      count: 1,
      sizeType: ['original'],
      sourceType: ['album', 'camera'],
      success: (response) => {
        const images = response.tempFiles

        this.setData({
          images
        })

        images.map((file, index) => {
          const uploadTask = wx.uploadFile({
            url: `${ API_BASE }/${ API_ROUTE_MEDIA }`,
            filePath: file.path,
            name: 'file',
            header: {
              'Authorization': `Bearer ${ this.data.jwt.token }`
            },
            success: (response) => {
              // console.log(response)
              const media = JSON.parse(response.data)
              const images = this.data.images
              images[index] = {
                ...file,
                id: media.id
              }

              this.setData({
                'entity.featured_media': media.id,
                images
              })
            }
          })

          uploadTask.onProgressUpdate((response) => {
            const progress = [...this.data.progress]
            progress[index] = response.progress

            this.setData({
              progress
            })
          })
        })
      }
    })
  },
  onPreviewImage (event) {
    const urls = this.data.images.map((image) => {
      return image.path
    })

    wx.previewImage({
      current: event.currentTarget.dataset.src,
      urls
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
      url: `${ API_BASE }/${ API_ROUTE_POSTS }`,
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
              entity: {},
              images: [],
              progress: []
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
