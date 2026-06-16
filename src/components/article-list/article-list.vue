<template>
  <view class="article-container" :class="{ 'web-grid': isWeb }">
    <view class="article-list" :class="{ 'grid-wrapper': isWeb }" v-if="articleList.length">
      <view
        class="article-list-item"
        v-for="item in articleList"
        :key="item.id"
        @click.stop="gotoDetail(item.id)"
        :class="{ 'web-card': isWeb }"
        hover-class="item_hover"
      >
        <!-- Web 特有的封面图展示 (置顶) -->
        <!-- #ifdef H5 -->
        <view class="web-cover" v-if="isWeb && item.coverImgUrl">
          <u-image :src="item.coverImgUrl" width="100%" height="180px" radius="12px 12px 0 0" mode="aspectFill"></u-image>
        </view>
        <!-- #endif -->

        <view class="card-content">
          <!-- 作者信息：头像 + ID，左上角 -->
          <view class="article-author">
            <u-avatar
              :src="(item.user && item.user.imageUrl) || '/static/default-avatar.jpg'"
              size="40"
            ></u-avatar>
            <text class="author-name">{{ (item.user && item.user.nickName) || '匿名用户' }}</text>
          </view>

          <!-- 标题 -->
          <view class="article-title u-line-1">{{ item.title }}</view>

          <!-- 主体 ，内容，封面，标签-->
          <view class="article-list-item-main" v-if="!isWeb">
            <view class="content">
              <view class="content-text u-line-2">{{ item.content }}</view>
              <view class="content-tags">
                <my-tag class="tag" size="mini" type="success" v-for="(tag, index) in (item.tag || [])" :key="index">{{ tag }}</my-tag>
              </view>
            </view>
            <u-image v-if="item.coverImgUrl" :showLoading="true" :src="item.coverImgUrl" width="160rpx" height="120rpx" radius="8px" mode="aspectFill"></u-image>
          </view>

          <!-- Web 版内容简述 -->
          <!-- #ifdef H5 -->
          <view class="web-desc u-line-2" v-if="isWeb">{{ item.content }}</view>
          <!-- #endif -->

          <!-- 尾部，日期，标签，点赞，评论，浏览 -->
          <view class="article-list-item-footer">
            <view class="date" v-if="!isWeb">{{ $u.timeFrom(Date.parse(item.create_time), false) }}</view>
            <view class="web-footer-left" v-if="isWeb">
                <my-tag class="tag" size="mini" type="primary" v-for="(tag, index) in (item.tag || [])" :key="index">{{ tag }}</my-tag>
            </view>
            <view class="stats">
              <view class="icon"><u-icon name="eye" size="18"></u-icon><text>{{ item.visitNumber }}</text></view>
              <view class="icon"><u-icon name="thumb-up" size="18"></u-icon><text>{{ item.likeNumber }}</text></view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <u-empty v-else class="empty" mode="data" text="文章列表为空"></u-empty>
  </view>
</template>

<script>
import { saveBrowseHistory } from "@/utils/storageUtils.js"
export default {
  props: {
    articleList: { type: Array, required: true },
    isWeb: { type: Boolean, default: false }
  },
  methods: {
    gotoDetail(articleId) {
      // 查找当前点击的文章数据并保存浏览记录
      const article = this.articleList.find(item => item.id === articleId)
      if (article) {
        saveBrowseHistory(article)
      }
      uni.navigateTo({ url: "/subPackages/index/articleDetail/articleDetail?articleId=" + articleId })
    },
  },
}
</script>

<style lang="scss" scoped>
.article-container { box-sizing: border-box; padding: 20rpx; }

/* ====== 作者信息（头像 + ID，左上角） ====== */
.article-author {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
  .author-name {
    margin-left: 14rpx;
    font-size: 26rpx;
    color: #1e293b;
    font-weight: 500;
  }
}

/* ====== 标题 ====== */
.article-title {
  font-size: $uni-font-size-subtitle;
  font-weight: bold;
  color: #1e293b;
  margin-bottom: 16rpx;
}

/* Web Grid Styles */
.web-grid {
  padding: 0 !important;
  .grid-wrapper {
    display: grid !important;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 24px;

    .web-card {
      margin-bottom: 0 !important;
      padding: 0 !important;
      display: flex;
      flex-direction: column;
      border: 1px solid #f1f5f9;
      transition: all 0.3s;
      cursor: pointer;
      overflow: hidden;

      &:hover { transform: translateY(-5px); box-shadow: 0 12px 24px rgba(0,0,0,0.08); border-color: #17ead9; }

      .card-content { padding: 20px; flex: 1; display: flex; flex-direction: column; }

      .article-author {
        margin-bottom: 12px;
        .author-name { font-size: 14px; color: #334155; }
      }

      .article-title { font-size: 16px; margin-bottom: 12px; }

      .web-desc { font-size: 14px; color: #475569; line-height: 1.6; margin-bottom: 20px; flex: 1; }

      .article-list-item-footer {
        padding-top: 15px; border-top: 1px solid #f1f5f9;
        .web-footer-left { display: flex; gap: 8px; flex: 1; }
        .stats { display: flex; gap: 15px; .icon { display: flex; align-items: center; color: #94a3b8; font-size: 13px; text { margin-left: 4px; } } }
      }
    }
  }
}

/* Original Mobile Styles */
.article-list {
  .item_hover { background-color: #f3f4f6; transition: background-color 0.2s ease; }
  &-item {
    background-color: #fff; margin-bottom: 20rpx; padding: 26rpx; border-radius: 16rpx;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
    &-main {
      display: flex; height: 150rpx;
      .content {
        flex: 1; font-size: $uni-font-size-paragraph; color: $uni-color-paragraph; margin-right: 20rpx;
        &-text { margin-bottom: 24rpx; }
        &-tags { display: flex; .tag { margin-right: 14rpx; } }
      }
    }
    &-footer {
      display: flex; padding-top: 20rpx; justify-content: flex-end; align-items: center;
      .date { margin-right: auto; font-size: $uni-font-size-article-meta; color: $uni-text-color-disable; }
      .icon { margin-right: 30rpx; display: flex; align-items: center; color: $uni-text-color-disable; font-size: $uni-font-size-article-meta; & > view { margin-left: 4rpx; color: #19be6b; } }
    }
  }
}
</style>
