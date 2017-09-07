import bottom from 'widget/bottom'
import React from 'react'
import "./cate.less"
import common from 'widget/common'
import ajax from 'widget/ajax'

document.title='速懒鲜生-分类'

// 缓存类目数据
var cateCache = {}

common.createPage(
  React.createClass({
    getInitialState(){
      return {
        list:[],
        current:107,
        sub:[]
      }
    },
    componentDidMount(){
      var promise = ajax({
        url:'/requestcategory/queryrootcategory'
      })
      promise.then(result=>{
        var a = JSON.parse(result)
        if(a.success){
          var list = a.module.categories
          this.setState({list})
          if(list&&list[0]){
            this.setState({
              current:list[0].catId,
              sub:list[0].subCategoryVOs
            })
            cateCache[list[0].catId] = list[0].subCategoryVOs
          }
        }
      })
      bottom.setMenu('cate')
    },
    getSub(catId){
      if(catId in cateCache){
        return this.setState({
          current:catId,
          sub:cateCache[catId]
        })
      }
      var promise = ajax({
        url:'/requestcategory/querysubcategory',
        method:'get',
        data:{catId:catId}
      })
      promise.then(result=>{
        var a = JSON.parse(result)
        if(a.success){
          this.setState({
            current:catId,
            sub:a.module.categories
          })
          cateCache[catId] = a.module.categories
        }
      })
    },
    render(){
      var {list,current,sub} = this.state
      return (
        <div>
          <div className="cate clearfix">
            <div className="cate-left">
              {list.map((item,index)=>(
                <p key={index} onClick={e=>{
                  this.setState({current:item.catId})
                  this.getSub(item.catId)
                }} className={(current===item.catId?'cate-current-href':'')+" cate-href"}>
                  {item.memo&&<span className="cate-memo">{item.memo}</span>}
                  {item.name}
                </p>
              ))}
            </div>
            <div className="cate-right">
              {sub.map(item=>(
                <div key={item.catId} className="catesub">
                  <div className="catesub-header">{item.name}</div>
                  <div className="catesub-body clearfix">
                    {item.subCategoryVOs.map(sub=>(
                      <a key={sub.catId} href={`sub-cate.html?id=${item.catId}&parentId=${current}`} className="catesub-children">
                        <img src={sub.picture} />
                        <p>{sub.name}</p>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    }
  })
)
