<template>
	<view class="community-page">
		<!-- #ifdef H5 -->
		<view class="web-community">
			<view class="web-container">
				<!-- 左侧菜单 -->
				<view class="web-side-left">
					<view class="side-nav-card">
						<view 
							class="side-nav-item" 
							v-for="(item, index) in sideList" 
							:key="index"
							:class="{ active: currentSide === index }"
							@click="currentSide = index"
						>
							<u-icon :name="item.icon" size="20"></u-icon>
							<text class="nav-text">{{ item.name }}</text>
						</view>
					</view>
					
					<view class="my-communities">
						<view class="card-header">我的社区</view>
						<view class="community-mini-item">前端学习社区</view>
						<view class="community-mini-item">Java交流社区</view>
					</view>
				</view>

				<!-- 中间信息流 -->
				<view class="web-feed">
					<view class="feed-header">
						<u-search placeholder="寻找你感兴趣的讨论..." :showAction="false"></u-search>
					</view>
					
					<!-- 快捷功能区 -->
					<view class="quick-nav">
						<view class="quick-item"> <u-icon name="bell" color="#2979ff" size="28"></u-icon> <text>通知</text> </view>
						<view class="quick-item"> <u-icon name="thumb-up" color="#fa3534" size="28"></u-icon> <text>点赞</text> </view>
						<view class="quick-item"> <u-icon name="chat" color="#19be6b" size="28"></u-icon> <text>回复</text> </view>
						<view class="quick-item"> <u-icon name="email" color="#ff9900" size="28"></u-icon> <text>私信</text> </view>
					</view>

					<view class="feed-content">
						<List isWeb></List>
					</view>
				</view>

				<!-- 右侧侧边栏 -->
				<view class="web-side-right">
					<view class="notice-card">
						<view class="card-header">平台公告</view>
						<view class="notice-item">Echo 学习平台 V2.0 网页版上线啦！</view>
						<view class="notice-item">关于社区文明发帖的规范通知...</view>
					</view>
					
					<view class="hot-topics">
						<view class="card-header">热门话题</view>
						<view class="topic-item"># 如何高效学习算法 #</view>
						<view class="topic-item"># 2026春招面经分享 #</view>
						<view class="topic-item"># Vue3 组合式 API 指南 #</view>
					</view>
				</view>
			</view>
		</view>
		<!-- #endif -->

		<!-- #ifndef H5 -->
		<view :style="{backgroundColor: bacColor}">
			<CumHeader></CumHeader>
			<List></List>
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
	import CumHeader from './cumHeader.vue';
	import List from './list.vue'
	export default {
		data() {
			return {
				bacColor: `#F4F4F5`,
				currentSide: 0,
				sideList: [
					{ name: '动态首页', icon: 'home' },
					{ name: '我的社区', icon: 'grid' },
					{ name: '关注内容', icon: 'heart' },
					{ name: '社区广场', icon: 'map' }
				]
			}
		},
		components: { CumHeader, List },
	}
</script>

<style lang="scss" scoped>
/* #ifdef H5 */
.web-community {
	background-color: #f1f5f9;
	min-height: calc(100vh - 60px);
	padding: 30px 0;
	
	.web-container {
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		gap: 24px;
		padding: 0 20px;
	}
	
	.web-side-left {
		width: 240px;
		display: flex;
		flex-direction: column;
		gap: 20px;
		
		.side-nav-card, .my-communities {
			background: #fff;
			border-radius: 12px;
			padding: 15px 0;
			box-shadow: 0 4px 12px rgba(0,0,0,0.02);
		}
		
		.side-nav-item {
			padding: 12px 25px;
			display: flex;
			align-items: center;
			cursor: pointer;
			color: #64748b;
			transition: all 0.2s;
			.nav-text { margin-left: 12px; font-size: 15px; }
			&.active { color: #17ead9; background: #f0fdfa; font-weight: 600; }
			&:hover:not(.active) { background: #f8fafc; color: #1e293b; }
		}
		
		.card-header { padding: 0 25px 12px; font-weight: 700; color: #1e293b; border-bottom: 1px solid #f1f5f9; margin-bottom: 10px; }
		.community-mini-item { padding: 8px 25px; font-size: 14px; color: #64748b; cursor: pointer; &:hover { color: #17ead9; } }
	}
	
	.web-feed {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 20px;
		
		.feed-header {
			background: #fff;
			padding: 20px;
			border-radius: 12px;
			box-shadow: 0 4px 12px rgba(0,0,0,0.02);
		}
		
		.quick-nav {
			display: grid;
			grid-template-columns: repeat(4, 1fr);
			background: #fff;
			padding: 20px;
			border-radius: 12px;
			gap: 15px;
			
			.quick-item {
				display: flex;
				flex-direction: column;
				align-items: center;
				cursor: pointer;
				text { margin-top: 8px; font-size: 13px; color: #475569; }
				&:hover text { color: #17ead9; }
			}
		}
		
		.feed-content {
			background: #fff;
			border-radius: 12px;
			padding: 10px;
			min-height: 500px;
		}
	}
	
	.web-side-right {
		width: 280px;
		display: flex;
		flex-direction: column;
		gap: 20px;
		
		.notice-card, .hot-topics {
			background: #fff;
			border-radius: 12px;
			padding: 20px;
			box-shadow: 0 4px 12px rgba(0,0,0,0.02);
			
			.card-header { font-weight: 700; color: #1e293b; margin-bottom: 15px; }
			.notice-item, .topic-item { font-size: 14px; color: #64748b; margin-bottom: 12px; cursor: pointer; line-height: 1.5; &:hover { color: #17ead9; } }
			.topic-item { color: #2979ff; font-weight: 500; }
		}
	}
}
/* #endif */
</style>
