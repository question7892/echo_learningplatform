<template>
  <!-- 封装我创作的贴子: -->
  <view>
    <u-navbar :title="tittle" :autoBack="true"></u-navbar>
    <view class="myCreated">
      <PostPage></PostPage>
    </view>
  </view>
</template>

<script>
import PostPage from "../../../components/pageComponents/postPage.vue"
export default {
  data() {
    return {
      tittle: "",
      records: [],
    }
  },
  onLoad(option) {
    let res = JSON.parse(option.Obj)
    console.log("post的res", res)
    this.tittle = res.text
    // console.log(res);
    this.myRequest()
  },
  components: {
    PostPage,
  },
  methods: {
    myRequest() {
      let myreq = new Promise((resolve, reject) => {
        uni.request({
          url: "/user/get/Invitation",
          method: "GET",
          success: res => {
            resolve(res)
          },
          fail: err => {
            reject(err)
          },
        })
      })
      myreq
        .then(res => {
          let result = res.data.data
          // for(let i=0;i<result.length;i++){
          // 	this.myrecords[i].
          // }
          this.records = result
          console.log(result)
        })
        .catch(err => {
          console.log("返回错误:", err)
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.myCreated {
  margin-top: 150rpx;
  display: flex;
  flex-direction: column;
}
</style>
