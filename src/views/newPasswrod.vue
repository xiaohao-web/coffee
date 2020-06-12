<template>
	<div class="newpassword">
		<van-nav-bar title="找回密码" left-arrow :fixed="true" @click-left="back" />
		<van-form @submit="verifyFor">
			<van-field v-model="userInfo.phone" name="手机号" label="手机号" placeholder="11位手机号" autocomplete="off" />
			<van-field v-model="userInfo.password" type="text" name="新密码" label="新密码" placeholder="密码(6-12字符)" autocomplete="off" />
			<div class="btn-box">
				<van-button round block type="info" native-type="submit">登录</van-button>
			</div>
		</van-form>
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
			return{
				userInfo:{
					phone:"",
					password:""
				}
			} 
		},
		methods:{
			//返回上一级
			back(){
				this.$router.go(-1)
			},
			verifyFor() {
			
			  //表单验证
			  if (valid.validForm(this.userInfo, this)) {
			    //验证通过
			
			    //加载提示
			    this.$toast.loading({
			      forbidClick: true,
			      duration: 0,
			      message: "加载中..."
			    });
			
			    this.axios({
			      method: 'POST',
			      url: '/retrievePassword',
			      data: {
			        appkey: this.appkey,
			        phone: this.userInfo.phone,
			        password: this.userInfo.password
			      },
			      transformRequest: along.transformRequest
			    }).then(result => {
			      this.$toast.clear();
			      
			      if (result.data.code == 'L001') {
			        this.$router.push({name: 'Login'});
			      } else {
			        this.$toast(result.data.msg);
			      }
			      
			    }).catch(err => {
			      this.$toast.clear();
			      
			    })
			
			  }
			
			}
		}
	}
</script>

<style lang="less" scoped>
	.newpassword{
		height: 607px;
		background-color: #E7DAC2;
		.btn-box{
			margin-top: 20px;
		}
		padding-top: 60px;
		.van-nav-bar {
			background-color: #5D0900;
		
			.van-nav-bar__title {
				color: white;
			}
		
			.van-icon {
				color: white;
			}
		}
	}
</style>
