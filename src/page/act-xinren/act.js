document.title = '崇明农场直供草鸡蛋6枚装'

import common from 'widget/common'
import {getUrlParam} from 'xzs-util'
import Coupon from './coupon'
import Success from './success'

var pages = [Coupon,Success]
var id = parseInt(getUrlParam('id'))||0

common.createPage(pages[id]||Coupon)
