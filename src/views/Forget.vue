<template>
	<div class="forget">
		<van-nav-bar title="找回密码" left-arrow :fixed="true" @click-left="back" />
		<van-form @submit="next">
			<van-field v-model="userInfo.email" name="邮箱" label="邮箱" placeholder="邮箱"  autocomplete="off"/>
			<van-field
			    v-model="userInfo.Code"
			    center
			    clearable
			    label="验证码"
			    placeholder="验证码"
			    autocomplete="off"
			    maxlength="6"
			  >
			  <template #button>
			    <van-button :disabled="isHas" size="small" type="info" @click.prevent="sendvalidCode" >{{text}}</van-button>
			  </template>
			</van-field>
			<div class="btn-box">
				<van-button round block type="info" native-type="submit">下一步</van-button>
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
		name: "Forget",
		data(){
			return{
				isHas:false,
				text:"发送验证码",
				userInfo:{
					email:"",
					Code:""
				}
			} 
		},
		methods:{
			back(){
				this.$router.go(-1);
			},
			//发送验证码
			sendvalidCode() {
			  //判断邮箱是否正确
			  if (valid.validForm({email: this.userInfo.email}, this)) {
			
			    
			
			    let time = 60;
			
			    this.isHas = true;
			    this.text = `${time}s后重新发送`;
			
			    let timer = setInterval(() => {
			
			      if (time == 0) {
			        clearInterval(timer);
			        timer = null;
			        this.isHas = false;
			        this.text = '发送验证码';
			      } else {
			        time--;
			        this.text = `${time}s后重新发送`;
			      }
			
			    }, 1000)
			
			    //发起请求
			    //加载提示
			    this.$toast.loading({
			      forbidClick: true,
			      duration: 0,
			      message: "加载中..."
			    });
			
			    this.axios({
			      method: 'POST',
			      url: '/emailValidCode',
			      data: {
			        appkey: this.appkey,
			        email: this.userInfo.email
			      },
			      transformRequest: along.transformRequest
			    }).then(result => {
			      this.$toast.clear();
			      
			      this.$toast(result.data.msg);
			    }).catch(err => {
			      this.$toast.clear();
			      
			    })
			
			  }
			  
			},
			//下一步
			next() {
			  
			  //验证验证码
			  if (/^[0-9]{6}$/.test(this.userInfo.Code)) {
		
			    //加载提示
			    this.$toast.loading({
			      forbidClick: true,
			      duration: 0,
			      message: "加载中..."
			    });
			
			    this.axios({
			      method: 'POST',
			      url: '/checkValidCode',
			      data: {
			        appkey: this.appkey,
			        validCode: this.userInfo.Code
			      },
			      transformRequest: along.transformRequest
			    }).then(result => {
			      this.$toast.clear();
				  
			      // 
			
			      if (result.data.code == 'K001') {
			
			        this.$router.push({name: 'newPasswrod'});
			
			      } else {
			        this.$toast(result.data.msg);
			      }
			      
			    }).catch(err => {
			      this.$toast.clear();
			      
			    })
			
			    
			
			  } else {
			    this.$toast('请输入6位数字验证码');
			  }
			
			  
			}
		}
	}
</script>

<style lang="less">
	.forget{
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
