const API_BASE = 'https://wp-dev.ninghao.net/wp-json'
const API_ROUTE_WEIXIN_LOGIN = 'weixin/v1/login'
const API_ROUTE_WEIXIN_BIND = 'weixin/v1/bind'

const weixinLogin = (callback) => {
  wx.login({
    success: (login) => {
      wx.request({
        url: `${ API_BASE }/${ API_ROUTE_WEIXIN_LOGIN }`,
        method: 'POST',
        data: {
          code: login.code
        },
        success: (response) => {
          callback(response)
        }
      })
    }
  })
}

const weixinBind = ({ userInfo, userId, token } = obj) => {
  wx.login({
    success: (login) => {
      wx.request({
        url: `${ API_BASE }/${ API_ROUTE_WEIXIN_BIND }`,
        method: 'POST',
        header: {
          'Authorization': `Bearer ${ token }`
        },
        data: {
          code: login.code,
          userInfo,
          userId
        },
        success: (response) => {
          console.log(response)
        }
      })
    }
  })
}

export {
  weixinLogin,
  weixinBind
}
