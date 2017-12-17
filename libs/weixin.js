import {
  API_BASE,
  API_ROUTE_WEIXIN_LOGIN,
  API_ROUTE_WEIXIN_BIND
} from '../config/api'

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
