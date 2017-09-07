import React from 'react'
import "./fix-modal.less"

export default (props)=>{
  var {show,children,style} = props
  return (
    <div
      style={style}
      className={"w-fix-modal "+(show?'w-fix-modal-show':'')}
    >
      {children}
    </div>
  )
}
