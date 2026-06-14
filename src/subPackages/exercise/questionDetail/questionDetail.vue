/**
 * @author lan
 * @page 刷题页
 */
<template>
  <view class="question-container" :class="{ 'web-layout': isWeb }">
    <!-- 导航条 -->
    <view class="question-nav" :style="{ height: navHeight + 'px' }"></view>

    <!-- main -->
    <view class="question-main" :style="{ paddingTop: navHeight + 'px' }">
      <!-- 进度条 -->
      <view class="progress-section">
        <view class="progress-bar">
          <view class="progress-fill" :style="{ width: (activeIndex + 1) / questionInfoList.length * 100 + '%' }"></view>
        </view>
        <text class="progress-text">{{ activeIndex + 1 }}<text class="progress-total"> / {{ questionInfoList.length }}</text></text>
      </view>

      <!-- 题目信息 -->
      <u-transition :show="show" mode="fade-left">
        <view class="question-card">
          <!-- 题目类型标签 -->
          <my-tag
            class="q-type-tag"
            :type="questionInfoList[activeIndex].question_type === '单选题' ? 'success' : 'error'"
            size="mini"
            :circle="false"
          >
            {{ questionInfoList[activeIndex].question_type }}
          </my-tag>

          <!-- 题号 + 题目 -->
          <view class="q-body">
            <text class="q-index">{{ activeIndex + 1 }}.</text>
            <text class="q-content">{{ questionInfoList[activeIndex].content }}</text>
          </view>

          <!-- 选项列表 -->
          <view class="option-list">
            <view
              class="option-item"
              :class="[getMapValue(questionInfoList[activeIndex].uuid, item.key, questionInfoList[activeIndex].question_type) ? 'selected' : '']"
              v-for="(item, index) in questionInfoList[activeIndex].choices"
              :key="item.key"
              @click="selectOption(item, index, questionInfoList[activeIndex].question_type)"
            >
              <view class="option-key">{{ item.key }}</view>
              <text class="option-text">{{ item.choice }}</text>
            </view>
          </view>
        </view>
      </u-transition>

      <!-- 导航按钮 -->
      <view class="nav-buttons">
        <view class="btn-prev" @click="switchQuestion('prev')" v-if="activeIndex > 0">
          <u-icon name="arrow-left" size="18"></u-icon>
          <text>上一题</text>
        </view>
        <view class="btn-spacer" v-if="activeIndex === 0"></view>
        <view class="btn-next" @click="switchQuestion('next')">
          <text>{{ nextBtn.text }}</text>
          <u-icon name="arrow-right" size="18"></u-icon>
        </view>
      </view>
    </view>

    <!-- 模态框 -->
    <u-modal
      :show="showModal"
      @confirm="commitAnswerCard"
      @cancel="closeModal"
      title="确认提交？"
      showCancelButton
      :asyncClose="true"
    ></u-modal>

    <!-- 加载页 -->
    <u-loading-page :loading="loading"></u-loading-page>
  </view>
</template>

<script>
import { systemInfo } from "@/mixin.js"
import { questionInfoList } from "@/mock/questionList.js"
export default {
  props: {
    isWeb: { type: Boolean, default: false }
  },
  components: {},
  mixins: [systemInfo],
  data: () => ({
    questionGroupId: "",
    questionInfoList: [{}],

    // 索引
    activeIndex: 0,

    // 进度条
    lineProgress: 1,
    lineProgressPer: 10,

    // btn
    prevBtnDisabled: true,
    nextBtn: { text: "下一题", loading: false, disabled: false },

    show: false,
    showModal: false,
    loading: true,

    answerMap: new Map(),
  }),
  computed: {},
  methods: {
    // 建立答案map
    createAnswerMap() {
      // 初始化map
      this.questionInfoList.forEach((item, index) => {
        if (item.question_type === "单选题") {
          this.answerMap.set(item.uuid, null)
        } else if (item.question_type === "多选题") {
          this.answerMap.set(item.uuid, [])
        }
      })

      console.log(this.answerMap)
    },

    // 获取题组
    async getQuestionList() {
      this.loading = true

      const { data: res } = await uni.request({
        url: "/question/get/set/questions",
        method: "GET",
        data: { QuestionSetId: this.questionGroupId },
      })
      // console.log(res)
      this.loading = false
      if (res.status !== "200") return uni.$u.toast("获取题组失败")

      // 适配后端数据格式：question_type 映射 & 字段补全
      const typeMap = { single: "单选题", multiple: "多选题" }
      this.questionInfoList = (res.data || []).map(q => ({
        ...q,
        question_type: typeMap[q.question_type] || q.question_type || "单选题",
        content: q.content || q.describe || "",
      }))
      this.createAnswerMap()
      this.lineProgressPer = this.questionInfoList.length
      this.show = true
    },

    // 选中选项
    selectOption(item, index, type) {
      // this.optionActiveIndex = index

      const qId = this.questionInfoList[this.activeIndex].uuid
      if (type === "单选题") {
        // 寻找key,设置value
        this.answerMap.set(qId, item.key)
      } else if (type === "多选题") {
        // 拿到选项卡
        const optionArr = this.answerMap.get(qId)

        // 没有则添加，有则去除
        if (!optionArr.includes(item.key)) {
          optionArr.push(item.key)
        } else {
          optionArr.splice(optionArr.indexOf(item.key), 1)
        }
      }

      // 手动更新、渲染数据
      this.$forceUpdate()
      // console.log(this.answerMap)
    },

    // 切换题目
    switchQuestion(type) {
      if (type === "next") {
        // 最后一题，转为提交
        if (this.activeIndex === this.questionInfoList.length - 1) {
          const unFinishedArr = []
          for (const [key, value] of this.answerMap) {
            if (value === null || !value.length) unFinishedArr.push(key)
          }
          // 提示题目未完成
          if (unFinishedArr.length) return uni.$u.toast(`你还有题目未完成：${JSON.stringify(unFinishedArr)}`)
          return (this.showModal = true)
        }

        // 切换下一题

        // 防抖
        if (!this.show) return
        this.show = false
        setTimeout(() => {
          this.activeIndex++
          this.lineProgress++
          this.show = true
        }, 300)
        this.lineProgressPer += 10
      } else if (type === "prev") {
        // 切换上一题

        // 防抖
        if (!this.show) return
        this.show = false
        setTimeout(() => {
          this.activeIndex--
          this.lineProgress--
          this.lineProgressPer -= 10
          this.show = true
        }, 300)
      }
    },

    // 用于判断选中option如何添加样式
    getMapValue(key, value, type) {
      /**
       * @key: 题号，第几题 如1 2 3 4...
       * @value: 题目的选项，如A B C D
       * @type: 题目的类型 如单选题 多选题
       */

      if (type === "单选题") return this.answerMap.get(key) === value
      // 多选，判断包含
      return this.answerMap.get(key).includes(value)
    },

    closeModal() {
      this.showModal = false
    },

    // 提交答题卡
    async commitAnswerCard() {
      // map转obj
      let answerObj = {}
      for (const [key, value] of this.answerMap) {
        answerObj[key] = value
      }
      // console.log(answerObj)

      // 提交
      try {
        const { data: res } = await uni.request({
          url: "/question/user/correcting",
          data: { QuestionSetId: this.questionGroupId, answerObj: answerObj },
        })
        console.log(res)
        if (res.status != 200) {
          this.showModal = false
          return uni.$u.toast("提交失败")
        }
        const answerReport = res.data
        uni.redirectTo({
          url: `/subPackages/exercise/resultPage/resultPage?answerReport=${JSON.stringify(
            answerReport
          )}&answerSheet=${JSON.stringify(answerObj)}`,
        })
      } catch (err) {
        console.error(err)
        uni.$u.toast("请求异常")
      } finally {
        this.showModal = false
      }
    },
  },
  watch: {
    // 把控btn开禁
    lineProgress(value) {
      this.prevBtnDisabled = value === 1 ? true : false
      if (value >= this.questionInfoList.length) {
        this.nextBtn = { text: "提交", loading: false, disabled: false }
      } else {
        this.nextBtn = { text: "下一题", loading: false, disabled: false }
      }
    },
  },

  onLoad(options) {
    this.questionGroupId = options.id
    this.getQuestionList()
  },
}
</script>

<style lang="scss" scoped>
* { box-sizing: border-box; }

.question-container {
  min-height: 100vh;
  background: #f0f2f5;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

.question-nav {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 10;
  background: linear-gradient(135deg, #96e6a1 0%, #d4fc79 100%);
}

.question-main {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 20rpx;
}

/* ====== 进度条 ====== */
.progress-section {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 20rpx 10rpx;
  background: #fff;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.03);
}
.progress-bar {
  flex: 1;
  height: 12rpx;
  background: #e5e7eb;
  border-radius: 6rpx;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #19be6b, #71d5a1);
  border-radius: 6rpx;
  transition: width 0.35s ease;
}
.progress-text {
  font-size: 24rpx;
  font-weight: 600;
  color: #1e293b;
  white-space: nowrap;
}
.progress-total {
  color: #94a3b8;
  font-weight: 400;
}

/* ====== 题目卡片 ====== */
.question-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 32rpx 28rpx;
  box-shadow: 0 2rpx 16rpx rgba(0,0,0,0.04);
}

/* 题型标签 */
.q-type-tag {
  margin-bottom: 20rpx;
}

/* 题号 + 题目文本 */
.q-body {
  display: flex;
  margin-bottom: 36rpx;
}
.q-index {
  font-size: 34rpx;
  font-weight: 700;
  color: #19be6b;
  margin-right: 10rpx;
  flex-shrink: 0;
}
.q-content {
  font-size: 34rpx;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.6;
}

/* ====== 选项列表 ====== */
.option-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.option-item {
  display: flex;
  align-items: center;
  padding: 24rpx 24rpx;
  border-radius: 16rpx;
  border: 2rpx solid #e5e7eb;
  background: #f9fafb;
  transition: all 0.2s ease;
  cursor: pointer;

  &:active {
    transform: scale(0.98);
  }
}

.option-key {
  width: 52rpx;
  height: 52rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26rpx;
  font-weight: 700;
  color: #64748b;
  background: #e5e7eb;
  flex-shrink: 0;
  transition: all 0.2s;
}

.option-text {
  flex: 1;
  margin-left: 20rpx;
  font-size: 30rpx;
  color: #334155;
  line-height: 1.5;
}

/* 选中态 */
.option-item.selected {
  border-color: #19be6b;
  background: linear-gradient(to right, #ecfdf5, #f0fdf4);
  box-shadow: 0 2rpx 12rpx rgba(25,190,107,0.12);

  .option-key {
    background: #19be6b;
    color: #fff;
  }
  .option-text {
    color: #16a34a;
    font-weight: 600;
  }
}

/* ====== 导航按钮 ====== */
.nav-buttons {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding: 40rpx 0 60rpx;
  gap: 24rpx;
}
.btn-prev, .btn-next {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
  flex: 1;
  height: 88rpx;
  border-radius: 44rpx;
  font-size: 28rpx;
  font-weight: 600;
  transition: all 0.2s;
  cursor: pointer;
}
.btn-prev {
  background: #e5e7eb;
  color: #475569;
  &:active { background: #d1d5db; }
}
.btn-next {
  background: linear-gradient(135deg, #19be6b, #71d5a1);
  color: #fff;
  box-shadow: 0 4rpx 16rpx rgba(25,190,107,0.3);
  &:active { transform: scale(0.97); }
}
.btn-spacer {
  flex: 1;
}

/* ====== Web 端适配 ====== */
.web-layout {
  .question-main {
    max-width: 760px;
    margin: 0 auto;
    padding: 28px 40px;
  }

  .progress-section {
    padding: 20px 20px;
    border-radius: 14px;
  }
  .progress-bar { height: 8px; border-radius: 4px; }
  .progress-fill { border-radius: 4px; }
  .progress-text { font-size: 15px; }

  .question-card {
    border-radius: 16px;
    padding: 36px 32px;
  }

  .q-index { font-size: 21px; margin-right: 10px; }
  .q-content { font-size: 21px; }

  .option-list { gap: 14px; }
  .option-item {
    padding: 18px 24px;
    border-radius: 14px;
    border: 1.5px solid #e5e7eb;
  }
  .option-key {
    width: 40px;
    height: 40px;
    font-size: 18px;
  }
  .option-text {
    font-size: 17px;
    margin-left: 16px;
  }

  .nav-buttons {
    padding: 36px 0 48px;
    gap: 20px;
  }
  .btn-prev, .btn-next {
    height: 52px;
    border-radius: 26px;
    font-size: 16px;
  }
}
</style>
