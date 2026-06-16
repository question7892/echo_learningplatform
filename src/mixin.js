export const systemInfo = {
  data: () => ({
    statusBarHeight: 0,
    navigationBarHeight: 0,
    navHeight: 0,

    startTime: 0,
    setTime: null,
    todayLearningTime: 0,
    oneWeekLearningTime: 0,
    // 最近2小时学习时长（独立计时，超过2小时不活跃自动清零）
    recentLearningMinutes: 0,
    lastActiveTimestamp: 0,
  }),

  methods: {
    // 获取设备信息
    getSystemInfo() {
      this.statusBarHeight = getApp().globalData.statusBarHeight
      this.navigationBarHeight = getApp().globalData.navigationBarHeight
      this.navHeight = getApp().globalData.navHeight
    },

    // 启动学习计时器
    startLearnTimer() {
      if (this.setTime) clearInterval(this.setTime)
      // 更新最后活跃时间
      this.lastActiveTimestamp = Date.now()
      this.setTime = setInterval(() => {
        this.startTime++
        // 每60秒累计1分钟
        if (this.startTime % 60 === 0 && this.startTime !== 0) {
          this.todayLearningTime += 1
          this.recentLearningMinutes += 1
        }
        // 每60分钟累计1小时（本周学习时长）
        if (this.todayLearningTime > 0 && this.todayLearningTime % 60 === 0) {
          this.oneWeekLearningTime += 1
        }
      }, 1000)
    },
  },

  computed: {
    // 获取可使用窗口高度
    windowHeight() {
      return uni.getSystemInfoSync().windowHeight
    },
    // 格式化今日学习时长显示（person.vue 使用）
    displayTodayTime() {
      const mins = this.todayLearningTime
      if (mins < 60) return `${mins}分钟`
      const h = Math.floor(mins / 60)
      const m = mins % 60
      return m > 0 ? `${h}小时${m}分钟` : `${h}小时`
    },
    // 格式化本周学习时长显示（person.vue 使用）
    displayWeekTime() {
      const hrs = this.oneWeekLearningTime
      if (hrs < 1) return `${this.todayLearningTime}分钟`
      return `${hrs}小时`
    },
    // 格式化最近2小时学习时长（studyRecords.vue 使用）
    displayRecentTime() {
      const mins = this.recentLearningMinutes
      if (mins === 0) return '0分钟'
      if (mins < 60) return `${mins}分钟`
      const h = Math.floor(mins / 60)
      const m = mins % 60
      return m > 0 ? `${h}小时${m}分钟` : `${h}小时`
    },
  },

  onLoad() {
    // 从缓存恢复学习时间
    const savedToday = uni.getStorageSync("todayLearningTime")
    const savedWeek = uni.getStorageSync("oneWeekLearningTime")
    if (savedToday && savedToday !== -1) {
      this.todayLearningTime = savedToday
    }
    if (savedWeek && savedWeek !== -1) {
      this.oneWeekLearningTime = savedWeek
    }
    // 恢复最近2小时学习时间，超过2小时则清零
    const TWO_HOURS = 2 * 60 * 60 * 1000
    const savedRecent = uni.getStorageSync("recentLearningMinutes")
    const savedTimestamp = uni.getStorageSync("lastActiveTimestamp")
    const now = Date.now()
    if (savedRecent && savedRecent !== -1 && savedTimestamp) {
      if (now - savedTimestamp < TWO_HOURS) {
        this.recentLearningMinutes = savedRecent
      } else {
        this.recentLearningMinutes = 0
      }
    }
    this.lastActiveTimestamp = now
    this.getSystemInfo()
  },

  mounted() {
    this.getSystemInfo()
    // 启动学习计时器
    this.startLearnTimer()
  },

  onShow() {
    // 检查最近学习是否超过2小时
    const TWO_HOURS = 2 * 60 * 60 * 1000
    const now = Date.now()
    if (this.lastActiveTimestamp && now - this.lastActiveTimestamp > TWO_HOURS) {
      this.recentLearningMinutes = 0
    }
    this.lastActiveTimestamp = now
    // 页面显示时重新启动计时器（从后台切回时）
    this.startLearnTimer()
  },

  onHide() {
    console.log("隐藏")
    try {
      // 页面隐藏时将学习时长放入缓存
      uni.setStorageSync("todayLearningTime", this.todayLearningTime)
      uni.setStorageSync("oneWeekLearningTime", this.oneWeekLearningTime)
      uni.setStorageSync("recentLearningMinutes", this.recentLearningMinutes)
      uni.setStorageSync("lastActiveTimestamp", this.lastActiveTimestamp || Date.now())
      clearInterval(this.setTime)
      this.setTime = null
    } catch (e) {
      //TODO handle the exception
    }
  },
}

export const globalMixin = {
  // rpx转px
  methods: {
    rpxToPx(rpx) {
      const screenWidth = uni.getSystemInfoSync().screenWidth
      return (Number.parseInt(rpx) * screenWidth) / 750
    },
  },
}
