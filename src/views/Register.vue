<template>

	<div class="register">
		<div class="logo">
			<img class="auto-img" src="../assets/logo.png" alt="" />
		</div>
		<van-form @submit="register">
			<van-field v-model="userInfo.phone" name="手机号" label="手机号" placeholder="11位手机号"  autocomplete="off"/>
			<van-field v-model="userInfo.nickName" name="昵称" label="昵称" placeholder="昵称(1-8个字符)"  autocomplete="off"/>
			<van-field v-model="userInfo.password" type="text" name="密码" label="密码" placeholder="密码(6-12个字符)" autocomplete="off" />
			<div class="btn-box">
				<van-button round block type="info" native-type="submit">注册</van-button>
			</div>
		</van-form>
	</div>


</template>

<script>
	// 导入正则
	import {valid} from '../utils/valid'

	// 导入公共部分
	import {along} from '../utils/along'
	export default {
		name: "Register",

		computed: {
			userInfo() {
				return this.$store.state.registerModule.userInfo
			}
		},

		methods: {
			//注册
			register() {
				
				if (valid.validForm(this.userInfo, this)) {

					//加载提示
					this.$toast.loading({

						//是否禁止背景点击
						forbidClick: true,

						//禁止自动关闭
						duration: 0,

						message: '注册中...'

					})

					// 发起post请求
					this.axios({
						method: "POST",
						url: "/register",
						data: {
							appkey: this.appkey,
							nickName: this.userInfo.nickName,
							phone: this.userInfo.phone,
							password: this.userInfo.password
						},

						// 序列化
						transformRequest: along.transformRequest

					}).then(result => {
						console.log(result.data.code);
						//关闭加载提示
						this.$toast.clear();
						if (result.data.code == 100) {
							this.$router.push({
								name: "Login"
							});
						} else {
							this.$toast({
								message: result.data.msg
							})
						}
					}).catch(err => {
						console.log("register,出错了");
						this.$toast.clear();
					})
				}

			}
		}

	};
</script>

<style lang="less" scoped>
	.register {
		position: absolute;
		top: 0;
		left: 0;
		width: 375px;
		height: 667px;
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
	}
</style>
