import {token} from 'widget/store'
import ajax from 'widget/ajax'

export default {
  gotoLogin(){
    window.location.href=`login.html?redicret=${window.escape(window.location.href)}`
  },
  check(callback){
    var cb = callback||function(){}
    var tokenValue = token.get()
    if(!tokenValue||tokenValue==='(null)'||tokenValue==='null'){
      return cb(false)
    }
    var promise = ajax({
      url:'/requestuser/mine',
      method:'post',
      data:{
        token:tokenValue
      }
    })
    promise.then(res=>{
      var result = JSON.parse(res)
      if(result.success){
        cb(true,result.module,tokenValue)
      }else{
        // 用户不存在
        if(result.resultCode===-7){
          token.clear()
        }
        cb(false)
      }
    })
  }
}
