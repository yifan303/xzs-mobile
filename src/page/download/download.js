import React from 'react'
import common from 'widget/common'
import './download.less'
import {isWeixin,isWebIos,isWebAndroid} from 'widget/util/platom.js'

var donwloadUrl = isWebIos()?
	'https://itunes.apple.com/app/apple-store/id1168240345?pt=118379198&ct=ditui1&mt=8':
	'http://www.xianzaishi.com/download/xianzaishi.apk'

var inWeixin = isWeixin()

common.createPage(
	React.createClass({
		getInitailState(){
			return {

			}
		},
		render(){
			return(
				<div className={"container "+(inWeixin?"weixin-cover":"")}>
					{inWeixin&&(
						<div className="cover">
							<img src={require('./pic/warn.png')} />
						</div>
					)}
					<div className="part1">
						<div className="clearfix">
							<div className="logo"></div>
							<p className="beblack">速懒鲜生</p>
							<p>有速懒，购好吃。</p>
							<p>最快30分钟闪电送达</p>
						</div>
						<div className="Btndownload">
							<a href={donwloadUrl}>下载APP</a>
						</div>
					</div>
					<div className="line22"></div>
					<div className="part2">
						<a href="https://m.xianzaishi.com/mobile/act-20170303.html?id=2"></a>
						<div className="overflow-auto">
							<div className="atuoScroll">
								<div className="scrollpic1 scrollpic"></div>
								<div className="scrollpic2 scrollpic"></div>
								<div className="scrollpic3 scrollpic"></div>
								<div className="scrollpic4 scrollpic"></div>
							</div>
						</div>
					</div>
					<div className="part3">
						<p>速懒鲜生以生鲜、外卖为切入，为您搜罗来自全世界的生鲜产品，涵盖海鲜、蔬菜、水果、肉禽、蛋奶等，还有大厨现做的各国美食、饮品，通过app和线下体验店提供一站式的美食解决方案，满足您一日三餐的任何需求。一键下单，所有商品全温层配送，快到半小时送达，无理由退换货。有速懒，购好吃！</p>
					</div>
				</div>
			)
		}

	})
)

if(!inWeixin&&isWebIos()){
	window.location.href=	'https://itunes.apple.com/app/apple-store/id1168240345?pt=118379198&ct=ditui1&mt=8'
}
