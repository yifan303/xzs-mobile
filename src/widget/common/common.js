import "dwd-rem"
import "./common.less"
import React from 'react'
import {render} from 'react-dom'
var content = document.getElementById('content')

const isDev=process.env.NODE_ENV==='development'
const isQa=process.env.NODE_ENV==='qa'
const isProd=process.env.NODE_ENV==='production'

export default {
  isDev,isQa,isProd,
  createPage(ReactClass){
    render(<ReactClass/>,content)
  }
}
