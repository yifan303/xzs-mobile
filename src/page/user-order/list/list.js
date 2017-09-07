import React from 'react'
import './list.less'
import ajax from 'widget/ajax'
import {parseDate} from 'widget/util/date.js'
import _ from 'underscore'
import message from 'xzs-message'
import {gotoPay} from 'widget/util/pay.js'
import {sysTime} from 'widget/promise'

var doc = window.document
var pageSize = 10
const disTime = 15*60*1000
const intervalTime = 1000

export default React.createClass({
  getInitialState(){
    return {
      curPage:1,
      objects:[],
      total:0,
      nowTime:+new Date
    }
  },
  interval:null,
  getObjects(){
    var {uid} = this.props
    var {curPage} = this.state
    var promise = ajax({
      url:'/order/getOrders.json',
      method:'post',
      domain:'trade',
      data:{
        uid,pageSize,curPage,status:0
      }
    })
    promise.then(result=>{
      if(result.success){
        var objects = Object.assign([],this.state.objects)
        var {pagination} = result.data

        this.setState({
          objects:objects.concat(result.data.objects),
          total:pagination.total
        })

      }
    })
  },
  componentWillUnmount(){
    if(this.interval){
      window.clearInterval(this.interval)
    }
  },
  componentDidMount(){

    // 获取当前时间
    sysTime.then(result=>{
      if(result.success){
        this.setState({nowTime:result.module})
      }
    })

    // 计算当前时间
    this.interval = window.setInterval(()=>{
      this.setState({nowTime:this.state.nowTime+intervalTime})
    },intervalTime)

    this.getObjects()

    // 下拉加载
    var content = document.getElementById('content')
    var lazyScroll = this.lazyScroll = _.throttle(()=>{
      var {curPage,objects,total} = this.state
      if(objects.length>=total){
        doc.removeEventListener('scroll',this.lazyScroll)
        return message('没有更多数据了')
      }
      var windowHeight = window.innerHeight
      var elementBottom = content.getBoundingClientRect().bottom
      var dis = windowHeight - elementBottom
      if(Math.abs(dis)<10){
        this.setState({curPage:curPage+1},()=>{
          this.getObjects()
        })
      }
    },1000)
    doc.addEventListener('scroll',lazyScroll)
  },
  componentWillUnmount(){
    doc.removeEventListener('scroll',this.lazyScroll)
  },
  render(){
    var {objects,nowTime} = this.state
    return (
      <div>
        {objects.map(object=>{
          var total = parseFloat(object.effeAmount)-parseFloat(object.discountAmount)
          return (
            <div key={object.id} className="order">
              <div className="order-header">
                <p>{parseDate(object.gmtCreate)}</p>
                <span>{object.statusString}</span>
              </div>
              <div className="order-body">
                <div>
                  {object.items.map(item=>(
                    <a key={item.id} href={`user-order.html?id=${object.id}`}>
                      <img src={item.iconUrl} />
                    </a>
                  ))}
                </div>
              </div>
              <div className="order-price">¥{total<0?'0.00':total}</div>
              {(nowTime-object.gmtCreate<disTime)&&object.status==2&&(
                <a className="order-pay" onClick={e=>gotoPay(object.id)}>付款</a>
              )}
            </div>
          )
        })}

      </div>
    )
  }
})
