import React from 'react'
import styles from "./pit.less"
import Img from './image.js'
import {Href} from 'widget/hybird'

export default (props) => {
  var {list,style,itemStyle} = props
  return (
    <div className="pit-module" style={style||{}}>
      {list.map((json,index)=>{
        var empty = json.itemSkuVOs&&json.itemSkuVOs[0]&&json.itemSkuVOs[0].inventory<=0;
        var saleDetailInfo = json.itemSkuVOs&&json.itemSkuVOs[0]&&json.itemSkuVOs[0].saleDetailInfo
        var tags = json.itemSkuVOs&&json.itemSkuVOs[0]&&json.itemSkuVOs[0].tagDetail&&json.itemSkuVOs[0].tagDetail['tagContent']
        return (
          <div key={index} className="pit-goods" style={itemStyle||{}}>
        		<Href item={json.itemId} className="pit-boxImg">
        			<Img className="pit-boxImgPic" src={json.picUrl} />
        		</Href>
        		<div className="pit-boxText">
        			<Href className="pit-text1" item={json.itemId}>{json.title}</Href>
              <p className="pit-subtitle"><span>¥{json.discountPriceYuanString}</span>/{saleDetailInfo}</p>
            </div>
            {empty&&<span className="pit-empty">卖光啦</span>}
            {tags&&(
              <span className="w-good-tags">{tags}</span>
            )}
        	</div>
        )
      })}
    </div>
  )
}
