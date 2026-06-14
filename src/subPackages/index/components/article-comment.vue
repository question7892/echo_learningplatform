<template>
  <div class="comment">
    <!-- 评论列表 -->
    <view class="comment-list" :class="{ 'web-list': isWeb }" v-if="commentList.length">
      <view class="comment-list-item" :class="{ 'web-item': isWeb }" v-for="(comment, index) in commentList" :key="comment.uuid" @click="gotoReply(index)">
        <view class="cli-lf">
          <view class="comment-avatar" @click="previewAvatar(comment.avatarUrl)">
            <image class="avatar-img" :src="getAvatarUrl(comment.avatarUrl)" mode="aspectFill"></image>
          </view>
        </view>

        <!-- 右侧 -->
        <view class="cli-rg">
          <view class="cli-rg-author">
            <view class="cli-rg-author-name">
              <text>{{ comment.userName }}</text>
            </view>
            <my-tag class="cli-rg-author-tag" v-if="comment.isAuthor" size="mini" type="success" :circle="false">作者</my-tag>
          </view>
          <view class="cli-rg-content">
            <text>{{ comment.content }}</text>
          </view>

          <!-- 评论底部栏：日期、评论、点赞 -->
          <view class="cli-rg-footer">
            <view class="cli-rg-footer-date">{{ $u.timeFrom(Date.parse(comment.create_time), false) }}</view>
            <view class="cli-rg-footer-rg" v-if="showIcons">
              <view class="cli-rfr-call">
                <!-- color="#19be6b" -->
                <u-icon name="chat" :size="rpxToPx(45)" color="#808080"></u-icon>
                <text>{{ comment.commentNumber }}</text>
              </view>
              <view class="cli-rfr-like" @click.stop="giveLike(comment)">
                <!-- color="#fa3534" -->
                <u-icon name="heart" :size="rpxToPx(45)" :color="getThumbStatus(comment.id)"></u-icon>
                <text>{{ comment.likeNumber }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 空白页 -->
    <view class="comment-empty" v-else>
      <u-empty text="暂无评论" mode="message"></u-empty>
    </view>
  </div>
</template>

<script>
export default {
  props: {
    commentList: {
      type: Array,
      required: true,
    },
    hasLikedArr: {
      type: Array,
      required: true,
    },
    showIcons: {
      type: Boolean,
      default: true,
    },
    isWeb: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    styles: {
      thumbColor: "#808080",
    },
  }),
  computed: {
    getThumbStatus() {
      return id => {
        return this.hasLikedArr.includes(id) ? "#fa3534" : "#808080"
      }
    },
  },
  methods: {
    // 头像回退
    getAvatarUrl(url) {
      return url || '/static/default-avatar.jpg'
    },
    // 点赞点击处理函数
    async giveLike(comment) {
      const { data: res } = await uni.request({
        url: "/index/like/one/comment",
        data: { commentId: comment.id, likeNumber: comment.likeNumber },
      })
      if (res.status != 200) return uni.$u.toast("出错了")
      this.$emit("giveCommentLikeHandler")
    },

    // 跳转回复页
    gotoReply(index) {
      let commentStr = JSON.stringify(this.commentList[index])
      uni.navigateTo({ url: `/subPackages/index/reply/reply?comment=${commentStr}` })
    },
  },
  watch: {},

  mounted() {
    // console.log(this.hasLikedArr, "hasLikedArr")
    // console.log(this.commentList, "commentList")
  },
}
</script>

<style lang="scss" scoped>
@mixin vertical_center($mode: flex-start) {
  display: flex;
  justify-content: $mode;
  align-items: center;
}
.comment {
  // background-color: #fff;
  margin: 0 0 50rpx;

  &-list {
    .item_hover {
      background-color: #f3f4f6;
      transition: background-color 0.2s ease;
    }

    &-item {
      padding: 24rpx 20rpx;
      display: flex;
      background-color: #fff;
      border-radius: 12rpx;
      box-shadow: 0 1rpx 8rpx rgba(0, 0, 0, 0.03);
      margin: 0 0 16rpx;
      .cli-lf {
        margin-right: 30rpx;
        .comment-avatar {
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

      .cli-rg {
        flex: 1;
        display: flex;
        flex-direction: column;
        &-author {
          @include vertical_center();
          font-weight: 600;
          font-size: $uni-font-size-article-comment;
          margin-bottom: 20rpx;

          &-tag {
            margin-left: 20rpx;
          }
        }

        &-content {
          color: $uni-color-paragraph;
          font-size: $uni-font-size-article-comment;
          line-height: 1.6;
        }

        &-footer {
          @include vertical_center(space-between);
          margin-top: 20rpx;
          height: 60rpx;

          &-date {
            color: $uni-text-color-disable;
            font-size: $uni-font-size-article-meta;
          }

          &-rg {
            width: 40%;
            height: 100%;
            margin-right: 20rpx;
            @include vertical_center(center);
            .cli-rfr-call,
            .cli-rfr-like {
              @include vertical_center();
              // 小优化，增大可点击区域
              height: 100%;
              padding: 0 20rpx;
              cursor: pointer;
              transition: transform 0.15s ease;
              &:active { transform: scale(0.9); }

              & > text {
                color: $uni-text-color-placeholder;
                font-size: $uni-font-size-article-meta;
              }
            }
          }
        }
      }
    }
  }
}

/* #ifdef H5 */
@media screen and (min-width: 768px) {
  .comment {
    margin: 0;
    .web-list {
      .web-item {
        padding: 20px 24px;
        margin: 0 0 12px;
        border-radius: 12px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        transition: background-color 0.2s ease;
        cursor: pointer;
        &:hover { background-color: #fafbfc; }

        .cli-lf {
          margin-right: 20px;
          .comment-avatar {
            width: 42px;
            height: 42px;
          }
        }

        .cli-rg {
          &-author {
            font-size: 15px;
            margin-bottom: 8px;
          }
          &-content {
            font-size: 15px;
            line-height: 1.7;
            color: #475569;
          }
          &-footer {
            margin-top: 14px;
            height: 40px;
            &-date { font-size: 13px; color: #94a3b8; }
            &-rg {
              width: auto;
              gap: 16px;
              margin-right: 0;
              .cli-rfr-call,
              .cli-rfr-like {
                padding: 0 12px;
                cursor: pointer;
                & > text { font-size: 13px; color: #94a3b8; }
                ::v-deep .u-icon__icon {
                  font-size: 18px !important;
                  line-height: 18px !important;
                }
              }
            }
          }
        }
      }
    }
  }
}
/* #endif */
</style>

