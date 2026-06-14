<script>
import { mapMutations } from "vuex"
export default {
  globalData: {
    statusBarHeight: 0, // 状态导航栏高度
    navHeight: 0, // 总体高度
    navigationBarHeight: 0, // 导航栏高度(标题栏高度)
  },
  methods: {
    ...mapMutations("userModule", ["getUserInfo"]),

    // 获取用户信息
    async getUserInfoInit() {
      const token = uni.getStorageSync("token")
      if (!token) return uni.reLaunch({ url: "/pages/login/login" })
      const { data: res } = await uni.request({ url: "/token/get/user", method: "GET" })
      if (!res || res.status != 200) {
        uni.removeStorageSync("token")
        return uni.reLaunch({ url: "/pages/login/login" })
      }
      this.getUserInfo(res.data)
    },

    // 获取小程序头部信息
    getAppHeaderInfo() {
      // 获取状态栏高度
      this.globalData.statusBarHeight = uni.getSystemInfoSync().statusBarHeight || 0

      // #ifdef MP-WEIXIN
      // 获取微信胶囊的位置信息 width,height,top,right,left,bottom
      const custom = wx.getMenuButtonBoundingClientRect()
      // 导航栏高度(标题栏高度) = 胶囊高度 + (顶部距离 - 状态栏高度) * 2
      this.globalData.navigationBarHeight = custom.height + (custom.top - this.globalData.statusBarHeight) * 2
      // 总体高度 = 状态栏高度 + 导航栏高度
      this.globalData.navHeight = this.globalData.navigationBarHeight + this.globalData.statusBarHeight
      // #endif

      // #ifdef H5 || APP-PLUS
      this.globalData.navigationBarHeight = 44 // H5 默认导航栏高度
      this.globalData.navHeight = this.globalData.navigationBarHeight + this.globalData.statusBarHeight
      // #endif
    },
  },
  onLaunch: function () {
    this.getUserInfoInit()
    this.getAppHeaderInfo()
  },

  onShow: function () {
    console.log("App Show")
  },
  onHide: function () {
    console.log("App Hide")
  },
}
</script>

<style lang="scss">
/*每个页面公共css */
@import "uview-ui/index.scss";

@import url("@/static/fonts/iconfont-weapp-icon.css");

/* #ifdef H5 */
/* 网页端全局重设计 */
html, body {
  background-color: #f0f2f5 !important;
  margin: 0;
  padding: 0;
}

/* 适配 PC 端宽屏布局 */
@media screen and (min-width: 768px) {
  /* 隐藏手机端的底部 TabBar */
  uni-tabbar, .uni-tabbar {
    display: none !important;
  }

  /* 为顶部的 topWindow 留出空间 */
  uni-app {
    padding-top: 60px !important;
  }

  /* 固定页面标题栏（题库、社区等），不随页面滚动 */
  uni-page-head, .uni-page-head {
    position: sticky !important;
    top: 60px !important;
    z-index: 998 !important;
  }

  /* 页面主体内容约束 - 真正的 Web 门户感 */
  uni-page-body {
    background-color: #fff !important;
    min-height: calc(100vh - 60px) !important;
    display: flex !important;
    flex-direction: column !important;
  }

  /* 核心：对于内容页面限制宽度，但登录页等全屏页面除外 */
  /* 我们通过选择器排除掉 login 页面，或者直接在 login 页面内部处理全屏 */
  /* 这里先保持 flex 布局，具体的宽度限制在每个页面组件内部处理会更灵活 */
  uni-page-body > view {
    width: 100% !important;
    height: 100% !important;
  }
}
/* #endif */
</style>
