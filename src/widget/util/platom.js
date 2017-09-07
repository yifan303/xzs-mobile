// 判断浏览器

var ua = window.navigator.userAgent.toLowerCase();

//判断是否微信浏览器
export var isWeixin = () =>{
  if(ua.indexOf('micromessenger')>-1){
    return true
  }
  return false
}

// 判断是否是ios浏览器
export var isWebIos = () => {
  return /(iphone|ipad|ipod|ios)/i.test(ua)
}

// 判断是否是android浏览器
export var isWebAndroid = () => {
  return !isWebIos()
}
