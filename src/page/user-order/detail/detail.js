import React from 'react'
import "./detail.less"
import req from 'widget/ajax'
import hybird from 'xzs-hybird'
import {token} from 'widget/store'
import {getUrlParam} from 'xzs-util'
import {parseDate} from 'widget/util/date.js'
import login from 'widget/login'

export default React.createClass({
  getInitialState(){
    return {
      oid:'',             // 订单号
      seq:'',             // 流水号
      gmtCreate:'',       // 创建时间
      gmtPay:'',          // 支付时间
      items:null,         // 商品列表
      attribute:'',       // 备注
      freight:0,          // 运费
      discountAmount:'',  // 优惠信息
      effeAmount:'',      // 合计
      originAmount:'',     // 原价
      addressInfo:null
    }
  },
  getAddressById(id,uid){
    var promise = req({
      url:'/da/getAddressById.json',
      method:'post',
      data:{id,uid},
      domain:'trade'
    })
    promise.then(result=>{
      if(result.success){
        this.setState({
          addressInfo:result.data
        })
      }
    })
  },
  componentDidMount(){
    hybird.setTitle('速懒鲜生-订单详情')

    var oid = getUrlParam('id')

    var param = `oid=${oid}&token=${token.get()}`
    var promise = req({
      url:'/order/getOrderDetailInfo.json?'+param,
      domain:'trade',
      method:"post"
    })
    promise.then(result=>{
      if(result.success){

        var {
          id,seq,gmtCreate,
          gmtPay,items,freight,
          discountAmount,effeAmount,originAmount,userAddressId
        } = result.data

        this.setState({
          oid:id,
          seq,
          gmtCreate:parseDate(gmtCreate),
          gmtPay:gmtPay?parseDate(gmtPay):'待支付',
          items,
          freight,
          discountAmount,effeAmount,originAmount
        })
        if(userAddressId!==0){
          // 获取uid
          login.check((result,data)=>{
            if(result){
              this.getAddressById(userAddressId,data.userId)
            }
          })
        }

      }
    })
  },
  render(){

    var {
      oid,seq,gmtCreate,gmtPay,
      items,attribute,freight,
      effeAmount,originAmount,
      discountAmount,addressInfo
    } = this.state

    return (
      <div>
        <div className="info">
          <p>订单编号 : {oid}</p>
          <p>流水号 : {seq}</p>
          <p>创建事件 : {gmtCreate}</p>
          <p>付款时间 : {gmtPay}</p>
        </div>
        {addressInfo&&(
          <div className="address">
            <span className="address__icon">
              <span>地址</span>
            </span>
            <div className="address__detail">
              <p>
                <span>{addressInfo.name}</span>
                <span>{addressInfo.phone}</span>
              </p>
              <p>{
                [
                  addressInfo.level2Name,
                  addressInfo.level3Name,
                  addressInfo.level4Name,
                  addressInfo.addressDetail
                ].join('')
              }</p>
            </div>
          </div>
        )}
        {items&&(
          <div className="goods">
            {items.map(item=>(
              <div key={item.id} className="goods__item">
                <img src={item.iconUrl} />
                <p>{item.name}</p>
                <p>
                  <span>¥{item.price}</span>
                  <i>x {item.count}</i>
                </p>
              </div>
            ))}
          </div>
        )}
        <div className="memo">
          <p>订单备注 : {attribute}</p>
        </div>
        <div className="price">
          <p className="price__line">
            <span>商品总价</span>
            <span>¥{originAmount}</span>
          </p>
          <p className="price__line">
            <span>运费</span>
            <span>¥{freight}</span>
          </p>
          <p className="price__line">
            <span>优惠信息</span>
            <span>-¥{discountAmount}</span>
          </p>
          <p className="price__total">
            <span>合计</span>
            <span>¥{effeAmount}</span>
          </p>
          <p className="customer">如果收到商品有质量问题，请尽快联系我们售后服务！</p>
        </div>
      </div>
    )
  }
})
