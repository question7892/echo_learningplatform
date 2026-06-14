<template>
	<view class="myBlog">
		<!-- 封装我的博客页面: -->
		<ArticleList :articleList="articleList"></ArticleList>
	</view>
</template>

<script>
	// 导入请求方法:
	import {
		myRequest
	} from '@/utils/utils.js';
	// 导入文章组件:
	import ArticleList from '@/components/article-list/article-list.vue';

	export default {
		data() {
			return {
				articleList: []
			}
		},
		created() {
			this.requestArticle()
		},
		components: {
			ArticleList
		},
		methods: {
			requestArticle() {
				let myArticle = new Promise((resolve, reject) => {
					uni.request({
						url: '/user/get/Invitation',
						method: 'GET',
						success: (res) => {
							resolve(res)
						},
						fail: (err) => {
							reject(err)
						}
					})
				})
				myArticle.then(({
					data: res
				}) => {
					let myArray = res.data;
					console.log('文章数据:', myArray)
					// console.log(this.articleList)
					this.articleList = myArray;
				}).catch(err => {
					console.log(err)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
</style>
