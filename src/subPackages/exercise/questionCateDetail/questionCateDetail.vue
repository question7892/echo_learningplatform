<template>
  <view class="question-cate-detail" :class="{ 'web-layout': isWeb }">
    <!-- 页面头部 -->
    <view class="cate-header" :style="{ paddingTop: navHeight + 'px', backgroundImage: categoryConfig.bgColor }">
      <!-- 描述 -->
      <view class="cate-header-desc">
        <view class="t-icon" :class="[categoryConfig.icon]"></view>
        <view class="cate-header-desc-rg">
          <view class="title">{{ categoryConfig.headLine }}</view>
          <view class="desc-text">{{ categoryConfig.desc }}</view>
        </view>
      </view>

      <!-- 头部白框 -->
      <view class="cate-header-bar">
        <text class="bar-title">题组列表</text>
        <view class="bar-search">
          <u-search placeholder="搜索题目" :showAction="false" clearabled></u-search>
        </view>
      </view>
    </view>

    <!-- 主体 -->
    <view class="cate-main">
      <question-list :questionList="questionList" ref="questionList"></question-list>
      <u-loadmore :status="status" loadingText="一大波题目正在赶来" nomoreText="~没有更多了~" />
    </view>
  </view>
</template>

<script>
import { systemInfo } from "@/mixin.js"
import { questionList } from "@/mock/questionList.js"
import categories from "./categories.js"
export default {
  props: {
    isWeb: { type: Boolean, default: false }
  },
  components: {},
  mixins: [systemInfo],
  data: () => ({
    key: "race",
    categoryConfig: null,
    questionList: questionList,
    status: "loadmore",

    totalPages: 5,
    paramData: {
      currentPage: 1,
      pageSize: 8,
    },
  }),
  computed: {},
  methods: {
    pageInit(key) {
      this.key = key
      this.categoryConfig = categories[this.key]
    },

    // 获取题组列表
    async getQuestionGroupList() {
      uni.showLoading()
      const { data: res } = await uni.request({
        url: "/question/get/set/information",
        method: "GET",
        data: { level: this.categoryConfig.level, currentPage: this.paramData.currentPage, pageSize: this.paramData.pageSize },
      })
      // console.log(res)
      if (res.status !== "200") return uni.$u.toast("获取题组列表失败")
      this.questionList = res.data.list
      this.totalPages = res.data.pages
      uni.hideLoading()
    },

    // 加载更多
    async loadMore() {
      // 节流
      if (this.status === "loading" || this.status === "nomore") return

      // 获取数组
      this.paramData.currentPage++
      try {
        const { data: res } = await uni.request({
          url: "/question/get/set/information",
          method: "GET",
          data: { level: this.categoryConfig.level, currentPage: this.paramData.currentPage, pageSize: this.paramData.pageSize },
        })
        // console.log(res)
        if (res.status !== "200") return uni.$u.toast("下拉加载失败")

        this.questionList = [...this.questionList, ...res.data.list]

        // 判断是否还有数据
        if (this.paramData.currentPage >= this.totalPages) return (this.status = "nomore")
        this.status = "loadmore"
      } catch (err) {
        console.error(err)
        uni.$u.toast("请求异常")
        this.status = "loadmore"
      }
    },
  },
  watch: {},

  onLoad(options) {
    this.pageInit(options.key)
    this.getQuestionGroupList()
  },

  // 监听下拉触底
  onReachBottom() {
    this.loadMore()
    // 节流
    // if (this.status === "loading" || this.status === "nomore") return

    // this.status = "loading"
    // setTimeout(() => {
    //   this.status = "nomore"
    // }, 2000)
  },
}
</script>

<style lang="scss" scoped>
* { box-sizing: border-box; }

$header: 480rpx;
$bar: 100rpx;

.question-cate-detail {
  min-height: 100vh;
  background: #f0f2f5;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

.cate-header {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.cate-header-desc {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 40rpx 32rpx;
  height: calc($header - $bar);
  .t-icon { margin-right: 32rpx; flex-shrink: 0; }
  .t-icon-race  { width: 180rpx; height: 180rpx; }
  .t-icon-algo   { width: 160rpx; height: 160rpx; }
  .t-icon-advance { width: 140rpx; height: 140rpx; }
}

.cate-header-desc-rg {
  flex: 1;
  display: flex;
  flex-direction: column;
  .title {
    font-size: 44rpx;
    font-weight: 800;
    color: #fff;
    letter-spacing: 6rpx;
    margin-bottom: 16rpx;
    text-shadow: 0 2rpx 8rpx rgba(0,0,0,0.15);
  }
  .desc-text {
    font-size: 26rpx;
    color: rgba(255,255,255,0.9);
    line-height: 1.5;
  }
}

.cate-header-bar {
  height: $bar;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32rpx;
  background: #fff;
  border-radius: 32rpx 32rpx 0 0;
  .bar-title {
    font-size: 34rpx;
    font-weight: 700;
    color: #1e293b;
  }
  .bar-search {
    width: 35%;
    ::v-deep .u-search__content {
      height: 52rpx !important;
    }
    ::v-deep .uni-input-input {
      font-size: 24rpx !important;
    }
  }
}

.cate-main {
  padding-top: $header;
  padding-left: 20rpx;
  padding-right: 20rpx;
}

/* ====== Web 端适配 ====== */
.web-layout {
  .cate-header {
    position: relative;
    max-width: 800px;
    margin: 0 auto;
    border-radius: 20px 20px 0 0;
    overflow: hidden;
  }
  .cate-header-desc {
    padding: 48px 40px;
    height: auto;
    min-height: 200px;
    .t-icon-race  { width: 140px; height: 140px; }
    .t-icon-algo   { width: 120px; height: 120px; }
    .t-icon-advance { width: 110px; height: 110px; }
  }
  .cate-header-desc-rg {
    .title { font-size: 30px; letter-spacing: 4px; color: #fff; }
    .desc-text { font-size: 15px; }
  }
  .cate-header-bar {
    height: 56px;
    padding: 0 28px;
    border-radius: 20px 20px 0 0;
    .bar-title { font-size: 18px; }
    .bar-search {
      width: 200px;
      ::v-deep .u-search__content {
        height: 34px !important;
      }
      ::v-deep .uni-input-input {
        font-size: 13px !important;
      }
    }
  }

  .cate-main {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px 28px 60px;
  }
}
</style>
