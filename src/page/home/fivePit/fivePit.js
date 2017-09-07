import React from 'react'
import './fivePit.less'
import {Href} from 'widget/hybird'
import Img from 'widget/image'

export default props=>{
  var {list} = props
  var renderSingle = item => {
    var tags = item.itemSkuVOs&&item.itemSkuVOs[0]&&item.itemSkuVOs[0].tagDetail&&item.itemSkuVOs[0].tagDetail['tagContent']
    var empty = item.itemSkuVOs&&item.itemSkuVOs[0]&&item.itemSkuVOs[0].inventory<=0
    return (
      <div>
        {empty&&(
          <span className="w-good-empty">卖光啦</span>
        )}
        {!empty&&tags&&(
          <span className="w-good-tags">{tags}</span>
        )}
        <p className="stitle">{item.title}</p>
        <p className="scount">{item.itemSkuVOs&&item.itemSkuVOs[0]&&item.itemSkuVOs[0].saleDetailInfo}</p>
        <p className="sprice">¥{item.discountPriceYuanString}</p>
        <Href item={item.itemId}>
          <Img className="simg" src={item.picUrl} />
        </Href>
      </div>
    )
  }
  var renderDouble = item => {
    var tags = item.itemSkuVOs&&item.itemSkuVOs[0]&&item.itemSkuVOs[0].tags
    var empty = item.itemSkuVOs&&item.itemSkuVOs[0]&&item.itemSkuVOs[0].inventory<=0
    return (
      <div className="five-wrap">
        {empty&&(
          <span className="w-good-empty">卖光啦</span>
        )}
        {!empty&&tags&&(
          <span className="w-good-tags">{tags}</span>
        )}
        <div className="dinfo">
          <span>{item.title}</span>
          <span>¥{item.discountPriceYuanString}</span>
        </div>
        <Href item={item.itemId}>
          <Img className="simg" src={item.picUrl} />
        </Href>
      </div>
    )
  }
  return (
    <div className="five-wrap">
      <div className="single">
        {renderSingle(list[0])}
      </div>
      <div className="double">
        {renderDouble(list[1])}
        {renderDouble(list[2])}
      </div>
      <div className="double">
        {renderDouble(list[3])}
        {renderDouble(list[4])}
      </div>
    </div>
  )
}
