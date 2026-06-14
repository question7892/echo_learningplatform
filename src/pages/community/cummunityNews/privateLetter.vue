<template>
	<!-- 私信列表 -->
	<view class="private-letter">
		<view class="letter-header">
			<text class="letter-title">聊天列表</text>
		</view>
		<view class="letter-card" v-for="(item, index) in userList" :key="index" @click="showDetails(index)">
			<view class="letter-avatar-wrap">
				<image class="letter-avatar" :src="item.userImg || '/static/default-avatar.jpg'" mode="aspectFill"></image>
				<view v-if="item.value !== 0" class="letter-badge">{{ item.value }}</view>
			</view>
			<view class="letter-info">
				<view class="letter-name-row">
					<text class="letter-name">{{ item.userName }}</text>
					<text class="letter-time">{{ item.time }}</text>
				</view>
				<text class="letter-preview">{{ item.content }}</text>
			</view>
			<text class="letter-arrow">›</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userList: [{
					id: 1,
					userImg: 'https://i0.hdslb.com/bfs/face/3ed6cfcaf4a2088430293d652ac728bc840d127e.jpg@240w_240h_1c_1s.webp',
					userName: 'Simon',
					time: '04/10 10:08',
					value: 1,
					content: '您好，看了您的博客之后我有个问题想问问您，就是关于……'
				}, {
					id: 2,
					userImg: 'https://i2.hdslb.com/bfs/face/f5d996322f0e960b50a95d1c20e7824bfa64887d.jpg@240w_240h_1c_1s.webp',
					userName: 'Lucy',
					time: '04/10 10:08',
					value: 2,
					content: '您好，请问能分享一下您的面经吗，感激不尽'
				}, {
					id: 3,
					userImg: 'https://i2.hdslb.com/bfs/face/1bcb8694c484750d99a6ec4e50bf7a71ff2d7e82.jpg@240w_240h_1c_1s.webp',
					userName: 'Judy',
					time: '04/10 10:08',
					value: 3,
					content: '您好，看了您的博客之后我有个问题想问问您，就是关于……'
				}, {
					id: 4,
					userImg: 'https://i0.hdslb.com/bfs/face/4e4b647405d5c4a2bf7d10402cedf55ad9a0e544.jpg@240w_240h_1c_1s.webp',
					userName: 'Mike',
					time: '04/10 10:08',
					value: 4,
					content: 'Hello，大佬我想加您好友一下，方便给个微信吗'
				}, {
					id: 5,
					userImg: 'https://i0.hdslb.com/bfs/face/4e4b647405d5c4a2bf7d10402cedf55ad9a0e544.jpg@240w_240h_1c_1s.webp',
					userName: 'Mike',
					time: '04/10 10:08',
					value: 0,
					content: 'Hello，大佬我想加您好友一下，方便给个微信吗'
				}]
			}
		},
		methods: {
			showDetails(index) {
				uni.navigateTo({
					url: '../cumTag/chat?chatObj=' + JSON.stringify(this.userList[index])
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.private-letter {
		background-color: #f5f6f8;
		min-height: 100vh;
	}

	.letter-header {
		padding: 24rpx 28rpx 16rpx;
		background: #fff;
		margin-bottom: 16rpx;

		.letter-title {
			font-size: 36rpx;
			font-weight: 700;
			color: #1e293b;
		}
	}

	.letter-card {
		display: flex;
		flex-direction: row;
		align-items: center;
		background: #fff;
		padding: 22rpx 24rpx;
		margin: 0 20rpx 12rpx 20rpx;
		border-radius: 16rpx;
		box-shadow: 0 2rpx 16rpx rgba(0, 0, 0, 0.04);
		transition: all 0.2s;

		&:active {
			transform: scale(0.98);
			background: #fafbfc;
		}

		.letter-avatar-wrap {
			position: relative;
			flex-shrink: 0;

			.letter-avatar {
				width: 96rpx;
				height: 96rpx;
				border-radius: 50%;
				border: 2rpx solid #f1f5f9;
			}

			.letter-badge {
				position: absolute;
				top: -6rpx;
				right: -6rpx;
				min-width: 36rpx;
				height: 36rpx;
				line-height: 36rpx;
				text-align: center;
				background: #ef4444;
				color: #fff;
				font-size: 22rpx;
				font-weight: 600;
				border-radius: 18rpx;
				padding: 0 8rpx;
				box-shadow: 0 2rpx 8rpx rgba(239, 68, 68, 0.4);
			}
		}

		.letter-info {
			flex: 1;
			display: flex;
			flex-direction: column;
			margin-left: 20rpx;
			overflow: hidden;

			.letter-name-row {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 8rpx;

				.letter-name {
					font-size: 32rpx;
					font-weight: 600;
					color: #1e293b;
				}

				.letter-time {
					font-size: 24rpx;
					color: #94a3b8;
					flex-shrink: 0;
				}
			}

			.letter-preview {
				font-size: 28rpx;
				color: #94a3b8;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		}

		.letter-arrow {
			font-size: 36rpx;
			color: #cbd5e1;
			margin-left: 12rpx;
			flex-shrink: 0;
		}
	}
</style>
