<template>
<!-- #ifdef H5 -->
<!-- 聊天页面 -->
	<view class="chat-page">
		<u-navbar :title="chatTittle" @rightClick="rightClick" :autoBack="true"></u-navbar>

		<!-- 聊天区域 -->
		<scroll-view scroll-y :scroll-top="scrollTop" :style="{ height: chatAreaHeight + 'px' }" class="chat-area">
			<view v-for="(item, index) in messageList" :key="index" :class="item.id === id ? 'msg-self' : 'msg-other'">
				<image class="msg-avatar" :src="item.userImg || '/static/default-avatar.jpg'" mode="aspectFill"></image>
				<view :class="item.id === id ? 'bubble-self' : 'bubble-other'">
					<text>{{ item.content }}</text>
				</view>
			</view>
		</scroll-view>

		<!-- 输入区域 -->
		<view class="chat-input-bar">
			<input v-model="iptValues" class="chat-input" type="text" placeholder="输入消息…"
				placeholder-style="color: #94a3b8" confirm-type="send" @confirm="sendNews" />
			<button class="chat-send-btn" @click="sendNews">发送</button>
		</view>
	</view>
<!-- #endif -->
<!-- #ifndef H5 -->
<!-- 封装的组件，用于展示与某个用户的私信: -->
	<!-- 自定义导航头: -->
	<view class="chat">
		<u-navbar :title="chatTittle" @rightClick="rightClick" :autoBack="true">
		</u-navbar>
		<!-- 下方显示的即为聊天区域: -->
		<!-- 需要获得时间戳: -->
		<view :style="{height: WindowHeight+'px'}" class="chatArea">
			<!-- 单个聊天消息: -->
			<view v-for="(item,index) in messageList" :key="index"
				:class="{'reverse': item.id===id,'singleNews':item.id!==id}">
				<!-- 其中包括用户头像，用户发送的消息内容,获取时间: -->
				<image class="userImg" :src="item.userImg"></image>
				<!-- 放置聊天内容的部分: -->
				<text class="myContent">{{item.content}}</text>
			</view>
		</view>
		<view class="inpContent">
			<input v-model="iptValues" class="myipt" type="text" placeholder="请输入内容">
			<text :style="{marginLeft: 10+ 'rpx',marginTop: 10+'rpx'}" class="icon iconfont icon-good myGood">666</text>
			<button class="mybtn" @click="sendNews">发送</button>
		</view>
		<!-- <MyIpt :index="active" :isLike="isLike" :like="0" :action="action" @sendMyNew="receiveNews"></MyIpt> -->
	</view>
<!-- #endif -->
</template>

<script>
const { log } = console;
	export default {
		onLoad(option) {
			uni.setStorageSync('myId', 0)
			uni.setStorageSync('myName', 'Voitto');
			this.id = uni.getStorageSync('myId');
			let optionPlus = JSON.parse(option.chatObj);
			this.WindowHeight = uni.getSystemInfoSync().windowHeight;
			this.chatAreaHeight = this.WindowHeight - 120;
			this.chatTittle = optionPlus.userName;
			this.messageList.unshift(optionPlus);

			uni.connectSocket({
				url: `ws://192.168.196.215:8088/websocket/${uni.getStorageSync('myName')}`,
				success: (res) => { },
				fail: (res) => { }
			});
			uni.onSocketOpen((res) => {
				console.log('WebSocket连接已打开！');
				this.socketSign = true;
			});
			uni.onSocketError((res) => {
				console.log('WebSocket连接打开失败，请检查网络！');
			});
			uni.onSocketClose((res) => {
				console.log('WebSocket 已关闭！');
				this.socketSign = false;
			});
			uni.onSocketMessage((res) => {
				let result = JSON.parse(res.data);
				let item = { message: result.message, reciverId: result.reciverId };
				console.log('收到服务器内容');
			});
		},
		data() {
			return {
				iptValues: '',
				id: '',
				chatTittle: '',
				WindowHeight: 0,
				chatAreaHeight: 0,
				scrollTop: 0,
				socketSign: false,
				messageList: [{
					id: 0,
					userName: 'Voitto',
					userImg: 'https://i2.hdslb.com/bfs/face/762ae6f1a5988fbfe0f61cb02bfe151f2aff534e.jpg@240w_240h_1c_1s.webp',
					content: '请您详细说说'
				}]
			}
		},
		methods: {
			rightClick() { },
			receiveNews(val) {
				this.messageList.push(val)
			},
			sendNews() {
				if (this.iptValues.replace(/(^\s*)|(\s*$)/g, '') === '') {
					uni.showToast({ title: '消息不能为空', icon: 'none' });
					return;
				}
				if (!this.socketSign) {
					uni.showToast({ title: '连接错误', icon: 'none' });
					return;
				}
				let message = {
					from: uni.getStorageSync('myName'),
					to: 'superAdmin',
					text: this.iptValues
				}
				uni.sendSocketMessage({
					data: JSON.stringify(message),
					success: (res) => {
						let content = this.iptValues;
						let chatNew = {
							id: 0,
							userName: 'Voitto',
							userImg: 'https://i2.hdslb.com/bfs/face/762ae6f1a5988fbfe0f61cb02bfe151f2aff534e.jpg@240w_240h_1c_1s.webp',
							content
						}
						this.messageList.push(chatNew);
						this.iptValues = '';
						this.$nextTick(() => {
							this.scrollTop = 999999;
						});
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
/* #ifdef H5 */
.chat-page {
		display: flex;
		flex-direction: column;
		background: #f5f6f8;
		height: 100vh;
	}

	/* 聊天区域 */
	.chat-area {
		flex: 1;
		padding: 16rpx 20rpx;
		margin-top: 44px;
		/* navbar height compensation */
	}

	.msg-self,
	.msg-other {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		margin-bottom: 24rpx;
	}

	.msg-self {
		flex-direction: row-reverse;
	}

	.msg-avatar {
		width: 72rpx;
		height: 72rpx;
		border-radius: 50%;
		flex-shrink: 0;
		border: 2rpx solid #f1f5f9;
	}

	.bubble-self,
	.bubble-other {
		max-width: 70%;
		padding: 18rpx 22rpx;
		font-size: 30rpx;
		border-radius: 20rpx;
		line-height: 1.5;
		word-break: break-all;
	}

	.bubble-self {
		background: #17ead9;
		color: #fff;
		margin-right: 16rpx;
		border-bottom-right-radius: 6rpx;
	}

	.bubble-other {
		background: #fff;
		color: #1e293b;
		margin-left: 16rpx;
		border-bottom-left-radius: 6rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
	}

	/* 输入栏 */
	.chat-input-bar {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 16rpx 20rpx;
		background: #fff;
		border-top: 1rpx solid #e2e8f0;
		box-shadow: 0 -2rpx 12rpx rgba(0, 0, 0, 0.04);
		gap: 16rpx;

		.chat-input {
			flex: 1;
			height: 72rpx;
			border-radius: 36rpx;
			background: #f5f6f8;
			padding: 0 24rpx;
			font-size: 28rpx;
			color: #1e293b;
		}

		.chat-send-btn {
			height: 72rpx;
			line-height: 72rpx;
			padding: 0 32rpx;
			background: #17ead9;
			color: #fff;
			font-size: 28rpx;
			font-weight: 600;
			border: none;
			border-radius: 36rpx;

			&:active {
				opacity: 0.8;
			}
		}
	}
/* #endif */
/* #ifndef H5 */
.chat {
		display: flex;
		position: relative;
		flex-direction: column;

		.chatArea {
			background-color: #F4F4F4;
			display: flex;
			flex-direction: column;
			margin-top: 150rpx;
			// align-items: center;

			.reverse {
				display: flex;
				// width: 100vw;
				flex-direction: row-reverse;
				margin: 20rpx;

				.userImg {
					width: 80rpx;
					height: 80rpx;
					border-radius: 50%;
				}

				.myContent {
					padding: 15rpx;
					// width: 70%;
					margin-right: 25rpx;
					display: flex;
					flex-direction: row;
					font-size: 30rpx;
					// align-items: center;
					background-color: aquamarine;
					border-radius: 15rpx;
				}
			}

			.singleNews {
				// width: 90%;
				display: flex;
				// width: 100vw;
				flex-direction: row;
				margin: 20rpx;

				.userImg {
					width: 80rpx;
					height: 80rpx;
					border-radius: 50%;
				}

				.myContent {
					padding: 15rpx;
					width: 70%;
					margin-left: 25rpx;
					display: flex;
					flex-direction: row;
					font-size: 30rpx;
					align-items: center;
					background-color: aquamarine;
					border-radius: 15rpx;
				}
			}
		}

		.inpContent {
			width: 100%;
			position: fixed;
			bottom: 0;
			background-color: white;
			display: flex;
			// justify-content: space-around;
			padding: 20rpx 10rpx 20rpx 10rpx;
			z-index: 1;
			border-top: 1rpx solid #b598a1;
			border-top-left-radius: 10rpx;
			border-top-right-radius: 10rpx;

			.myipt {
				width: 70%;
				border-radius: 20rpx;
				border: 1rpx solid silver;
			}

			.mybtn {
				// width: 15%;
				display: flex;
				height: 60rpx;
				line-height: 60rpx;
				font-size: 30rpx;
			}

			.myGood {
				display: flex;
				// width: 200rpx;
				font-size: 30rpx;
			}
		}
	}
/* #endif */
</style>
