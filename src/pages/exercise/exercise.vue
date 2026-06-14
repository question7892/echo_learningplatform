<template>
  <view class="exercise-page">
    <!-- #ifdef H5 -->
    <view class="web-exercise">
      <view class="web-container">
        <!-- 顶部难度选择卡片 -->
        <view class="difficulty-grid">
          <view class="diff-card basic" @click="gotoCateDetail('algo')">
            <view class="card-info">
              <view class="card-title">基础题库</view>
              <view class="card-desc">掌握核心基础，打好编程地基</view>
            </view>
            <view class="t-icon t-icon-algo"></view>
          </view>
          <view class="diff-card advance" @click="gotoCateDetail('advance')">
            <view class="card-info">
              <view class="card-title">进阶挑战</view>
              <view class="card-desc">攻克复杂逻辑，提升实战能力</view>
            </view>
            <view class="t-icon t-icon-advance"></view>
          </view>
          <view class="diff-card race" @click="gotoCateDetail('race')">
            <view class="card-info">
              <view class="card-title">巅峰赛场</view>
              <view class="card-desc">挑战高难算法，成就技术巅峰</view>
            </view>
            <view class="t-icon t-icon-race"></view>
          </view>
        </view>

        <!-- 主内容区 -->
        <view class="web-main">
          <!-- 侧边过滤器 -->
          <view class="web-side">
            <view class="side-title">题库分类</view>
            <view 
              class="side-nav-item" 
              v-for="(item, index) in tagList" 
              :key="index"
              :class="{ active: activeTabIndex === index }"
              @click="switchTab({ index, name: item })"
            >
              {{ item }}
            </view>
          </view>

          <!-- 题目列表 -->
          <view class="web-content">
            <view class="list-header">
              <view class="result-count">共计 {{ questionList.length }} 道题目</view>
              <view class="web-search">
                <u-search placeholder="搜索题目..." :showAction="false"></u-search>
              </view>
            </view>
            
            <view class="list-grid">
              <question-list :questionList="questionList" isWeb></question-list>
            </view>
            
            <view class="web-loadmore">
              <u-loadmore :status="status" nomore-text="已经到底啦" />
            </view>
          </view>
        </view>
      </view>
    </view>
    <!-- #endif -->

    <!-- #ifndef H5 -->
    <view class="exercise">
      <view class="exercise-module">
        <view class="exercise-module-lf" @click="gotoCateDetail('algo')">
          <view class="title">基础题库</view>
          <view class="t-icon t-icon-algo"></view>
        </view>
        <view class="exercise-module-rg">
          <view class="rg-top" @click="gotoCateDetail('advance')">
            <view class="title">进阶</view>
            <view class="t-icon t-icon-advance"></view>
          </view>
          <view class="rg-bottom" @click="gotoCateDetail('race')">
            <view class="title">困难</view>
            <view class="t-icon t-icon-race"></view>
          </view>
        </view>
      </view>
      <view class="exercise-tab">
        <view class="search"> <u-search placeholder="搜索题目" :showAction="false"></u-search> </view>
        <view class="tag-group">
          <my-tag class="tag" size="small" :type="activeTabIndex === index ? 'primary' : 'info'" v-for="(item, index) in tagList" :key="index" @click="switchTab({ index, name: item })" > {{ item }} </my-tag>
        </view>
      </view>
      <scroll-view :style="{ height: `${windowHeight - rpxToPx(520)}px` }" scroll-y enable-flex id="mobile-scroll" @scrolltolower="onLower">
        <question-list :questionList="questionList" ref="questionList"></question-list>
        <u-loadmore :status="status" />
      </scroll-view>
    </view>
    <!-- #endif -->
    <u-toast ref="uToast"></u-toast>
  </view>
</template>

<script>
import { systemInfo } from "@/mixin.js"
export default {
  mixins: [systemInfo],
  data: () => ({
    tagList: ["推荐", "最热", "最新"],
    activeTabIndex: 0,
    questionList: [],
    status: "loadmore",
    totalPages: 0,
    paramsData: { currentPage: 1, pageSize: 12 },
  }),
  methods: {
    switchTab(item) { this.activeTabIndex = item.index },
    gotoCateDetail(key) { uni.navigateTo({ url: "/subPackages/exercise/questionCateDetail/questionCateDetail?key=" + key }) },
    async getQuestionGroupList() {
      try {
        const { data: res } = await uni.request({
          url: "/question/get/set/information",
          method: "GET",
          data: { currentPage: this.paramsData.currentPage, pageSize: this.paramsData.pageSize },
        })
        if (res.status === "200") {
          this.questionList = res.data.list
          this.totalPages = res.data.pages
        }
      } finally {}
    },
    onLower() { /* ... */ }
  },
  onLoad() { this.getQuestionGroupList() },
}
</script>

<style lang="scss" scoped>
* { box-sizing: border-box; }

/* #ifdef H5 */
.web-exercise {
  background-color: #f8fafc;
  min-height: calc(100vh - 60px);
  padding: 40px 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;

  .web-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .difficulty-grid {
    display: grid;
    grid-template-columns: 1.5fr 1fr 1fr;
    gap: 24px;
    margin-bottom: 40px;

    .diff-card {
      height: 180px;
      border-radius: 20px;
      padding: 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      color: #fff;
      position: relative;
      overflow: hidden;

      &::after {
        content: '';
        position: absolute;
        top: -50%;
        right: -30%;
        width: 200px;
        height: 200px;
        background: rgba(255,255,255,0.08);
        border-radius: 50%;
      }

      &:hover { transform: translateY(-5px); box-shadow: 0 15px 30px rgba(0,0,0,0.12); }

      .card-title { font-size: 20px; font-weight: 700; margin-bottom: 10px; position: relative; z-index: 1; }
      .card-desc { font-size: 14px; opacity: 0.9; position: relative; z-index: 1; }

      .t-icon { width: 80px; height: 80px; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2)); position: relative; z-index: 1; }

      &.basic { background: linear-gradient(135deg, #00c6fb 0%, #005bea 100%); }
      &.advance { background: linear-gradient(135deg, #43e97b 0%, #16a34a 100%); }
      &.race { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }
    }
  }

  .web-main {
    display: flex;
    gap: 30px;

    .web-side {
      width: 240px;
      background: #fff;
      border-radius: 16px;
      padding: 24px;
      position: sticky;
      top: 80px;
      align-self: flex-start;
      box-shadow: 0 4px 12px rgba(0,0,0,0.02);

      .side-title { font-size: 18px; font-weight: 700; color: #1e293b; margin-bottom: 20px; }
      .side-nav-item {
        padding: 12px 20px;
        font-size: 14px;
        border-radius: 8px;
        margin-bottom: 8px;
        color: #64748b;
        cursor: pointer;
        transition: all 0.2s;
        &.active { background: #f0fdfa; color: #17ead9; font-weight: 600; }
        &:hover:not(.active) { background: #f8fafc; color: #1e293b; }
      }
    }

    .web-content {
      flex: 1;
      .list-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
        .result-count { color: #94a3b8; font-size: 14px; }
        .web-search {
          width: 220px;
          ::v-deep .u-search__content {
            height: 34px !important;
          }
          ::v-deep .uni-input-input {
            font-size: 13px !important;
          }
        }
      }
      .web-loadmore { margin-top: 40px; padding-bottom: 60px; }
    }
  }
}
/* #endif */

/* #ifndef H5 */
$module: 400rpx;
$tab: 100rpx;

.exercise {
  height: 100vh;
  background: #f0f2f5;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;

  .exercise-module {
    display: flex;
    justify-content: space-between;
    height: $module;
    padding: 24rpx;
    background: transparent;

    &-lf {
      flex: 3;
      margin-right: 24rpx;
      border-radius: 24rpx;
      padding: 32rpx 24rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 20rpx;
      background: linear-gradient(135deg, #00c6fb 0%, #005bea 100%);
      box-shadow: 0 8rpx 24rpx rgba(0,91,234,0.25);
      .title {
        color: #fff;
        font-weight: 800;
        font-size: 40rpx;
        letter-spacing: 4rpx;
        text-shadow: 0 2rpx 8rpx rgba(0,0,0,0.15);
      }
      .t-icon-algo { width: 130rpx; height: 130rpx; filter: drop-shadow(0 4rpx 12rpx rgba(0,0,0,0.2)); }
    }

    &-rg {
      flex: 4;
      display: flex;
      flex-direction: column;
      gap: 24rpx;

      .rg-top, .rg-bottom {
        flex: 1;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 24rpx 36rpx;
        border-radius: 24rpx;
        box-shadow: 0 6rpx 20rpx rgba(0,0,0,0.1);
      }
      .title {
        color: #fff;
        font-weight: 800;
        font-size: 36rpx;
        letter-spacing: 4rpx;
        text-shadow: 0 2rpx 6rpx rgba(0,0,0,0.12);
      }
      .rg-top {
        background: linear-gradient(135deg, #43e97b 0%, #16a34a 100%);
        .t-icon-advance { width: 90rpx; height: 90rpx; filter: drop-shadow(0 4rpx 12rpx rgba(0,0,0,0.2)); }
      }
      .rg-bottom {
        background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
        .t-icon-race { width: 110rpx; height: 110rpx; filter: drop-shadow(0 4rpx 12rpx rgba(0,0,0,0.2)); }
      }
    }
  }

  .exercise-tab {
    height: $tab;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    padding: 0 24rpx;
    margin-top: 20rpx;
    border-radius: 20rpx 20rpx 0 0;
    .search {
      width: 42%;
      ::v-deep .u-search__content {
        height: 56rpx !important;
      }
      ::v-deep .uni-input-input {
        font-size: 24rpx !important;
      }
    }
    .tag-group {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 12rpx;
    }
  }
}
/* #endif */
</style>

