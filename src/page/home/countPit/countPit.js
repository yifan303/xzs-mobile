import React from 'react'
import './countPit.less'
import parseBanner from '../parseBanner.js'
import {Href} from 'widget/hybird'
import Img from 'widget/image'
import {sysTime} from 'widget/promise'

const intervalTime = 100

export default React.createClass({
  getInitialState(){
    return {
      hour:0,
      minute:0,
      second:0,
      mini:0,
      current:null
    }
  },
  runCount(){
    var secondUnit = 1000
    var miniteUnit = 60*secondUnit
    var hourUnit = 60*miniteUnit
    var {current} = this.state
    var {end} = this.props
    if(end){
      var d = end - current
      this.setState({
        hour:parseInt(d/hourUnit),
        minute:parseInt(d%hourUnit/miniteUnit),
        second:parseInt(d%miniteUnit/secondUnit),
        mini:parseInt(d%secondUnit/100),
        current:current+intervalTime
      })
    }

  },
  interval:null,
  componentDidMount(){
    sysTime.then(result=>{
      if(result.success){

        var {end} = this.props
        if(end<result.module){
          return
        }

        this.setState({current:result.module},()=>{
          this.interval = window.setInterval(()=>{
            this.runCount()
          },intervalTime)
        })
      }
    })
  },
  componentDidUnMount(){
    if(this.interval){
      window.clearInterval(this.interval)
    }
  },
  render(){
    var {list,pic,end,uid} = this.props
    var {hour,minute,second,mini,current} = this.state
    var renderPic = (p,index) => (
      parseBanner(p,index,{
        width:'4.75rem',
        height:'2.2rem',
        display:'block',
        margin:'.1rem auto 0'
      })
    )
    if(hour===0&&minute===0&&second===0&&mini===0){
      return (
        <div></div>
      )
    }
    return (
      <div className='count-wrap'>
        <section>
          <p>本场活动结束还剩</p>
          <p><span>{hour}</span>时<span>{minute}</span>分<span>{second}</span>秒<span>{mini}</span></p>
          <Href item={list[0].itemId}><Img src={list[0].picUrl} /></Href>
          <p>{list[0].title}</p>
          <p>¥{list[0].discountPriceYuanString}<span>/{list[0].itemSkuVOs&&list[0].itemSkuVOs[0]&&list[0].itemSkuVOs[0].saleDetailInfo}</span></p>
          <p>原价 : ¥{list[0].priceYuanString}</p>
          <Href className="addToCard" item={list[0].itemId} sku={list[0].sku} uid={uid}>+</Href>
        </section>
        <section>
          {pic.filter((p,index)=>index<3).map(renderPic)}
        </section>
      </div>
    )
  }
})
