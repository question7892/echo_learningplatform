<template>
	<!-- 帖子列表 -->
	<view :style="{ height: Math.floor(WindowHeight * 0.62) + 'px' }" class="post-main">
		<scroll-view @touchstart="start" @touchmove="move" @touchend="end" scroll-y
			:style="{ height: Math.floor(WindowHeight * 0.62) + 'px' }" class="post-scroll">
			<view class="post-card" v-for="(item, index) in obj" :key="index">
				<!-- 第一部分：头像 + 作者 + 时间 -->
				<view class="post-head">
					<image class="post-avatar" :src="item.src || '/static/default-avatar.jpg'" mode="aspectFill"></image>
					<view class="post-author">
						<view class="author-row">
							<text class="author-name">{{ item.author }}</text>
							<image class="author-badge" src="../../../static/cummunity/medal.png" mode="aspectFit"></image>
						</view>
						<text class="post-time">{{ item.create_time }}</text>
					</view>
					<image v-if="index === 0" class="post-pin" src="../../../static/cummunity/setTop.png"
						mode="aspectFit"></image>
				</view>

				<!-- 第二部分：标题 + 内容 -->
				<view class="post-body" @click="goDetail(item)">
					<text class="post-title">{{ item.title }}</text>
					<text class="post-excerpt">{{ item.content }}</text>
				</view>

				<!-- 第三部分：互动数据 -->
				<view class="post-footer">
					<view class="footer-item">
						<image src="../../../static/cummunity/skip.png" mode="aspectFit"></image>
						<text>{{ icons[0].num }}</text>
					</view>
					<view class="footer-item">
						<image src="../../../static/cummunity/myLike.png" mode="aspectFit"></image>
						<text>{{ icons[1].num }}</text>
					</view>
					<view class="footer-item">
						<image src="../../../static/cummunity/myReplay.png" mode="aspectFit"></image>
						<text>{{ icons[2].num }}</text>
					</view>
				</view>
			</view>

			<!-- 空状态 -->
			<view v-if="!obj || obj.length === 0" class="empty-state">
				<text class="empty-text">暂无帖子</text>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import { systemInfo } from '../../../mixin.js';
	import { obj } from '../../../mock/cummunityPost.js'

	export default {
		mixins: [systemInfo],
		created() {
			this.WindowHeight = uni.getSystemInfoSync().windowHeight;
			this.getAllPosts();
		},
		data() {
			return {
				WindowHeight: 0,
				obj,
				icons: [
					{ url: '../../../static/cummunity/skip.png', num: 100 },
					{ url: '../../../static/cummunity/myLike.png', num: 100 },
					{ url: '../../../static/cummunity/myReplay.png', num: 100 }
				]
			}
		},
		methods: {
			start(e) { },
			move(e) { },
			end(e) { },
			goDetail(item) {
				// 跳转到帖子详情
			},
			getAllPosts() {
				let myAllPost = new Promise((resolve, reject) => {
					uni.request({
						url: "/discuss/user/get/all/discuss/comment",
						method: 'POST',
						data: { pageSize: 100, currentPage: 1, discussId: 1 },
						success: (res) => resolve(res),
						fail: (err) => reject(err)
					})
				})
				myAllPost.then(res => {
					let result = res.data;
					if (result.data && result.data.comment) {
						this.obj = result.data.comment;
					}
				}).catch(err => {
					console.log('请求出错:', err);
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.post-main {
		overflow: hidden;
	}

	.post-scroll {
		background: #f5f6f8;
		padding: 16rpx 0;
	}

	.post-card {
		display: flex;
		flex-direction: column;
		background: #fff;
		margin: 0 20rpx 18rpx;
		border-radius: 16rpx;
		padding: 24rpx;
		box-shadow: 0 2rpx 16rpx rgba(0, 0, 0, 0.04);
		transition: all 0.2s;

		&:active {
			transform: scale(0.99);
		}
	}

	/* 头部：头像 + 作者 + 时间 */
	.post-head {
		display: flex;
		flex-direction: row;
		align-items: center;
		position: relative;

		.post-avatar {
			width: 72rpx;
			height: 72rpx;
			border-radius: 50%;
			flex-shrink: 0;
			border: 2rpx solid #f1f5f9;
		}

		.post-author {
			flex: 1;
			display: flex;
			flex-direction: column;
			margin-left: 16rpx;

			.author-row {
				display: flex;
				flex-direction: row;
				align-items: center;

				.author-name {
					font-size: 30rpx;
					font-weight: 600;
					color: #1e293b;
				}

				.author-badge {
					width: 36rpx;
					height: 36rpx;
					margin-left: 8rpx;
				}
			}

			.post-time {
				font-size: 24rpx;
				color: #94a3b8;
				margin-top: 4rpx;
			}
		}

		.post-pin {
			width: 48rpx;
			height: 48rpx;
		}
	}

	/* 内容区 */
	.post-body {
		padding: 16rpx 0;
		border-bottom: 1rpx solid #f1f5f9;

		.post-title {
			font-size: 32rpx;
			font-weight: 700;
			color: #1e293b;
			display: block;
			margin-bottom: 10rpx;
			line-height: 1.4;
		}

		.post-excerpt {
			font-size: 28rpx;
			color: #64748b;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			display: block;
			line-height: 1.5;
		}
	}

	/* 底部：互动数据 */
	.post-footer {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
		padding-top: 16rpx;

		.footer-item {
			display: flex;
			flex-direction: row;
			align-items: center;
			gap: 8rpx;

			image {
				width: 32rpx;
				height: 32rpx;
				opacity: 0.5;
			}

			text {
				font-size: 26rpx;
				color: #94a3b8;
			}
		}
	}

	/* 空状态 */
	.empty-state {
		padding: 120rpx 0;
		text-align: center;

		.empty-text {
			font-size: 28rpx;
			color: #94a3b8;
		}
	}
</style>
