<template>
	<!-- 系统通知消息 -->
	<view class="system-news">
		<view class="news-card" v-for="(item, index) in list" :key="index">
			<view class="news-header">
				<image class="news-avatar" :src="src" mode="aspectFill"></image>
				<view class="news-header-text">
					<text class="news-title">{{ item.tittle }}</text>
					<text class="news-time">{{ item.time }}</text>
				</view>
				<view class="news-badge">系统</view>
			</view>
			<view class="news-body">
				<text class="news-content">{{ item.text }}</text>
			</view>
			<view class="news-footer">
				<text class="news-link">查看详情 ›</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				src: 'https://s2.loli.net/2022/04/23/j5nmRFBOvrxgJNo.png',
				list: [{
					tittle: '快回来学习!',
					text: 'Hi，小码农，最新的算法刷题打卡活动开始啦！打满30天有惊喜哦，快约上小伙伴一起来打卡吧！详情请点击 https://www.csdn.net/',
					time: '2022-3-10'
				}, {
					tittle: '您的会员即将到期',
					text: 'Hello! 亲爱的小码农，您的会员将于2022年5月13日到期，若需要可续费。充值会员可享受题库开放所有试题，面经等诸多优惠哦，详情请点击链接: https://www.csdn.net',
					time: '2022-4-1'
				}]
			}
		}
	}
</script>

<style lang="scss" scoped>
	.system-news {
		padding: 20rpx;
		background-color: #f5f6f8;
		min-height: 100vh;
	}

	.news-card {
		background: #fff;
		border-radius: 16rpx;
		padding: 28rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 2rpx 16rpx rgba(0, 0, 0, 0.04);

		.news-header {
			display: flex;
			flex-direction: row;
			align-items: center;
			margin-bottom: 20rpx;

			.news-avatar {
				width: 88rpx;
				height: 88rpx;
				border-radius: 50%;
				flex-shrink: 0;
			}

			.news-header-text {
				flex: 1;
				display: flex;
				flex-direction: column;
				margin-left: 20rpx;

				.news-title {
					font-size: 34rpx;
					font-weight: 700;
					color: #1e293b;
					margin-bottom: 6rpx;
				}

				.news-time {
					font-size: 26rpx;
					color: #94a3b8;
				}
			}

			.news-badge {
				font-size: 24rpx;
				color: #3b82f6;
				background: #eff6ff;
				padding: 6rpx 18rpx;
				border-radius: 20rpx;
				flex-shrink: 0;
			}
		}

		.news-body {
			padding: 0 0 16rpx 0;

			.news-content {
				font-size: 30rpx;
				color: #475569;
				line-height: 1.7;
			}
		}

		.news-footer {
			border-top: 1rpx solid #f1f5f9;
			padding-top: 16rpx;

			.news-link {
				font-size: 28rpx;
				color: #17ead9;
				font-weight: 500;
			}
		}
	}
</style>
