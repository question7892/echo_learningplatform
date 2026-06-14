<template>
  <view class="video" :class="{ 'web-grid': isWeb }">
    <view class="video-list" :class="{ 'grid-wrapper': isWeb }" v-if="videoList.length">
      <view class="video-list-item" v-for="item in videoList" :key="item.uuid" :class="{ 'web-card': isWeb }">
        
        <!-- 视频容器 -->
        <view class="video-wrapper">
            <video
              class="video-list-item-main"
              muted
              loop
              controls
              :id="`myVideo${item.uuid}`"
              :autoplay="false"
              :show-center-play-btn="true"
              :show-mute-btn="true"
              enable-play-gesture
              object-fit="cover"
              :poster="item.poster"
              :src="item.videoUrl"
            ></video>
            <view class="video-overlay" v-if="isWeb">
                <u-icon name="play-circle" size="48" color="rgba(255,255,255,0.8)"></u-icon>
            </view>
        </view>

        <view class="card-info-wrap">
            <view class="video-list-item-content u-line-2">{{ item.title }}</view>

            <!-- 头部 -->
            <view class="video-list-item-header">
              <u-avatar :src="item.avatar" size="30"></u-avatar>
              <view class="info">
                <view class="info-name">{{ item.userName }}</view>
                <view class="info-date" v-if="!isWeb">{{ $u.timeFrom(Date.parse(item.create_time), false) }}</view>
              </view>
              <view class="web-category" v-if="isWeb">
                  <my-tag size="mini" type="success" :circle="false">{{ item.category }}</my-tag>
              </view>
            </view>

            <!-- footer -->
            <view class="video-list-item-footer" v-if="!isWeb">
              <view class="visit">
                <u-avatar-group :urls="avatarList" :size="rpxToPx(50)" gap="0.4"></u-avatar-group>
                <view class="visit-placeholder">等13人看过</view>
              </view>
              <view class="category_tip">
                分类：<my-tag size="mini" type="success" :circle="false">{{ item.category }}</my-tag>
              </view>
            </view>
        </view>
      </view>
    </view>
    <u-empty v-else class="empty" icon="http://cdn.uviewui.com/uview/empty/data.png" text="视频列表为空"></u-empty>
  </view>
</template>

<script>
export default {
  props: {
    videoList: { type: Array, required: true },
    isWeb: { type: Boolean, default: false }
  },
  data: () => ({
    videoContextList: [],
    avatarList: [
      "https://cdn.uviewui.com/uview/album/1.jpg", "https://cdn.uviewui.com/uview/album/2.jpg", "https://cdn.uviewui.com/uview/album/3.jpg"
    ],
  }),
  methods: {
    createVideoContextList() {
      this.videoList.forEach(item => {
        const videoContext = uni.createVideoContext(`myVideo${item.uuid}`, this)
        this.videoContextList.push(videoContext)
      })
    },
    firstPlay() {
      if (this.videoContextList.length && !this.isWeb) {
        this.videoContextList[0].play()
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.video { box-sizing: border-box; }

/* Web Grid Styles */
.web-grid {
  padding: 0 !important;
  .grid-wrapper {
    display: grid !important;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 24px;
    
    .web-card {
      margin-bottom: 0 !important;
      background: #fff;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid #f1f5f9;
      transition: all 0.3s;
      
      &:hover { transform: translateY(-5px); box-shadow: 0 12px 24px rgba(0,0,0,0.08); }
      
      .video-wrapper {
          position: relative;
          height: 180px;
          .video-list-item-main { height: 100% !important; border-radius: 0 !important; }
          .video-overlay {
              position: absolute; top: 0; left: 0; width: 100%; height: 100%;
              background: rgba(0,0,0,0.2); display: flex; align-items: center; justify-content: center;
              opacity: 0; transition: opacity 0.3s; pointer-events: none;
          }
          &:hover .video-overlay { opacity: 1; }
      }
      
      .card-info-wrap { padding: 15px; }
      .video-list-item-content { font-size: 15px !important; font-weight: 600; color: #1e293b; margin: 0 0 15px 0 !important; height: 44px; }
      
      .video-list-item-header {
          height: auto !important;
          .info-name { font-size: 13px !important; color: #64748b; }
          .web-category { margin-left: auto; }
      }
    }
  }
}

/* Original Mobile Styles */
.video-list {
  display: flex; flex-direction: column;
  &-item {
    padding: 20rpx; padding-bottom: 0; display: flex; flex-direction: column; margin-bottom: 40rpx; background-color: #fff; border-radius: 30rpx;
    &-header {
      display: flex; align-items: center; height: 90rpx;
      .info { display: flex; justify-content: space-around; flex-direction: column; margin-left: 20rpx;
        &-name { color: $uni-color-title; font-weight: bold; font-size: 32rpx; }
        &-date { color: $uni-text-color-disable; font-size: 28rpx; }
      }
    }
    &-content { margin: 20rpx 0; color: $uni-color-paragraph; font-size: 32rpx; }
    &-main { width: 100%; height: 400rpx; border: none; border-radius: 20rpx; }
    &-footer {
      display: flex; justify-content: space-between; align-items: center; min-height: 100rpx;
      .visit { display: flex; align-items: center; &-placeholder { margin-left: 10rpx; color: $uni-text-color-placeholder; font-size: 28rpx; } }
      .category_tip { font-size: 28rpx; color: $uni-text-color-placeholder; margin-right: 10rpx; }
    }
  }
}
</style>

