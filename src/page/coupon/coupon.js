import React from 'react'
import common from 'widget/common'
import "./coupon.less"
import {getUrlParam} from 'xzs-util'
import ajax from 'widget/ajax_v2'
import req from 'widget/ajax'
import message from 'xzs-message'
import {parseDateOnly} from 'widget/util/date.js'
import createToken from 'xzs-token'
import login from 'widget/login'
import {token} from 'widget/store'

const key = getUrlParam('id')

common.createPage(
  React.createClass({
    getInitialState(){
      return {
        title:'',
        expire:''
      }
    },
    componentDidMount(){

      var tokenValue = token.get()
      if(tokenValue){
        var tokenPromise = req({
          url:'/requestuser/mine',
          method:'post',
          data:{
            token:tokenValue
          }
        })
        tokenPromise.then(res=>{
          var result = JSON.parse(res)
          if(result.success){
            // token有效 则什么都不做
          }else{
            token.clear()
          }
        })
      }

      // 获取优惠卷详情
      var promise = ajax({
        url:'/promotion/getCouponDetail',
        method:'post',
        data:{
          key
        }
      })
      promise.then(result=>{
        result = JSON.parse(result)
        if(result.success){
          var {module} = result
          if(!module||module.length<1){
            return message('没有优惠卷信息')
          }
          module = module[0]
          var {title,gmtEnd} = module
          this.setState({
            title,
            expire:parseDateOnly(gmtEnd).replace(/\-/g,'.')
          })
        }else{
          message(result.errorMsg)
        }
      })

    },
    getCoupon(){
      var tokenValue = token.get()
      if(!tokenValue){
        return login.gotoLogin()
      }
      var promise = ajax({
        url:'/promotion/sendDiscountCoupon',
        method:'post',
        data:{token:tokenValue,key}
      })
      promise.then(result=>{
        result = JSON.parse(result)
        if(result.success){
          return message('领取优惠卷成功')
        }else{
          return message(result.errorMsg||result.error)
        }
      })

    },
    render(){
      var {title,expire} = this.state
      return (
        <div className="coupon" onClick={e=>{this.getCoupon()}}>
          <div className="info">
            <div className="title">{title}</div>
            <div className="expire">有效期至 : {expire}</div>
          </div>
        </div>
      )
    }
  })
)
