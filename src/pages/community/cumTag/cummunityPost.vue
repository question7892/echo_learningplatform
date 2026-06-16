<template>
<!-- #ifdef H5 -->
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
<!-- #endif -->
<!-- #ifndef H5 -->
<!-- 贴子列表: -->
	<!-- 设计社区的贴子 -->
	<view :style="{ height: Math.floor(this.WindowHeight*0.68)+10 + 'px' }" class="cumPost-mainContainer">
		<!-- 设置滑动事件: -->
		<scroll-view @touchstart="start" @touchmove="move" @touchend="end" scroll-y="true"
			:style="{ height: Math.floor(this.WindowHeight*0.68)+10 + 'px' }" class="cumPost-deputyContainer">
			<view class="cumPost" v-for="(item,index) in obj" :key="index">
				<!-- 第一部分：包括头像，昵称，发布时间 -->
				<view class="cumPost-head">
					<!-- 头像: -->
					<image class="cumPost-headImg" :src="item.src" mode=""></image>
					<!-- 昵称和发布时间：昵称后添加上部分小勋章图标 -->
					<view class="cumPost-nameTime">
						<text class="cumPost-name"
							:style="{fontSize: font_size+'rpx',fontWeight: Bold}">{{item.author}}的发表</text>
						<text :style="{fontSize: font_size-5+'rpx',color: font_color}">{{item.create_time}}</text>
					</view>
				</view>
				<!-- 第二部分：贴子标题和部分内容: -->
				<view class="cumPost-content">
					<!-- 同样是上下布局：标题栏和内容栏: -->
					<view class="cumPost-contentTittle">
						<!-- 其中主轴为x轴 -->
						{{item.title}}
					</view>
					<view class="cumPost-contentInfo">
						{{item.content}}
					</view>
				</view>
				<!-- 第三部分：浏览量，点赞量，评论量 -->
				<view class="comPost-footer">
					<view class="comPost-num" v-for="(target,index) in icons" :key="index">
						<image :src="target.url" mode=""></image>
						<text :style="{fontSize: font_size-10+'rpx'}">{{target.num}}</text>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
<!-- #endif -->
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
/* #ifdef H5 */
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
/* #endif */
/* #ifndef H5 */
// 社区的贴子:
	// 单个模块分三部分：1，头像，昵称，发布时间；2，标题，部分内容；3，浏览，留言，点赞；
	.cumPost-mainContainer {
		// margin-top: 37%;
		position: relative;
		margin-top: 37%;
		overflow: hidden;

		// height: 800rpx;
		.cumPost-deputyContainer {
			// top: 60%;
			// height: 800rpx;
			background-color: #F4F4F5;
			padding-top: 15rpx;
		}
	}

	.cumPost {
		display: flex;
		position: relative;
		flex-direction: column;
		background-color: white;
		margin: 0 20rpx 20rpx 20rpx;
		border-radius: 10rpx;
		padding-bottom: 10rpx;

		// 第一部分：头像，昵称，发布时间：
		.cumPost-head {
			display: flex;
			flex-direction: row;
			align-items: center;
			padding: 10rpx 0 10rpx 10rpx;
			border-bottom: 1rpx solid silver;

			// 头像部分:
			.cumPost-headImg {
				// position: absolute;
				width: 75rpx;
				height: 75rpx;
				border-radius: 50%;
				background-size: 100% 100%;
				margin-right: 15rpx;
			}

			// 昵称和发布时间:
			.cumPost-nameTime {
				display: flex;
				flex-direction: column;

				// 昵称后的图标:
				.cumPost-name:after {
					content: '';
					display: block;
					background: url(../../../static/cummunity/medal.png) no-repeat 0 0;
					width: 40rpx;
					height: 40rpx;
					margin-top: 5rpx;
					margin-left: 5rpx;
					float: right;
					background-size: cover;
				}
			}
		}

		.cumPost-content {
			display: flex;
			position: relative;
			// 上下布局：
			flex-direction: column;
			padding: 10rpx;

			// 标题栏：
			.cumPost-contentTittle {
				display: flex;
				flex-direction: row;
				font-weight: bold;
				font-size: 40rpx;
				margin-left: 10rpx;
				padding: 10rpx 15rpx 15rpx 15rpx;
			}

			.cumPost-contentInfo {
				font-size: 30rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				color: grey;
				padding: 5rpx 15rpx 15rpx 15rpx;
				border-bottom: 1rpx solid silver;
			}
		}

		// 处理置顶图标:
		.cumPost-content:before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			display: inline-block;
			width: 60rpx;
			height: 60rpx;
			background: url(../../../static/cummunity/setTop.png) no-repeat 0 0;
			background-size: cover;
		}

		.comPost-footer {
			display: flex;
			flex-direction: row;
			justify-content: space-around;
			align-items: center;

			.comPost-num {
				display: flex;
				flex-direction: column;
				text-align: center;

				image {
					margin-left: 5rpx;
					width: 35rpx;
					height: 35rpx;
					background-size: 100% 100%;
				}
			}
		}
	}
/* #endif */
</style>
