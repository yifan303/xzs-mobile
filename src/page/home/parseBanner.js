import React from 'react'
import {getTarget} from 'widget/type'
import {Href} from 'widget/hybird'
import Img from 'widget/image'

export default (pic,index,style)=>{
  if(getTarget(pic.targetType)==='detail'){
    return (
      <Href item={pic.targetId} key={index} >
        <Img className="m-banner" src={pic.picUrl} style={style}/>
      </Href>
    )
  }
  if(getTarget(pic.targetType)==='href'){
    return (
      <a key={index} href={pic.targetId}>
        <Img className="m-banner" src={pic.picUrl} style={style}/>
      </a>
    )
  }
  return (
    <Img className="m-banner" key={index} src={pic.picUrl} style={style}/>
  )
}
