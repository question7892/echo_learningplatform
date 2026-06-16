<template>
<!-- #ifdef H5 -->
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
<!-- #endif -->
<!-- #ifndef H5 -->
<!-- 回复页 -->
	<view class="replay">
		<!-- 单个回复列表的元素 -->
		<view class="replay-single" v-for="(item,index) in list" :key="index">
			<!-- 其中包括回复者的头像，昵称，回复时间，回复内容，回复那一条博客或者消息 -->
			<!-- 回复者的头像: -->
			<image class="img" :src="item.headerImg" mode=""></image>
			<!-- 与回复有关的消息 -->
			<view class="replay-info">
				<!-- 其中主要部分还是上下布局 -->
				<!-- 昵称和回复内容: -->
				<view class="name_content">
					<!-- 昵称 -->
					<view :style="{fontWeight:fs}" class="nameComment-nickName">{{item.name}}</view>
					<!-- 回复内容: -->
					<view class="nameComment-content">{{item.replayContent}}</view>
				</view>
				<!-- 下方包括回复时间和点赞,评论: -->
				<view class="time_like_com">
					<text>{{item.time}}</text>
					<view>
						<!-- 点赞: -->
						<image src="../../../static/cummunity/myLike.png" mode=""></image>
						<text>{{item.likeNum}}</text>
					</view>
					<view>
						<!-- 评论: -->
						<image src="../../../static/cummunity/myReplay.png" mode=""></image>
						{{item.commentNum}}
					</view>
				</view>
			</view>
			<!-- 指定回复的评论 -->
			<text class="replay-comment">{{item.comment}}</text>
		</view>
	</view>
<!-- #endif -->
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
/* #ifdef H5 */
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
/* #endif */
/* #ifndef H5 */
// 最外层容器:
	.replay {
		display: flex;
		width: 100%;
		flex-direction: column;
		position: relative;

		&-single {
			width: 100%;
			display: flex;
			margin-bottom: 10rpx;
			position: relative;
			flex-direction: row;
			// align-items: center;
			border-bottom: 1rpx solid rgba(204, 204, 214, .5);
			// justify-content: space-around;

			.img {
				// flex: 1;
				width: 100rpx;
				height: 100rpx;
				border-radius: 50%;
				margin: 10rpx 20rpx 0 10rpx;
				// position: absolute;
				// top: 1%;
				// left: 1%;
			}

			.replay-info {
				display: flex;
				font-size: 35rpx;
				flex: 2;
				flex-direction: column;
				// align-items: center;
				// justify-content: center;

				// 昵称和回复内容:
				.name_content {
					display: flex;
					flex-direction: column;
					margin-right: 10rpx;

					.nameComment-nickName,
					.nameComment-content {
						margin-bottom: 10rpx;
					}

					.nameComment-nickName:after {
						content: '回复了我';
						// display: block;
						font-size: 35rpx;
						color: grey;
						margin-left: 20rpx;
					}
				}

				.time_like_com {
					display: flex;
					flex-direction: row;
					padding-right: 5rpx;
					// float: left;
					justify-content: space-between;

					image {
						width: 40rpx;
						height: 40rpx;
					}
				}
			}

			.replay-comment {
				// flex: 0.5;
				// flex: 1;
				width: 20%;
				margin-left: 10rpx;
				font-size: 30rpx;
				color: silver;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				float: right;
				margin-top: 7%;
			}
		}
	}
/* #endif */
</style>
