import req from 'reqwest'
import common from 'widget/common'
import "./ajax.less"

var loading = document.createElement('div')
var content = document.body
loading.style.display = 'none'
content.appendChild(loading)
loading.innerHTML = `
  <div class='uil-spin-css' style='-webkit-transform:scale(0.6)'>
    <div><div></div></div>
    <div><div></div></div>
    <div><div></div></div>
    <div><div></div></div>
    <div><div></div></div>
    <div><div></div></div>
    <div><div></div></div>
    <div><div></div></div>
    </div>
  `

var params = (param) => {
  var str = '';
  for(var i in param){
    if(str!==''){
      str += '&'
    }
    str += `${i}=${param[i]}`
  }
  return str
}

export var domainMap = {
  'item':{
    'dev':'//item.xianzaishi.net/wapcenter',
    'prod':'//item.xianzaishi.com'
  },
  'trade':{
    'dev':'//trade.xianzaishi.net',
    'prod':'//trade.xianzaishi.com'
  },
  'purchase':{
    'dev':'//purchaseop.xianzaishi.net/purchaseadmin',
    'prod':'//purchaseop.xianzaishi.com'
  }
}

export default function(options){
  var domainName = options.domain||'item'
  var domain = domainMap[domainName]||domainMap['item']

  if(common.isProd||options.online){
    options.url=domain.prod+options.url
  }else if(common.isDev||common.isQa){
    options.url=domain.dev+options.url
  }

  options.contentType="text/plain"
  options.processData=false
  options.dataType='html'

  var postData = {
    "version":1,
    "src":"erp",
    "data":options.data||"",
    "appversion":"1"
  }

  if(options.method==='get'||options.method==='GET'){
    options.url += '?'+params(options.data)
    options.data=''
  }else{
    options.data=JSON.stringify(postData)
  }
  loading.style.display = 'block'
  var promise = req(options)
  var always = () => {
    loading.style.display = 'none'
  }
  promise.then(result=>{
    always()
    return result
  },()=>{
    always()
  })
  return promise
}
