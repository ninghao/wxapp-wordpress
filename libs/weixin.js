const API_BASE = 'https://wp-dev.ninghao.net/wp-json'
const API_ROUTE_WEIXIN_LOGIN = 'weixin/v1/login'

const weixinLogin = () => {
  wx.login({
    success: (login) => {
      wx.request({
        url: `${ API_BASE }/${ API_ROUTE_WEIXIN_LOGIN }`,
        method: 'POST',
        data: {
          code: login.code
        },
        success: (response) => {
          console.log(response)
        }
      })
    }
  })
}

export {
  weixinLogin
}
