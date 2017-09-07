import bottom from 'widget/bottom'
import React from 'react'
import "./cart.less"
import common from 'widget/common'
import ajax from 'widget/ajax'
import {token} from 'widget/store'
import login from 'widget/login'
import Img from 'widget/image'
import message from 'xzs-message'
import hybird from 'xzs-hybird'
import Modal from 'dwd-modal'
import {getUrlParam} from 'xzs-util'

var debug = getUrlParam('debug')

common.createPage(React.createClass({
  getInitialState(){
    return {
      discountInfo:null,
      objects:null,
      freightDesc:'',
      uid:'',

      countModal:false

    }
  },
  componentDidMount(){
    bottom.setMenu('cart')
    hybird.setTitle('速懒鲜生-购物车')

    var getCarts = () =>{
      var promise = ajax({
        url:'/sc/getCarts.json',
        domain:'trade',
        method:'post',
        data:{token:token.get()}
      })
      promise.then(result=>{
        if(result.success){
          if(!result.data){
            return this.setState({objects:undefined})
          }
          var {objects,discountInfo,freightDesc} = result.data
          this.setState({
            objects,
            discountInfo,
            freightDesc
          })
        }
      })
    }

    login.check((result,module)=>{
      if(result){
        this.setState({uid:module.userId},getCarts)
      }else{
        window.location.href='login.html'
      }
    })

  },

  // 删除商品
  del({itemId,skuId,itemName}){
    var objects = this.state.objects.filter(object=>object.skuId!==skuId)
    this.setState({objects})
    var checkList = objects.filter(object=>object.unSelect!==true).map(object=>object.skuId)
    var promise = ajax({
      url:'/sc/changeCartCount.json',
      method:'post',
      domain:'trade',
      data:{
        itemId,
        skuId,
        itemCount:0,
        token:token.get(),
        checkList:JSON.stringify(checkList)
      }
    })
    promise.then(result=>{
      if(result.success){
        if(!result.data){
          return
        }
        var {discountInfo,freightDesc} = result.data
        this.setState({
          freightDesc,
          discountInfo
        })
        return message(`${itemName}删除成功`)
      }else{
        message(result.errorMsg||'删除失败')
      }
    })
  },
  // 改变商品个数
  changeCount(object,itemCount){
    if(itemCount<1){
      return
    }
    if(object.unSelect === true){
      return message('请勾选上商品之后，再修改数量')
    }
    var {itemId,skuId,itemName} = object
    object.itemCount = itemCount
    var {objects} = this.state
    this.setState({objects:Object.assign([],objects)})
    var checkList = objects.filter(object=>object.unSelect!==true).map(object=>object.skuId)
    var promise = ajax({
      url:'/sc/changeCartCount.json',
      method:'post',
      domain:'trade',
      data:{
        itemId,
        skuId,
        itemCount,
        token:token.get(),
        checkList:JSON.stringify(checkList)
      }
    })
    promise.then(result=>{
      if(result.success){
        var {discountInfo,freightDesc} = result.data
        this.setState({
          freightDesc,
          discountInfo
        })
      }else{
        message(result.errorMsg||'更新失败')
      }
    })
  },
  // 选择商品
  selectItem(object){
    if(object.unSelect !== true){
      object.unSelect = true
    }else{
      object.unSelect = false
    }
    var {objects} = this.state
    this.setState({objects:Object.assign([],objects)})
    var checkList = objects.filter(object=>object.unSelect!==true).map(object=>object.skuId)
    var promise = ajax({
      url:'/sc/select.json',
      domain:'trade',
      method:'post',
      data:{
        token:token.get(),
        skuId:object.skuId,
        checkList:JSON.stringify(checkList)
      }
    })
    promise.then(result=>{
      if(result.success){
        var {discountInfo,freightDesc} = result.data
        this.setState({
          freightDesc,
          discountInfo
        })
      }
    })
  },
  // 点击全选
  selectAllItem(){
    var {objects} = this.state
    var isAllSelect = this.isAllSelect()
    var resultObjects = objects.map(object=>{
      var result = Object.assign({},object)
      result.unSelect = isAllSelect
      return result
    })
    this.setState({
      objects:resultObjects
    })
    var checkList = !isAllSelect?resultObjects.map(object=>object.skuId):[]
    var promise = ajax({
      url:'/sc/select.json',
      domain:'trade',
      method:'post',
      data:{
        token:token.get(),
        checkList:JSON.stringify(checkList)
      }
    })
    promise.then(result=>{
      if(result.success){
        var {discountInfo,freightDesc} = result.data
        this.setState({
          freightDesc,
          discountInfo
        })
      }
    })
  },
  // 判断当前是否全选
  isAllSelect(){
    var {objects} = this.state
    if(objects===null||objects===undefined){
      return true
    }
    var unSelectList = objects.filter(object=>object.unSelect===true)
    if(unSelectList.length===0){
      return true
    }
    return false
  },
  // 结算
  count(){

    // 目前不支持支付 点击结算提示打开或者下载app
    // if(debug!='1'){
    //   return this.setState({countModal:true})
    // }

    var {objects} = this.state
    var selectList = objects.filter(object=>object.unSelect!==true)
    if(selectList.length === 0){
      return message('请选择商品进行结算')
    }
    var skuIds = selectList.map(item=>item.skuId)
    var sciId = selectList.map(item=>item.id)
    window.location.href=`account.html?skuId=${skuIds.join(',')}&sciId=${sciId}`
  },
  render(){
    var {objects,discountInfo,uid,freightDesc,countModal} = this.state
    var isAllSelect = this.isAllSelect()
    if(objects === null){
      return <div />
    }
    if(objects === undefined){
      return (
        <div className="cart-empty">
          <img src={require('./cart-empty-pic.jpg')}
            className="cart-empty-pic" />
          <a href="home.html" className="cart-empty-btn">去逛逛</a>
        </div>
      )
    }
    return (
      <div>
        {discountInfo&&discountInfo.discountDesc!==''&&(
          <div className="cart-sale-wrap">
            <div className="cart-sale-place"/>
            <div className="cart-sale">
              <span>优惠贴士 | </span>
              <span>{discountInfo.discountDesc}</span>
            </div>
          </div>
        )}
        <Modal width='6rem' show={countModal} onHide={e=>this.setState({countModal:false})}>
          <div className="count-modal">
            <a className="close">X</a>
            <div className="count-wrap">
               <p>请打开鲜在时app进行结算</p>
               <p>若未下载，请点击下载</p>
            </div>
            <a className="down" href="download.html">下载鲜在时app</a>
          </div>
        </Modal>
        {objects.map(object=>{
          var tagContent = object.itemTags
          return (
            <div key={object.id} className="cart-good">
              <span
                className={`cart-good-icon ${object.unSelect===true?'cart-good-icon-un':''}`}
                onClick={e=>this.selectItem(object)}
              />
              <Img className="cart-good-img" src={object.itemIconUrl} />
              <p className="cart-good-title">{object.itemName}</p>
              <p className="cart-good-spec">规格 : {object.skuInfo.spec}</p>
              <a className="cart-good-del" onClick={e=>this.del(object)}>X</a>
              <div className="cart-good-price">
                <span className="cart-good-origin">¥ {object.itemPayPrice}</span>
                <p className="cart-good-count">
                  <span
                    className="cart-good-operation"
                    onClick={e=>this.changeCount(object,parseInt(object.itemCount)-1)}
                  >-</span>
                  <span className="cart-good-num">{parseInt(object.itemCount)}</span>
                  <span
                    className="cart-good-operation"
                    onClick={e=>this.changeCount(object,parseInt(object.itemCount)+1)}
                  >+</span>
                </p>
              </div>
            </div>
          )
        })}
        <div className="cart-bottom-wrap">
          <div className="cart-bottom-place"></div>
          {freightDesc!==''&&<div className="cart-freight">
            <span>{freightDesc}</span>
            <a href="home.html">{'去凑单>'}</a>
          </div>}
          <div className="cart-bottom">
            <a
              onClick={e=>this.selectAllItem()}
              className={`cart-whole ${isAllSelect?'':'cart-whole-unSelect'}`}
            />
            <span className="cart-whole-text">全选</span>
            <span className="cart-total">{(discountInfo&&discountInfo.currPrice)||'0.00'}</span>
            <a className="cart-account" onClick={e=>this.count()}>去结算</a>
          </div>
        </div>
      </div>
    )
  }
}))
