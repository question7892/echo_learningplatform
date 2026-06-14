<template>
  <div class="file-container" :class="{ 'web-grid': isWeb }">
    <template v-if="fileList.length">
      <view class="file-list" :class="{ 'grid-wrapper': isWeb }">
        <view class="file-list-item" v-for="item in fileList" :key="item.id" @click="openFile(item.id, item.url)" :class="{ 'web-card': isWeb }">
          
          <view class="web-file-main" v-if="isWeb">
              <view class="t-icon" :class="[`t-icon-${item.type}`]"></view>
          </view>

          <view class="file-list-item-info">
            <!-- Mobile Icon -->
            <view v-if="!isWeb" class="t-icon" :class="[`t-icon-${item.type}`]"></view>
            
            <view class="text-content">
                <view class="name u-line-1">{{ item.name }}</view>
                <view class="size">{{ item.size }}</view>
            </view>

            <!-- 进度条 -->
            <view class="progress" v-if="getFileProgressStatus(item.id)">
              <u-line-progress :percentage="fileStatusObject[item.id].progress" :showText="false" :height="rpxToPx(10)"></u-line-progress>
              <view class="progress-text">{{ fileStatusObject[item.id].progress + "%" }}</view>
            </view>

            <view class="exist" v-show="fileStatusObject[item.id] && fileStatusObject[item.id].isExist">已下载</view>
          </view>

          <view class="file-list-item-download" @click.stop="downloadClickHandler(item.id, item.url)">
            <u-loading-icon :show="fileStatusObject[item.id] && fileStatusObject[item.id].downloading" mode="circle" color="#ff9900"></u-loading-icon>
            <view v-show="!fileStatusObject[item.id] || !fileStatusObject[item.id].downloading" class="t-icon t-icon-xiazai"></view>
          </view>
        </view>
      </view>
    </template>
    <u-empty v-else class="empty" icon="http://cdn.uviewui.com/uview/empty/data.png" text="暂无相关资料"></u-empty>
  </div>
</template>

<script>
export default {
  props: {
    fileList: { type: Array, required: true },
    isWeb: { type: Boolean, default: false }
  },
  data: () => ({
    fileStatusObject: {}, savedFileList: [],
  }),
  computed: {
    getFileProgressStatus() {
      return id => {
        if (this.fileStatusObject[id] !== undefined) return this.fileStatusObject[id].downloading
        return false
      }
    },
  },
  methods: {
    getSavedFileList() {
      const saved = uni.getStorageSync("savedFileList")
      if (saved) this.savedFileList = JSON.parse(saved)
    },
    fileStatusListInit() {
      this.fileList.forEach(file => {
        let isExist = this.savedFileList.some(item => item.id === file.id)
        this.$set(this.fileStatusObject, file.id, { downloading: false, progress: 0, isExist: isExist })
      })
    },
    async downloadClickHandler(id, url) {
      if (this.fileStatusObject[id] && this.fileStatusObject[id].downloading) return
      if (this.fileStatusObject[id] && this.fileStatusObject[id].isExist) {
        const { cancel } = await uni.showModal({ title: "提示", content: "文件已下载，是否重新下载？" })
        if (cancel) return
      }
      this.downloadFile(id, url)
    },
    downloadFile(id, url) {
      if (!this.fileStatusObject[id]) this.$set(this.fileStatusObject, id, { downloading: true, progress: 0, isExist: false })
      else this.fileStatusObject[id].downloading = true
      
      const downloadTask = uni.downloadFile({
        url: url,
        success: async ({ tempFilePath, statusCode }) => {
          if (statusCode === 200) {
            this.fileStatusObject[id].isExist = true
            this.$u.toast("下载成功")
          }
        },
        complete: () => { this.fileStatusObject[id].downloading = false },
      })
      downloadTask.onProgressUpdate(({ progress }) => { this.fileStatusObject[id].progress = progress })
    },
    async openFile(id, url) {
      // #ifdef H5
      window.open(url, "_blank")
      // #endif

      // #ifndef H5
      uni.showLoading({ title: "正在加载文件" })
      uni.downloadFile({
        url: url,
        success: (res) => {
          if (res.statusCode === 200) {
            uni.openDocument({
              filePath: res.tempFilePath,
              success: () => {
                console.log("打开文档成功")
              },
              fail: (err) => {
                console.error(err)
                uni.$u.toast("暂不支持预览该格式或文件损坏")
              }
            })
          } else {
            uni.$u.toast("文件加载失败")
          }
        },
        fail: () => {
          uni.$u.toast("网络异常，无法加载文件")
        },
        complete: () => {
          uni.hideLoading()
        }
      })
      // #endif
    }
  },
  mounted() { this.getSavedFileList(); this.fileStatusListInit(); }
}
</script>

<style lang="scss" scoped>
.file-container { box-sizing: border-box; }

/* Web Grid Styles */
.web-grid {
  padding: 0 !important;
  .grid-wrapper {
    display: grid !important;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 20px;
    
    .web-card {
      margin-bottom: 0 !important;
      background: #fff;
      border-radius: 12px;
      padding: 20px !important;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      border: 1px solid #f1f5f9;
      transition: all 0.3s;
      
      &:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.05); }
      
      .web-file-main {
          margin-bottom: 15px;
          .t-icon { width: 60px; height: 60px; }
      }
      
      .file-list-item-info {
          width: 100% !important;
          .name { font-size: 15px !important; font-weight: 600; color: #1e293b; margin-bottom: 5px; }
          .size { font-size: 12px !important; color: #94a3b8; }
      }
      
      .file-list-item-download {
          margin-top: 15px; width: 100% !important; justify-content: center !important;
          .t-icon-xiazai { width: 30px !important; height: 30px !important; }
      }
    }
  }
}

/* Original Mobile Styles */
.file-list {
  padding: 20rpx;
  &-item {
    display: flex; align-items: center; background-color: #fff; padding: 20rpx; margin-bottom: 20rpx; border-radius: 20rpx;
    .t-icon { width: 100rpx; height: 100rpx; margin-right: 20rpx; }
    &-info { flex: 1; display: flex; flex-direction: column;
      .name { color: $uni-color-paragraph; font-size: 34rpx; }
      .size { font-size: 24rpx; color: $uni-text-color-disable; }
    }
    &-download { width: 80rpx; display: flex; justify-content: center; .t-icon-xiazai { width: 60rpx; height: 60rpx; } }
  }
}
</style>

