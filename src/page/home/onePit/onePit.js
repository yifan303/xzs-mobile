import React from 'react'
import styles from './onePit.less'
import Img from 'widget/image'
import {Href} from 'widget/hybird'

export default props=>{
  var {list,title} = props
  var renderItem = item=>{
    var tags = item.itemSkuVOs&&item.itemSkuVOs[0]&&item.itemSkuVOs[0].tagDetail&&item.itemSkuVOs[0].tagDetail['tagContent']
    return (
      <div key={item.itemId} className="clearfix">
        <Href item={item.itemId}>
          <Img src={item.picUrl} />
        </Href>
        <p>{item.title}</p>
        <p>{item.subtitle}</p>
        <p>规格: {item.itemSkuVOs&&item.itemSkuVOs[0]&&item.itemSkuVOs[0].saleDetailInfo}</p>
        <p>¥<span>{item.discountPriceYuanString}</span></p>
        <div className="one-cart"></div>
        {tags&&(
          <span className="w-good-tags">{tags}</span>
        )}
      </div>
    )
  }
  return (
    <div className="one-wrap">
      <header>{title}</header>
      {list.map(renderItem)}
    </div>
  )
}
