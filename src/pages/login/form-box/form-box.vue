<template>
  <form class="form-container" @submit="formSubmit">
    <!-- 输入框1 -->
    <view class="form-container-item">
      <!-- #ifdef H5 -->
      <u-icon size="24" color="#64748b" :name="formType[0].icon"></u-icon>
      <!-- #endif -->
      <!-- #ifndef H5 -->
      <u-icon :size="rpxToPx(50)" color="#303133" :name="formType[0].icon"></u-icon>
      <!-- #endif -->
      <input
        :password="formType[0].isPassword"
        :name="formType[0].name"
        v-model="firstColumn"
        :type="formType[0].type"
        :placeholder="formType[0].placeholder"
      />
    </view>

    <!-- 输入框2 -->
    <view class="form-container-item">
      <!-- #ifdef H5 -->
      <u-icon size="24" color="#64748b" :name="formType[1].icon"></u-icon>
      <!-- #endif -->
      <!-- #ifndef H5 -->
      <u-icon :size="rpxToPx(50)" color="#303133" :name="formType[1].icon"></u-icon>
      <!-- #endif -->
      <input
        :password="formType[1].isPassword"
        :name="formType[1].name"
        v-model="secondColumn"
        :type="formType[1].type"
        :maxlength="formType[1].maxLength ? formType[1].maxLength : 12"
        :placeholder="formType[1].placeholder"
      />
      <u-code :seconds="seconds" change-text="Xs" ref="uCode" @end="codeEnd" @change="codeChange"></u-code>
      <view
        class="send"
        v-if="formType[1].name === 'code'"
        :class="[sending ? 'disabled' : '']"
        @click.stop="getCode(firstColumn)"
      >
        {{ tips }}
      </view>
    </view>

    <!-- 按钮组 -->
    <view class="form-btns">
      <button class="form-btns-item" form-type="submit" :disabled="loginBtn.disabled" type="primary">
        <u-loading-icon v-if="loginBtn.loading" mode="circle" :size="rpxToPx(36)"></u-loading-icon>
        <view class="form-btns-item-text">{{ loginBtn.btnText }}</view>
      </button>
    </view>

    <!-- 验证码登录 -->
    <view class="form-code" @click="switchWay">{{ loginText }}</view>

    <!-- 反馈组件 -->
    <u-toast ref="uToast"></u-toast>
  </form>
</template>

<script>
import { mapMutations } from "vuex"
export default {
  props: {},
  data: () => ({
    firstColumn: "",
    secondColumn: "",
    formType: [
      {
        name: "userName",
        placeholder: "用户名",
        type: "text",
        icon: "tags",
        isPassword: false,
      },
      {
        name: "password",
        placeholder: "密码",
        type: "text",
        icon: "lock",
        isPassword: true,
      },
    ],
    isPhoneLogin: true,
    loginText: "使用账号密码登录",
    loginBtn: {
      btnText: "立即登录",
      loading: false,
      disabled: false,
    },

    tips: "",
    sending: false,
    seconds: 60,
  }),
  computed: {},
  methods: {
    ...mapMutations("userModule", ["getUserInfo"]),

    // 切换登录方式
    switchWay() {
      this.loginText === "使用验证码登录" ? (this.loginText = "使用账号密码登录") : (this.loginText = "使用验证码登录")
      this.isPhoneLogin = !this.isPhoneLogin
    },

    // 模拟
    mock() {
      this.loginBtn = { btnText: "登录中", disabled: true, loading: true }
      setTimeout(() => {
        this.loginBtn = { btnText: "立即登录", loading: false, disabled: false }
        this.$refs.uToast.show({ type: "success", message: "登录成功" })
      }, 3000)
    },

    // 提交表单
    formSubmit(e) {
      const { value: userInfo } = e.detail
      if (!this.isPhoneLogin) {
        if (userInfo.userName && userInfo.password) {
          this.accountLogin(userInfo)
        } else {
          this.$refs.uToast.show({ type: "error", message: "用户名或密码不能为空" })
        }
      } else {
        if (userInfo.phone && userInfo.code) {
          this.phoneLogin(userInfo)
        } else {
          this.$refs.uToast.show({ type: "error", message: "电话号码或验证码不能为空" })
        }
      }
    },

    // 账号密码登录
    async accountLogin(accountInfo) {
      try {
        this.loginBtn = { btnText: "登录中", disabled: true, loading: true }

        const { data: res } = await uni.request({
          url: "/wechat/user/login",
          method: "POST",
          data: { loginAct: accountInfo.userName, password: accountInfo.password },
        })
        console.log(res)
        if (res.status !== "200") return this.$refs.uToast.show({ type: "error", message: "登录失败" })
        if (res.message === "用户密码错误！") return this.$refs.uToast.show({ type: "error", message: "密码错误" })

        // 存储token，userInfo
        uni.setStorageSync("token", res.data.token)
        this.getUserInfo(res.data.user)
        uni.reLaunch({ url: "/pages/index/index" })
      } catch (err) {
        console.error(err)
        uni.$u.toast("服务器异常")
      } finally {
        this.loginBtn = { btnText: "立即登录", loading: false, disabled: false }
      }
    },

    // 电话号码登录
    async phoneLogin(phoneInfo) {
      try {
        this.loginBtn = { btnText: "登录中", disabled: true, loading: true }

        const { data: res } = await uni.request({
          url: "/wechat/user/login/phone",
          method: "POST",
          data: { userPhone: phoneInfo.phone, code: phoneInfo.code },
        })
        console.log(res)
        if (res.status !== "200") return this.$refs.uToast.show({ type: "error", message: "登录失败" })
        if (res.message === "验证码已过期！") return this.$refs.uToast.show({ type: "error", message: "验证码已过期" })

        // 存储token，userInfo
        uni.setStorageSync("token", res.data.token)
        this.getUserInfo(res.data.user)
        uni.reLaunch({ url: "/pages/index/index" })
      } catch (err) {
        console.error(err)
        uni.$u.toast("服务器异常")
      } finally {
        this.loginBtn = { btnText: "立即登录", loading: false, disabled: false }
      }
    },

    // 获取验证码
    async getCode(phone) {
      const regTel = /^[1][3,4,5,7,8,9][0-9]{9}$/
      if (!regTel.test(phone)) return this.$refs.uToast.show({ type: "error", message: "电话号码有误" })

      if (this.$refs.uCode.canGetCode) {
        // 通知验证码组件内部开始倒计时
        this.$refs.uCode.start()
        this.sending = true
        const { data: res } = await uni.request({ url: "/wechat/user/login/phone/code", method: "GET", data: { phone: phone } })
        console.log(res)
        if (res.status !== "200") return uni.$u.toast("获取验证码失败")
        this.$refs.uToast.show({ type: "success", message: "验证码已发送" })
      }
    },

    // 监听code改变
    codeChange(text) {
      this.tips = text
    },

    // 倒计时结束
    codeEnd() {
      this.sending = false
    },
  },
  watch: {
    // 监听表单切换
    isPhoneLogin: {
      immediate: true,
      handler(val) {
        // 重置表单
        this.firstColumn = ""
        this.secondColumn = ""

        // 切换表单
        if (!val) {
          this.formType = [
            {
              name: "userName",
              placeholder: "用户名",
              type: "text",
              icon: "tags",
              isPassword: false,
            },
            {
              name: "password",
              placeholder: "密码",
              type: "text",
              icon: "lock",
              isPassword: true,
            },
          ]
        } else {
          this.formType = [
            {
              name: "phone",
              placeholder: "电话号码",
              type: "number",
              icon: "share",
              isPassword: false,
            },
            {
              name: "code",
              placeholder: "验证码",
              type: "text",
              icon: "bell",
              isPassword: false,
              maxLength: 6,
            },
          ]
        }
      },
    },
  },

  // 组件周期函数--监听组件挂载完毕
  mounted() {
    // console.log("mounted")
  },
}
</script>

<style lang="scss" scoped>
.form-container {
  /* #ifdef H5 */
  @media screen and (min-width: 768px) {
      display: flex;
      flex-direction: column;
      align-items: center;
  }
  /* #endif */

  &-item {
    width: 80%;
    height: 70rpx;
    border-bottom: 2rpx solid #ceccca;
    margin-bottom: 30rpx;

    display: flex;
    align-items: center;

    /* #ifdef H5 */
    @media screen and (min-width: 768px) {
        width: 100%;
        height: 45px;
        margin-bottom: 20px;
        font-size: 16px;
    }
    /* #endif */

    input {
      margin-left: 15rpx;
      flex: 1;
    }
    .send {
      width: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #18b566;
      cursor: pointer;
      &.disabled {
        color: $uni-text-color-disable;
      }
      /* #ifdef H5 */
      @media screen and (min-width: 768px) {
          font-size: 14px;
          width: 100px;
      }
      /* #endif */
    }
  }

  .form-btns {
    overflow: hidden;
    margin-top: 100rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    /* #ifdef H5 */
    @media screen and (min-width: 768px) {
        margin-top: 40px;
        width: 100%;
    }
    /* #endif */

    &-item {
      height: 80rpx;
      width: 100%;
      border-radius: 40rpx;
      font-size: 36rpx;
      background-image: linear-gradient(to right, #38f9d7 0%, #43e97b 100%);
      margin-bottom: 20rpx;

      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;

      &-text {
        margin-left: 20rpx;
      }

      /* #ifdef H5 */
      @media screen and (min-width: 768px) {
          height: 45px;
          font-size: 18px;
      }
      /* #endif */
    }
  }

  .form-code {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50rpx;
    font-size: 34rpx;
    color: $uni-text-color-placeholder;
    cursor: pointer;
    /* #ifdef H5 */
    @media screen and (min-width: 768px) {
        font-size: 14px;
        height: 30px;
    }
    /* #endif */
  }
}
</style>
