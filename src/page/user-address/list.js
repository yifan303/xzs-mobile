import common from 'widget/common'
import List from './list-class.js'
import React from 'react'

common.createPage(
  ()=>{
    return <List goBack={e=>{
      window.location.href = 'user.html'
    }}/>
  }
)
