<template>
  <view class="question-container" :class="{ 'web-grid': isWeb }">
    <view class="question-list" :class="{ 'grid-wrapper': isWeb }" v-if="questionList.length">
      <view class="question-list-item" v-for="item in questionList" :key="item.id" @click.stop="gotoDetail(item.id)" :class="{ 'web-card': isWeb }">
        <view class="question-list-item-desc">
          <view class="title u-line-1">{{ item.title }}</view>

          <view class="info">
            <view class="level">
              <my-tag class="tag" :type="levelColor(item.level)" :circle="false" size="mini">{{ item.level }}</my-tag>
              <my-tag class="tag" type="info" size="mini" v-for="tag in item.tagList" :key="tag.tagId">{{ tag.tag }}</my-tag>
            </view>

            <view class="pass">
              <text class="pass-text">正确率：</text>
              <text class="pass-rate">{{ item.passRate + "%" }}</text>
            </view>
          </view>
        </view>

        <u-icon v-if="!isWeb" name="arrow-right" size="20" color="#999"></u-icon>
        <view v-else class="web-enter">进入练习</view>
      </view>
    </view>
    <view v-else class="empty">
      <u-empty class="empty" icon="http://cdn.uviewui.com/uview/empty/data.png" text="这里什么也没有"></u-empty>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    questionList: { type: Array, required: true },
    isWeb: { type: Boolean, default: false }
  },
  methods: {
    levelColor(level) {
      if (level === "简单") return "success";
      if (level === "中等") return "warning";
      if (level === "困难") return "error";
      return "info";
    },
    gotoDetail(id) { uni.navigateTo({ url: "/subPackages/exercise/questionDetail/questionDetail?id=" + id }) },
  }
}
</script>

<style lang="scss" scoped>
.question-container { display: flex; flex-direction: column; }

/* Web Grid Styles */
.web-grid {
  .grid-wrapper {
    display: grid !important;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 20px;
    padding: 0 !important;
    
    .web-card {
      margin: 0 !important;
      padding: 24px !important;
      border: 1px solid #f1f5f9;
      transition: all 0.3s;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      
      &:hover { border-color: #17ead9; box-shadow: 0 8px 16px rgba(0,0,0,0.04); transform: translateY(-3px); }
      
      .title { font-size: 18px !important; color: #1e293b; margin-bottom: 20px !important; }
      
      .info { margin-top: auto; }
      
      .web-enter {
          margin-top: 20px; text-align: center; padding: 8px;
          background: #f8fafc; border-radius: 8px; font-size: 13px; color: #17ead9;
          font-weight: 600; transition: all 0.2s;
      }
      &:hover .web-enter { background: #17ead9; color: #fff; }
    }
  }
}

/* Original Mobile Styles */
.question-list {
  width: 100%; box-sizing: border-box;
  &-item {
    box-sizing: border-box; margin: 0 20rpx 20rpx; padding: 20rpx 30rpx; background-color: #fff; border-radius: 12rpx;
    display: flex; justify-content: space-between; align-items: center;
    &-desc {
      flex: 1; display: flex; flex-direction: column; margin-right: 40rpx;
      .title { font-weight: 600; font-size: 36rpx; margin-bottom: 20rpx; }
      .info { display: flex; font-size: 24rpx; align-items: center; color: $uni-text-color-placeholder; width: 100%;
        .level { .tag { margin-right: 20rpx; } }
        .pass { margin-left: auto; &-rate { color: $uni-color-success; } }
      }
    }
  }
}
</style>
