<template>
  <!-- 单个收藏夹 -->
  <view class="single-fav-page">
    <!-- 导航栏 -->
    <u-navbar :title="target.name || '收藏夹'" :autoBack="true" :fixed="true" @rightClick="goBack"
      bgColor="#fff" titleStyle="color:#1e293b;font-weight:700;font-size:32rpx;">
    </u-navbar>

    <!-- 头部概览卡片 -->
    <view class="fav-hero">
      <view class="hero-icon">📁</view>
      <text class="hero-name">{{ target.name }}</text>
      <text class="hero-count">{{ target.contents || collects.length }} 个收藏内容</text>
    </view>

    <!-- 内容列表 -->
    <view class="fav-content">
      <view class="section-header">
        <view class="back-row" @click="goBack">
          <text class="back-arrow">‹</text>
          <text class="back-label">返回</text>
        </view>
        <text class="section-title">收藏内容</text>
      </view>

      <view class="content-list">
        <view class="content-card" v-for="(item, index) in collects" :key="index" @click="goMyCollect(index)">
          <text class="card-title">{{ item.title }}</text>
          <text class="card-excerpt">{{ item.content }}</text>
          <view class="card-footer">
            <text class="card-author">作者：{{ item.userName }}</text>
            <text class="card-arrow">查看详情 ›</text>
          </view>
        </view>

        <!-- 空状态 -->
        <view class="content-empty" v-if="!collects || collects.length === 0">
          <text class="empty-icon">📭</text>
          <text class="empty-text">收藏夹还是空的</text>
          <text class="empty-hint">浏览内容时添加到收藏夹吧</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { goDetail } from "@/utils/utils.js"
import { saveBrowseHistory } from "@/utils/storageUtils.js"
export default {
  data() {
    return {
      thisId: "",
      target: {
        name: "",
        contents: "",
      },
      collects: [],
    }
  },
  onLoad(option) {
    let res = JSON.parse(option.Obj)
    console.log("单个收藏夹的内容:", res.id)
    this.thisId = res.id
    this.target.name = res.name
    this.target.contents = res.num
    this.getAllConent()
  },
  methods: {
    goBack() { uni.navigateBack({ delta: 1 }) },
    goMyCollect(index) {
      // 点击查看详情时，将当前内容保存为浏览记录
      saveBrowseHistory(this.collects[index])
      goDetail("./myCollect", 1, this.collects[index].id)
    },
    getAllConent() {
      let myReq = new Promise((resolve, reject) => {
        uni.request({
          url: "/user/get/favorites/essay",
          method: "POST",
          data: { favoritesId: this.thisId },
          header: {
            Authorization:
              "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ7XCJ1c2VyXCI6e1wiaWRcIjpcImM0NTEyYjY0ZWRkYTRkM2E4Yzg3NGUyMWZhOGFhYjNlXCIsXCJpbWFnZVVybFwiOlwiaHR0cHM6Ly90aGlyZHd4LnFsb2dvLmNuL21tb3Blbi92aV8zMi9IVXJwWWFQemR5U0RJSHJYcWlhTkVYbGdYMUZjdmliMXZhQ2tka1JacWc2NkxwZ25RaWFhaWFHM1kwNTlnbmtDMmVqRmtlbmFCaWNyUUdGVHFWQUsweG83c29RLzEzMlwiLFwibGFzdFRpbWVcIjoxNjUwNzEyNjk4MDM5LFwibG9naW5BY3RcIjpcIuWwj-afk0p1blwiLFwibmlja05hbWVcIjpcIuWwj-afk0p1blwiLFwib3BlbklkXCI6XCJvQWxjXzRfbDNCOFJiT0ROc3M2Sk5CU0Z0d1dzXCIsXCJwYXNzV29yZFwiOlwiZTEwYWRjMzk0OWJhNTlhYmJlNTZlMDU3ZjIwZjg4M2VcIixcInN0YXRlXCI6MX19IiwiaWF0IjoxNjUwNzEyNjk4LCJleHAiOjE2NTQzMTI2OTgsImp0aSI6IjU0NDlhNjRiLWIyZTctNDExNC04YzRiLWFkYjA3ZGM2MWFkNiJ9.daWMdZ-H1qOJqXKRVLNP-sXciFp8ThHYldOpMIHOcBmlqYdZfNTDPARQix0lGtKELlHS_cYoiMjVpfuRMk2AFw",
          },
          success: res => {
            resolve(res)
          },
          fail: err => {
            reject(err)
          },
        })
      })
      myReq
        .then(res => {
          console.log("当前收藏夹下的所有内容:", res)
          this.collects = res.data.data || []
        })
        .catch(err => {
          console.log("返回错误:", err)
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.single-fav-page {
  min-height: 100vh;
  background: #f1f5f9;
}

/* ====== 头部概览 ====== */
.fav-hero {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 40%, #a78bfa 100%);
  padding: 40rpx 32rpx 36rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin: 20rpx 24rpx;
  border-radius: 24rpx;
  box-shadow: 0 8rpx 28rpx rgba(99, 102, 241, 0.22);
}
.hero-icon {
  font-size: 52rpx;
  margin-bottom: 16rpx;
}
.hero-name {
  font-size: 36rpx;
  font-weight: 700;
  color: #fff;
  margin-bottom: 10rpx;
}
.hero-count {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
}

/* ====== 内容区 ====== */
.fav-content {
  padding: 0 24rpx 40rpx;
}
.section-header {
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
.section-title {
  font-size: 30rpx;
  font-weight: 700;
  color: #1e293b;
  padding-left: 20rpx;
  border-left: 6rpx solid #6366f1;
}

/* 内容卡片 */
.content-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.content-card {
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 18rpx;
  padding: 24rpx 24rpx 18rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(226, 232, 240, 0.5);
  cursor: pointer;
  transition: all 0.2s;
  &:active { transform: scale(0.985); }
}
.card-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 10rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.card-excerpt {
  font-size: 26rpx;
  color: #94a3b8;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 16rpx;
}
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 14rpx;
  border-top: 1px solid #f1f5f9;
}
.card-author {
  font-size: 24rpx;
  color: #64748b;
}
.card-arrow {
  font-size: 24rpx;
  color: #6366f1;
  font-weight: 600;
}

/* 空状态 */
.content-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80rpx 0;
  .empty-icon { font-size: 64rpx; margin-bottom: 20rpx; }
  .empty-text { font-size: 28rpx; color: #94a3b8; font-weight: 500; }
  .empty-hint { font-size: 22rpx; color: #cbd5e1; margin-top: 8rpx; }
}
</style>
