document.title = '领取5元无门槛卷'

import common from 'widget/common'
import {getUrlParam} from 'xzs-util'
import Coupon from './coupon'
import Success from './success'
import CouponApp from './coupon-1'

var pages = {'0':Coupon,'1':Success,'2':CouponApp}
var id = parseInt(getUrlParam('id'))||'0'

common.createPage(pages[id]||Coupon)
