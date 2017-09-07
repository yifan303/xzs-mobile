import common from 'widget/common'
import ajax from 'widget/ajax'
import React from 'react'
import {getUrlParam} from 'xzs-util'
import Slide from 'dwd-slide'
import "./detail.less"
import appUrl from 'widget/type/appUrl.js'
import {appendItem,getSumItemCount} from 'widget/promise'
import login from 'widget/login'
import message from 'xzs-message'

var itemId = getUrlParam('id')||getUrlParam('itemId')

common.createPage(React.createClass({
  getInitialState(){
    return {
      picList:[],
      title:'',
      subtitle:'',
      discountPriceYuanString:'',
      priceYuanString:"",
      count:1,
      saleDetailInfo:'',
      originplace:'',
      itemId:null,
      skuId:null,
      uid:null,
      tagDetail:null,

      sumItem:0

    }
  },
  componentDidMount(){
    // 获取商品详情
    var promise = ajax({
      url:'/requestcommodity/itemdetail',
      method:'get',
      data:{
        itemId
      }
    })
    promise.then(res=>{
      var result = JSON.parse(res)
      if(result.success){
        var {picList,title,subtitle,itemSkuVOs,itemId} = result.module
        var {priceYuanString,discountPriceYuanString,saleDetailInfo,originplace,skuId,tagDetail} = result.module.itemSkuVOs[0]
        this.setState({itemId,skuId,picList,title,subtitle,priceYuanString,discountPriceYuanString,saleDetailInfo,originplace,tagDetail})
      }
    })

    // 获取用户信息
    login.check((result,modules)=>{
      if(result){
        var uid = modules.userId
        this.setState({uid})
        var promise = getSumItemCount(uid)
        promise.then(result=>{
          if(result.success){
            this.setState({sumItem:this.state.sumItem+parseInt(result.data)})
          }
        })
      }
    })

  },
  goBack(){
    window.location.href = window.document.referrer||'home.html'
  },
  deleteCount(){
    var {count} = this.state
    if(count>1){
      this.setState({count:count-1})
    }
  },
  addCount(){
    var {count} = this.state
    this.setState({count:count+1})
  },
  appendToCart(){
    var {uid,itemId,count,skuId} = this.state
    if(uid===null){
      login.gotoLogin()
      return
    }
    var promise = appendItem({uid,itemId,itemCount:count,skuId})
    promise.then(result=>{
      if(result.success){
        message('添加商品成功')
        this.setState({sumItem:this.state.sumItem+parseInt(count)})
      }else{
        message(result.errorMsg||'添加商品失败')
      }
    })
  },
  render(){
    var {
      itemId,picList,title,
      subtitle,discountPriceYuanString,priceYuanString,
      count,saleDetailInfo,originplace,
      sumItem,tagDetail
    } = this.state
    return (
      <div>
        <span onClick={e=>this.goBack()} className="detail-back"></span>
        {picList&&picList.length>0&&(
          <Slide
            auto={false}
            width="10rem"
            height="10rem"
            images={picList.map(pic=>({
              src:pic
            }))}
          />
        )}
        <div className="detail-info">
          <p className="detail-title">{title}</p>
          <p className="detail-subTitle">
            {subtitle}
            {tagDetail&&tagDetail.tagContent&&<span className="detail-tag">{tagDetail.tagContent}</span>}
          </p>
          <div className="detail-sale clearfix">
            <div className="detail-price detail-left">
              <span className="detail-price-sign">¥</span>
              <span className="detail-price-discount">{discountPriceYuanString}</span>
              <span className="detail-price-origin">¥{priceYuanString}</span>
            </div>
            <div className="detail-right">
              <span onClick={e=>this.deleteCount()} className="detail-operation">-</span>
              <span className="detail-num">{count}</span>
              <span onClick={e=>this.addCount()} className="detail-operation">+</span>
            </div>
          </div>
          <div className="detail-spec clearfix">
            <div className="detail-left detail-text">规格</div>
            <div className="detail-right">
              <span className="detail-spec-text">{saleDetailInfo}</span>
            </div>
          </div>
          <div className="detail-spec clearfix">
            <div className="detail-left detail-text">产地</div>
            <div className="detail-right detail-text">{originplace}</div>
          </div>
        </div>
        {itemId&&<iframe className="detail-frame" src={`//www.xianzaishi.com/mobile/detail.html?id=${itemId}`}/>}
        <div className="detail-cart-place"></div>
        <div className="detail-cart">
          <a href="cart.html" className="detail-cart-icon">
            {sumItem>0&&(<span>{sumItem}</span>)}
          </a>
          <div className="detail-cart-add" onClick={e=>this.appendToCart()}>加入购物车</div>
        </div>
      </div>
    )
  }
}))
