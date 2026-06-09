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
                <u-search placeholder="搜索感兴趣的题目..." :showAction="false"></u-search>
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
/* #ifdef H5 */
.web-exercise {
  background-color: #f8fafc;
  min-height: calc(100vh - 60px);
  padding: 40px 0;
  
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
      
      &:hover { transform: translateY(-5px); box-shadow: 0 15px 30px rgba(0,0,0,0.1); }
      
      .card-title { font-size: 18px; font-weight: 700; margin-bottom: 10px; }
      .card-desc { font-size: 14px; opacity: 0.9; }
      
      .t-icon { width: 80px; height: 80px; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2)); }
      
      &.basic { background: linear-gradient(135deg, #00c6fb 0%, #005bea 100%); }
      &.advance { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
      &.race { background: linear-gradient(135deg, #fee140 0%, #fa709a 100%); }
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
        .web-search { width: 300px; }
      }
      .web-loadmore { margin-top: 40px; padding-bottom: 60px; }
    }
  }
}
/* #endif */

/* #ifndef H5 */
$module: 400rpx; $tab: 100rpx;
.exercise {
  height: 100vh; background-color: $uni-bg-color-grey; box-sizing: border-box;
  .exercise-module {
    display: flex; justify-content: space-between; height: $module; background-color: #fff; padding: 30rpx; box-sizing: border-box;
    &-lf {
      flex: 3; background-image: linear-gradient(to top, #00c6fb 0%, #005bea 100%); margin-right: 40rpx; border-radius: 20rpx; padding: 20rpx; display: flex; flex-direction: column; align-items: center; justify-content: space-around;
      .title { color: #fff; font-weight: bold; letter-spacing: 6rpx; font-size: 45rpx; }
      .t-icon-algo { width: 140rpx; height: 140rpx; }
    }
    &-rg {
      flex: 4; display: flex; flex-direction: column;
      .rg-top, .rg-bottom { flex: 1; display: flex; justify-content: space-around; align-items: center; padding: 20rpx 40rpx; border-radius: 20rpx; }
      .title { color: #fff; width: 40%; letter-spacing: 6rpx; font-weight: bold; font-size: 40rpx; }
      .rg-top { background-image: linear-gradient(to right, #43e97b 0%, #38f9d7 100%); margin-bottom: 20rpx; .t-icon-advance { width: 100rpx; height: 100rpx; } }
      .rg-bottom { background-image: linear-gradient(to right, #fee140 0%, #fa709a 100%); .t-icon-race { width: 120rpx; height: 120rpx; } }
    }
  }
  .exercise-tab {
    height: $tab; display: flex; justify-content: space-between; align-items: center; box-sizing: border-box; background-color: #fff; border-bottom: 2rpx solid #f3f4f6; padding: 0 20rpx; margin-top: 20rpx;
    .search { width: 45%; }
    .tag-group { display: flex; justify-content: flex-end; align-items: center; .tag { margin-right: 20rpx; } }
  }
}
/* #endif */
</style>

