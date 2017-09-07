import Slide from 'dwd-slide'
import React from 'react'
import Img from 'widget/image'
import Marquee from '../marquee'
import "./modes.less"
import parseType from 'widget/type'
import {getTarget} from 'widget/type'
import parseBanner from '../parseBanner.js'

import Pit from '../pit'
import OnePit from '../onePit'
import TwoPit from '../twoPit'
import ScrollPit from '../scrollPit'
import FourPit from '../fourPit'
import CountPit from '../countPit'
import FivePit from '../fivePit'
import Square from '../category'
import CountList from '../countList'
import Drink from '../drink'
import TitlePic from '../titlePic'

var getType = (mode) => {
  return parseType(mode.stepType)
}

var isArray = (list) => list&&typeof(list)==='object'&&list.length>0

var renderMode = (uid,item,index) => {
  var {picList,catList,contentList,items,title,end,kernelList,time,picUrl} = item
  var type = getType(item)
  if(type === 'slide'&&isArray(picList)){
    var auto = picList.length>1
    return (
      <Slide
        auto={auto}
        width="10rem"
        height="4rem"
        during={5000}
        images={picList.map(config=>{
          var href = 'javascript:void(0)'
          var type = getTarget(config.targetType)
          if(type === 'detail'){
            href=`detail.html?id=${config.targetId}`
          }
          if(type === 'href'){
            href=config.targetId
          }
          return {
            src:config.picUrl,
            href
          }
        })}
      />
    )
  }

  if(type === 'category'&&isArray(catList)){
    return (
      <div  className="category clearfix">
        {catList.map((cat,cindex)=>{
          return (
            <a href={cat.jumpLink||`sub-cate.html?parentId=${cat.catId}`} key={cindex} className="category-item">
              <Img src={cat.picUrl}/>
              <span>{cat.catName}</span>
            </a>
          )
        })}
      </div>
    )
  }
  if(type ==='square'&&isArray(kernelList)){
    return <Square list={kernelList}/>
  }
  if(type === 'banner'&&isArray(picList)){
    return parseBanner(picList[0],index)
  }
  if(type === 'contentList'&&isArray(kernelList)){
    return (
      <div className="marquee-wrap">
        <img className="marquee-img" src={item.picUrl||require('./xianshi.png')}/>
        <Marquee list={kernelList} />
      </div>
    )
  }
  if(getType(item)==='goods'&&isArray(item.items)){
    return (
      <Pit  list={item.items} uid={uid}/>
    )
  }
  if(type === 'rowRoll'&&isArray(items)){
    return (
      <Pit
        list={items}
        style={{width:'10rem','overflowX':'scroll','whiteSpace':'nowrap'}}
        itemStyle={{float:'none',display:'inline-block'}}
      />
    )
  }
  if(type === 'titlePic'){
    return (
      <TitlePic picUrl={picUrl} title={title}/>
    )
  }
  if(type==='fiveGood'&&isArray(items)&&items.length>4){
    return (
      <FivePit  list={items}/>
    )
  }
  if(type==='oneGood'&&isArray(kernelList)){
    return (
      <CountList  list={kernelList} uid={uid} end={(time&&time.end)||+new Date}/>
    )
  }
  if(type === 'drink'&&isArray(kernelList)){
    return (
      <Drink
        target={item.link}
        list={kernelList}
        picUrl={picUrl}
        uid={uid}
      />
    )
  }
  if(type==='scrollGood'&&isArray(items)){
    return (
      <ScrollPit  list={items} title={title}/>
    )
  }
  if(type==='fourGood'&&isArray(items)&&isArray(picList)){
    return (
      <FourPit  list={items} pic={picList}/>
    )
  }
  if(type==='countGood'&&isArray(items)&&isArray(picList)&&picList.length>0){
    return (
      <CountPit uid={uid} list={items} pic={picList} end={end}/>
    )
  }
  if(type==='twoGood'&&isArray(items)){
    return (
      <TwoPit list={items}/>
    )
  }

  return (
    <div></div>
  )
}

export default function(props){
  var {modes} = props
  return (
    <div>
      {modes.map((item,index)=>(
        <div key={index}>
          {item.headSpace==true&&(
            <div style={{width:"100%",height:".2rem"}}></div>
          )}
          {renderMode(props.uid,item)}
        </div>
      ))}
    </div>
  )
}
