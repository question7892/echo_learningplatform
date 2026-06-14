<template>
	<view class="community-page">
		<!-- #ifdef H5 -->
		<view class="web-community">
			<view class="web-container">
				<!-- 左侧菜单 -->
				<view class="web-side-left">
					<view class="side-nav-card">
						<view class="side-nav-item" v-for="(item, index) in sideList" :key="index"
							:class="{ active: currentSide === index }" @click="currentSide = index">
							<u-icon :name="item.icon" size="20"></u-icon>
							<text class="nav-text">{{ item.name }}</text>
							<view v-if="currentSide === index" class="nav-active-dot"></view>
						</view>
					</view>

					<view class="my-communities">
						<view class="card-header">
							<text>我的社区</text>
							<text class="header-count">2</text>
						</view>
						<view class="community-mini-item">
							<view class="mini-dot frontend"></view>
							<text>前端学习社区</text>
						</view>
						<view class="community-mini-item">
							<view class="mini-dot java"></view>
							<text>Java交流社区</text>
						</view>
					</view>
				</view>

				<!-- 中间信息流 -->
				<view class="web-feed">
					<view class="feed-header">
						<u-search placeholder="寻找你感兴趣的讨论…" :showAction="false" shape="round"
							bg-color="#f5f6f8"></u-search>
					</view>

					<!-- 快捷功能区 -->
					<view class="quick-nav">
						<view class="quick-item" v-for="(item, index) in quickItems" :key="index">
							<view class="quick-icon-wrap" :style="{ background: item.bg }">
								<u-icon :name="item.icon" :color="item.color" size="26"></u-icon>
							</view>
							<text>{{ item.label }}</text>
						</view>
					</view>

					<view class="feed-content">
						<List isWeb></List>
					</view>
				</view>

				<!-- 右侧侧边栏 -->
				<view class="web-side-right">
					<view class="notice-card">
						<view class="card-header">
							<u-icon name="volume" size="18" color="#3b82f6"></u-icon>
							<text>平台公告</text>
						</view>
						<view class="notice-item">
							<view class="notice-dot"></view>
							<text>Echo 学习平台 V2.0 网页版上线啦！</text>
						</view>
						<view class="notice-item">
							<view class="notice-dot"></view>
							<text>关于社区文明发帖的规范通知</text>
						</view>
					</view>

					<view class="hot-topics">
						<view class="card-header">
							<u-icon name="fire" size="18" color="#f59e0b"></u-icon>
							<text>热门话题</text>
						</view>
						<view class="topic-item" v-for="(topic, idx) in hotTopics" :key="idx">
							<text class="topic-rank" :class="'rank-' + (idx + 1)">{{ idx + 1 }}</text>
							<text>{{ topic }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- #endif -->

		<!-- #ifndef H5 -->
		<view class="mobile-community" :style="{ backgroundColor: bacColor }">
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
				bacColor: '#f5f6f8',
				currentSide: 0,
				sideList: [
					{ name: '动态首页', icon: 'home' },
					{ name: '我的社区', icon: 'grid' },
					{ name: '关注内容', icon: 'heart' },
					{ name: '社区广场', icon: 'map' }
				],
				quickItems: [
					{ icon: 'bell', color: '#3b82f6', bg: '#eff6ff', label: '通知' },
					{ icon: 'thumb-up', color: '#ef4444', bg: '#fef2f2', label: '点赞' },
					{ icon: 'chat', color: '#10b981', bg: '#ecfdf5', label: '回复' },
					{ icon: 'email', color: '#f59e0b', bg: '#fffbeb', label: '私信' }
				],
				hotTopics: [
					'如何高效学习算法',
					'2026 春招面经分享',
					'Vue3 组合式 API 指南'
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
			position: sticky;
			top: 80px;
			align-self: flex-start;

			.side-nav-card,
			.my-communities {
				background: #fff;
				border-radius: 16px;
				padding: 16px 0;
				box-shadow: 0 2px 16px rgba(0, 0, 0, 0.04);
			}

			.side-nav-item {
				padding: 13px 24px;
				display: flex;
				align-items: center;
				cursor: pointer;
				color: #64748b;
				transition: all 0.2s;
				position: relative;

				.nav-text {
					margin-left: 14px;
					font-size: 15px;
				}

				.nav-active-dot {
					position: absolute;
					right: 16px;
					width: 8px;
					height: 8px;
					background: #17ead9;
					border-radius: 50%;
				}

				&.active {
					color: #17ead9;
					background: #f0fdfa;
					font-weight: 600;
				}

				&:hover:not(.active) {
					background: #f8fafc;
					color: #1e293b;
				}
			}

			.card-header {
				padding: 0 24px 14px;
				font-size: 14px;
				font-weight: 700;
				color: #1e293b;
				border-bottom: 1px solid #f1f5f9;
				margin-bottom: 10px;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.header-count {
					background: #f1f5f9;
					color: #64748b;
					font-size: 12px;
					padding: 2px 10px;
					border-radius: 10px;
				}
			}

			.community-mini-item {
				padding: 10px 24px;
				font-size: 14px;
				color: #64748b;
				cursor: pointer;
				display: flex;
				align-items: center;
				gap: 10px;

				.mini-dot {
					width: 10px;
					height: 10px;
					border-radius: 3px;
					flex-shrink: 0;

					&.frontend {
						background: #3b82f6;
					}

					&.java {
						background: #f59e0b;
					}
				}

				&:hover {
					color: #17ead9;
				}
			}
		}

		.web-feed {
			flex: 1;
			display: flex;
			flex-direction: column;
			gap: 20px;
			min-width: 0;

			.feed-header {
				background: #fff;
				padding: 20px;
				border-radius: 16px;
				box-shadow: 0 2px 16px rgba(0, 0, 0, 0.04);
			}

			.quick-nav {
				display: grid;
				grid-template-columns: repeat(4, 1fr);
				background: #fff;
				padding: 24px 16px;
				border-radius: 16px;
				gap: 12px;
				box-shadow: 0 2px 16px rgba(0, 0, 0, 0.04);

				.quick-item {
					display: flex;
					flex-direction: column;
					align-items: center;
					cursor: pointer;

					.quick-icon-wrap {
						width: 56px;
						height: 56px;
						display: flex;
						align-items: center;
						justify-content: center;
						border-radius: 16px;
						margin-bottom: 8px;
						transition: all 0.2s;
					}

					text {
						font-size: 13px;
						color: #475569;
						font-weight: 500;
					}

					&:hover .quick-icon-wrap {
						transform: scale(1.05);
					}

					&:hover text {
						color: #17ead9;
					}
				}
			}

			.feed-content {
				background: #fff;
				border-radius: 16px;
				padding: 8px;
				min-height: 500px;
				box-shadow: 0 2px 16px rgba(0, 0, 0, 0.04);
			}
		}

		.web-side-right {
			width: 280px;
			display: flex;
			flex-direction: column;
			gap: 20px;
			position: sticky;
			top: 80px;
			align-self: flex-start;

			.notice-card,
			.hot-topics {
				background: #fff;
				border-radius: 16px;
				padding: 20px;
				box-shadow: 0 2px 16px rgba(0, 0, 0, 0.04);

				.card-header {
					font-size: 15px;
					font-weight: 700;
					color: #1e293b;
					margin-bottom: 18px;
					display: flex;
					align-items: center;
					gap: 8px;
				}

				.notice-item {
					font-size: 14px;
					color: #64748b;
					margin-bottom: 14px;
					cursor: pointer;
					line-height: 1.5;
					display: flex;
					align-items: flex-start;
					gap: 10px;

					.notice-dot {
						width: 6px;
						height: 6px;
						background: #3b82f6;
						border-radius: 50%;
						flex-shrink: 0;
						margin-top: 7px;
					}

					&:hover {
						color: #17ead9;
					}
				}

				.topic-item {
					font-size: 14px;
					color: #334155;
					margin-bottom: 14px;
					cursor: pointer;
					display: flex;
					align-items: center;
					gap: 12px;
					font-weight: 500;

					.topic-rank {
						width: 22px;
						height: 22px;
						display: flex;
						align-items: center;
						justify-content: center;
						border-radius: 6px;
						font-size: 12px;
						font-weight: 700;
						color: #fff;
						background: #94a3b8;
						flex-shrink: 0;

						&.rank-1 {
							background: #ef4444;
						}

						&.rank-2 {
							background: #f59e0b;
						}

						&.rank-3 {
							background: #3b82f6;
						}
					}

					&:hover {
						color: #17ead9;
					}
				}
			}
		}
	}

	/* #endif */

	/* #ifndef H5 */
	.mobile-community {
		min-height: 100vh;
	}
	/* #endif */
</style>
