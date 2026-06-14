<template>
  <u-popup class="panel" :show="popupShow" mode="bottom" :round="20" @close="closePopup">
    <view class="panel-container">
      <!-- 顶部拖拽条 -->
      <view class="panel-drag-bar"></view>

      <view class="panel-body">
        <view class="input-area">
          <u-textarea count focus v-model="text" :showConfirmBar="false" height="120"></u-textarea>
        </view>

        <view class="handler">
          <view class="handler-btn" @click.stop="publish">
            <u-button
              type="primary"
              icon="play-right"
              hairline
              size="small"
              :loading="btn.loading"
              :disabled="btn.disabled"
              shape="circle"
            >
              {{ btn.text }}
            </u-button>
          </view>
        </view>
      </view>
    </view>
  </u-popup>
</template>

<script>
export default {
  props: {},
  data: () => ({
    popupShow: false,
    text: "",
    btn: { text: "发布", loading: false, disabled: false },
  }),
  computed: {},
  methods: {
    // 关闭popup
    closePopup() {
      this.popupShow = false
    },

    // 发布，传递
    publish() {
      if (!this.text.trim().length) return uni.$u.toast("内容不能为空")
      this.btn = { text: "", loading: true, disabled: true }
      this.$emit("receiveText", this.text.trim())

      // this.text = ""
      // this.popupShow = false
    },
  },
  watch: {},

  mounted() {},
}
</script>

<style lang="scss" scoped>
.panel-container {
  background: #fff;
  padding-bottom: env(safe-area-inset-bottom);

  .panel-drag-bar {
    width: 60rpx;
    height: 6rpx;
    background: #d0d5dd;
    border-radius: 3rpx;
    margin: 16rpx auto 0;
  }

  .panel-body {
    padding: 20rpx 30rpx;
    display: flex;
    align-items: flex-end;
    gap: 20rpx;

    .input-area {
      flex: 1;
      min-height: 120rpx;
    }

    .handler {
      flex-shrink: 0;
      padding-bottom: 8rpx;

      &-btn {
        ::v-deep .u-button {
          padding: 0 32rpx;
          height: 56rpx;
          line-height: 56rpx;
          font-size: 26rpx;
        }
      }
    }
  }
}

/* #ifdef H5 */
@media screen and (min-width: 768px) {
  .panel {
    ::v-deep .u-popup__content {
      width: 100%;
      border-radius: 16px 16px 0 0;
      overflow: hidden;
      box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.1);
    }
  }
  .panel-container {
    .panel-body {
      padding: 20px 32px;
      gap: 16px;

      .input-area {
        min-height: 90px;
        ::v-deep .u-textarea {
          font-size: 15px;
        }
        ::v-deep .u-textarea__field {
          height: 80px !important;
        }
      }

      .handler {
        padding-bottom: 6px;

        &-btn {
          ::v-deep .u-button {
            padding: 0 28px;
            height: 40px;
            line-height: 40px;
            font-size: 14px;
          }
        }
      }
    }
  }
}
/* #endif */
</style>
