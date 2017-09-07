import React from 'react'
import Modal from 'dwd-modal'

export default React.createClass({
  render(){
    var {list,show,onHide,onSelect} = this.props
    return (
      <Modal
        show={show}
        onHide={onHide}
        width="8rem"
      >
        <div className="address-select user-list">
          {list.map(item=>(
            <div
              key={item.id}
              onClick={e=>onSelect(item)}
              className="address-select-item user-item"
            >
              <span className="user-text">{item.name}</span>
              <a className="user-href"/>
            </div>
          ))}
        </div>
      </Modal>
    )
  }
})
