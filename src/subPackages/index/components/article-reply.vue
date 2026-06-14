<template>
  <view class="reply">
    <!-- 回复列表 -->
    <view class="reply-list" :class="{ 'web-list': isWeb }" v-if="replyList.length">
      <view class="reply-list-item" :class="{ 'web-item': isWeb }" v-for="item in replyList" :key="item.id" hover-class="item_hover">
        <view class="rli-lf">
          <view class="reply-avatar">
            <image class="avatar-img" :src="getAvatarUrl(item.avatarUrl)" mode="aspectFill"></image>
          </view>
        </view>

        <!-- 回复主体 -->
        <view class="rli-rg">
          <view class="rli-rg-user">
            <view class="rli-rg-user-name">{{ item.userName }}</view>
            <view class="rli-rg-user-tag"></view>
          </view>

          <!-- 日期 -->
          <view class="rli-rg-date">{{ $u.timeFrom(Date.parse(item.create_time), false) }}</view>

          <!-- 内容 -->
          <view class="rli-rg-content">{{ item.content }}</view>
        </view>
      </view>
    </view>

    <!-- 空白页 -->
    <!-- 空白页 -->
    <view class="reply-empty" v-else>
      <u-empty text="暂无回复" mode="message"></u-empty>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    replyList: {
      type: Array,
      required: true,
    },
    isWeb: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({}),
  computed: {},
  methods: {
    // 头像回退
    getAvatarUrl(url) {
      return url || '/static/default-avatar.jpg'
    },
  },
  watch: {},

  mounted() {},
}
</script>

<style lang="scss" scoped>
.reply {
  &-list {
    .item_hover {
      background-color: #f3f4f6;
      transition: background-color 0.2s ease;
    }
    &-item {
      background-color: #fff;
      padding: 24rpx 20rpx;
      display: flex;
      border-radius: 12rpx;
      box-shadow: 0 1rpx 8rpx rgba(0, 0, 0, 0.03);
      margin: 0 0 16rpx;
      border-left: 6rpx solid #17ead9;
      margin-left: 16rpx;

      .rli-lf {
        margin-right: 24rpx;
        .reply-avatar {
          width: 70rpx;
          height: 70rpx;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
          .avatar-img {
            width: 100%;
            height: 100%;
            display: block;
          }
        }
      }
      .rli-rg {
        flex: 1;
        display: flex;
        flex-direction: column;

        &-user {
          display: flex;
          align-items: center;
          font-weight: 600;
          font-size: $uni-font-size-article-comment;
          margin-bottom: 8rpx;
          &-name {
            margin-right: 20rpx;
          }
        }

        &-date {
          color: $uni-text-color-disable;
          font-size: $uni-font-size-article-meta;
          margin-bottom: 16rpx;
        }

        &-content {
          color: $uni-color-paragraph;
          font-size: $uni-font-size-article-comment;
          line-height: 1.6;
        }
      }
    }
  }
}

/* #ifdef H5 */
@media screen and (min-width: 768px) {
  .reply {
    .web-list {
      .web-item {
        padding: 20px 24px;
        margin: 0 0 12px;
        border-radius: 12px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        border-left: 4px solid #17ead9;
        margin-left: 20px;
        transition: background-color 0.2s ease;
        cursor: pointer;
        &:hover { background-color: #fafbfc; }

        .rli-lf {
          margin-right: 20px;
          .reply-avatar {
            width: 42px;
            height: 42px;
          }
        }

        .rli-rg {
          &-user {
            font-size: 15px;
            margin-bottom: 6px;
          }
          &-date {
            font-size: 13px;
            color: #94a3b8;
            margin-bottom: 10px;
          }
          &-content {
            font-size: 15px;
            line-height: 1.7;
            color: #475569;
          }
        }
      }
    }
  }
}
/* #endif */
</style>

