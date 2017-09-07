import React from 'react'
import common from 'widget/common'

var __html = `尊敬的客户，为保障您的合法权益，请您在点击“充值”按钮前，完整、仔细地阅读本充值协议。当您继续点击“充值”按钮，即视为您已阅读、理解本协议，并同意按本协议规定执行。

1、充值方式
   通过本APP客户端在线充值外。

2、充值赠送金额（如有）、充值金额、账户金额
  充值赠送金额指：根据鲜在时不时推出的充值优惠活动，您充值后，在您充值金额以外，额外赠予的金额。如，您充值1000元人民币，根据当时的充值优惠活动赠送您1019元，则您成功充值1000元后，在您账户内显示的充值金额为1019元，超出的19元即为充值赠送金额。
  充值金额指：您实际充值支付的金额（人民币）。
  账户金额：即您鲜在时账户中当前显示的金额，账户金额一般通过充值金额、充值赠送金额及其他赠送或补偿的金额获得。

3、账户金额仅可用于支付鲜在时平台（线上和线下通用）提供的商品购买支付服务。

4、充值后，账户余额使用不设有效期，不能转移、转赠，只支持为本账户支付。

5、账户余额暂不支持退款且不可用于购买预售和团购商品、储值卡、提货券等虚拟卡券类商品。

6、如需开具发票，请完善发票开具信息；开票金额为您实际支付充值金额，不包含充值返现金额.用充值金额支付的订单不可以在支付发票。

7、可在法律法规允许范围内对本协议进行解释。

`

common.createPage(React.createClass({
  render(){
    return (
      <div style={{"padding":".3rem"}}>
        <img style={{"display":"block","margin":"0 auto",width:'9.4rem',height:'auto'}} src={require('../login/login.jpg')} />
        <h1 style={{"fontSize":".6rem","marginBottom":".6rem"}}>鲜在时充值服务协议</h1>
        <pre style={{"whiteSpace":"pre-wrap","fontSize":".4rem"}} dangerouslySetInnerHTML={{__html}}>
        </pre>
      </div>
    )
  }
}))
