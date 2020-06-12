<template>
	<div class="my">
		<van-nav-bar title="我的" :fixed="true"  />
		<div class="bg-box">
			<div class="bg-top" :style="{backgroundImage: 'url(' + userInfo.userBg + ')'}">
				<!-- 更换背景 -->
				<div class="changebg">
				  <span>更换背景</span>
				  <van-uploader class="v-bg" :after-read="upload" />
				</div>
				
				<div class="parIcon">
					<div class="Icon"><img class="auto-img" :src="userInfo.userImg" alt=""></div>
					<div class="name-box">{{userInfo.nickName}}</div>
				</div>
			</div>
			 <van-cell-group>
			  <van-cell v-for="(item, index) in cellData" :key="index" :title="item.title" size="large" @click="goPage(item.name)" is-link />
			</van-cell-group>
		</div>
	</div>
</template>

<script>
	
	import {mapState} from 'vuex'
	
	import {along} from '../utils/along'
	


	export default {
		name: 'My',
		computed: {
			...mapState('myModule', ['cellData','userInfo']),
		},
		created() {
		  this.getuserInfo();
		},
		methods: {
			goPage(name) {
				this.$router.push({
					name
				});
			},
			
			//上传背景
			upload(file) {
			
			  // if (!this.isLogin) {
			  //   this.$toast('请先登录');
			  //   return;
			  // }
			
			  //控制上传图片大小不能超过 300KB
			  let imgSize = 300 * 1024;
			  if (file.file.size > imgSize) {
			    this.$toast('上传图片大小不能超过300KB');
			    return;
			  }
			
			  let imgType = file.file.type.split('/')[1];
			  // 
			
			  //处理图片的base64
			  let serverBase64Img = file.content.replace(/data:image\/[A-Za-z]+;base64,/, '');
			  // 
			
			  let tokenString = localStorage.getItem('_t');
			
			  //加载提示
			  this.$toast.loading({
			    forbidClick: true,
			    duration: 0,
			    message: "加载中..."
			  });
			
			  this.axios({
			    method: 'POST',
			    url: '/updateUserBg',
			    data: {
			      appkey: this.appkey,
			      tokenString,
			      imgType,
			      serverBase64Img
			    },
			    transformRequest: along.transformRequest
			  }).then(result => {
			    this.$toast.clear();
			    
			    this.userInfo.userBg = result.data.userBg;
			  }).catch(err => {
			   this.$toast.clear();
			   
			    
			  })
			
			},
			
			
			getuserInfo(){
				let tokenString = localStorage.getItem('_t');
				
				//加载提示
				this.$toast.loading({
				  forbidClick: true,
				  duration: 0,
				  message: "加载中..."
				});
				
				this.axios({
				  method: 'GET',
				  url: '/findMy',
				  params: {
				    appkey: this.appkey,
				    tokenString
				  }
				}).then(result => {
				  this.$toast.clear();
				  
				  this.$store.commit('myModule/changeData', {key: 'userInfo', value: result.data.result[0]});
				}).catch(err => {
				  this.$toast.clear();
				  
				})
			},
			
			
		}
	}
</script>

<style lang="less" scoped>
	.my {
		.van-nav-bar {
			background-color: #5D0900;

			.van-nav-bar__title {
				color: white;
			}

			.van-icon {
				color: white;
			}
		}

		.bg-box {
			padding-top: 46px;
			height: 621px;
			background-color: #E7DAC2;
		}

		.bg-top {
			height: 200px;
			background-repeat: no-repeat;
			background-size: cover;
			background-position: center center;
			position: relative;
			.changebg{
				position: absolute;
				top: 20px;
				left: 20px;
				color: #fff;
				font-size: 14px;
				.v-bg{
				  position: absolute;
				  left: 0;
				  top: 0;
				  width: 100%;
				  height: 100%;
				  overflow: hidden;
				  opacity: 0;
				}
			}
			.parIcon {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				text-align: center;

				.Icon {
					overflow: hidden;
					border-radius: 50%;
					width: 80px;
					height: 80px;
					background-color: white;
					margin: 0 auto;
				}

				.name-box {
					color: white;
					font-size: 16px;
				}
			}

		}
	
	    .van-cell{
			&:nth-child(2){
				margin-bottom: 20px;
			}
			background-color: #F4E4CA;
		}
		
		.van-cell-group{
			background-color: #E7DAC2;
		}
	}
</style>
