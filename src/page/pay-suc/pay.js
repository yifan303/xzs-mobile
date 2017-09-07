import {getUrlParam} from 'xzs-util'
import React from 'react'
import common from 'widget/common'
import req from 'widget/ajax'
import message from 'xzs-message'
import "./pay.less"
import hybird from 'xzs-hybird'
import {token} from 'widget/store'
import {parseDate} from 'widget/util/date.js'

common.createPage(
  React.createClass({
    getInitialState(){
      return {
        effeAmount:'',
        gmtCreate:''
      }
    },
    componentDidMount(){
      hybird.setTitle('支付成功')
      var oid = getUrlParam('id')
      var param = `oid=${oid}&token=${token.get()}`
      var promise = req({
        url:'/order/getOrderDetailInfo.json?'+param,
        domain:'trade',
        method:"post"
      })
      promise.then(result=>{
        if(result.success){
          var {effeAmount,gmtCreate} = result.data
          this.setState({
            effeAmount,gmtCreate:parseDate(gmtCreate)
          })
        }
      })
    },
    render(){
      var {effeAmount,gmtCreate} = this.state
      return (
        <div>
          <div className="header">
            <img src={require('./select.jpg')} />
            <span>支付成功</span>
          </div>
          <div className="body">
            <p>
              <span>付款金额:</span>
              <i>{effeAmount}</i>元
            </p>
            <p>
              <span>下单时间:</span>
              {gmtCreate}
            </p>
          </div>
          <div className="footer">
            <a href="user-order.html">查看订单</a>
            <a href="home.html">返回首页</a>
          </div>
        </div>
      )
    }
  })
)
