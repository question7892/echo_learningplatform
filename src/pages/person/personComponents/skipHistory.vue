<template>
  <!-- 浏览记录 -->
  <view class="history-page">
    <!-- 导航栏 -->
    <u-navbar title="浏览记录" :autoBack="true" :fixed="true" @rightClick="goBack"
      bgColor="#fff" titleStyle="color:#1e293b;font-weight:700;font-size:32rpx;">
    </u-navbar>

    <!-- 内容区 -->
    <view class="history-content">
      <view class="history-header">
        <view class="back-row" @click="goBack">
          <text class="back-arrow">‹</text>
          <text class="back-label">返回</text>
        </view>
        <text class="header-title">最近浏览</text>
        <view class="header-right">
          <text class="header-count" v-if="records && records.length">{{ records.length }} 条记录</text>
          <text class="header-clear" v-if="records && records.length" @click="handleClearAll">清空</text>
        </view>
      </view>
      <PostPage :records="records"></PostPage>
    </view>

  </view>
</template>

<script>
import PostPage from '../../../components/pageComponents/postPage.vue'
import { getBrowseHistory, clearBrowseHistory } from '@/utils/storageUtils.js'
export default {
  data() {
    return {
      records: [],
    }
  },
  components: {
    PostPage,
  },
  methods: {
    goBack() { uni.navigateBack({ delta: 1 }) },
    loadHistory() {
      this.records = getBrowseHistory()
      console.log('本地浏览记录:', this.records.length, '条')
    },
    handleClearAll() {
      uni.showModal({
        title: '清空浏览记录',
        content: '确认清空所有浏览记录吗？',
        confirmText: '清空',
        confirmColor: '#ef4444',
        success: res => {
          if (res.confirm) {
            clearBrowseHistory()
            this.records = []
            uni.$u.toast('已清空浏览记录')
          }
        },
      })
    },
  },
  // 每次显示页面时从本地缓存重新加载（包括从详情页返回时）
  onShow() {
    this.loadHistory()
  },
}
</script>

<style lang="scss" scoped>
.history-page {
  min-height: 100vh;
  background: #f1f5f9;
}

.history-content {
  padding: 24rpx;
  padding-top: 20rpx;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 22rpx;
  padding: 0 4rpx;
  flex-wrap: wrap;
  gap: 12rpx;
}
.back-row {
  display: flex;
  align-items: center;
  gap: 4rpx;
  padding: 8rpx 16rpx 8rpx 8rpx;
  background: #f1f5f9;
  border-radius: 10rpx;
  cursor: pointer;
  transition: all 0.2s;
  &:active { background: #e2e8f0; }
  .back-arrow { font-size: 36rpx; color: #6366f1; font-weight: 700; line-height: 1; }
  .back-label { font-size: 24rpx; color: #64748b; font-weight: 500; }
}
.header-title {
  font-size: 30rpx;
  font-weight: 700;
  color: #1e293b;
  padding-left: 20rpx;
  border-left: 6rpx solid #6366f1;
}
.header-right {
  display: flex;
  align-items: center;
  gap: 16rpx;
}
.header-count {
  font-size: 24rpx;
  color: #94a3b8;
}
.header-clear {
  font-size: 24rpx;
  color: #ef4444;
  font-weight: 500;
  padding: 6rpx 16rpx;
  background: #fef2f2;
  border-radius: 8rpx;
  cursor: pointer;
  &:active { background: #fee2e2; }
}
</style>
