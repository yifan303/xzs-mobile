import React from 'react'
import "./marquee.less"
import _ from 'underscore'

const step = 0.8
const during = 3000
const transition = 300

export default React.createClass({
  getInitialState(){
    return {
      list:[],
      current:0,
      transition:true
    }
  },
  interval:null,
  run(){
    var {current,list} = this.state

    this.setState({current:current+1,transition:true},()=>{
      if(current>=list.length-2){
        window.setTimeout(()=>{
          this.setState({transition:false},()=>this.setState({current:0}))
        },transition+100)
      }
    })

  },
  componentDidMount(){
    var list = _.clone(this.props.list)
    var first = _.clone(list[0])
    list.push(first)
    this.setState({list})

    if(list.length>2){
      this.interval = window.setInterval(()=>this.run(),during)
    }
  },
  componentWillUnmount(){
    if(this.interval){
      window.clearInterval(this.interval)
    }
  },
  render(){
    var {list,current,transition} = this.state
    return (
      <div className="marquee">
        <div className={"marquee-move "+(transition?'':'marquee-move-empty')} style={{transform:`translate(0,-${current*step}rem)`}}>
          {list.map((obj,p)=>{
            var {link} = obj
            // 类目
            if(link.type===1){
              return (
                <a key={p} href={`category.html?id=${link.url}`}>{obj.name}</a>
              )
            }
            // 详情页
            if(link.type===2){
              return (
                <a key={p} href={obj.item&&`detail.html?id=${obj.item.itemId}`}>{obj.name}</a>
              )
            }
            // 链接
            if(link.type===4){
              return (
                <a key={p} href={link.targetId}>{obj.name}</a>
              )
            }
            return (
              <p key={p}>{obj.name}</p>
            )
          })}
        </div>
      </div>
    )
  }
})
