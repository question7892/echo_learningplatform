<template>
	<!-- 收到的赞 -->
	<view class="receive-like">
		<view class="like-card" v-for="(item, index) in people" :key="index">
			<image class="like-avatar" :src="item.headerImg || '/static/default-avatar.jpg'" mode="aspectFill"></image>
			<view class="like-info">
				<view class="like-name-row">
					<text class="like-name">{{ item.name }}</text>
					<text class="like-action">赞了我</text>
				</view>
				<text class="like-time">{{ item.time }}</text>
			</view>
			<view class="like-detail-btn">
				<text>详情</text>
				<text class="arrow">›</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				people: [{
					name: 'Simon',
					headerImg: '../../../static/person/myRecruit.png',
					time: '2022-3-18 10:10'
				}, {
					name: 'Lucy',
					headerImg: '../../../static/person/myBlog.png',
					time: '2022-4-1 12:40'
				}]
			}
		}
	}
</script>

<style lang="scss" scoped>
	.receive-like {
		padding: 20rpx;
		background-color: #f5f6f8;
		min-height: 100vh;
	}

	.like-card {
		display: flex;
		flex-direction: row;
		align-items: center;
		background: #fff;
		border-radius: 16rpx;
		padding: 24rpx;
		margin-bottom: 16rpx;
		box-shadow: 0 2rpx 16rpx rgba(0, 0, 0, 0.04);
		transition: all 0.2s;

		&:active {
			transform: scale(0.98);
			background: #fafbfc;
		}

		.like-avatar {
			width: 96rpx;
			height: 96rpx;
			border-radius: 50%;
			flex-shrink: 0;
			border: 2rpx solid #f1f5f9;
		}

		.like-info {
			flex: 1;
			display: flex;
			flex-direction: column;
			margin-left: 20rpx;

			.like-name-row {
				display: flex;
				flex-direction: row;
				align-items: center;
				margin-bottom: 8rpx;

				.like-name {
					font-size: 32rpx;
					font-weight: 700;
					color: #1e293b;
				}

				.like-action {
					font-size: 26rpx;
					color: #ef4444;
					background: #fef2f2;
					padding: 4rpx 14rpx;
					border-radius: 12rpx;
					margin-left: 16rpx;
				}
			}

			.like-time {
				font-size: 26rpx;
				color: #94a3b8;
			}
		}

		.like-detail-btn {
			display: flex;
			align-items: center;
			font-size: 28rpx;
			color: #17ead9;
			font-weight: 500;
			flex-shrink: 0;

			.arrow {
				font-size: 32rpx;
				margin-left: 4rpx;
			}
		}
	}
</style>
