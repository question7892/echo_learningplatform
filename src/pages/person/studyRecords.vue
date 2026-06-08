<template>
  <view :class="{ 'web-records': isWeb }">
    <view class="container" :class="{ 'web-container': isWeb }">
      <!-- 容器上方的标题 -->
      <text v-if="!isWeb" class="container-tittle">学习时间</text>
      <!-- 容器中即为当天的学习时间和一周的学习总时长 -->
      <view class="container-learningTime">
        <view class="container-daylea">
          <text class="container-todTime">{{ todayLearningTime }}</text>
          <text class="label" v-if="isWeb">今日学习时长</text>
        </view>
        <view class="container-weklea">
          <text class="container-weekTime">{{ oneWeekLearningTime }}</text>
          <text class="label" v-if="isWeb">本周学习时长</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    isWeb: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      todayLearningTime: '20分钟',
      oneWeekLearningTime: '20小时',
    }
  },
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
      
      .container-daylea, .container-weklea {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
      }
      
      .container-todTime, .container-weekTime {
        font-size: 24px;
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

    .container-daylea,
    .container-weklea {
      padding: 20rpx;
      display: flex;
      flex-direction: column;
      flex: 1;
      font-size: 40rpx;
      text-align: center;
    }

    .container-daylea {
      .container-todTime::after {
        /* #ifndef H5 */
        content: "今日学习时长";
        font-size: 35rpx;
        display: block;
        color: grey;
        /* #endif */
      }
    }

    .container-weklea {
      .container-weekTime::after {
        /* #ifndef H5 */
        content: "本周学习时长";
        font-size: 35rpx;
        display: block;
        color: grey;
        /* #endif */
      }
    }
  }
}
</style>
