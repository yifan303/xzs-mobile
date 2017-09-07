import ajax from 'widget/ajax'
import message from 'xzs-message'

// 添加购物车
export var appendItem = ({uid,itemId,itemCount,skuId})=>{
  var promise = ajax({
    url:'/sc/appendItem.json',
    method:'post',
    domain:'trade',
    data:{
      uid,itemId,itemCount,skuId
    }
  })
  promise.then(result=>{
    if(result.success){
      message('添加购物车成功')
    }
    return result
  })
  return promise
}

export var getSumItemCount = (uid) => {
  var promise = ajax({
    url:'/sc/getSumItemCount.json',
    method:'post',
    domain:'trade',
    data:{uid}
  })
  return promise
}

export var sysTime = ajax({
  url:'/system/gettime',
  method:'get',
  domain:'purchase'
})
