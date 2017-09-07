var {href} = window.location
var urlMap = {
  home:{
    schema:"xianzaishi://mrsulan.com/home",
    url:'//m.xianzaishi.com/mobile/home.html'
  },
  detail:{
    schema:'xianzaishi://mrsulan.com/detail',
    url:'//m.xianzaishi.com/mobile/detail.html'
  },
  category:{
    schema:'xianzaishi://mrsulan.com/category',
    url:'//m.xianzaishi.com/mobile/cate.html'
  },
  subCate:{
    schema:'xianzaishi://mrsulan.com/category-item',
    url:'//m.xianzaishi.com/mobile/sub-cate.html'
  },
  scan:{
    schema:'xianzaishi://mrsulan.com/scan',
    url:href
  },
  cart:{
    schema:'xianzaishi://mrsulan.com/cart',
    url:'//m.xianzaishi.com/mobile/cart.html'
  },
  search:{
    schema:'xianzaishi://mrsulan.com/search',
    url:href
  },
  searchWord:{
    schema:'xianzaishi://mrsulan.com/search-word',
    url:href
  },
  mine:{
    schema:'xianzaishi://mrsulan.com/mine',
    url:'//m.xianzaishi.com/mobile/user.html'
  },
  mineOrder:{
    schema:'xianzaishi://mrsulan.com/mine-order',
    url:'//m.xianzaishi.com/mobile/user-order.html'
  },
  mineAddress:{
    schema:'xianzaishi://mrsulan.com/mine-address',
    url:'//m.xianzaishi.com/mobile/user-address.html'
  },
  code:{
    schema:'xianzaishi://mrsulan.com/mine-code',
    url:href
  },
  recharge:{
    schema:'xianzaishi://mrsulan.com/recharge',
    url:href
  },
  customer:{
    schema:'xianzaishi://mrsulan.com/customer',
    url:href
  },
  setting:{
    schema:'xianzaishi://mrsulan.com/setting',
    url:href
  },
  invite:{
    schema:'xianzaishi://mrsulan.com/invite',
    url:href
  }
}
var ua = window.navigator.userAgent.toLowerCase();
var isWeixin = () =>{
  if(ua.indexOf('micromessenger')>-1){
    return true
  }
  return false
}

var openClient = (name,param={})=>{

  var domain = urlMap[name||'home']
  var parseParam = param => {
    var res = []
    for(var i in param){
      res.push(i+'='+param[i])
    }
    if(res.length===0){
      return ''
    }
    return '?'+res.join('&')
  }

  runSchema(domain.schema + parseParam(param),domain.url + parseParam(param))

}

var runSchema = (schema,url) => {

  // ios下  使用原生提供的方法发起schema请求
  if(window.webkit&&window.webkit.messageHandlers&&window.webkit.messageHandlers.openUrl){
    window.webkit.messageHandlers.openUrl.postMessage(schema)
  }else{
    var timeout = null
    var timeoutCount = 500
    var d = + new Date
    var frame = document.createElement('iframe')
    var clearAll = () => {
      document.body.removeChild(frame)
      if(timeout){
        window.clearTimeout(timeout)
        timeout = null
      }
    }
    frame.src = schema
    frame.style.display = 'none'
    document.body.appendChild(frame)
    timeout = window.setTimeout(()=>{
      var endTime = +new Date
      if(isWeixin()||endTime-d<timeoutCount+200){
        window.location.href = url
      }
      clearAll()
    },timeoutCount)
  }

}

export default {
  openClient
}
