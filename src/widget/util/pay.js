// 支付相关
import common from 'widget/common'
var host = common.isProd?'m.xianzaishi.com':'m.xianzaishi.net'

var url = window.encodeURIComponent(`http://${host}/mobile/pay.html`)
export var gotoPay = (oid) => {
  window.location.href=`https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx4b6d100929d957c6&redirect_uri=${url}&response_type=code&scope=snsapi_userinfo&state=${oid}#wechat_redirect`
}
