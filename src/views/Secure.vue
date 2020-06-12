<template>
	<div class="secure">
		<van-nav-bar title="账号安全" left-arrow :fixed="true" @click-left="back" />
		<div class="button-box">
			<div>
				<van-button type="primary" color="red" round size="large" @click="logOff">退出登录</van-button>
			</div>
			<div class="password-box">
				<van-button type="primary" color="#008BFA" round size="large" @click="changeShow">修改密码</van-button>
			</div>
			<div>
				<van-button type="primary" color="#00C469" round size="large" @click="Islogout">注销</van-button>
			</div>
		</div>
		<van-action-sheet v-model="isShow" title="标题">
			<van-form @submit="ISconfirm">
				<van-field v-model="userInfo.formerPassword" type="text" name="旧密码" label="旧密码" placeholder="旧密码(6-12字符)" autocomplete="off"/>
				<van-field v-model="userInfo.password" type="text" name="新密码" label="新密码" placeholder="新密码(-12字符)" autocomplete="off"/>
				<div style="margin: 16px;">
					<van-button round block type="info" native-type="submit">
						确定
					</van-button>
				</div>
			</van-form>
		</van-action-sheet>
	</div>
</template>

<script>
	// 导入正则
	import {
		valid
	} from '../utils/valid'

	// 导入公共部分
	import {
		along
	} from '../utils/along'
	export default {
		name: "Secure",
		data() {
			return {
				isShow: false,
				userInfo: {
					formerPassword: "",
					password: ""
				}
			}
		},
		methods: {
			back() {
				this.$router.go(-1)
			},

			changeShow() {
				this.isShow = true;
			},

			ISconfirm() {
				
				if (valid.validForm(this.userInfo, this)) {
					//判断两个密码是否一致
					if (this.userInfo.password == this.userInfo.formerPassword) {
						this.$toast('新密码不能和旧密码一致');
						return;
					}
					let tokenString = localStorage.getItem('_t');

					this.axios({
						method: 'POST',
						url: '/updatePassword',
						data: {
							appkey: this.appkey,
							tokenString,
							oldPassword: this.userInfo.formerPassword,
							password: this.userInfo.password
						},
						transformRequest: along.transformRequest
					}).then(result => {
						console.log(result);
						if (result.data.code === 'E001') {

							this.isShow = false;

							//删除本地存储
							localStorage.removeItem('_t');
							
							 this.$store.commit('changeData', {key: 'isLogin', value: false});
							
							// 跳转登录页
							this.$router.push({
								name: 'Login'
							});
						} else {
							this.$toast(result.data.msg);
						}
					}).catch(err => {
						this.$toast.clear();
						
					})
				}
			},
			Islogout(){
				
				this.$dialog.confirm({
				  title: '注销账号',
				  message: '是否确定注销，一旦确认注销就无法恢复'
				}).then(text => {
				
				
				  if (text == 'confirm') {
				    //执行注销
				    let tokenString = localStorage.getItem('_t');
				
				    //加载提示
				    this.$toast.loading({
				      forbidClick: true,
				      duration: 0,
				      message: "加载中..."
				    });
				
				    this.axios({
				      method: 'POST',
				      url: '/destroyAccount',
				      data: {
				        appkey: this.appkey,
				        tokenString
				      },
				      transformRequest: along.transformRequest
				    }).then(result => {
				      this.$toast.clear();
				      
				      localStorage.removeItem('_t');
				      this.$router.push({name: 'Login'});
				    }).catch(err => {
				      this.$toast.clear();
				      
				    })
				
				  }
				  
				
				}).catch(err => {
				  
				})
				  
			
			},
			
			//退出登录
			logOff() {
			
			
			  let tokenString = localStorage.getItem('_t');
			
			    //加载提示
			    this.$toast.loading({
			      forbidClick: true,
			      duration: 0,
			      message: "加载中..."
			    });
			
			    this.axios({
			      method: 'POST',
			      url: '/logout',
			      data: {
			        appkey: this.appkey,
			        tokenString
			      },
			      transformRequest: along.transformRequest
			    }).then(result => {
			      this.$toast.clear();
			
			      localStorage.removeItem('_t');
			      this.$router.push({name: 'Login'});
			    }).catch(err => {
			      this.$toast.clear();
			      
			    })
			},
		}

	}
</script>

<style lang="less" scoped>
	.secure {
		position: relative;

		.van-nav-bar {
			background-color: #5D0900;

			.van-nav-bar__title {
				color: white;
			}

			.van-icon {
				color: white;
			}
		}

		padding-top: 46px;
		height: 621px;
		background-image: url("../imgs/u=27458007,1193891197&fm=26&gp=0.jpg");
		background-repeat: no-repeat;
		background-size: cover;
		background-position: center center;

		.password-box {
			margin: 20px 0;
		}

		.button-box {
			margin-top: 400px;
		}
	}
</style>
