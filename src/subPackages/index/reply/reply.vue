<template>
  <view class="reply">
    <!-- 父级评论 -->
    <article-comment :commentList="comment" :showIcons="false" isWeb></article-comment>

    <!-- 回复 -->
    <view class="reply-title">
      <view class="reply-title-text">全部回复</view>
      <view class="reply-title-add" @click.stop="openPanel">
        <u-button type="primary" plain hairline text="添加回复" shape="circle" size="small"></u-button>
      </view>
    </view>

    <!-- 回复列表 -->
    <article-reply :replyList="replyList" isWeb></article-reply>

    <!-- 回复面板 -->
    <publishPanel @receiveText="publishReply" ref="replyPanel"></publishPanel>
  </view>
</template>

<script>
import ArticleComment from "../components/article-comment.vue"
import ArticleReply from "../components/article-reply.vue"
import { replyList } from "@/mock/replyList.js"
export default {
  components: { ArticleComment, ArticleReply },
  data: () => ({
    comment: [],
    replyList: [],
  }),
  computed: {},
  methods: {
    // 打开面板
    openPanel() {
      this.$refs.replyPanel.popupShow = true
    },

    // 获取回复列表
    async getReplyList() {
      try {
        const { data: res } = await uni.request({ url: "/index/get/all/re/comment", data: { parentId: this.comment[0].id } })
        // console.log(res)
        if (res.status != 200) return uni.$u.toast("获取回复列表失败")
        this.replyList = res.data.comment
      } catch (err) {
        console.error(err)
        uni.$u.toast("请求异常")
      }
    },

    // 回复
    async publishReply(value) {
      try {
        const { data: res } = await uni.request({
          url: "/index/add/re/comment",
          data: {
            parentId: this.comment[0].id,
            commentNumber: this.comment[0].commentNumber,
            content: value,
          },
        })
        // console.log(res)
        if (res.status != 200) return uni.$u.toast("回复失败")
        this.getReplyList()
      } catch (err) {
        console.error(err)
        uni.$u.toast("请求异常")
      } finally {
        this.$refs.replyPanel.text = ""
        this.$refs.replyPanel.btn = { text: "发布", loading: false, disabled: false }
        this.$refs.replyPanel.popupShow = false
      }
    },
  },
  watch: {},

  onLoad(options) {
    let comment = JSON.parse(options.comment)
    this.comment.push(comment)
    this.getReplyList()
  },
}
</script>

<style lang="scss">
// 设置页面背景
page {
  background-color: $uni-bg-color-grey;
}
</style>

<style lang="scss" scoped>
.reply {
  background-color: $uni-bg-color-grey;
  &-title {
    display: flex;
    justify-content: space-between;
    background-color: #fff;
    height: 100rpx;
    margin-top: 30rpx;
    padding: 0 40rpx;
    padding-right: 60rpx;
    align-items: center;
    width: 100%;
    box-sizing: border-box;
    border-bottom: 2rpx solid #f3f4f6;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
    &-text {
      font-weight: bold;
      font-size: $uni-font-size-subtitle;
    }
  }
}

/* #ifdef H5 */
@media screen and (min-width: 768px) {
  .reply {
    max-width: 900px;
    margin: 0 auto;
    padding: 0 0 40px;
    min-height: calc(100vh - 60px);

    &-title {
      margin-top: 24px;
      border-radius: 16px 16px 0 0;
      height: 56px;
      padding: 0 40px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04);
      &-text { font-size: 18px; }
    }
  }
}
/* #endif */
</style>
