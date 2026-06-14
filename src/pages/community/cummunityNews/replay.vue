<template>
	<!-- 回复通知 -->
	<view class="replay-page">
		<view class="replay-card" v-for="(item, index) in list" :key="index">
			<image class="replay-avatar" :src="item.headerImg || '/static/default-avatar.jpg'" mode="aspectFill"></image>
			<view class="replay-body">
				<view class="replay-name-row">
					<text class="replay-name">{{ item.name }}</text>
					<text class="replay-label">回复了我</text>
				</view>
				<text class="replay-content">{{ item.replayContent }}</text>
				<view class="replay-original">
					<text class="original-label">原评论：</text>
					<text class="original-text">{{ item.comment }}</text>
				</view>
				<view class="replay-footer">
					<text class="replay-time">{{ item.time }}</text>
					<view class="replay-actions">
						<view class="action-item">
							<image class="action-icon" src="../../../static/cummunity/myLike.png" mode="aspectFit"></image>
							<text>{{ item.likeNum }}</text>
						</view>
						<view class="action-item">
							<image class="action-icon" src="../../../static/cummunity/myReplay.png" mode="aspectFit"></image>
							<text>{{ item.commentNum }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [{
					name: 'Simon',
					headerImg: 'https://i2.hdslb.com/bfs/face/762ae6f1a5988fbfe0f61cb02bfe151f2aff534e.jpg@240w_240h_1c_1s.webp',
					time: '2022-4-1',
					comment: '推荐一些优秀的教程',
					replayContent: '看了大佬的文章，受益匪浅啊',
					likeNum: 10,
					commentNum: 10
				}, {
					name: 'Mike',
					headerImg: 'https://i2.hdslb.com/bfs/face/762ae6f1a5988fbfe0f61cb02bfe151f2aff534e.jpg@240w_240h_1c_1s.webp',
					time: '2022-4-2',
					comment: '推荐一些优秀的开源项目',
					replayContent: '大佬牛啊，互关一下呗',
					likeNum: 10,
					commentNum: 10
				}]
			}
		}
	}
</script>

<style lang="scss" scoped>
	.replay-page {
		padding: 20rpx;
		background-color: #f5f6f8;
		min-height: 100vh;
	}

	.replay-card {
		display: flex;
		flex-direction: row;
		background: #fff;
		border-radius: 16rpx;
		padding: 24rpx;
		margin-bottom: 16rpx;
		box-shadow: 0 2rpx 16rpx rgba(0, 0, 0, 0.04);

		.replay-avatar {
			width: 88rpx;
			height: 88rpx;
			border-radius: 50%;
			flex-shrink: 0;
			border: 2rpx solid #f1f5f9;
		}

		.replay-body {
			flex: 1;
			display: flex;
			flex-direction: column;
			margin-left: 20rpx;
			min-width: 0;

			.replay-name-row {
				display: flex;
				flex-direction: row;
				align-items: center;
				margin-bottom: 10rpx;

				.replay-name {
					font-size: 32rpx;
					font-weight: 700;
					color: #1e293b;
				}

				.replay-label {
					font-size: 26rpx;
					color: #10b981;
					background: #ecfdf5;
					padding: 4rpx 14rpx;
					border-radius: 12rpx;
					margin-left: 16rpx;
				}
			}

			.replay-content {
				font-size: 30rpx;
				color: #334155;
				line-height: 1.6;
				margin-bottom: 12rpx;
			}

			.replay-original {
				background: #f8fafc;
				border-radius: 10rpx;
				padding: 14rpx 18rpx;
				margin-bottom: 14rpx;
				border-left: 4rpx solid #e2e8f0;

				.original-label {
					font-size: 24rpx;
					color: #94a3b8;
					margin-right: 4rpx;
				}

				.original-text {
					font-size: 26rpx;
					color: #64748b;
				}
			}

			.replay-footer {
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: space-between;

				.replay-time {
					font-size: 26rpx;
					color: #94a3b8;
				}

				.replay-actions {
					display: flex;
					flex-direction: row;
					gap: 28rpx;

					.action-item {
						display: flex;
						flex-direction: row;
						align-items: center;
						font-size: 26rpx;
						color: #64748b;

						.action-icon {
							width: 32rpx;
							height: 32rpx;
							margin-right: 6rpx;
						}
					}
				}
			}
		}
	}
</style>
