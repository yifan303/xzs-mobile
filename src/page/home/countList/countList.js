import React from 'react'
import styles from './countList.less'
import {getCount} from 'widget/util/date.js'
import {Href} from 'widget/hybird'

export default React.createClass({
  getInitialState(){
    return {
      hour:0,
      minute:0,
      second:0
    }
  },
  componentDidMount(){
    var startTime = + new Date
    var runInterval = () => {
      var {hour,minute,second} = getCount(this.props.end,startTime)
      this.setState({hour,minute,second},()=>{
        startTime += 1000
      })
    }
    window.setInterval(runInterval,1000)
  },
  render(){
    var {hour,minute,second} = this.state
    var {list} = this.props
    return (
      <div className="count">
        <header>
          <span>{hour}</span>
          <span>{minute}</span>
          <span>{second}</span>
        </header>
        <container>
          {list.map((item,key)=>{
            var good = item.item||{}
            var sku = good.itemSkuVOs||[{}]
            var names = item.name.split(';')
            return (
              <div className="count-item" key={key}>
                <Href item={good.itemId}>
                  <img src={good.picUrl} />
                </Href>
                <Href item={good.itemId}>
                  <p className="count-title">{good.title}</p>
                </Href>
                <p className="count-subtitle">{good.subtitle}</p>
                <p className="count-originPrice">原价 : ¥{good.priceYuanString}</p>
                <p className="count-price">
                  <span>¥{sku[0].discountPriceYuanString}</span>
                  /{sku[0].saleDetailInfo}
                </p>
                <Href item={good.itemId} sku={good.sku} uid={this.props.uid} className="count-add">+</Href>
              </div>
            )
          })}
        </container>
      </div>
    )
  }
})
