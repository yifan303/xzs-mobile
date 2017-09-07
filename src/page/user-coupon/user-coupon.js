import React from 'react'
import common from 'widget/common'
import "./coupon.less"
import Coupon from 'widget/coupon'
import hybird from 'xzs-hybird'
import {domainMap} from 'widget/ajax'
import req from 'reqwest'
import {token} from 'widget/store'
import message from 'xzs-message'

common.createPage(
  React.createClass({
    getInitialState(){
      return {
        list:[]
      }
    },
    componentDidMount(){
      hybird.setTitle('速懒鲜生-我的优惠卷')
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
          queryType:0
        }
      })
      promise.then(res=>{
        var result = JSON.parse(res)
        if(result.success){
          this.setState({list:result.module||[]})
        }else{
          message(result.errorMsg||'优惠卷获取失败')
        }
      })
    },
    render(){
      return (
        <div className="coupon-wrap">
          <Coupon list={this.state.list} onClose={e=>window.location.href="user.html"}/>
        </div>
      )
    }
  })
)
