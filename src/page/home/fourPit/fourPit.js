import React from 'react'
import styles from './fourPit.less'
import parseBanner from '../parseBanner.js'
import Img from 'widget/image'
import {Href} from 'widget/hybird'

export default props => {
  var {list,pic} = props
  var renderItem = item => {
    if(!item){
      return <div></div>
    }
    var tags = item.itemSkuVOs&&item.itemSkuVOs[0]&&item.itemSkuVOs[0].tagDetail&&item.itemSkuVOs[0].tagDetail['tagContent']
    return (
      <div>
        {tags&&(
          <span className="w-good-tags">{tags}</span>
        )}
        <Href item={item.itemId}>
          <Img src={item.picUrl} />
        </Href>
        <p>¥{item.discountPriceYuanString}<span>/{item.itemSkuVOs&&item.itemSkuVOs[0]&&item.itemSkuVOs[0].saleDetailInfo}</span></p>
      </div>
    )
  }
  return (
    <div className="four-wrap">
      {parseBanner(pic[0],0,{
        flex:'0 0 4rem',
        width:'4rem',
        height:'6.18rem'
      })}
      <section>
        {renderItem(list[0])}
        {renderItem(list[2])}
      </section>
      <section>
        {renderItem(list[1])}
        {renderItem(list[3])}
      </section>
    </div>
  )
}
