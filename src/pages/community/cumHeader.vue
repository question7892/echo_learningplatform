<template>
<!-- #ifdef H5 -->
<!-- 社区头部组件 -->
	<view class="cum-header">
		<!-- 搜索框 -->
		<view class="header-search">
			<image class="search-icon" src="../../static/cummunity/mySearch.png" mode=""></image>
			<input class="search-input" placeholder="搜索感兴趣的社区…" placeholder-style="color: #94a3b8; text-align: left"
				type="text" />
		</view>

		<!-- 快捷导航 -->
		<view class="header-nav">
			<view class="nav-item" v-for="(item, index) in list" :key="index" @click="skipUrl(item.assignUrl)">
				<view class="nav-icon-wrap" :style="{ background: item.bg }">
					<image class="nav-icon" :src="item.src" mode="aspectFit"></image>
				</view>
				<text class="nav-text">{{ item.text }}</text>
			</view>
		</view>
	</view>
<!-- #endif -->
<!-- #ifndef H5 -->
<!-- 关于社区模块的设计 -->
	<view :style="{backgroundColor: bacColor}">
		<!-- 最外层容器， -->
		<view class="cummunity">
			<!-- 设计为一个搜索框加一个图标导航栏 -->
			<!-- 搜索框容器 -->
			<view class="cummunity-inpCon">
				<!-- 搜索框需要一个图标 -->
				<image class="cummunity-searchIcon" src="../../static/cummunity/mySearch.png" mode=""></image>
				<input class="cummunity-input" placeholder="请输入需要查找的社区" placeholder-style="text-align: left" type="text" />
			</view>
			<!-- 列表导航栏： -->
			<view class="cummunity-container">
				<view class="cummunity-icons" v-for="(item,index) in list" :key="index">
					<image @click="skipUrl(item.assignUrl)" class="cummunity-image" :src="item.src"  mode=""></image>
					<text :style="{fontSize: fs+'rpx'}">{{item.text}}</text>
				</view>
			</view>
		</view>
	</view>
<!-- #endif -->
</template>

<script>
export default {
		data() {
			return {
				bacColor: '#f5f6f8',
				list: [
					{
						text: '通知消息',
						assignUrl: './cummunityNews/systemNews',
						src: 'https://s2.loli.net/2022/04/23/aZHdXeSKsNoJbfA.png',
						bg: '#eff6ff'
					},
					{
						text: '赞',
						assignUrl: './cummunityNews/receiveLike',
						src: 'https://s2.loli.net/2022/04/23/4LyclIE9TOhfdGA.png',
						bg: '#fef2f2'
					},
					{
						text: '回复',
						assignUrl: './cummunityNews/replay',
						src: 'https://s2.loli.net/2022/04/23/FMhLoXgYlxcwRUG.png',
						bg: '#ecfdf5'
					},
					{
						text: '私信',
						assignUrl: './cummunityNews/privateLetter',
						src: 'https://s2.loli.net/2022/04/23/KaZ6Nj7g3b2vIXL.png',
						bg: '#fffbeb'
					}
				]
			}
		},
		methods: {
			skipUrl(assignUrl) {
				uni.navigateTo({ url: assignUrl })
			}
		}
	}
</script>

<style lang="scss" scoped>
/* #ifdef H5 */
.cum-header {
		background: #fff;
		padding: 20rpx 24rpx 24rpx;
		border-radius: 0 0 24rpx 24rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.04);
	}

	.header-search {
		position: relative;
		margin-bottom: 24rpx;

		.search-icon {
			position: absolute;
			left: 24rpx;
			top: 50%;
			transform: translateY(-50%);
			width: 36rpx;
			height: 36rpx;
			z-index: 1;
			opacity: 0.5;
		}

		.search-input {
			width: 100%;
			height: 80rpx;
			padding-left: 72rpx;
			border-radius: 40rpx;
			background: #f5f6f8;
			font-size: 30rpx;
			color: #1e293b;
			box-sizing: border-box;
		}
	}

	.header-nav {
		display: flex;
		flex-direction: row;
		justify-content: space-around;

		.nav-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: 8rpx 16rpx;

			.nav-icon-wrap {
				width: 96rpx;
				height: 96rpx;
				border-radius: 24rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-bottom: 10rpx;
				transition: all 0.2s;

				&:active {
					transform: scale(0.9);
				}

				.nav-icon {
					width: 52rpx;
					height: 52rpx;
				}
			}

			.nav-text {
				font-size: 26rpx;
				color: #475569;
				font-weight: 500;
			}
		}
	}
/* #endif */
/* #ifndef H5 */
.cummunity {
		display: flex;
		flex-direction: column;
		background-color: white;

		.cummunity-inpCon {
			width: 100%;
			margin-top: 20rpx;
			position: relative;
			.cummunity-searchIcon {
				width: 5%;
				height: 50%;
				top: 50%;
				position: absolute;
				transform: translateY(-50%);
				left: 7%;
				z-index: 1;
			}

			// height: ;
			.cummunity-input {
				width: 90%;
				display: flex;
				height: 80rpx;
				margin: 0 auto;
				position: relative;
				justify-content: space-around;
				align-items: center;
				text-align: center;
				border-radius: 40rpx;
				background-color: #F4F4F5;
			}
			// 对输入框中提示文字的样式：
			
		}

		.cummunity-container {
			display: flex;
			margin-top: 20rpx;
			flex-direction: row;
			border-radius: 25rpx;
			background-color: white;

			.cummunity-icons {
				width: 100%;
				margin: 20rpx;
				display: flex;
				align-items: center;
				flex-direction: column;
				justify-content: space-around;

				.cummunity-image {
					width: 80rpx;
					height: 80rpx;
					
				}
			}
		}
	}
/* #endif */
</style>
