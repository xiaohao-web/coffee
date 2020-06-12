<template>
	<div class="account">
		<van-nav-bar title="个人信息"  left-arrow :fixed="true" @click-left="back" />
		 <van-cell-group>
		  <van-cell class="userImg" title="头像" size="large">
		    <template #right-icon>
		      <div class="person-img">
		        <img class="auto-img" :src="setuserInfo.userImg" alt="">
				<van-uploader class="v-uploader" :after-read="upload" />
		      </div>
		    </template>
		  </van-cell>
		  <van-cell title="用户id" size="large" :value="setuserInfo.userId" />
		  <van-cell title="手机号" size="large" :value="setuserInfo.phone" />
		  <van-cell class="userImg" title="昵称" size="large">
		    <template #right-icon>
		      <div>
		        <van-field class="v-field" input-align="right" v-model="setuserInfo.nickName" @change="setnickName"/>
		      </div>
		    </template>
		  </van-cell>
		</van-cell-group>
	</div>
</template>

<script>
	import {along} from '../utils/along'
	export default {
	  name: "Account",
	  data() {
	    return {
	      setuserInfo: {
	        userImg: '',
	        phone: '',
	        userId: '',
	        nickName: '',
	        desc: ''
	      }
	    };
	  },
	  
	   created() {
	    this.gainUserInfo();
	  },
	  
	  methods:{
		  
		  //上传头像
      upload(file) {
        // 

        //控制上传图片大小不能超过 300KB
        let imgSize = 300 * 1024;
        if (file.file.size > imgSize) {
          this.$toast('上传图片大小不能超过300KB');
          return;
        }
				
				console.log(file)

        let imgType = file.file.type.split('/')[1];

        let serverBase64Img = file.content.replace(/data:image\/[A-Za-z]+;base64,/, '');

        let tokenString = localStorage.getItem('_t');

        //加载提示
        this.$toast.loading({
          forbidClick: true,
          duration: 0,
          message: "加载中..."
        });

        this.axios({
          method: 'POST',
          url: '/updateAvatar',
          data: {
            appkey: this.appkey,
            tokenString,
            imgType,
            serverBase64Img
          },
          transformRequest: along.transformRequest
        }).then(result => {
          this.$toast.clear();
          // 
          this.setuserInfo.userImg = result.data.userImg;
        }).catch(err => {
         this.$toast.clear();
          
        })

      },
		  
		  //修改昵称
		  setnickName(){
			  let tokenString = localStorage.getItem('_t');
			  
			   //加载提示
			  this.$toast.loading({
			    forbidClick: true,
			    duration: 0,
			    message: "加载中..."
			  });
			  
			  this.axios({
			    method: 'POST',
			    url:'/updateNickName',
			    data: {
			      appkey: this.appkey,
			      tokenString,
			      nickName: this.setuserInfo.nickName
			    },
			    transformRequest: along.transformRequest
			  }).then(result => {
			    this.$toast.clear();
			    
			  }).catch(err => {
			    this.$toast.clear();
			    
			  })
		  },
		  
		  //获取用户信息
		  gainUserInfo(){
			 let tokenString = localStorage.getItem('_t');
			 
			 //加载提示
			 this.$toast.loading({
			   forbidClick: true,
			   duration: 0,
			   message: "加载中..."
			 });
			 
			 this.axios({
			   method: 'GET',
			   url: '/findAccountInfo',
			   params: {
			     appkey: this.appkey,
			     tokenString
			   }
			 }).then(result => {
			   this.$toast.clear();
			   
			   this.setuserInfo = result.data.result[0];
			   
			 }).catch(err => {
			   this.$toast.clear();
			   
			 })
		  },
		  
		  back(){
			  this.$router.go(-1);
		  }
	  }
	}
</script>

<style lang="less" scoped>
	.account {
		padding-top: 46px;
		height: 621px;
		background-color: #E7DAC2;
		.van-cell{
			background-color: #F8E3CA;
		}
		.van-nav-bar {
			background-color: #5D0900;
	
			.van-nav-bar__title {
				color: white;
			}
	
			.van-icon {
				color: white;
			}
		}
		.userImg{
			position: relative;
			padding-top: 0;
			padding-bottom: 0;
			line-height: 48px;
			.v-uploader{
			  position: absolute;
			  width: 40px;
			  height: 40px;
			  left: 0;
			  top: 0;
			  overflow: hidden;
			  z-index: 2;
			  opacity: 0;
			}
		}
		.person-img{
		  width: 40px;
		  margin-top: 4px;
		  position: relative;
		}
		
		/deep/ .v-field{
		  padding: 0;
		  line-height: 48px;
		}
	}
		
</style>
