<template>
  <view :class="{ 'web-records': isWeb }">
    <view class="container" :class="{ 'web-container': isWeb }">
      <!-- 容器上方的标题 -->
      <text v-if="!isWeb" class="container-tittle">学习时间</text>
      <!-- 最近2小时学习时长 -->
      <view class="container-learningTime">
        <view class="container-daylea">
          <text class="container-todTime">{{ displayRecentTime }}</text>
          <text class="label" v-if="isWeb">最近学习</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { systemInfo } from "@/mixin.js"
export default {
  props: {
    isWeb: {
      type: Boolean,
      default: false
    }
  },
  mixins: [systemInfo],
}
</script>

<style lang="scss" scoped>
/* Web 端的样式 */
.web-records {
  padding: 0 !important;
  .web-container {
    margin: 0 !important;
    background: transparent !important;
    .container-learningTime {
      background: linear-gradient(135deg, #f0fdfa 0%, #e0f2fe 100%);
      border-radius: 12px;
      padding: 20px;
      display: flex;
      flex-direction: row;

      .container-daylea {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
      }

      .container-todTime {
        font-size: 20px;
        font-weight: 700;
        color: #1e293b;
      }

      .label {
        font-size: 13px;
        color: #64748b;
        margin-top: 5px;
      }
    }
  }
}

/* 原始移动端的样式 */
.container {
  margin: 25rpx;
  border-radius: 15rpx;
  display: flex;
  flex-direction: column;
  background-image: linear-gradient(to right, #d4e0f7, #d9edf7, #eaf2ff, #d4e0f7);

  .container-tittle {
    padding-left: 20rpx;
    padding-bottom: 10rpx;
    margin-top: 20rpx;
    font-size: 35rpx;
    float: left;
    border-bottom: 1rpx solid white;
  }

  .container-learningTime {
    display: flex;
    flex-direction: row;

    .container-daylea {
      padding: 20rpx;
      display: flex;
      flex-direction: column;
      flex: 1;
      font-size: 40rpx;
      text-align: center;

      .container-todTime::after {
        /* #ifndef H5 */
        content: "最近学习";
        font-size: 35rpx;
        display: block;
        color: grey;
        /* #endif */
      }
    }
  }
}
</style>
