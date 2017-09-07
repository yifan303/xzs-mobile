import React from 'react'
import "./coupon.less"
import Cancel from 'widget/button/cancel.js'

var parseDate = date => {
  return [date.getFullYear(),date.getMonth()+1,date.getDate()].join('.')
}

export default (props) => {
  var {list,onSelect} = props
  return (
    <div className="w-coupon-wrap">
      {list.length === 0&&(
        <img className="w-coupon-empty" src={require('./coupon-empty.jpg')} />
      )}
      {list.length > 0&&list.map(item=>{
        var startTime = new Date(item.couponStartTime)
        var endTime = new Date(item.couponEndTime)
        return (
          <div key={item.id} className="w-coupon" onClick={e=>onSelect&&onSelect(item)}>
            <div  className="w-coupon-first">
              <p className="w-coupon-price">¥ {((item.amountCent/100)||0).toFixed(2)}</p>
              <p className="w-coupon-condition">满{item.amountLimitYuanDescription}元可用</p>
            </div>
            <div className="w-coupon-second">
              <span>未使用</span>
              <span>使用期限 : {parseDate(startTime)} - {parseDate(endTime)}</span>
            </div>
          </div>
        )
      })}
      <div className="w-coupon-button-wrap"></div>
      <div className="w-coupon-button">
        <Cancel onClick={e=>props.onClose()}>返回</Cancel>
      </div>
    </div>
  )
}
