<template>
  <view class="home-page">
    <!-- #ifdef H5 -->
    <view class="web-home">
      <!-- 侧边分类栏 -->
      <view class="side-nav">
        <view 
          class="side-item" 
          v-for="(item, index) in tabList" 
          :key="index"
          :class="{ active: tabActiveIndex === index }"
          @click="switchTab({ index })"
        >
          {{ item.name }}
        </view>
      </view>

      <!-- 右侧主内容区 -->
      <view class="main-content">
        <!-- 顶部横幅/搜索 -->
        <view class="hero-section">
          <view class="hero-bg"></view>
          <view class="hero-inner">
            <view class="welcome-text">欢迎来到 Echo 学习社区</view>
            <view class="search-box-wrap">
              <u-search 
                placeholder="搜索感兴趣的内容..." 
                :showAction="false" 
                height="50"
                @click="gotoSearch"
              ></u-search>
            </view>
          </view>
        </view>

        <!-- 内容过滤器 -->
        <view class="filter-bar">
          <view 
            class="filter-item" 
            v-for="(item, index) in subTabList" 
            :key="index"
            :class="{ active: subActiveIndex === index }"
            @click="switchSubTab({ index, text: item })"
          >
            {{ item }}
          </view>
        </view>

        <!-- 列表区域 (网格化) -->
        <view class="content-grid">
          <!-- 这里根据 tabActiveIndex 展示不同的列表组件，并传入 Web 特有的样式 -->
          <article-list v-if="tabActiveIndex === 0" :articleList="contentObj.articleList.data" isWeb></article-list>
          <video-list v-if="tabActiveIndex === 1" :videoList="contentObj.videoList.data" isWeb></video-list>
          <file-list v-if="tabActiveIndex === 2" :fileList="contentObj.fileList.data" isWeb></file-list>
          
          <view class="web-loadmore">
            <u-loadmore :status="currentStatus" nomore-text="没有更多内容了" />
          </view>
        </view>
      </view>
    </view>
    <!-- #endif -->

    <!-- #ifndef H5 -->
    <view class="home">
      <!-- (保留原有的手机端模板) -->
      <view class="nav" :style="{ height: navHeight + 'px', paddingTop: statusBarHeight + 'px' }">
        <u-search placeholder="搜索文章" :showAction="false" :disabled="true" @click="gotoSearch"></u-search>
      </view>
      <!-- ... (原代码中 home 类的其余内容) ... -->
      <view class="tab" :style="{ top: navHeight + 'px' }">
        <u-tabs :scrollable="false" :list="tabList" lineWidth="30" lineHeight="5" :current="tabActiveIndex" lineColor="#f56c6c" @click="switchTab" ></u-tabs>
        <view class="sub-tab">
          <my-tag class="tag" v-for="(item, index) in subTabList" :key="index" :type="subActiveIndex === index ? 'error' : 'info'" size="small" @click="switchSubTab({ index, text: item })" > {{ item }} </my-tag>
        </view>
      </view>
      <swiper class="home-list" :style="{ height: `${swiperHeight}px`, marginTop: `${rpxToPx(160) + navHeight}px` }" :current="tabActiveIndex" @change="swiperChangeHandler" >
        <swiper-item class="home-list-item">
          <scroll-view scroll-y enable-flex id="content-container-1" @scrolltolower="getMoreArticle">
            <article-list :articleList="contentObj.articleList.data" ref="articleList"></article-list>
          </scroll-view>
        </swiper-item>
        <swiper-item class="home-list-item">
          <scroll-view scroll-y enable-flex id="content-container-2" @scrolltolower="getMoreVideo">
            <video-list :videoList="contentObj.videoList.data" ref="video"></video-list>
          </scroll-view>
        </swiper-item>
        <swiper-item class="home-list-item">
          <scroll-view scroll-y enable-flex id="content-container-3" @scrolltolower="getMoreFile">
            <file-list :fileList="contentObj.fileList.data" ref="file"></file-list>
          </scroll-view>
        </swiper-item>
      </swiper>
      <view class="go-write" v-if="showWrite" @click="gotoWrite"> <view class="t-icon t-icon-bianji"></view> </view>
    </view>
    <!-- #endif -->

    <u-loading-page :loading="loading"></u-loading-page>
  </view>
</template>

<script>
import { systemInfo } from "@/mixin.js"
export default {
  mixins: [systemInfo],
  data: () => ({
    tabList: [{ name: "文章" }, { name: "视频" }, { name: "资源" }],
    subTabList: ["最热", "最新"],
    unRecommendHot: false,
    tabActiveIndex: 0,
    subActiveIndex: 0,
    contentObj: {
      articleList: { data: [], status: "loadmore", totalPages: 0, paramsData: { currentPage: 1, pageSize: 12 }, noMore: false },
      videoList: { data: [], status: "loadmore", totalPages: 0, paramsData: { currentPage: 1, pageSize: 12 }, noMore: false },
      fileList: { data: [], status: "loadmore", totalPages: 0, paramsData: { currentPage: 1, pageSize: 12 }, noMore: false },
    },
    loading: true,
    showWrite: true,
  }),

  computed: {
    swiperHeight() {
      return this.windowHeight - (this.rpxToPx(160) + this.navHeight)
    },
    currentStatus() {
      if (this.tabActiveIndex === 0) return this.contentObj.articleList.status
      if (this.tabActiveIndex === 1) return this.contentObj.videoList.status
      return this.contentObj.fileList.status
    }
  },

  methods: {
    switchTab({ index }) {
      this.tabActiveIndex = index
      // H5 下手动触发加载
      /* #ifdef H5 */
      this.loadDataIfNeeded()
      /* #endif */
    },
    loadDataIfNeeded() {
      if (this.tabActiveIndex === 0 && this.contentObj.articleList.data.length === 0) this.getArticleList(this.unRecommendHot)
      else if (this.tabActiveIndex === 1 && this.contentObj.videoList.data.length === 0) this.getVideoList()
      else if (this.tabActiveIndex === 2 && this.contentObj.fileList.data.length === 0) this.getFileList()
    },
    swiperChangeHandler({ detail }) {
      this.tabActiveIndex = detail.current
      this.loadDataIfNeeded()
    },
    switchSubTab(item) {
      this.subActiveIndex = item.index
      this.unRecommendHot = item.text === "最热" ? false : true
      // 重置并请求
      const key = this.tabActiveIndex === 0 ? 'articleList' : (this.tabActiveIndex === 1 ? 'videoList' : 'fileList')
      this.contentObj[key].data = []
      this.contentObj[key].paramsData.currentPage = 1
      this.loadDataIfNeeded()
    },
    async getArticleList(flag) {
      this.loading = true
      try {
        const { data: res } = await uni.request({
          url: "/index/get/all/essays/recommend",
          data: { currentPage: this.contentObj.articleList.paramsData.currentPage, pageSize: this.contentObj.articleList.paramsData.pageSize, flag: flag.toString() },
        })
        if (res.status == 200) {
          this.contentObj.articleList.data = res.data.list
          this.contentObj.articleList.totalPages = res.data.pages
        }
      } finally { this.loading = false }
    },
    async getVideoList() {
      this.loading = true
      try {
        const { data: res } = await uni.request({
          url: "/index/get/all/video",
          data: { currentPage: this.contentObj.videoList.paramsData.currentPage, pageSize: this.contentObj.videoList.paramsData.pageSize },
        })
        if (res.status == 200) {
          this.contentObj.videoList.data = res.data.list
          this.contentObj.videoList.totalPages = res.data.pages
        }
      } finally { this.loading = false }
    },
    async getFileList() {
      this.loading = true
      try {
        const { data: res } = await uni.request({
          url: "/index/get/all/resource",
          data: { currentPage: this.contentObj.fileList.paramsData.currentPage, pageSize: this.contentObj.fileList.paramsData.pageSize },
        })
        if (res.status == 200) {
          this.contentObj.fileList.data = res.data.list
          this.contentObj.fileList.totalPages = res.data.pages
        }
      } finally { this.loading = false }
    },
    gotoWrite() { uni.navigateTo({ url: "/subPackages/index/write/write" }) },
    gotoSearch() { uni.navigateTo({ url: "/subPackages/index/historySearch/historySearch" }) },
    getMoreArticle() { /* ... */ },
    getMoreVideo() { /* ... */ },
    getMoreFile() { /* ... */ },
  },
  onLoad() {
    this.getArticleList(this.unRecommendHot)
  },
}
</script>

<style lang="scss" scoped>
/* #ifdef H5 */
.web-home {
  display: flex;
  min-height: calc(100vh - 60px);
  background-color: #f8fafc;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  
  .side-nav {
    width: 200px;
    background: #fff;
    border-right: 1px solid #f1f5f9;
    padding: 20px 0;
    position: sticky;
    top: 60px;
    height: calc(100vh - 60px);
    
    .side-item {
      padding: 15px 30px;
      font-size: 16px;
      color: #64748b;
      cursor: pointer;
      transition: all 0.2s;
      border-right: 3px solid transparent;
      
      &:hover { background: #f8fafc; color: #17ead9; }
      &.active {
        color: #17ead9;
        background: #f0fdfa;
        border-right-color: #17ead9;
        font-weight: 600;
      }
    }
  }
  
  .main-content {
    flex: 1;
    padding: 30px;
    
    .hero-section {
      height: 200px;
      border-radius: 16px;
      background: linear-gradient(135deg, #17ead9 0%, #6078ea 100%);
      margin-bottom: 30px;
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      
      .hero-inner {
        position: relative;
        z-index: 2;
        text-align: center;
        .welcome-text {
          font-size: 24px;
          color: #fff;
          font-weight: 700;
          margin-bottom: 20px;
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .search-box-wrap {
          width: 500px;
          ::v-deep .u-search {
            background: rgba(255,255,255,0.9) !important;
            border-radius: 12px !important;
          }
        }
      }
    }
    
    .filter-bar {
      display: flex;
      margin-bottom: 24px;
      .filter-item {
        margin-right: 24px;
        font-size: 15px;
        color: #94a3b8;
        cursor: pointer;
        padding-bottom: 8px;
        border-bottom: 2px solid transparent;
        &.active {
          color: #1e293b;
          font-weight: 600;
          border-bottom-color: #17ead9;
        }
      }
    }
    
    .content-grid {
      ::v-deep .article-list-container,
      ::v-deep .video-list-container,
      ::v-deep .file-list-container {
        display: grid !important;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)) !important;
        gap: 24px !important;
      }
      
      .web-loadmore { margin-top: 40px; padding-bottom: 40px; }
    }
  }
}
/* #endif */

/* #ifndef H5 */
$tab: 160rpx;
.home {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: $uni-bg-color-grey;
  box-sizing: border-box;
}
.nav {
  width: 100%;
  box-sizing: border-box;
  position: fixed;
  z-index: 99;
  background-color: #fff;
  padding-left: 40rpx;
  padding-right: 40rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}
.tab {
  background-color: #ffffff;
  height: $tab;
  position: fixed;
  z-index: 99;
  width: 100%;
  .sub-tab {
    padding-left: 30rpx;
    margin-top: 20rpx;
    display: flex;
    .tag { margin-right: 20rpx; }
  }
}
.home-list {
  overflow: auto;
  scroll-view {
    height: 100%;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    .more { height: 60rpx; display: flex; align-items: center; }
  }
}
.go-write {
  position: fixed;
  width: 100rpx;
  height: 100rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fcbd71;
  box-shadow: 0 0 20rpx #fcbd71;
  border-radius: 50%;
  right: 10%;
  bottom: 10%;
  .t-icon { width: 60rpx; height: 60rpx; }
}
/* #endif */
</style>
