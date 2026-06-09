<template>
  <view class="person-page">
    <!-- #ifdef H5 -->
    <view class="web-person">
      <view class="web-container">
        <!-- 左侧个人信息卡片 & 导航 -->
        <view class="web-side">
          <view class="profile-card">
            <image class="avatar" :src="userInfo.avatarUrl || '/static/person/myHeaderPicture.jpg'"></image>
            <view class="nickname">{{ userInfo.nickName || '未登录用户' }}</view>
            <view class="bio">{{ userInfo.signature || '开启智慧学习，成就卓越自我' }}</view>
            <view class="edit-btn" @click="gotoSetting">编辑资料</view>
          </view>
          
          <view class="side-menu">
            <view class="menu-group">个人中心</view>
            <view class="menu-item active"> <u-icon name="home" size="18"></u-icon> <text>我的主页</text> </view>
            <view class="menu-item"> <u-icon name="file-text" size="18"></u-icon> <text>我的课程</text> </view>
            <view class="menu-item"> <u-icon name="star" size="18"></u-icon> <text>我的收藏</text> </view>
            <view class="menu-group">创作中心</view>
            <view class="menu-item"> <u-icon name="edit-pen" size="18"></u-icon> <text>我的博客</text> </view>
            <view class="menu-item"> <u-icon name="chat" size="18"></u-icon> <text>我的贴子</text> </view>
          </view>
        </view>

        <!-- 右侧主面板 -->
        <view class="web-main">
          <!-- 统计卡片 -->
          <view class="stats-grid">
            <view class="stat-card">
              <view class="stat-val">20</view>
              <view class="stat-label">今日学习 (分)</view>
            </view>
            <view class="stat-card">
              <view class="stat-val">120</view>
              <view class="stat-label">累计打卡 (天)</view>
            </view>
            <view class="stat-card">
              <view class="stat-val">15</view>
              <view class="stat-label">关注社区</view>
            </view>
            <view class="stat-card">
              <view class="stat-val">580</view>
              <view class="stat-label">获得点赞</view>
            </view>
          </view>

          <!-- 功能区 -->
          <view class="section-card">
            <view class="section-header">常用服务</view>
            <view class="service-grid">
              <view class="service-item"> <u-icon name="order" color="#2979ff" size="30"></u-icon> <text>错题本</text> </view>
              <view class="service-item"> <u-icon name="integral" color="#ff9900" size="30"></u-icon> <text>技能树</text> </view>
              <view class="service-item"> <u-icon name="download" color="#19be6b" size="30"></u-icon> <text>我的下载</text> </view>
              <view class="service-item"> <u-icon name="calendar" color="#fa3534" size="30"></u-icon> <text>打卡记录</text> </view>
              <view class="service-item"> <u-icon name="man-add" color="#909399" size="30"></u-icon> <text>招聘信息</text> </view>
              <view class="service-item"> <u-icon name="question-circle" color="#71d5a1" size="30"></u-icon> <text>常见问题</text> </view>
            </view>
          </view>
          
          <view class="section-card">
            <view class="section-header">最近学习</view>
            <StudyRecords isWeb></StudyRecords>
          </view>
        </view>
      </view>
    </view>
    <!-- #endif -->

    <!-- #ifndef H5 -->
    <view class="person">
      <Header :userInfo="userInfo"></Header>
      <StudyRecords></StudyRecords>
      <CenterList></CenterList>
      <MyCreate></MyCreate>
      <TailList></TailList>
    </view>
    <!-- #endif -->
  </view>
</template>

<script>
import Header from "./header.vue"
import StudyRecords from "./studyRecords.vue"
import CenterList from "./centerList.vue"
import MyCreate from "./myCreate.vue"
import TailList from "./tailList.vue"
import { mapState } from "vuex"
export default {
  components: { Header, StudyRecords, CenterList, MyCreate, TailList },
  computed: { ...mapState("userModule", ["userInfo"]) },
  methods: {
    gotoSetting() { uni.navigateTo({ url: '/pages/person/settingInfo/setting' }) }
  }
}
</script>

<style lang="scss" scoped>
/* #ifdef H5 */
.web-person {
  background-color: #f1f5f9;
  min-height: calc(100vh - 60px);
  padding: 40px 0;
  
  .web-container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    gap: 30px;
    padding: 0 20px;
  }
  
  .web-side {
    width: 300px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    
    .profile-card {
      background: #fff;
      border-radius: 20px;
      padding: 40px 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      box-shadow: 0 4px 20px rgba(0,0,0,0.02);
      
      .avatar { width: 100px; height: 100px; border-radius: 50%; margin-bottom: 20px; border: 4px solid #f0fdfa; }
      .nickname { font-size: 18px; font-weight: 700; color: #1e293b; margin-bottom: 10px; }
      .bio { font-size: 14px; color: #64748b; line-height: 1.5; margin-bottom: 24px; }
      .edit-btn { padding: 8px 24px; border-radius: 20px; background: #f1f5f9; font-size: 13px; color: #475569; cursor: pointer; transition: all 0.2s; &:hover { background: #e2e8f0; } }
    }
    
    .side-menu {
      background: #fff;
      border-radius: 20px;
      padding: 15px 0;
      box-shadow: 0 4px 20px rgba(0,0,0,0.02);
      
      .menu-group { padding: 15px 25px 8px; font-size: 12px; color: #94a3b8; font-weight: 600; text-transform: uppercase; }
      .menu-item {
        padding: 12px 25px;
        display: flex;
        align-items: center;
        cursor: pointer;
        color: #64748b;
        transition: all 0.2s;
        text { margin-left: 15px; font-size: 15px; }
        &.active { color: #17ead9; background: #f0fdfa; font-weight: 600; }
        &:hover:not(.active) { background: #f8fafc; color: #1e293b; }
      }
    }
  }
  
  .web-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 24px;
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      
      .stat-card {
        background: #fff;
        border-radius: 20px;
        padding: 24px;
        text-align: center;
        box-shadow: 0 4px 20px rgba(0,0,0,0.02);
        .stat-val { font-size: 22px; font-weight: 700; color: #1e293b; margin-bottom: 8px; }
        .stat-label { font-size: 13px; color: #64748b; }
      }
    }
    
    .section-card {
      background: #fff;
      border-radius: 20px;
      padding: 30px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.02);
      
      .section-header { font-size: 16px; font-weight: 700; color: #1e293b; margin-bottom: 24px; }
      
      .service-grid {
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        gap: 20px;
        
        .service-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          transition: transform 0.2s;
          &:hover { transform: translateY(-3px); }
          text { margin-top: 12px; font-size: 13px; color: #475569; }
        }
      }
    }
  }
}
/* #endif */

/* #ifndef H5 */
.person { min-height: 100vh; background-color: $uni-bg-color-grey; box-sizing: border-box; }
/* #endif */
</style>

