import hybird from 'xzs-hybird'
import React from 'react'
import message from 'xzs-message'
import {appendItem} from 'widget/promise'

var isApp = () => {
  return typeof(window.xzsPlatform)!=='undefined'
}



export function Href(props){
  var {style,className,sku,item,uid} = props
  return (
    <a style={style||{}} className={className||''} onClick={e=>{
      if(isApp()){
        if(item&&sku){
          return hybird.addItemToCart(item,sku)
        }
        if(item){
          return hybird.openDetail(item)
        }
      }else{
        if(item&&sku&&uid){
          //添加购物车
          return appendItem({
            uid,itemId:item,itemCount:1,skuId:sku
          })
        }
        if(item){
          return window.location.href=`detail.html?id=${item}`
        }
      }
    }}>
      {props.children}
    </a>
  )
}
