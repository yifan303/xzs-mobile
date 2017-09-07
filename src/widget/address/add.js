import React from 'react'
import "./add.less"
import ajax from 'widget/ajax'
import Modal from './address-modal.js'
import message from 'xzs-message'
import login from 'widget/login'

export default React.createClass({
  getInitialState(){
    return {

      address:'',
      phone:'',
      name:'',

      provinces:[],
      province:null,
      provinceModal:false,

      citys:[],
      city:null,
      cityModal:false,

      areas:[],
      area:null,
      areaModal:false,

      streets:[],
      street:null,
      streetModal:false

    }
  },
  componentDidMount(){

    // 修改行为
    var modify = () => {
      var {id,uid} = this.props
      if(id){
        document.title = '修改地址'
        if(!uid){
          return message('用户信息有误，请刷新后重试')
        }
        var promise = ajax({
          url:'/da/getAddressById.json',
          method:'post',
          data:{id,uid},
          domain:'trade'
        })
        promise.then(result=>{
          if(result.success){
            var {address,phone,name,provinces,citys,areas,streets} = this.state
            var {level1Name,level2Name,level3Name,level4Name,address,name,phone} = result.data
            var getCorrectOption = (list,item) => {
              var options = list.filter(one=>one.name===item)
              if(options.length===1){
                return options[0]
              }else{
                return null
              }
            }
            this.setState({
              address,
              phone,
              name,
              province:getCorrectOption(provinces,level1Name),
              city:getCorrectOption(citys,level2Name),
              area:getCorrectOption(areas,level3Name),
              street:getCorrectOption(streets,level4Name)
            })
          }
        })
      }else{
        document.title = '添加地址'
      }
    }

    // 获取地址信息
    var promise = ajax({
      url:'/da/getShopServiceAreaDetail.json',
      method:'post',
      data:{shop_id:1},
      domain:'trade'
    })
    promise.then(result=>{
      if(result.success){
        var {level1Area,level2Area,level3Area,level4Area} = result.data
        this.setState({
          provinces:level1Area||[],
          citys:level2Area||[],
          areas:level3Area||[],
          streets:level4Area||[]
        },()=>modify())
      }
    })



  },
  goBack(){
    var {onHide} = this.props
    onHide&&onHide()
  },
  openProvince(){
    this.setState({provinceModal:true})
  },
  openCity(){
    var {province} = this.state
    if(!province){
      return message('请先选择省市')
    }
    this.setState({cityModal:true})
  },
  openArea(){
    var {city} = this.state
    if(!city){
      return message('请先选择市')
    }
    this.setState({areaModal:true})
  },
  openStreet(){
    var {area} = this.state
    if(!area){
      return message('请先选择街道市')
    }
    this.setState({streetModal:true})
  },
  valid(){
    var {street,address,phone,name} = this.state
    var {uid} = this.props
    if(street === null){
      message('请选择街道')
      return false
    }
    if(!uid){
      message('用户信息无效，请刷新后重试')
      return false
    }
    if(address === ''){
      message('请填写详细地址')
      return false
    }
    if(phone === ''){
      message('请填写电话号码')
      return false
    }
    if(name === ''){
      message('请填写收货人姓名')
      return false
    }
    return true
  },
  // 修改收货地址
  save(){
    if(!this.valid()){
      return
    }
    var {street,address,phone,name} = this.state
    var {uid,id} = this.props
    var promise = ajax({
      url:'/da/modifyLinkman.json',
      method:'post',
      domain:'trade',
      data:{
        id,
        uid,
        code:street.code+"",
        address,
        phone,
        name
      }
    })
    promise.then(result=>{
      if(result.success){
        message('修改地址成功')
        this.goBack()
      }else{
        message(result.message)
      }
    })
  },
  // 添加收货地址
  submit(){
    if(!this.valid()){
      return
    }
    var {street,address,phone,name} = this.state
    var {uid} = this.props
    var promise = ajax({
      url:'/da/addLinkman.json',
      method:'post',
      domain:'trade',
      data:{
        uid,
        code:street.code+"",
        address,
        phone,
        name
      }
    })
    promise.then(result=>{
      if(result.success){
        message('添加地址成功')
        this.goBack()
      }else{
        message(result.message)
      }
    })
  },
  render(){

    var {
      address,phone,name,
      provinceModal,provinces,province,
      cityModal,citys,city,
      areaModal,areas,area,
      streets,street,streetModal
    } = this.state

    var {id} = this.props

    return (
      <div className="address-add">
        <Modal
          show={provinceModal}
          width="8rem"
          list={provinces}
          onHide={e=>this.setState({provinceModal:false})}
          onSelect={item=>this.setState({province:item,provinceModal:false})}
        />
        <Modal
          show={cityModal}
          width="8rem"
          list={citys.filter(item=>province&&province.code===item.parentCode)}
          onHide={e=>this.setState({cityModal:false})}
          onSelect={item=>this.setState({city:item,cityModal:false})}
        />
        <Modal
          show={areaModal}
          width="8rem"
          list={areas.filter(item=>city&&city.code===item.parentCode)}
          onHide={e=>this.setState({areaModal:false})}
          onSelect={item=>this.setState({area:item,areaModal:false})}
        />
        <Modal
          show={streetModal}
          width="8rem"
          list={streets.filter(item=>area&&area.code===item.parentCode)}
          onHide={e=>this.setState({streetModal:false})}
          onSelect={item=>this.setState({street:item,streetModal:false})}
        />
        <div className="user-list">
          <div className="user-item" onClick={e=>this.openProvince()}>
            <span className="user-text">{province?province.name:'请选择省市'}</span>
            <a className="user-href"/>
          </div>
        </div>
        <div className="user-list">
          <div className="user-item" onClick={e=>this.openCity()}>
            <span className="user-text">{city?city.name:'请选择市'}</span>
            <a className="user-href"/>
          </div>
        </div>
        <div className="user-list">
          <div className="user-item" onClick={e=>this.openArea()}>
            <span className="user-text">{area?area.name:'请选择可配送区域'}</span>
            <a className="user-href"/>
          </div>
        </div>
        <div className="user-list">
          <div className="user-item" onClick={e=>this.openStreet()}>
            <span className="user-text">{street?street.name:'请选择可配送街道'}</span>
            <a className="user-href"/>
          </div>
        </div>
        <div className="user-list">
          <div className="user-item">
            <input
              type="text"
              onChange={e=>this.setState({address:e.target.value})}
              value={address}
              className="user-input"
              placeholder="请填写您的详细地址"
            />
          </div>
          <div className="user-item">
            <input
              type="text"
              onChange={e=>this.setState({name:e.target.value})}
              value={name}
              className="user-input"
              placeholder="收货人姓名"
            />
          </div>
          <div className="user-item">
            <input
              type="number"
              value={phone}
              onChange={e=>this.setState({phone:e.target.value})}
              className="user-input"
              placeholder="联系电话"
            />
          </div>
        </div>
        <div className="address-btns">
          <a onClick={e=>(id?this.save():this.submit())}>保存收货地址</a>
          <a onClick={e=>this.goBack()}>取消</a>
        </div>
      </div>
    )
  }
})
