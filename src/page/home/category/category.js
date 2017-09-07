import "./category.less"
import React from 'react'

export default ({list})=>(
  <div className='square'>
    {list.map((item,index)=>(
      <a href={item.link&&item.link.type===4?item.link.url:'javascript:void(0);'} key={index} className='square-item'>
        <img src={item.picUrl} />
        <i>{item.name}</i>
      </a>
    ))}
  </div>
)
