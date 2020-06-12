<template>

	<div class="login">
		<div class="logo">
			<img class="auto-img" src="../assets/logo.png" alt="" />
		</div>
		<van-form @submit="login">
			<van-field v-model="userInfo.phone" name="手机号" label="手机号" placeholder="11位手机号" autocomplete="off" />
			<van-field v-model="userInfo.password" type="text" name="密码" label="密码" placeholder="密码(6-12字符)" autocomplete="off" />
			<div class="btn-box">
				<van-button round block type="info" native-type="submit">登录</van-button>
			</div>
		</van-form>
		<div class="operation clearfix">
			<div class="zhuze fl" @click="goPublic(goWeb.goRegister)">注册</div>
			<div class="wangji fr" @click="goPublic(goWeb.goForget)">忘记密码</div>
		</div>
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
		name: "Login",
		
		data(){
			return {
				 goWeb:{
					goRegister:"Register",
					goForget:"Forget"
				}
			}
		},

		computed: {
			userInfo() {
				return this.$store.state.loginModule.userInfo
			}
		},

		methods: {
			
			//跳转注册页
			goPublic(str){
				this.$router.push({name: str})
			},
			
			//登录
			login() {
				

				//加载提示
				this.$toast.loading({

					//是否禁止背景点击
					forbidClick: true,

					//禁止自动关闭
					duration: 0,

					message: '登录中...'

				})

				if (valid.validForm(this.userInfo, this)) {

					//发起post请求
					this.axios({
						method: "POST",
						url: "/login",
						data: {
							appkey: this.appkey,
							nickName: this.userInfo.nickName,
							phone: this.userInfo.phone,
							password: this.userInfo.password
						},

						transformRequest: along.transformRequest
					}).then(result => {
						

						//关闭加载提示
						this.$toast.clear();
						if (result.data.code == 200) {

							//本地存储token
							localStorage.setItem('_t', result.data.token);

							//跳转页面
							this.$router.push({
								name: 'Home'
							});

						} else {
							this.$toast(result.data.msg);
						}


					}).catch(err => {
						
						this.$toast.clear();
					})

				}
			}
		}

	};
</script>

<style lang="less" scoped>
	.login {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: url(../imgs/u=27458007,1193891197&fm=26&gp=0.jpg) no-repeat;
		background-size: cover;

		.btn-box {
			margin-top: 16px;
			padding: 0 10px;
		}

		.logo {
			margin: 80px auto;
			width: 120px;
			height: 120px;
		}
		.operation{
			margin-top: 20px;
			color: white;
			font-size: 18px;
			padding: 0 20px;
		}
	}
</style>
