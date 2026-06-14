<template>
  <view class="analysis" :class="{ 'web-layout': isWeb }">
    <!-- 加载页 -->
    <u-loading-page :loading="loading"></u-loading-page>

    <!-- 答题卡 -->
    <view class="answer-card">
      <view class="card-header">
        <text class="card-title">作答情况</text>
        <view class="legend">
          <view class="legend-item"><view class="dot correct"></view><text>正确</text></view>
          <view class="legend-item"><view class="dot wrong"></view><text>错误</text></view>
        </view>
      </view>

      <view class="answer-grid">
        <view class="circle-wrap" v-for="(item, index) in analysisList" :key="item.id" @click="selectCircle(index)">
          <view
            class="circle"
            :class="{
              'is-correct': item.isCorrect,
              'is-wrong': !item.isCorrect,
              'is-active': index === activeIndex
            }"
          >
            {{ index + 1 }}
          </view>
        </view>
      </view>
    </view>

    <!-- 主体 -->
    <u-transition :show="mainShow" mode="fade-left">
      <view class="analysis-main">
        <!-- 题目信息 -->
        <questionInfo :analysisData="analysisList[activeIndex]" @addWrongBook="addWrongBook"></questionInfo>

        <!-- 解析 -->
        <view class="explain-card">
          <text class="explain-title">解析</text>
          <text class="explain-content" v-if="analysisList[activeIndex].hasAnalysis">
            {{ analysisList[activeIndex].analysis_content }}
          </text>
          <view class="explain-empty" v-else>
            <text class="empty-text">暂无解析</text>
            <text class="empty-hint">该题目暂未提供解析，可添加到错题本稍后复习</text>
          </view>
        </view>
      </view>
    </u-transition>

    <u-notify ref="uNotify" message="Hi uView"></u-notify>
  </view>
</template>

<script>
import { analysisList } from "@/mock/analysisList.js"
export default {
  props: {
    isWeb: { type: Boolean, default: false }
  },
  components: {},
  data: () => ({
    analysisList: [{}],
    activeIndex: 0,
    mainShow: false,
    loading: true,

    questionGroupInfo: null,
  }),
  computed: {
    getCircleBgColor() {
      return isCorrect => (isCorrect ? "#19be6b" : "#f56c6c")
    },

    getCircleActiveClass() {
      return (index, isCorrect) => {
        if (index === this.activeIndex) {
          if (isCorrect) return "active_correct"
          return "active_worng"
        }
      }
    },
  },
  methods: {
    selectCircle(index) {
      // 节流
      if (!this.mainShow) return

      this.mainShow = false
      setTimeout(() => {
        this.activeIndex = index
        this.mainShow = true
      }, 300)
    },

    // 获取题组信息
    getQuestionGroupInfo(info) {
      this.questionGroupInfo = info
    },

    // 获取解析
    async getAnalysisList() {
      this.loading = true
      try {
        const { data: res } = await uni.request({
          url: "/question/user/get/analysis",
          method: "GET",
          data: {
            QuestionSetId: this.questionGroupInfo.QuestionSetId,
            answerObj: this.questionGroupInfo.answerObj,
            faultQuestions: this.questionGroupInfo.faultQuestions,
          },
        })
        console.log(res)
        if (res.status != 200) return uni.$u.toast("获取解析失败")

        this.analysisList = res.data
      } catch (err) {
        console.error(err)
        uni.$u.toast("请求异常")
      } finally {
        this.loading = false
        this.mainShow = true
      }
    },

    // 添加至错题本
    addWrongBook(questionId, value) {
      this.analysisList.forEach(item => {
        if (item.id === questionId) {
          item.withinWrongBook = value
          if (value) {
            this.$refs.uNotify.success("已添加到错题本")
          } else {
            this.$refs.uNotify.error("已取消添加")
          }
          return
        }
      })
    },
  },
  watch: {},

  // 页面周期函数--监听页面加载
  onLoad(options) {
    this.getQuestionGroupInfo(JSON.parse(options.questionGroupInfo))
    this.getAnalysisList()

    // 模拟
    // setTimeout(() => {
    //   this.loading = false
    //   this.analysisList = analysisList
    //   this.mainShow = true
    // }, 100)
  },
}
</script>

<style lang="scss" scoped>
* { box-sizing: border-box; }

.analysis {
  min-height: 100vh;
  background: #f0f2f5;
  padding: 24rpx;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

/* ====== 答题卡 ====== */
.answer-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 28rpx 24rpx;
  box-shadow: 0 2rpx 16rpx rgba(0,0,0,0.04);
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}
.card-title {
  font-size: 30rpx;
  font-weight: 700;
  color: #1e293b;
  padding-left: 20rpx;
  border-left: 6rpx solid #2b85e4;
}
.legend {
  display: flex;
  gap: 24rpx;
}
.legend-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
  font-size: 22rpx;
  color: #94a3b8;
}
.dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  &.correct { background: #22c55e; }
  &.wrong { background: #ef4444; }
}

/* 答题圆圈网格 */
.answer-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}
.circle-wrap {
  width: calc((100% - 4 * 16rpx) / 5);
  display: flex;
  justify-content: center;
  padding: 10rpx 0;
}
.circle {
  width: 68rpx;
  height: 68rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  font-weight: 700;
  color: #fff;
  transition: all 0.25s ease;
  cursor: pointer;
}
.circle.is-correct { background: #22c55e; }
.circle.is-wrong   { background: #ef4444; }
.circle.is-active {
  transform: scale(1.18);
  box-shadow: 0 0 24rpx currentColor;
}
.circle.is-active.is-correct { box-shadow: 0 0 32rpx rgba(34,197,94,0.5); border: 3rpx solid #fff; }
.circle.is-active.is-wrong   { box-shadow: 0 0 32rpx rgba(239,68,68,0.5); border: 3rpx solid #fff; }

/* ====== 题目 + 解析 ====== */
.analysis-main {
  margin-top: 24rpx;
}

.explain-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 28rpx 24rpx;
  margin-top: 24rpx;
  box-shadow: 0 2rpx 16rpx rgba(0,0,0,0.04);
}
.explain-title {
  display: block;
  font-size: 30rpx;
  font-weight: 700;
  color: #1e293b;
  padding-left: 20rpx;
  border-left: 6rpx solid #2b85e4;
  margin-bottom: 20rpx;
}
.explain-content {
  display: block;
  font-size: 28rpx;
  color: #475569;
  line-height: 1.8;
  text-align: justify;
}
.explain-empty {
  text-align: center;
  padding: 40rpx 0;
  .empty-text { display: block; font-size: 28rpx; color: #94a3b8; }
  .empty-hint { display: block; font-size: 22rpx; color: #cbd5e1; margin-top: 8rpx; }
}

/* ====== Web 端适配 ====== */
.web-layout {
  max-width: 800px;
  margin: 0 auto;
  padding: 32px 40px;
  background: #f8fafc;
  min-height: calc(100vh - 60px);

  .answer-card { border-radius: 16px; padding: 28px 28px; }
  .card-title { font-size: 18px; }
  .card-header { margin-bottom: 20px; }
  .legend-item { font-size: 13px; }
  .dot { width: 12px; height: 12px; }

  .answer-grid { gap: 12px; }
  .circle-wrap { width: calc((100% - 4 * 12px) / 5); padding: 8px 0; }
  .circle { width: 52px; height: 52px; font-size: 20px; }

  .analysis-main { margin-top: 20px; }

  .explain-card { border-radius: 16px; padding: 28px; margin-top: 20px; }
  .explain-title { font-size: 18px; border-left-width: 5px; margin-bottom: 16px; }
  .explain-content { font-size: 16px; line-height: 1.9; }
}
</style>
