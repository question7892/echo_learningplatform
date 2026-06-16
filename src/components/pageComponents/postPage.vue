<template>
  <!-- 贴子卡片组件 -->
  <view class="post-list">
    <view class="post-card" v-for="(item, index) in records" :key="index" @click="goOther(index)">
      <!-- 卡片头部：标签 + 时间 -->
      <view class="card-top">
        <view class="post-badge">贴子</view>
        <text class="post-time">
          <text class="time-icon">🕐</text>
          {{ item.createTime || item.creat_time || item.create_time || item.time }}
        </text>
      </view>

      <!-- 标题 -->
      <text class="post-title">{{ item.title || item.tittle || item.discuss_name }}</text>

      <!-- 内容预览 -->
      <view class="post-body">
        <text class="post-excerpt">{{ item.content || item.context || item.describe }}</text>
        <image
          v-if="item.contentImg || item.coverImgUrl || item.imageUrl || item.imageurl"
          class="post-thumb"
          :src="item.contentImg || item.coverImgUrl || item.imageUrl || item.imageurl"
          mode="aspectFill"
        ></image>
      </view>

      <!-- 底部统计栏 -->
      <view class="card-footer">
        <view class="footer-author">
          <text class="author-avatar">👤</text>
          <text class="author-name">{{ item.author || item.userName || item.nick_name || item.userId || '匿名作者' }}</text>
        </view>
        <view class="footer-stats">
          <view class="stat-item">
            <text class="stat-icon">👁</text>
            <text class="stat-val">{{ item.readNum || item.visitNumber || item.visitnumber || 0 }}</text>
          </view>
          <view class="stat-item">
            <text class="stat-icon">❤</text>
            <text class="stat-val">{{ item.like || item.likeNumber || item.likenumber || 0 }}</text>
          </view>
          <view class="stat-item">
            <text class="stat-icon">💬</text>
            <text class="stat-val">{{ item.comment || item.commentNumber || item.commentnumber || 0 }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view class="post-empty" v-if="!records || records.length === 0">
      <text class="empty-icon">📭</text>
      <text class="empty-text">暂无内容</text>
    </view>
  </view>
</template>

<script>
import { goDetail } from "@/utils/utils.js"
import { saveBrowseHistory } from "@/utils/storageUtils.js"
export default {
  props: {
    records: { type: Array, default: () => [] }
  },
  data() {
    return {
      flag: 2,
      favData: [],
    }
  },
  methods: {
    goOther(index) {
      // 点击查看详情时，将当前内容保存为浏览记录
      saveBrowseHistory(this.records[index])
      goDetail(
        "/pages/person/personComponents/collect/myCollect",
        1,
        this.records[index].postId || this.records[index].id || this.records[index].viewId
      )
    },
  },
}
</script>

<style lang="scss" scoped>
.post-list {
  display: flex;
  flex-direction: column;
  gap: 18rpx;
  padding: 0 4rpx;
}

/* ====== 卡片 ====== */
.post-card {
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 18rpx;
  padding: 24rpx 24rpx 18rpx;
  box-shadow: 0 2rpx 14rpx rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(226, 232, 240, 0.5);
  transition: all 0.2s ease;
  cursor: pointer;

  &:active {
    transform: scale(0.985);
    box-shadow: 0 4rpx 18rpx rgba(99, 102, 241, 0.08);
  }
}

/* 卡片顶部 */
.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14rpx;
}
.post-badge {
  font-size: 20rpx;
  font-weight: 700;
  color: #6366f1;
  background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
  padding: 4rpx 16rpx;
  border-radius: 8rpx;
  letter-spacing: 1rpx;
}
.post-time {
  font-size: 22rpx;
  color: #94a3b8;
  display: flex;
  align-items: center;
  gap: 6rpx;
  .time-icon { font-size: 18rpx; }
}

/* 标题 */
.post-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.4;
  margin-bottom: 16rpx;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 内容预览 */
.post-body {
  display: flex;
  gap: 18rpx;
  margin-bottom: 18rpx;
}
.post-excerpt {
  flex: 1;
  color: #94a3b8;
  font-size: 26rpx;
  line-height: 1.7;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.post-thumb {
  width: 140rpx;
  height: 100rpx;
  border-radius: 10rpx;
  flex-shrink: 0;
  object-fit: cover;
}

/* 底部栏 */
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16rpx;
  border-top: 1px solid #f1f5f9;
}
.footer-author {
  display: flex;
  align-items: center;
  gap: 8rpx;
  .author-avatar { font-size: 22rpx; }
  .author-name {
    font-size: 24rpx;
    color: #64748b;
    max-width: 140rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.footer-stats {
  display: flex;
  gap: 24rpx;
}
.stat-item {
  display: flex;
  align-items: center;
  gap: 6rpx;
  .stat-icon { font-size: 20rpx; }
  .stat-val { font-size: 22rpx; color: #94a3b8; }
}

/* 空状态 */
.post-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80rpx 0;
  .empty-icon { font-size: 64rpx; margin-bottom: 20rpx; }
  .empty-text { font-size: 28rpx; color: #94a3b8; font-weight: 500; }
}
</style>
