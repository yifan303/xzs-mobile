document.title = '速懒鲜生-领取优惠卷'

import common from 'widget/common'
import {getUrlParam} from 'xzs-util'
import Coupon from './coupon'
import Success from './success'
import Success2 from './success-2'

var pages = [Coupon,Success,Success2]
var id = parseInt(getUrlParam('id'))||0
common.createPage(pages[id]||Coupon)
