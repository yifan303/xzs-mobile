import React from 'react'
import "./single.less"
import common from 'widget/common'
import ajax from 'widget/ajax'
import {getUrlParam} from 'xzs-util'
import _ from 'underscore'

var current = getUrlParam('id')
var parentId = getUrlParam('parentId')||getUrlParam('catIdStrFromHome')
var pageSize = 10
var doc = window.document

document.title='速懒鲜生-分类'

common.createPage(
  React.createClass({
    getInitialState(){
      return {
        list:[],
        sub:[],
        items:null,
        current,
        parentId,
        pageNum:0,

        total:0

      }
    },
    lazyScroll(){},
    componentDidMount(){

      var promise = ajax({
        url:'/requestcategory/queryrootcategory'
      })
      promise.then(result=>{
        var a = JSON.parse(result)
        if(a.success){
          var list = a.module.categories
          this.setState({list})
        }
      })
      this.getSubCategory()
      this.selectSubCategory(this.state.current)

      // 下拉加载
      var content = document.getElementById('content')
      var lazyScroll = this.lazyScroll = _.throttle(()=>{
        var {pageNum,items,total} = this.state
        if(items.length>=total){
          return
        }
        var windowHeight = window.innerHeight
        var elementBottom = content.getBoundingClientRect().bottom
        var dis = windowHeight - elementBottom
        if(Math.abs(dis)<10){
          this.setState({pageNum:pageNum+1},()=>{
            this.getGoods()
          })
        }
      },1000)
      doc.addEventListener('scroll',lazyScroll)
    },
    componentWillUnmount(){
      doc.removeEventListener('scroll',this.lazyScroll)
    },
    getSubCategory(){
      var {pageNum,parentId} = this.state
      var promise = ajax({
        url:'/requestcategory/leafcategory',
        method:'get',
        data:{
          parentId,
          pageSize,
          pageNum
        }
      })
      promise.then(res=>{
        var result = JSON.parse(res)
        if(result.success){
          this.setState({sub:result.module.categories})
        }
      })
    },
    getGoods(){
      var {pageNum,parentId,current} = this.state
      if(current===null){
        var promise = ajax({
          url:'/requestcategory/leafcategory',
          method:'get',
          data:{
            parentId,
            pageSize,
            pageNum
          }
        })
        promise.then(res=>{
          var result = JSON.parse(res)
          if(result.success){
            var items = this.state.items||[]
            this.setState({
              items:items.concat(result.module.items||[]),
              total:result.module.itemCount
            })
          }
        })
      }else{
        var gpromise = ajax({
          url:'/requestcategory/commodies',
          method:'post',
          data:{
            cmCat2Ids:current,
            pageSize,
            pageNum
          }
        })
        gpromise.then(res=>{
          var result = JSON.parse(res)
          if(result.success){
            var items = this.state.items||[]
            this.setState({
              items:items.concat(result.module.items||[]),
              total:result.module.itemCount
            })
          }
        })
      }
    },
    selectRootCategory(parentId){
      this.setState({
        parentId,
        current:null,
        pageNum:0,
        items:null
      },()=>{
        this.getSubCategory()
        this.getGoods()
      })

    },
    selectSubCategory(current){
      this.setState({
        current,
        pageNum:0,
        items:null
      },()=>this.getGoods())
    },
    render(){
      var {list,sub,parentId,current,items,total} = this.state
      return (
        <div>
          <div className="catetop-place"></div>
          <div className="catetop">
            {list.map((cate,index)=>(
              <span
                onClick={e=>this.selectRootCategory(cate.catId)}
                key={cate.catId}
                className={cate.catId==parentId?'catetop-select':''}
              >{cate.name}</span>
            ))}
          </div>
          <div className="catesub">
            <span
              onClick={e=>this.selectSubCategory(null)}
              className={current===null&&"catesub-select"}
            >
              全部
            </span>
            {sub.map(subCate=>(
              <span
                onClick={e=>this.selectSubCategory(subCate.catId)}
                className={current==subCate.catId?"catesub-select":''}
                key={subCate.catId}
              >
                {subCate.catName}
              </span>
            ))}
          </div>
          {items&&items.length===0&&<div className="cateGood-empty">当前分类下没有商品</div>}
          {items&&items.length>0&&(
            <div className="cateGood">
              {items.map(item=>{
                var isEmpty = item.itemSkuVOs&&item.itemSkuVOs[0]&&item.itemSkuVOs[0].inventory<1
                var tagContent = item.itemSkuVOs&&item.itemSkuVOs[0]&&item.itemSkuVOs[0].tagDetail&&item.itemSkuVOs[0].tagDetail.tagContent
                return (
                  <div key={item.itemId} className="cateItem">
                    <a href={`detail.html?id=${item.itemId}`}><img src={item.picUrl} /></a>
                    <a href={`detail.html?id=${item.itemId}`} className="cateItem-title">{item.title}</a>
                    <p className="cateItem-price">¥{item.priceYuanString}</p>
                    {tagContent&&<span className="cateItem-tags">{tagContent}</span>}
                    {!isEmpty&&<a href={`detail.html?id=${item.itemId}`}><span className="cateItem-cart"></span></a>}
                    {isEmpty&&<span className="cateItem-cart-empty"></span>}
                    {isEmpty&&<span className="cateItem-saleout">卖光啦</span>}
                  </div>
                )
              })}
            </div>
          )}
          <div className="cateBottom">
            {total!==0&&items&&items.length>=total&&<span>没有更多商品了</span>}
            {total!==0&&items&&items.length<total&&<span>加载中</span>}
          </div>
        </div>
      )
    }
  })
)
