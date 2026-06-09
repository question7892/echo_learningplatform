<template>
  <view class="login-page">
    <!-- #ifdef H5 -->
    <view class="web-login-container">
      <view class="login-left">
        <view class="hero-content">
          <view class="hero-logo">Echo</view>
          <view class="hero-title">开启你的智慧学习之旅</view>
          <view class="hero-desc">专业的在线学习平台，助力每一位学子成就梦想。</view>
          <view class="hero-features">
            <view class="feature-item">✓ 精品课程资源</view>
            <view class="feature-item">✓ 互动社区交流</view>
            <view class="feature-item">✓ 智能题库练习</view>
          </view>
        </view>
      </view>
      <view class="login-right">
        <view class="login-card">
          <view class="card-header">
            <view class="card-title">欢迎登录</view>
            <view class="card-subtitle">
              还没有账号？<text class="link" @click="gotoRigister">立即注册</text>
            </view>
          </view>
          
          <form-box class="web-form"></form-box>

          <view class="web-other-login">
            <view class="divider">
              <view class="line"></view>
              <view class="text">第三方登录</view>
              <view class="line"></view>
            </view>
            <view class="weixin-btn" @click="weixinLogin">
              <u-icon name="weixin-circle-fill" color="#18b566" size="32"></u-icon>
              <text>微信扫码一键登录</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    <!-- #endif -->

    <!-- #ifndef H5 -->
    <view class="mobile-login" :style="{ paddingTop: navHeight + 'px' }">
      <view class="login-tip">Hi~，欢迎回来！</view>
      <view class="rigister-go">
        <text class="rigister-go-tip">还没有账号？立即</text>
        <text class="rigister-go-url" @click="gotoRigister">注册</text>
      </view>
      <form-box></form-box>
      <view class="login-other">
        <u-divider text="第三方登录" lineColor="#909399"></u-divider>
        <view class="login-other-weixin" @click="weixinLogin">
          <button type="primary">
            <u-icon name="weixin-circle-fill" color="#18b566" :size="rpxToPx(80)"></u-icon>
            <text>一键登录</text>
          </button>
        </view>
      </view>
    </view>
    <!-- #endif -->
  </view>
</template>

<script>
import formBox from "./form-box/form-box.vue"
import { systemInfo } from "@/mixin.js"
import { mapMutations, mapState } from "vuex"
export default {
  components: { formBox },
  data: () => ({
    bg: require("@/static/bg.png"),
  }),
  mixins: [systemInfo],
  computed: {
    ...mapState("userModule", ["userInfo"]),
  },

  methods: {
    ...mapMutations("userModule", ["getUserInfo"]),

    // 微信登录
    async weixinLogin() {
      const IS_LOCAL_DEBUG = true; 
      if (IS_LOCAL_DEBUG) {
        try {
          uni.setStorageSync("token", "fake_token_123")
          this.getUserInfo({
            nickName: "本地测试用户",
            avatarUrl: "https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0",
            id: '888888'
          })
          uni.$u.toast("本地免密登录成功！")
          setTimeout(() => {
            uni.switchTab({ 
              url: "/pages/index/index",
              fail: () => { uni.reLaunch({ url: "/pages/index/index" }) }
            })
          }, 800)
        } catch (err) {
          console.error(err)
        }
        return;
      }

      try {
        const { userInfo } = await uni.getUserProfile({ desc: "获取微信用户信息", lang: "zh_CN" })
        const { code } = await uni.login({ provider: "weixin" })
        const { data: res } = await uni.request({
          url: "/wechat/login",
          method: "GET",
          data: { code: code, nickName: userInfo.nickName, avatarUrl: userInfo.avatarUrl },
        })
        if (res.status !== "200") return uni.$u.toast("登录失败")
        uni.setStorageSync("token", res.data.token)
        this.getUserInfo(res.data.user)
      } catch (err) {
        console.error(err)
        if (err.errMsg === "getUserProfile:fail auth deny") return uni.$u.toast("取消授权")
        uni.$u.toast("请求异常，请重试")
      }
    },

    gotoRigister() {
      uni.redirectTo({ url: "/pages/newRigister/newRigister" })
    },
  },
}
</script>

<style lang="scss" scoped>
/* #ifdef H5 */
.web-login-container {
  display: flex;
  min-height: 100vh;
  width: 100%;
  background-color: #f8fafc;
  
  .login-left {
    flex: 1.2;
    background: linear-gradient(135deg, #17ead9 0%, #6078ea 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    padding: 60px;
    
    .hero-content {
      max-width: 500px;
      .hero-logo {
        font-size: 34px;
        font-weight: 800;
        margin-bottom: 24px;
        letter-spacing: -1px;
      }
      .hero-title {
        font-size: 26px;
        font-weight: 600;
        margin-bottom: 14px;
      }
      .hero-desc {
        font-size: 15px;
        opacity: 0.9;
        line-height: 1.6;
        margin-bottom: 32px;
      }
      .hero-features {
        .feature-item {
          font-size: 14px;
          display: flex;
          align-items: center;
        }
      }
    }
  }
  
  .login-right {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;
    
    .login-card {
      width: 100%;
      max-width: 450px;
      background: #fff;
      padding: 50px;
      border-radius: 20px;
      box-shadow: 0 20px 50px rgba(0,0,0,0.05);
      
      .card-header {
        margin-bottom: 40px;
        .card-title {
          font-size: 24px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 8px;
        }
        .card-subtitle {
          font-size: 14px;
          color: #64748b;
          .link {
            color: #6078ea;
            font-weight: 600;
            cursor: pointer;
            margin-left: 4px;
            &:hover { text-decoration: underline; }
          }
        }
      }
      
      .web-form {
        ::v-deep .form-container {
          .form-container-item {
            width: 100% !important;
            height: 50px !important;
            border: 1px solid #e2e8f0 !important;
            border-radius: 10px !important;
            padding: 0 15px !important;
            margin-bottom: 20px !important;
            box-sizing: border-box !important;
            
            input {
              font-size: 15px !important;
              color: #1e293b !important;
            }
          }
          
          .form-btns {
            margin-top: 30px !important;
            .form-btns-item {
              height: 50px !important;
              border-radius: 10px !important;
              background: #6078ea !important;
              box-shadow: 0 4px 12px rgba(96, 120, 234, 0.3) !important;
              .form-btns-item-text {
                font-size: 16px !important;
                font-weight: 600 !important;
              }
            }
          }
          
          .form-code {
            font-size: 14px !important;
            color: #64748b !important;
            margin-top: 15px !important;
          }
        }
      }
      
      .web-other-login {
        margin-top: 40px;
        .divider {
          display: flex;
          align-items: center;
          margin-bottom: 24px;
          .line { flex: 1; height: 1px; background: #f1f5f9; }
          .text { padding: 0 16px; font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; }
        }
        .weixin-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 50px;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
          &:hover { background: #f8fafc; border-color: #cbd5e1; }
          text { margin-left: 12px; font-size: 14px; font-weight: 500; color: #475569; }
        }
      }
    }
  }
}
/* #endif */

/* #ifndef H5 */
.mobile-login {
  min-height: 100vh;
  box-sizing: border-box;
  background-image: linear-gradient(-225deg, #dfffcd 0%, #90f9c4 48%, #39f3bb 100%);
  background-size: cover;
  padding: 0 60rpx 60rpx;
  display: flex;
  flex-direction: column;

  &-tip {
    font-size: 60rpx;
    font-weight: bold;
    margin-top: 60rpx;
    margin-bottom: 20rpx;
  }

  .rigister-go {
    display: flex;
    color: $uni-text-color-placeholder;
    margin-bottom: 60rpx;
    &-url { color: #f56c6c; }
  }

  &-other {
    margin-top: auto;
    margin-bottom: 100rpx;
    &-weixin {
      display: flex;
      margin-top: 80rpx;
      > button {
        height: 100rpx;
        border-radius: 50rpx;
        padding: 0 40rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: transparent;
        text { color: #808080; margin-left: 20rpx; }
      }
    }
  }
}
/* #endif */
</style>

