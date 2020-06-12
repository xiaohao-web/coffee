<template>
	<div class="like">
		<van-nav-bar title="收藏" :fixed="true" left-arrow @click-left="back" />
		<div class="like-box-bg">
			<div class="like-box">
				<div :class="[index%2 == 0 ? 'a' : 'b']" v-for="(item,index) in likeData" :key="index">
				  <div>
				    <img class="auto-img" :src="item.smallImg" alt="">
				  </div>
				  <div class="title">{{item.name}}</div>
				  <div class="clearfix">
				    <span class="fl price">￥{{item.price}}</span>
				    <span class="fr delete">
				      <van-icon class="v-icon" name="delete" @click="removeLike(item.pid, index)" />
				    </span>
				  </div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {mapState} from 'vuex'
	import {along} from '../utils/along'
	
	export default {
		name: "Like",
		
		created() {
		  this.getLike();
		},
		
		computed: {
		  ...mapState('likeModule', ['likeData'])
		},
		
		methods: {
			
			getLike(){
				let tokenString = localStorage.getItem('_t');
				//初始化数据
				this.axios({
				  method: 'GET',
				  url: '/findAllLike',
				  params: {
				    appkey: this.appkey,
				    tokenString
				  }
				}).then(result => {
				  
				  if (result.data.code == 2000) {
				    this.$store.commit('likeModule/changeData', {key: 'likeData', value: result.data.result});
				    
				  }
				}).catch(err => {
				  
				})
			},
			
			//删除我的收藏商品
			removeLike(pid, index) {
			  
			  let tokenString = localStorage.getItem('_t');
			
			  this.axios({
			    method: 'POST',
			    url: '/notlike',
			    data: {
			      appkey: this.appkey,
			      tokenString,
			      pid
			    },
			    transformRequest: along.transformRequest
			  }).then(result => {
			    
			    this.$store.commit('likeModule/changeLikeData', index);
			  }).catch(err => {
			    
			  })
			
			},
			
			//返回上一级
			back() {
				this.$router.go(-1);
			},
		}
	}
</script>

<style lang="less" scoped>
	
	.like{
		.van-nav-bar{
			background-color: #5E0E08;
			.van-nav-bar__title{
				color: white;
			}
			.van-icon{
				color: white;
			}
		}
		height: 621px;
		background-color: #F4E4CA;
		padding-top: 46px;
		.like-box{
		  margin-top: 10px;
		  >div{
		    float: left;
		    width: calc(~"50% - 5px - 20px");
		    background-color: #fff;
		    padding: 10px;
		    margin-bottom: 10px;
			background-color: #F6F3EE;
		    &.a{
		      margin-right: 5px;
		    }
		    &.b{
		      margin-left: 5px;
		    }
		  }
		}
		.title{
		  padding: 10px 0;
		  color: #444;
		  font-size: 16px;
		}
		.price{
		  font-size: 14px;
		  color: #BB0000;
		  line-height: 24px;
		}
		.delete{
		  height: 24px;
		  width: 24px;
		  .v-icon{
		    font-size: 24px;
		    color: #6E241A;
		  }
		}
	}
	
</style>
