<template>
  <view class="result" :class="{ 'web-layout': isWeb }">
    <!-- ====== 顶部概览卡片 ====== -->
    <view class="overview-card">
      <!-- 正确率圆环 -->
      <view class="score-ring">
        <view class="ring-inner">
          <text class="score-num">{{ displayRate }}</text>
          <text class="score-unit">分</text>
          <text class="score-label">正确率</text>
        </view>
      </view>

      <!-- 题目信息 -->
      <view class="question-meta">
        <text class="q-title">{{ answerReport.question.title }}</text>
        <view class="q-tags">
          <my-tag :type="getLevelColor(answerReport.question.level)" :circle="false" size="mini">
            {{ answerReport.question.level }}
          </my-tag>
          <my-tag type="info" size="mini" v-for="tag in answerReport.question.tagList" :key="tag.tagId">
            {{ tag.tag }}
          </my-tag>
        </view>
      </view>
    </view>

    <!-- ====== 统计面板 ====== -->
    <view class="stats-row">
      <view class="stat-item stat-total">
        <text class="stat-num">{{ answerReport.totalNumber }}</text>
        <text class="stat-label">共计</text>
      </view>
      <view class="stat-item stat-correct">
        <text class="stat-num">{{ answerReport.correctNumber }}</text>
        <text class="stat-label">答对</text>
      </view>
      <view class="stat-item stat-wrong">
        <text class="stat-num">{{ answerReport.wrongNumber }}</text>
        <text class="stat-label">答错</text>
      </view>
      <view class="stat-item stat-rate">
        <text class="stat-num">{{ displayRate }}%</text>
        <text class="stat-label">正确率</text>
      </view>
    </view>

    <!-- ====== 答题明细 ====== -->
    <view class="answer-detail">
      <view class="section-title">答题明细</view>
      <view class="answer-grid">
        <view
          class="answer-cell"
          v-for="(correctAnswer, index) in answerReport.answerList"
          :key="index"
          :class="{ correct: isCorrect(index), wrong: !isCorrect(index) }"
        >
          <view class="cell-index">{{ index + 1 }}</view>
          <view class="cell-answers">
            <text class="cell-correct">答案 {{ formatAnswer(correctAnswer) }}</text>
            <text class="cell-yours" v-if="!isCorrect(index)">
              你的 {{ formatAnswer(getUserAnswer(index)) }}
            </text>
          </view>
          <view class="cell-badge" :class="{ right: isCorrect(index), err: !isCorrect(index) }">
            {{ isCorrect(index) ? '✓' : '✗' }}
          </view>
        </view>
      </view>
    </view>

    <!-- 查看解析按钮 -->
    <view class="btn-wrap">
      <u-button text="查看解析" shape="circle" color="#19be6b" @click="gotoAnalysis"></u-button>
    </view>
  </view>
</template>

<script>
export default {
  components: {},
  data: () => ({
    answerSheet: null,
    questionGroupId: null,

    answerReport: {
      faultQuestions: [],
      answerList: ["A", "D", "C", "B", "C", "B", "B", ["A", "B"], ["B", "D"], ["A", "B", "C", "D"]],
      question: null,
      passRate: 60,
      totalNumber: 10,
      correctNumber: 6,
      wrongNumber: 4,
    },

    question: {
      id: "02",
      title: "寻找两个正序数组的中位数寻找两个正序数组的中位数",
      level: "困难",
      tagList: [
        {
          tagId: "0001",
          tag: "二分",
        },
        {
          tagId: "0002",
          tag: "归并排序",
        },
      ],
      passRate: 11,
    },
  }),
  props: {
    isWeb: { type: Boolean, default: false }
  },
  computed: {
    // 正确率保留1位小数
    displayRate() {
      const rate = Number(this.answerReport.passRate)
      return isNaN(rate) ? '0' : parseFloat(rate.toFixed(1))
    },
    // 根据难度选择tag种类
    getLevelColor() {
      return level => {
        switch (level) {
          case "简单":
            return "success"
          case "中等":
            return "warning"
          case "困难":
            return "error"
          default:
            break
        }
      }
    },
  },
  methods: {
    // 将 UUID-keyed 的 answerSheet 转为有序数组
    // answerSheet 可能是 {uuid: answer} 或已经是数组
    getAnswerSheetArray() {
      if (!this.answerSheet) return []
      return Array.isArray(this.answerSheet)
        ? this.answerSheet
        : Object.values(this.answerSheet)
    },
    // 判断某题是否答对
    isCorrect(index) {
      const correct = this.answerReport.answerList[index]
      const userArr = this.getAnswerSheetArray()
      const user = userArr[index]
      if (user === null || user === undefined) return false
      if (Array.isArray(correct)) {
        if (!Array.isArray(user)) return false
        if (correct.length !== user.length) return false
        return correct.every(v => user.includes(v))
      }
      return String(user) === String(correct)
    },
    // 格式化答案显示
    formatAnswer(answer) {
      return Array.isArray(answer) ? answer.join('') : String(answer)
    },
    // 获取用户答案
    getUserAnswer(index) {
      const userArr = this.getAnswerSheetArray()
      const user = userArr[index]
      if (user === null || user === undefined) return '未作答'
      return Array.isArray(user) ? user.join('') : String(user)
    },
    gotoAnalysis() {
      const questionGroupInfo = {
        QuestionSetId: this.answerReport.question.id,
        answerObj: this.answerSheet,
        faultQuestions: this.answerReport.faultQuestions,
      }
      console.log(this.answerReport.question.id)

      console.log(questionGroupInfo)
      uni.navigateTo({ url: "/subPackages/exercise/analysis/analysis?questionGroupInfo=" + JSON.stringify(questionGroupInfo) })
    },
  },
  watch: {},

  // 页面周期函数--监听页面加载
  onLoad(options) {
    this.answerReport = JSON.parse(options.answerReport)
    this.answerSheet = JSON.parse(options.answerSheet)
  },
}
</script>

<style lang="scss" scoped>
* { box-sizing: border-box; }

.result {
  min-height: 100vh;
  background: #f0f2f5;
  padding: 24rpx;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

/* ====== 顶部概览卡片 ====== */
.overview-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 40rpx 32rpx;
  display: flex;
  align-items: center;
  gap: 32rpx;
  box-shadow: 0 2rpx 16rpx rgba(0,0,0,0.04);
}

/* 正确率圆环 */
.score-ring {
  width: 180rpx;
  height: 180rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #2af598 0%, #009efd 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  box-shadow: 0 8rpx 24rpx rgba(0,158,253,0.25);
}
.ring-inner {
  width: 75%;
  height: 75%;
  border-radius: 50%;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.score-num {
  font-size: 52rpx;
  font-weight: 800;
  color: #1a9a5a;
  line-height: 1;
}
.score-unit {
  font-size: 22rpx;
  color: #999;
  margin-top: 2rpx;
}
.score-label {
  font-size: 20rpx;
  color: #999;
  margin-top: 4rpx;
}

/* 题目信息 */
.question-meta {
  flex: 1;
  min-width: 0;
}
.q-title {
  font-size: 30rpx;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.5;
  display: block;
  margin-bottom: 16rpx;
}
.q-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  align-items: center;
}

/* ====== 统计行 ====== */
.stats-row {
  display: flex;
  gap: 16rpx;
  margin-top: 20rpx;
}
.stat-item {
  flex: 1;
  background: #fff;
  border-radius: 16rpx;
  padding: 28rpx 16rpx;
  text-align: center;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.03);
}
.stat-num {
  display: block;
  font-size: 40rpx;
  font-weight: 700;
  line-height: 1.2;
}
.stat-label {
  display: block;
  font-size: 22rpx;
  color: #94a3b8;
  margin-top: 6rpx;
}
.stat-total .stat-num { color: #3b82f6; }
.stat-correct .stat-num { color: #22c55e; }
.stat-wrong .stat-num { color: #ef4444; }
.stat-rate .stat-num { color: #8b5cf6; }

/* ====== 答题明细 ====== */
.answer-detail {
  background: #fff;
  border-radius: 20rpx;
  margin-top: 20rpx;
  padding: 32rpx 24rpx;
  box-shadow: 0 2rpx 16rpx rgba(0,0,0,0.04);
}
.section-title {
  font-size: 30rpx;
  font-weight: 700;
  color: #1e293b;
  padding-left: 20rpx;
  margin-bottom: 24rpx;
  border-left: 6rpx solid #2b85e4;
}
.answer-grid {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

/* 单个答案行 */
.answer-cell {
  display: flex;
  align-items: center;
  padding: 20rpx 20rpx;
  border-radius: 14rpx;
  background: #f8fafc;
  transition: background 0.2s;
}
.answer-cell.correct { background: #f0fdf4; }
.answer-cell.wrong { background: #fef2f2; }

.cell-index {
  width: 52rpx;
  height: 52rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26rpx;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
}
.answer-cell.correct .cell-index { background: #22c55e; }
.answer-cell.wrong .cell-index { background: #ef4444; }

.cell-answers {
  flex: 1;
  margin-left: 20rpx;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}
.cell-correct {
  font-size: 28rpx;
  color: #16a34a;
  font-weight: 600;
}
.cell-yours {
  font-size: 22rpx;
  color: #dc2626;
}

.cell-badge {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  font-weight: 700;
  flex-shrink: 0;
}
.cell-badge.right { background: #dcfce7; color: #16a34a; }
.cell-badge.err { background: #fee2e2; color: #dc2626; }

/* 查看解析按钮 */
.btn-wrap {
  margin-top: 40rpx;
  padding-bottom: 60rpx;
  display: flex;
  justify-content: center;
  ::v-deep .u-button {
    width: 400rpx;
    height: 80rpx;
    font-size: 30rpx;
    font-weight: 600;
    letter-spacing: 2rpx;
  }
}

/* ====== Web 端适配 ====== */
.web-layout {
  max-width: 800px;
  margin: 0 auto;
  padding: 32px 40px;
  background: #f8fafc;
  min-height: calc(100vh - 60px);

  .overview-card {
    padding: 40px 36px;
    border-radius: 16px;
  }
  .score-ring {
    width: 140px;
    height: 140px;
  }
  .score-num { font-size: 40px; }
  .score-unit { font-size: 14px; }
  .score-label { font-size: 13px; }

  .q-title { font-size: 19px; margin-bottom: 14px; }

  .stats-row { gap: 16px; margin-top: 20px; }
  .stat-item { padding: 24px 20px; border-radius: 14px; }
  .stat-num { font-size: 30px; }
  .stat-label { font-size: 14px; }

  .answer-detail { border-radius: 16px; padding: 32px 28px; }
  .section-title { font-size: 18px; margin-bottom: 20px; }
  .answer-grid { gap: 10px; }
  .answer-cell { padding: 16px 20px; border-radius: 12px; }
  .cell-index { width: 40px; height: 40px; font-size: 18px; }
  .cell-correct { font-size: 16px; }
  .cell-yours { font-size: 13px; }
  .cell-badge { width: 36px; height: 36px; font-size: 20px; }

  .btn-wrap {
    margin-top: 36px;
    padding-bottom: 40px;
    ::v-deep .u-button {
      width: 320px;
      height: 52px;
      font-size: 17px;
    }
  }
}
</style>
