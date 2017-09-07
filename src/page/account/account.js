import common from 'widget/common'
import React from 'react'
import hybird from 'xzs-hybird'
import "./account.less"
import login from 'widget/login'
import req from 'reqwest'
import ajax from 'widget/ajax'
import {domainMap} from 'widget/ajax'
import message from 'xzs-message'
import FixModal from 'widget/fix-modal'
import AddressList from '../user-address/list-class.js'
import {getUrlParam} from 'xzs-util'
import {token} from 'widget/store'
import Img from 'widget/image'
import Modal from 'dwd-modal'
import _ from 'underscore'
import Coupon from 'widget/coupon'
import Cancel from 'widget/button/cancel.js'
import {parseTime,parseDate,parseDateStr} from 'widget/util/date.js'
import {gotoPay} from 'widget/util/pay.js'

var sciId = getUrlParam('sciId')
// 购物车id校验
if(!sciId){
  window.location.href='cart.html'
}

common.createPage(React.createClass({
  getInitialState(){
    return {

      // 表单数据
      uid:'',
      address:null,
      freight:'',
      arrive:'',
      description:'',
      coupon:null,

      // 优惠信息
      discountInfos:null,

      //收货地址弹出框
      addressModal:false,

      // 当前总价
      currPrice:'',

      // 商品列表
      objects:null,
      // 商品列表弹出框
      objectsModal:false,

      // 送达时间弹出框
      arriveModal:false,

      // 送达 今天或者明天
      arriveDay:['今天','明天'],
      arriveDayValue:'0',
      arriveTime:[{},{}],
      arriveTimeValue:parseDateStr(+new Date),

      // 优惠卷
      couponList:[],
      couponModal:false,
      couponListLength:0,

      isSubmit:false

    }
  },
  componentDidMount(){
    hybird.setTitle('速懒鲜生-订单结算')

    // 获取结算的sku
    var skuIds = getUrlParam('skuId')
    if(!skuIds){
      window.location.href="cart.html"
    }
    var skus = skuIds.split(',')

    // 获取结算信息
    var getSettle = ()=>{
      var promise = ajax({
        url:'/sc/settle.json',
        method:'post',
        domain:'trade',
        data:{
          token:token.get(),
          skuIds
        }
      })
      promise.then(result=>{
        if(result.success){
          var {currPrice,objects,freight,discountInfos,couponList,deliverRangeResult} = result.data
          var arriveTime = getRangeTime(deliverRangeResult)
          var arriveTimeValue = _.keys(arriveTime[0])[0] || ''
          this.setState({
            currPrice,objects,freight,
            couponListLength:(couponList||[]).length,
            discountInfos:discountInfos&&discountInfos.length>0?discountInfos[0]:null,
            arriveDay:getDay(deliverRangeResult),
            arriveTime,
            arriveTimeValue
          })
        }
      })
    }

    // 获取默认地址
    var getDefaultAddress = ()=>{
      var {uid} = this.state
      var promise = ajax({
        url:'/da/getDefaultAddress.json',
        domain:'trade',
        method:'post',
        data:{
          uid
        }
      })
      promise.then(result=>{
        if(result.success){
          if(!result.data){
            return
          }
          var address = result.data
          var {level1Name,level2Name,level3Name,level4Name} = address
          address.codeAddress =[level1Name,level2Name,level3Name,level4Name].join('')
          this.setState({address})
        }else{
          message(result.message||'获取默认地址失败')
        }
      })
    }

    // 获取今日明日
    var getDay = (rangeResult)=>{
      return ['今日','明日']
    }

    // 获取今日明日时间
    var getRangeTime = rangeResult => {
      var handleResult = result => {
        var {start,dayEnd,timeRange,waveRange} = result
        var obj = {}
        var minuteUtil = 1000 * 60
        while(start+waveRange*minuteUtil<dayEnd&&start+timeRange*minuteUtil<dayEnd){
          obj[parseDateStr(start)] = parseTime(start) + '-' + parseTime(start+timeRange*minuteUtil)
          start+=waveRange*minuteUtil
        }
        return obj
      }
      return rangeResult.map(handleResult)
    }

    // 获取uid
    login.check((result,modules)=>{
      if(result){
        this.setState({uid:modules.userId},()=>{
          getDefaultAddress()
          getSettle()
        })
      }else{
        window.location.href='cart.html'
      }
    })

  },
  openAddressModal(){
    this.setState({addressModal:true})
  },
  // 选择地址
  selectAddress(item){
    this.setState({
      addressModal:false,
      address:item
    })
  },
  // 商品列表
  openObjectsModal(){
    this.setState({
      objectsModal:true
    })
  },
  // 送达时间
  openArriveModal(){
    this.setState({
      arriveModal:true
    })
  },
  // 获取优惠卷列表
  getConponList(){
    this.setState({couponModal:true})
    var {objects} = this.state
    var buySkuDetailJson = objects.reduceRight(($1,$2)=>{
      $1[$2.skuId+''] = parseInt($2.itemCount)+''
      return $1
    },{})
    var url = ''
    var method = '/promotion/selectUserCouponList'
    var domain = domainMap['item']
    if(common.isProd){
      url=domain.prod+method
    }else if(common.isDev||common.isQa){
      url=domain.dev+method
    }
    var promise = req({
      url,
      method:'post',
      data:{
        token:token.get(),
        queryType:1,
        payType:1,
        buySkuDetailJson:JSON.stringify(buySkuDetailJson)
      }
    })
    promise.then(res=>{
      var result = JSON.parse(res)
      if(result.success){
        this.setState({couponList:result.module||[]})
      }else{
        message(result.message||'优惠卷获取失败')
      }
    })
  },
  // 选择优惠卷
  selectCoupon(coupon){
    this.setState({
      couponModal:false,
      coupon
    })
  },
  // 提交订单
  submit(){
    var {uid,coupon,arriveTimeValue,address,description} = this.state
    if(address===null){
      return message('请选择收货地址')
    }
    var distribution = arriveTimeValue
    var credit = 0
    var couponId = coupon === null ? 0:coupon.id
    var addressId = address.id
    this.setState({isSubmit:true})
    var promise = ajax({
      url:"/sc/toCartOrder.json",
      domain:'trade',
      method:'post',
      data:{
        token:token.get(),sciId,
        distribution,credit,
        couponId,adderssId:addressId,
        description,rechargePayAmount:0
      }
    })
    promise.then(result=>{
      if(result.success){
        message('订单提交成功')
        window.setTimeout(()=>{
          gotoPay(result.data)
          this.setState({isSubmit:false})
        },2000)
      }else{
        message(result.errorMsg||'订单提交失败')
        this.setState({isSubmit:false})
      }
    },()=>{
      this.setState({isSubmit:false})
    })
  },
  render(){
    var {
      freight,
      address,addressModal,
      currPrice,
      objects,objectsModal,
      discountInfos,
      arriveModal,
      arriveDay,
      arriveDayValue,
      arriveTime,
      arriveTimeValue,
      description,
      couponList,
      couponListLength,
      couponModal,
      coupon,
      isSubmit
    } = this.state

    // 计算总价
    var totalPrice = parseFloat(currPrice)+parseFloat(freight)

    if(coupon){
      totalPrice = totalPrice-coupon.amountCent/100
    }

    if(totalPrice<0){
      totalPrice = 0
    }

    return (
      <div className="account">

        <FixModal show={addressModal}>
          <AddressList
            goBack={e=>this.setState({addressModal:false})}
            onSelect={item=>this.selectAddress(item)}
          />
        </FixModal>

        <FixModal show={couponModal} style={{"backgroundColor":"#ededed"}}>
          <Coupon list={couponList} onSelect={item=>this.selectCoupon(item)} onClose={e=>this.setState({couponModal:false})}/>
        </FixModal>

        {objects!==null&&(
          <FixModal show={objectsModal}>
            <div className="account-object-pit">
            {objects.map(object=>(
              <div key={object.id} className="account-pit">
                <Img className="account-pit-img" src={object.itemIconUrl} />
                <p className="account-pit-title">{object.itemName}</p>
                <span className="account-pit-price">¥{object.itemPayPrice}</span>
                <span className="account-pit-count">X {object.itemCount}</span>
              </div>
            ))}
            </div>
            <div className="account-object-back-wrap">
              <div className="account-object-back-place" />
              <div className="account-object-back">
                <Cancel onClick={e=>this.setState({objectsModal:false})}>返回</Cancel>
              </div>
            </div>
          </FixModal>
        )}

        <Modal
          onHide={e=>this.setState({arriveModal:false})}
          show={arriveModal}
          width="6rem"
        >
          <div className="account-arrive-time">
            <select value={arriveDayValue} onChange={e=>this.setState({arriveDayValue:e.target.value})}>
              {arriveDay.map((arrive,index)=>(
                <option key={index} value={index}>{arrive}</option>
              ))}
            </select>
            <select value={arriveTimeValue} onChange={e=>this.setState({arriveTimeValue:e.target.value})}>
              {_.pairs(arriveTime[parseInt(arriveDayValue)]).map(pair=>(
                <option key={pair[0]} value={pair[0]}>{pair[1]}</option>
              ))}
            </select>
          </div>
        </Modal>

        <div className="account-address" onClick={e=>this.openAddressModal()}>

          {!address&&(
            <div className="account-edit">
              <a />
              <span>点此处填写您的收货信息</span>
            </div>
          )}

          {address&&(
            <div className="account-show-address">
              <p>
                <span>{address.name}</span>
                <span>{address.phone}</span>
              </p>
              <p>{address.codeAddress+address.address}</p>
            </div>
          )}

          <a className="account-arrow" />
        </div>

        <div className="account-discount">
          <span>已享优惠</span>
          <span>{discountInfos&&discountInfos.discountDesc}</span>
        </div>
        {objects!==null&&(
          <div className="account-pits">
            {objects.length===1&&(
              <div className="account-pit">
                <Img className="account-pit-img" src={objects[0].itemIconUrl} />
                <p className="account-pit-title">{objects[0].itemName}</p>
                <span className="account-pit-price">¥{objects[0].itemPayPrice}</span>
                <span className="account-pit-count">X {objects[0].itemCount}</span>
              </div>
            )}
            {objects.length>1&&(
              <div className="account-pit-imgs" onClick={e=>this.openObjectsModal()}>
                {objects.map((object,index)=>{
                  if(index>3){
                    return <span key={index} />
                  }else{
                    return <img key={index} src={object.itemIconUrl}/>
                  }
                })}
                <span className="account-pit-length">共{objects.length}件</span>
              </div>
            )}
            <a className="account-arrow" />
          </div>
        )}
        <div className="account-outer">
          <div className="account-mod account-sale" onClick={e=>this.openArriveModal()}>
            <div className="account-left">期望送达时间</div>
            <div className="account-right">
              <span className="account-arrive">{
                arriveTimeValue=='-1'?'尽快送达':(arriveDay[arriveDayValue]+arriveTime[parseInt(arriveDayValue)][arriveTimeValue])
              }</span>
            </div>
            <a className="account-arrow" />
          </div>
          <div className="account-mod account-sale" onClick={e=>this.getConponList()}>
            <div className="account-left">优惠</div>
            <div className="account-right">
              <span className="account-coupon">{couponListLength}</span>
            </div>
            <a className="account-arrow" />
          </div>
        </div>

        <div className="account-mod account-outer">
          <input
            value={description}
            className="account-memo"
            placeholder="若您对订单有特殊要求,请在此备注"
            onChange={e=>this.setState({description:e.target.value})}
          />
        </div>

        <div className="account-outer account-total">
          <div className="account-mod">
            <div className="account-left">商品总价</div>
            <div className="account-right">¥{currPrice}</div>
          </div>
          <div className="account-mod">
            <div className="account-left">运费</div>
            <div className="account-right">¥{freight}</div>
          </div>
          {coupon&&<div className="account-mod">
            <div className="account-left">{coupon.couponTitle}</div>
            <div className="account-right">- ¥{coupon.amountCent/100}</div>
          </div>}
        </div>
        <div className="account-outer account-mod">
          <div className="account-left">
            <span className="account-weixin" />
            <span>微信</span>
          </div>
          <div className="account-right">
            <span className="account-gou"/>
          </div>
        </div>

        <div className="account-bottom-wrap">
          <div className="account-bottom-place" />
          <div className="account-bottom">
            <span>合计 : </span>
            <span>{(totalPrice||0).toFixed(2)}</span>
            {!isSubmit&&<a onClick={e=>this.submit()}>提交订单</a>}
            {isSubmit&&<a>订单已提交</a>}
          </div>
        </div>
      </div>
    )
  }
}))
