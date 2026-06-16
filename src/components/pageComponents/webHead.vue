<template>
	<view class="web-nav">
		<view class="nav-content">
			<view class="logo">
				<view class="logo-text-main">Echo</view>
				<view class="logo-text-sub">学习平台</view>
			</view>
			<view class="menu">
				<view class="menu-item" v-for="(item,index) in menuList" :key="index" @click="gotoPage(item.url)">
					{{item.name}}
				</view>
			</view>
			<view class="user-info">
				<view class="info-item">搜索</view>
				<view class="info-item m-left">消息</view>
				<image
					class="avatar m-left"
					:src="userInfo.avatarUrl || '/static/person/myHeaderPicture.jpg'"
					mode="aspectFill"
					@click="goPersonCenter"
				></image>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapState } from "vuex"
	export default {
		created() {
			console.log('WebHead Component Loaded');
		},
		data() {
			return {
				menuList: [
					{ name: '首页', url: '/pages/index/index' },
					{ name: '题库', url: '/pages/exercise/exercise' },
					{ name: '社区', url: '/pages/community/community' },
					{ name: '个人中心', url: '/pages/person/person' }
				]
			};
		},
		computed: {
			...mapState("userModule", ["userInfo"])
		},
		methods: {
			gotoPage(url) {
				uni.switchTab({
					url
				})
			},
			goPersonCenter() {
				uni.switchTab({
					url: '/pages/person/person'
				})
			}
		}
	}
</script>

<style scoped>
/* 使用纯 PX 避免 rpx 干扰 */
.web-nav {
	width: 100% !important;
	height: 60px !important;
	background-color: #fff !important;
	box-shadow: 0 2px 8px rgba(0,0,0,0.06) !important;
	display: flex !important;
	align-items: center !important;
	position: fixed !important;
	top: 0 !important;
	left: 0 !important;
	z-index: 9999 !important;
    font-family: sans-serif !important;
}

.nav-content {
	max-width: 1200px !important;
	width: 100% !important;
	margin: 0 auto !important;
	display: flex !important;
	justify-content: space-between !important;
	align-items: center !important;
	padding: 0 20px !important;
	box-sizing: border-box !important;
}

.logo {
	display: flex !important;
	align-items: center !important;
}

.logo-text-main {
    font-size: 22px !important;
    font-weight: bold !important;
    color: #17ead9 !important;
}

.logo-text-sub {
    margin-left: 10px !important;
    font-size: 15px !important;
    color: #333 !important;
}

.menu {
	display: flex !important;
	flex: 1 !important;
	justify-content: center !important;
}

.menu-item {
	margin: 0 20px !important;
	font-size: 16px !important;
	color: #666 !important;
	cursor: pointer !important;
}

.user-info {
	display: flex !important;
	align-items: center !important;
}

.info-item {
	font-size: 14px !important;
	color: #666 !important;
	cursor: pointer !important;
}

.avatar {
	width: 35px !important;
	height: 35px !important;
	border-radius: 50% !important;
	background-color: #eee !important;
	object-fit: cover !important;
	cursor: pointer !important;
	border: 2px solid #f1f5f9 !important;
	transition: border-color 0.2s !important;
}
.avatar:hover {
	border-color: #6366f1 !important;
}

.m-left {
	margin-left: 20px !important;
}
</style>