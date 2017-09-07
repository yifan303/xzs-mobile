import {cookie} from 'xzs-util'
import hybird from 'xzs-hybird'
import message from 'xzs-message'
import common from 'widget/common'

var isApp = () => hybird.isAndroid()||hybird.isIos()
var domain = common.isProd?'.xianzaishi.com':'.xianzaishi.net'
var isNew = () => hybird.getToken()!==undefined

// token 在app中使用存取需要和app交互
// 在微信或者浏览器中使用cookie
var tokenSign = 'token'
var token = {
  get(){
    if(isApp()&&isNew()){
      return hybird.getToken()
    }
    return cookie.get(tokenSign)
  },
  set(tokenValue){
    if(isApp()&&isNew()){
      return hybird.sendToken(tokenValue)
    }
    return cookie.set(tokenSign,tokenValue,7,domain)
  },
  clear(){
    if(isApp()&&isNew()){
      return
    }
    return this.set('')
  }
}

export {token,isApp}
