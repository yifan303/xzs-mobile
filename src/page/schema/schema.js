import util from 'xzs-hybird'
import common from 'widget/common'
import React from 'react'
import "./schema.less"

document.title = "schema测试页"
common.createPage(React.createClass({
  render(){
    return (
      <div>
        <p className="schema-text">
          {'首页 : xianzaishi://mrsulan.com/home'}
          <a className="schema-btn" onClick={e=>util.openClient('home')}>唤起</a>
        </p>
        <p className="schema-text">
          {'详情页 : xianzaishi://mrsulan.com/detail?itemId=10204197'}
          <a className="schema-btn" onClick={e=>util.openClient('detail',{itemId:'10204197'})}>唤起</a>
        </p>
        <p className="schema-text">
          {'分类页 : xianzaishi://mrsulan.com/category'}
          <a className="schema-btn" onClick={e=>util.openClient('category')}>唤起</a>
        </p>
        <p className="schema-text">
          {'子类目页 : xianzaishi://mrsulan.com/category-item?catIdStrFromHome=563'}
          <a className="schema-btn" onClick={e=>util.openClient('subCate',{catIdStrFromHome:'563'})}>唤起</a>
        </p>
        <p className="schema-text">
          {'扫码购 : xianzaishi://mrsulan.com/scan'}
          <a className="schema-btn" onClick={e=>util.openClient('scan')}>唤起</a>
        </p>
        <p className="schema-text">
          {'购物车 : xianzaishi://mrsulan.com/cart'}
          <a className="schema-btn" onClick={e=>util.openClient('cart')}>唤起</a>
        </p>
        <p className="schema-text">
          {'搜索页 : xianzaishi://mrsulan.com/search'}
          <a className="schema-btn" onClick={e=>util.openClient('search')}>唤起</a>
        </p>
        <p className="schema-text">
          {'搜索关键字 : xianzaishi://mrsulan.com/search-word?keyWord=三文鱼'}
          <a className="schema-btn" onClick={e=>util.openClient('searchWord',{keyWord:'三文鱼'})}>唤起</a>
        </p>
        <p className="schema-text">
          {'我的 : xianzaishi://mrsulan.com/mine'}
          <a className="schema-btn" onClick={e=>util.openClient('mine')}>唤起</a>
        </p>
        <p className="schema-text">
          {'我的订单 : xianzaishi://mrsulan.com/mine-order'}
          <a className="schema-btn" onClick={e=>util.openClient('mineOrder')}>唤起</a>
        </p>
        <p className="schema-text">
          {'我的收货地址 : xianzaishi://mrsulan.com/mine-address'}
          <a className="schema-btn" onClick={e=>util.openClient('mineAddress')}>唤起</a>
        </p>
        <p className="schema-text">
          {'兑换邀请码 : xianzaishi://mrsulan.com/mine-code'}
          <a className="schema-btn" onClick={e=>util.openClient('code')}>唤起</a>
        </p>
        <p className="schema-text">
          {'充值支付 : xianzaishi://mrsulan.com/recharge'}
          <a className="schema-btn" onClick={e=>util.openClient('recharge')}>唤起</a>
        </p>
        <p className="schema-text">
          {'客服与帮助 : xianzaishi://mrsulan.com/customer'}
          <a className="schema-btn" onClick={e=>util.openClient('customer')}>唤起</a>
        </p>
        <p className="schema-text">
          {'设置 : xianzaishi://mrsulan.com/setting'}
          <a className="schema-btn" onClick={e=>util.openClient('setting')}>唤起</a>
        </p>
        <p className="schema-text">
          {'邀请 : xianzaishi://mrsulan.com/invite'}
          <a className="schema-btn" onClick={e=>util.openClient('invite')}>唤起</a>
        </p>
      </div>
    )
  }
}))
