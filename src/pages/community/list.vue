<template>
	<!-- 社区列表页 -->
	<view :class="{ 'web-list': isWeb }">
		<!-- 选项栏 -->
		<view class="list-tabs">
			<view class="tab-item" v-for="(item, index) in optionList" :key="index"
				:class="{ active: currentTab === index }" @click="currentTab = index">
				{{ item }}
				<view v-if="currentTab === index" class="tab-indicator"></view>
			</view>
		</view>

		<!-- 主体内容 -->
		<view :style="{ height: Math.floor(WindowHeight * 0.78) + 'px' }" class="list-body">
			<!-- 左侧分类导航 -->
			<scroll-view scroll-y class="list-left">
				<view class="left-item" v-for="(item, index) in leftList" :key="index"
					:class="{ active: leftActive === index }" @click="leftActive = index">
					<text>{{ item }}</text>
					<view v-if="leftActive === index" class="left-active-bar"></view>
				</view>
			</scroll-view>

			<!-- 右侧社区卡片 -->
			<scroll-view scroll-y class="list-right">
				<view class="community-card" v-for="(item, index) in rightList" :key="index" @click="goCummunity(index)">
					<image class="card-img" :src="item.src" mode="aspectFill"></image>
					<view class="card-info">
						<text class="card-name">{{ item.text }}</text>
						<text class="card-members">{{ item.info }}</text>
					</view>
					<button class="card-join-btn" size="mini" @click.stop="joinCum">加入</button>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import { myRequest } from '@/utils/utils.js';
	import { systemInfo } from '../../mixin.js'

	export default {
		mixins: [systemInfo],
		props: {
			isWeb: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				currentTab: 0,
				leftActive: 0,
				imgWidth: '120',
				imgHeight: '120',
				WindowHeight: 0,
				optionList: ['推荐社区', '我的社区'],
				leftList: [],
				rightList: [
					{ src: 'https://s2.loli.net/2022/04/23/GuUiC4SITFw5Ael.png', text: '前端学习社区', info: '1W 成员' },
					{ src: 'https://s2.loli.net/2022/04/23/zZyhDInS3dMu9El.png', text: '后端学习社区', info: '1W 成员' },
					{ src: 'https://s2.loli.net/2022/04/23/UwdFvehO7CK653s.png', text: '大数据交流社区', info: '1W 成员' },
					{ src: 'https://s2.loli.net/2022/04/23/jbLFQN1BYUVX89n.png', text: '爬虫研究室', info: '1W 成员' },
					{ src: 'https://s2.loli.net/2022/04/23/f9kzSYvKWBdX2jE.png', text: 'Java交流社区', info: '1W 成员' },
					{ src: 'https://s2.loli.net/2022/04/23/nbFzY8j3UBseX4V.png', text: 'C++交流社区', info: '1W 成员' },
					{ src: 'https://s2.loli.net/2022/04/23/T2iWJ4xOGHmjZ9l.png', text: '算法学习社区', info: '1W 成员' }
				]
			}
		},
		created() {
			this.WindowHeight = uni.getSystemInfoSync().windowHeight;
			this.requestCummunity();
			this.allCummunity();
		},
		methods: {
			goCummunity(index) {
				uni.navigateTo({
					url: './cumTag/cumTag?cummunity=' + JSON.stringify(this.rightList[index]),
				})
			},
			joinCum() {
				let oneCummunity = new Promise((resolve, reject) => {
					uni.request({
						url: '/discuss/add/one/like/discuss',
						method: 'POST',
						data: { discussId: 1 },
						header: {
							Authorization: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ7XCJ1c2VyXCI6e1wiaWRcIjpcImM0NTEyYjY0ZWRkYTRkM2E4Yzg3NGUyMWZhOGFhYjNlXCIsXCJpbWFnZVVybFwiOlwiaHR0cHM6Ly90aGlyZHd4LnFsb2dvLmNuL21tb3Blbi92aV8zMi9IVXJwWWFQemR5U0RJSHJYcWlhTkVYbGdYMUZjdmliMXZhQ2tka1JacWc2NkxwZ25RaWFhaWFHM1kwNTlnbmtDMmVqRmtlbmFCaWNyUUdGVHFWQUsweG83c29RLzEzMlwiLFwibGFzdFRpbWVcIjoxNjUwNzEyNjk4MDM5LFwibG9naW5BY3RcIjpcIuWwj-afk0p1blwiLFwibmlja05hbWVcIjpcIuWwj-afk0p1blwiLFwib3BlbklkXCI6XCJvQWxjXzRfbDNCOFJiT0ROc3M2Sk5CU0Z0d1dzXCIsXCJwYXNzV29yZFwiOlwiZTEwYWRjMzk0OWJhNTlhYmJlNTZlMDU3ZjIwZjg4M2VcIixcInN0YXRlXCI6MX19IiwiaWF0IjoxNjUwNzEyNjk4LCJleHAiOjE2NTQzMTI2OTgsImp0aSI6IjU0NDlhNjRiLWIyZTctNDExNC04YzRiLWFkYjA3ZGM2MWFkNiJ9.daWMdZ-H1qOJqXKRVLNP-sXciFp8ThHYldOpMIHOcBmlqYdZfNTDPARQix0lGtKELlHS_cYoiMjVpfuRMk2AFw'
						},
						success: (res) => resolve(res),
						fail: (err) => reject(err)
					})
				})
				oneCummunity.then(res => {
					console.log('加入:', res)
				}).catch(err => { console.log(err) })
			},
			getKind() {
				return new Promise((resolve, reject) => {
					uni.request({
						url: '/discuss/get/all/type',
						method: 'POST',
						data: { pageSize: 10, currentPage: 1 },
						headers: { "content-type": "application/json" },
						success: (res) => resolve(res),
						fail: (err) => reject(err)
					})
				})
			},
			async requestCummunity() {
				let result = await this.getKind();
				this.leftList.splice(0, this.leftList.length);
				for (let i = 0; i < result.data.data.types.length; i++) {
					this.leftList.push(result.data.data.types[i].type);
				}
			},
			talkArea() {
				return new Promise((resolve, reject) => {
					uni.request({
						url: '/discuss/get/all/discuss',
						method: 'POST',
						data: { currentPage: 1, pageSize: 10 },
						success: (res) => resolve(res),
						fail: (err) => reject(err)
					})
				})
			},
			async allCummunity() {
				let result = await this.talkArea();
				console.log('所有的社区:', result);
			},
		}
	}
</script>

<style lang="scss" scoped>
	.list-tabs {
		display: flex;
		flex-direction: row;
		padding: 16rpx 24rpx;
		background: #fff;
		gap: 40rpx;
		border-bottom: 2rpx solid #f1f5f9;

		.tab-item {
			font-size: 32rpx;
			color: #64748b;
			position: relative;
			padding: 6rpx 0;
			transition: all 0.2s;
			font-weight: 500;

			&.active {
				color: #1e293b;
				font-weight: 700;
			}

			.tab-indicator {
				position: absolute;
				bottom: -18rpx;
				left: 50%;
				transform: translateX(-50%);
				width: 40rpx;
				height: 6rpx;
				background: #17ead9;
				border-radius: 3rpx;
			}
		}
	}

	.list-body {
		display: flex;
		flex-direction: row;

		.list-left {
			flex: 1;
			background: #fff;
			overflow-y: auto;

			.left-item {
				padding: 28rpx 20rpx;
				font-size: 30rpx;
				color: #64748b;
				text-align: center;
				position: relative;
				transition: all 0.2s;

				&.active {
					color: #1e293b;
					font-weight: 600;
					background: #f8fafc;
				}

				.left-active-bar {
					position: absolute;
					left: 0;
					top: 50%;
					transform: translateY(-50%);
					width: 6rpx;
					height: 36rpx;
					background: #17ead9;
					border-radius: 0 3rpx 3rpx 0;
				}
			}
		}

		.list-right {
			flex: 3;
			background: #f5f6f8;
			padding: 16rpx;

			.community-card {
				display: flex;
				flex-direction: row;
				align-items: center;
				background: #fff;
				border-radius: 16rpx;
				padding: 20rpx;
				margin-bottom: 16rpx;
				box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
				position: relative;
				transition: all 0.2s;

				&:active {
					transform: scale(0.98);
				}

				.card-img {
					width: 100rpx;
					height: 100rpx;
					border-radius: 16rpx;
					flex-shrink: 0;
				}

				.card-info {
					display: flex;
					flex-direction: column;
					margin-left: 20rpx;
					flex: 1;

					.card-name {
						font-size: 30rpx;
						font-weight: 600;
						color: #1e293b;
						margin-bottom: 6rpx;
					}

					.card-members {
						font-size: 26rpx;
						color: #94a3b8;
					}
				}

				.card-join-btn {
					height: 56rpx;
					line-height: 56rpx;
					font-size: 26rpx;
					padding: 0 28rpx;
					background: #17ead9;
					color: #fff;
					border: none;
					border-radius: 28rpx;
					font-weight: 500;

					&:active {
						opacity: 0.8;
					}
				}
			}
		}
	}

	/* #ifdef H5 */
	.web-list {
		.list-body {
			height: auto !important;

			.list-right {
				max-height: 600px;
			}
		}
	}
	/* #endif */
</style>
