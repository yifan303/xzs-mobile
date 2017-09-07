import React from 'react'
import styles from './drink.less'
import {Href} from 'widget/hybird'

export default (props) => {
  var {list,picUrl,target,uid} = props

  return (
    <div className="drink-contain">
      <a className="drink-more" href={target&&target.type==4?target.url:''}>更多</a>
      <div className="drink-wrap" style={{backgroundImage:picUrl?`url(${picUrl})`:'none'}}>
        {list.map((item,key)=>{
          var good = item.item||{}
          var sku = good.itemSkuVOs||[{}]
          var names = item.name.split(/[;=]/)
          return (
            <div className="drink-item" key={key}>
              <Href item={good.itemId}>
                <img src={good.picUrl} />
              </Href>
              <Href item={good.itemId}>
                <p className="drink-title">{good.title}</p>
              </Href>  
              <p className="drink-subtitle">{good.subtitle}</p>
              <p className="drink-memo">
                <span>
                  <i>{names[0]}</i>
                  <i>{names[2]}</i>
                </span>
                <span>
                  <i>{names[1]}</i>
                  <i>{names[3]}</i>
                </span>
              </p>
              <p className="drink-price">
                <span>¥{sku[0].discountPriceYuanString}</span>
                /{sku[0].saleDetailInfo}
              </p>
              <Href item={good.itemId} sku={good.sku} uid={uid} className="drink-add">+</Href>
            </div>
          )
        })}
      </div>
    </div>
  )
}
