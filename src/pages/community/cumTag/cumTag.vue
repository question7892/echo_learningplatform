<template>
<!-- #ifdef H5 -->
<view class="cum-tag-page">
		<!-- 自定义导航栏 -->
		<PageHead class="pagehead" :cumTittle="cumTittle"></PageHead>

		<!-- 社区信息头部 + 标签栏（固定区域） -->
		<view class="tag-fixed-area">
			<view class="tag-header">
				<view class="tag-title-row">
					<text class="tag-title">{{ cumTittle }}</text>
					<view class="tag-join-btn" @click="handClick">
						<text>已加入</text>
					</view>
				</view>

				<view class="tag-info-row">
					<view class="tag-desc">
						<image class="tag-logo" :src="logo" mode="aspectFill"></image>
						<view class="tag-stats">
							<view class="stat-item">
								<text class="stat-num">{{ peopleNumber }}</text>
								<text class="stat-label">成员</text>
							</view>
							<view class="stat-divider"></view>
							<view class="stat-item">
								<text class="stat-num">{{ contentContribution }}</text>
								<text class="stat-label">贡献值</text>
							</view>
						</view>
					</view>
					<image class="tag-collect" src="https://s2.loli.net/2022/04/23/dpiK16JAkOECheH.png" mode="aspectFit">
					</image>
				</view>
			</view>

			<!-- 帖子筛选标签栏 -->
			<view class="tag-tab-bar">
				<text v-for="(item, index) in artTittles" :key="index" :class="{ active: tabActive === index }"
					@click="tabActive = index">
					{{ item }}
				</text>
			</view>
		</view>

		<!-- 帖子列表（可滚动区域） -->
		<view class="tag-post-area">
			<CummunityPost></CummunityPost>
		</view>
	</view>
<!-- #endif -->
<!-- #ifndef H5 -->
<view class="prohibition">
		<!-- 使用封装的组件 -->
		<PageHead class="pagehead" :cumTittle="cumTittle"></PageHead>
		<view ref="tittle" class="prohibition-head">
			<view class="prohibition-tittle">
				{{cumTittle}}
				<!-- 显示加入或是已加入，点击之后分别取反： -->
				<view class="prohibition-isJoin" @click="handClick">
					已加入
				</view>
			</view>
			<!-- 包含社区logo，人数等信息的版块 -->
			<view class="prohibition-info">
				<!-- 信息描述: -->
				<view class="prohibition-desc">
					<!-- 社区logo: -->
					<image class="prohibition-logo" :src="logo" mode=""></image>
					<view class="prohibition-desctext">
						<text>{{peopleNumber}}</text>
						<text>{{contentContribution}}贡献值</text>
					</view>
				</view>
				<!-- 收藏本社区: -->
				<image class="prohibition-collect" src="https://s2.loli.net/2022/04/23/dpiK16JAkOECheH.png" mode="">
				</image>
			</view>
		</view>
		<!-- 设置文章选项栏: -->
		<!-- 看情况是否封装组件 -->
		<view class="prohibition-tab">
			<text v-for="(item,index) in artTittles" :key="index">{{item}}</text>
		</view>
		<CummunityPost></CummunityPost>
	</view>
<!-- #endif -->
</template>

<script>
import PageHead from '../../../components/pageComponents/pageHead.vue';
	import CummunityPost from './cummunityPost.vue';

	export default {
		data() {
			return {
				cumTittle: '',
				logo: '',
				peopleNumber: 0,
				contentContribution: 1000,
				tabActive: 0,
				artTittles: ['最新发布', '最新回复', '精选', '与我相关']
			}
		},
		components: {
			PageHead,
			CummunityPost
		},
		onLoad(option) {
			let { src, info, text } = JSON.parse(option.cummunity);
			this.cumTittle = text;
			this.logo = src;
			this.peopleNumber = info;
		},
		methods: {
			handClick() {
				uni.showModal({
					title: '提示',
					content: '确定要退出此社区吗？',
					success: function (res) {
						if (res.confirm) {
							console.log('用户点击确定');
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
		},
	}
</script>

<style lang="scss" scoped>
/* #ifdef H5 */
.cum-tag-page {
		background: #f5f6f8;
		min-height: 100vh;
		padding-bottom: 20rpx;
	}

	.tag-fixed-area {
		position: sticky;
		top: 0;
		z-index: 10;
		background: #fff;
		box-shadow: 0 2rpx 16rpx rgba(0, 0, 0, 0.06);
	}

	.tag-header {
		padding: 16rpx 24rpx 16rpx;
	}

	.tag-title-row {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding-bottom: 16rpx;
		border-bottom: 1rpx solid #f1f5f9;

		.tag-title {
			font-size: 36rpx;
			font-weight: 700;
			color: #1e293b;
		}

		.tag-join-btn {
			padding: 8rpx 24rpx;
			border: 2rpx solid #e2e8f0;
			border-radius: 24rpx;
			font-size: 26rpx;
			color: #64748b;
			background: #f8fafc;
		}
	}

	.tag-info-row {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx 0 4rpx;

		.tag-desc {
			display: flex;
			flex-direction: row;
			align-items: center;

			.tag-logo {
				width: 72rpx;
				height: 72rpx;
				border-radius: 16rpx;
				flex-shrink: 0;
			}

			.tag-stats {
				display: flex;
				flex-direction: row;
				align-items: center;
				margin-left: 20rpx;

				.stat-item {
					display: flex;
					flex-direction: column;
					align-items: center;

					.stat-num {
						font-size: 30rpx;
						font-weight: 700;
						color: #1e293b;
					}

					.stat-label {
						font-size: 22rpx;
						color: #94a3b8;
						margin-top: 2rpx;
					}
				}

				.stat-divider {
					width: 2rpx;
					height: 36rpx;
					background: #e2e8f0;
					margin: 0 28rpx;
				}
			}
		}

		.tag-collect {
			width: 48rpx;
			height: 48rpx;
			flex-shrink: 0;
		}
	}

	.tag-tab-bar {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		padding: 12rpx 20rpx;
		border-top: 1rpx solid #f1f5f9;

		text {
			font-size: 28rpx;
			color: #64748b;
			padding: 10rpx 20rpx;
			border-radius: 20rpx;
			transition: all 0.2s;
		}

		text.active {
			color: #17ead9;
			background: #f0fdfa;
			font-weight: 600;
		}
	}

	.tag-post-area {
		background: #f5f6f8;
	}
/* #endif */
/* #ifndef H5 */
.prohibition {
		font-size: 35rpx;
		overflow: hidden;

		&-head {
			display: flex;
			position: fixed;
			flex-direction: column;
			width: 100%;
			background-color: rgb(244, 244, 244);

			// 标题与是否加入的部分:
			.prohibition-tittle {
				display: flex;
				flex-direction: row;
				justify-content: space-around;
				align-items: center;
				padding: 10rpx 0 10rpx 0;
				border-bottom: 0.01rpx solid silver;

				.prohibition-isJoin {
					padding: 10rpx;
					border: 1rpx solid silver;
					border-radius: 20rpx;
				}
			}

			// 以下模块为包含社区logo，社区其他信息的模块：
			.prohibition-info {
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: space-around;
				padding: 10rpx 0 5rpx 0;
				background-color: white;
				// justify-content: space-around;
				float: left;
				// 社区logo：


				.prohibition-desc {
					display: flex;
					flex-direction: row;
					align-items: center;
					font-size: 35rpx;

					// border-bottom: 0.1rpx solid silver;
					.prohibition-logo {
						width: 80rpx;
						height: 80rpx;
						margin: 0 20rpx 0 0;
					}

					.prohibition-desctext {
						display: flex;
						flex-direction: column;
					}
				}

				.prohibition-collect {
					width: 40rpx;
					height: 40rpx;
					margin-right: 60rpx;
				}
			}
		}

		.prohibition-tab {
			z-index: 1;
			display: flex;
			flex-direction: row;
			justify-content: space-around;
			margin-top: 28%;
			background-color: #F4F4F4;
			border-bottom: 1rpx solid white;
			position: fixed;
			width: 100%;

			text {
				margin: 10rpx 0 5rpx 0;
				padding-right: 20rpx;
			}
		}


	}
/* #endif */
</style>
