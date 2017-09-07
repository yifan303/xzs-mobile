import React from 'react'
import styles from './scrollPit.less'
import {Href} from 'widget/hybird'

export default props=>{
  var {list,title} = props
  var renderItem = item => {
    var tags = item.itemSkuVOs&&item.itemSkuVOs[0]&&item.itemSkuVOs[0].tagDetail&&item.itemSkuVOs[0].tagDetail['tagContent']
    return (
      <section key={item.itemId} className="clearfix" style={{'position':'relative'}}>
        <Href item={item.itemId}><img src={item.picUrl} /></Href>
        <p>{item.title}</p>
        <p>¥{item.discountPriceYuanString}<span>/{item.itemSkuVOs&&item.itemSkuVOs[0]&&item.itemSkuVOs[0].saleDetailInfo}</span></p>
        {tags&&(
          <span className="w-good-tags">{tags}</span>
        )}
      </section>
    )
  }
  return (
    <div className="scroll-wrap">
      <header>{title}</header>
      <div>
        {list.map(renderItem)}
      </div>
    </div>
  )
}
