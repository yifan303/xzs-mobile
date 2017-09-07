import {getUrlParam} from 'xzs-util'
import React from 'react'
import common from 'widget/common'
import req from 'reqwest'
import message from 'xzs-message'
import "./pay.less"

const env = common.isProd?'com':'net'

var parseParam = data => JSON.stringify({
  "version":1,"src":"Eclipse###8.0",data,"appversion":"1"
})

common.createPage(
  React.createClass({
    getInitialState(){
      return {
        success:true
      }
    },
    componentDidMount(){
      var pay = () => {
        var code = getUrlParam('code')
        var state = getUrlParam('state')
        var promise = req({
          url:`//trade.xianzaishi.${env}/order/getWeixinWapPaySign.json`,
          method:'post',
          contentType:'application/json',
          data:parseParam({"oid":state,code})
        })
        promise.then(result=>{
          if(result.success){
            var {sign,noncestr,timestamp,appid,prepayid,pack,signType} = result.data
            if(typeof(wx)!==undefined){
              wx.chooseWXPay({
                timestamp:timestamp,
                nonceStr:noncestr,
                "package":pack,
                signType,
                paySign:sign,
                success(){
                  window.location.href = `//m.xianzaishi.${env}/mobile/pay-suc.html?id=${state}`
                },
                fail(){
                  this.setState({success:false})
                }
              })
            }
            return
          }
          message(result.error||result.errorMsg)
        })
      }


      if(typeof(wx)!==undefined){
        var promise = req({
          url:`//trade.xianzaishi.${env}/order/getWeixinWapPayTicket.json`,
          method:'post',
          contentType:'application/json',
          data:parseParam({url:window.encodeURIComponent(location.href.split('#')[0])})
        })
        promise.then(result=>{
          if(result.success){
            var {timestamp,noncestr,appId,paySign} = result.data
            wx.config({
              debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
              appId, // 必填，公众号的唯一标识
              timestamp:parseInt(timestamp), // 必填，生成签名的时间戳
              nonceStr: noncestr, // 必填，生成签名的随机串
              signature: paySign,// 必填，签名，见附录1
              jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });
            wx.ready(()=>{
              pay()
            })
            wx.error(res=>{
              message(JSON.stringify(res))
            })
          }
        })
      }else{
        message('请在微信中打开')
      }
    },
    render(){
      var {success} = this.state
      return (
        <div className="paying">
          {success&&("订单创建成功，30分钟内支付有效，正在唤起支付。")}
          {!success&&(
            <span>
              "订单支付失败,可以进入"
              <a href="user-order.html">我的订单页</a>
              "进行支付"
            </span>
          )}
        </div>
      )
    }
  })
)
