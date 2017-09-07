import React from 'react'
import "./list.less"
import ajax from 'widget/ajax'
import login from 'widget/login'
import Address from 'widget/address'
import message from 'xzs-message'

export default React.createClass({
  getInitialState(){
    return {
      uid:'',
      edit:false,
      list:undefined,
      addressModal:false,
      editModal:false
    }
  },
  componentDidMount(){
    document.title='我的收货地址'
    login.check((result,modules)=>{
      if(result){
        this.setState({uid:modules.userId},()=>this.getAllAddress())
      }else{
        login.gotoLogin()
      }
    })
  },
  getAllAddress(){
    var {uid} = this.state
    var promise = ajax({
      url:'/da/getAllAddress.json',
      method:'post',
      domain:'trade',
      data:{
        uid
      }
    })
    promise.then(result=>{
      if(result.success){
        this.setState({list:result.data})
      }else{
        message(result.message||'获取收货地址失败')
      }
    })
  },
  delAddress(id){
    var {uid} = this.state
    if(uid===''){
      return message('用户信息有误，请刷新后重试')
    }
    var promise = ajax({
      url:'/da/delLinkman.json',
      method:'post',
      domain:'trade',
      data:{
        uid,id
      }
    })
    promise.then(result=>{
      if(result.success){
        this.getAllAddress()
        message('删除收货地址成功')
      }else{
        message(result.message)
      }
    })
  },
  goBack(){
    this.props.goBack&&this.props.goBack()
  },
  select(item){
    var {onSelect} = this.props
    onSelect&&onSelect(item)
  },
  render(){
    var {list,addressModal,uid,edit,editId,editModal} = this.state
    return (
      <div>
        {addressModal&&(
          <Address
            uid={uid}
            onHide={e=>{
              this.setState({addressModal:false})
              this.getAllAddress()
            }}
          />
        )}
        {editModal&&(
          <Address
            uid={uid}
            id={editId}
            onHide={e=>{
              this.setState({editModal:false})
              this.getAllAddress()
            }}
          />
        )}
        {(list===null||(list&&list.length===0))&&(
          <div className="address-empty">
            <img src={require('./address.jpg')} />
            <p>啊哦～您当前暂无收货地址哦！</p>
            <p>请填写您的收货地址</p>
            <a onClick={e=>this.setState({addressModal:true})}>新增收货地址</a>
          </div>
        )}
        {list&&list.length>0&&(
          <div>
            <div className="address-list">
              {list.map(item=>(
                <div key={item.id} className="address-item">
                  {edit&&<span className="address-item-del" onClick={e=>this.delAddress(item.id)}/>}
                  {edit&&<span className="address-item-edit" onClick={e=>this.setState({editId:item.id,editModal:true})}></span>}
                  <div onClick={e=>this.select(item)}>
                    <p className="address-item-info">
                      <span>{item.name}</span>
                      <span>{item.phone}</span>
                    </p>
                    <p className="address-item-location">{item.codeAddress+item.address}</p>
                  </div>
                </div>
              ))}
            </div>
            {!edit&&<a className="address-manage" onClick={e=>this.setState({edit:true})}>管理</a>}
            {edit&&<a className="address-manage" onClick={e=>this.setState({edit:false})}>完成</a>}
            <div className="address-list-btns">
              <a onClick={e=>this.setState({addressModal:true})}>新增收货地址</a>
              <a onClick={e=>this.goBack()}>返回</a>
            </div>
            <div className="address-list-btns-place" />
          </div>
        )}
        {list===undefined&&(
          <div></div>
        )}
      </div>
    )
  }
})
