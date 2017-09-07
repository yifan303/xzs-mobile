import React from 'react'
import "../coupon/coupon.less"
import {token} from 'widget/store'
import Modal from 'widget/login/modal.js'
import message from 'xzs-message'
import login from 'widget/login'
import ajax from 'widget/ajax'
import SimpleModal from 'dwd-modal'
import appUrl from 'widget/type/appUrl.js'
import {cookie} from 'xzs-util'
import _ from 'underscore'

export default React.createClass({
  getInitialState(){
    return {
      phone:'',
      show:false,
      token:'',

      repeatShow:false

    }
  },
  componentDidMount(){

  },
  getCoupon(){
    login.check(result=>{
      if(result){
        var promise = ajax({
          url:'/promotion/addDiscountCoupon',
          method:'get',
          data:{
            type:1,
            couponId:9,
            token:token.get()
          }
        })
        promise.then(res=>{
          var result = JSON.parse(res)
          if(result.success){
            if(result.errorMsg&&result.errorMsg.indexOf('已拥有')>-1){
              return message('抱歉！此活动仅限新用户参与')
            }
            window.location.href='act-20170303.html?id=1'
          }else{
            message(result.errorMsg)
          }
        })
      }else{
        return login.gotoLogin()
      }
    })

  },
  render(){
    var {phone,show,repeatShow} = this.state
    return (
      <div>
        <img className="banner" src={require('../coupon/banner1.png')} />
        <img onClick={e=>this.getCoupon()} className="banner" src={require('../coupon/banner2.png')} />
        <img className="banner" src={require('../coupon/banner3.png')} />
        <SimpleModal
          show={repeatShow}
          onHide={e=>this.setState({repeatShow:false})}
          width="8rem"
        >
          <div className="repeat-modal">
            <span onClick={e=>this.setState({repeatShow:false})}>x</span>
            <p>抱歉！此活动仅限新用户参与</p>
            <a href={appUrl}>打开app更多惊喜</a>
          </div>
        </SimpleModal>
      </div>
    )
  }
})
