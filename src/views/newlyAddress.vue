<template>
	<div class="newly-address">
		<van-nav-bar :title="title" left-arrow :fixed="true" @click-left="back" />
		<van-address-edit
			:area-list="addressMail"
			:address-info="addressInfo"
			:show-set-default="isDefault"
			:show-delete="isDelete"
			:show-postal="isPostal"
			save-button-text="保存地址"
			delete-button-text="删除地址"
			detail-rows="2"
			detail-maxlength="60"
			@save="saveAddress"
			@delete="removeAddress"
		/>
		  
	</div>
</template>

<script>
	import {mapState} from 'vuex'
	
	//导入公共方法
	import { along } from "../utils/along";
	export default {
	  name: "newlyAddress",
	  data(){
		  return {
		    //初始化组件地址内容
		    addressInfo: {
		      aid: '',
		      name: '',
		      tel: '',
		      province: '',
		      city: '',
		      county: '',
		      addressDetail: '',
		      areaCode: '',
		      postalCode: '',
		      isDefault: false
		    }
		  };
	  },
	  
	  created(){
		  
		  //截取查询数据
		  let query = this.$route.query;
		  if(query.isAdd == 0){
				let tokenString = localStorage.getItem('_t');
				
				this.$toast.loading({
				  forbidClick: true,
				  duration: 0,
				  message: "加载中..."
				});
				
				this.axios({
				method: 'GET',
				url: '/findAddressByAid',
				params: {
				appkey: this.appkey,
				tokenString,
				aid: query.aid
				}
				}).then(result =>{
					this.$toast.clear();
					result.data.result[0].isDefault = !!result.data.result[0].isDefault;
					//遍历addressInfo和赋值
					for(let i in this.addressInfo){
						this.addressInfo[i] = result.data.result[0][i];
					}
					
					//复制对象
					let codyAddress = Object.assign({}, this.addressInfo);
					this.$store.commit('newlyAddressModule/changeData', {key: 'temporaryAddressData', value: codyAddress});
				}).catch(err => {
					this.$toast.clear();
					
				})
		  }
		  
		  
		  this.$store.commit('newlyAddressModule/changeData', {key: 'aid', value: query.aid});
		  
		  this.$store.commit('newlyAddressModule/changeData', {key: 'isAdd', value: query.isAdd});
		  
		  this.$store.commit('newlyAddressModule/changeData', {key: 'title', value: query.isAdd == 0 ? '编辑地址' : '新增地址'});
		  
		  this.$store.commit('newlyAddressModule/changeData', {key: 'isDelete', value: !query.isAdd});
		  
	  },
	  
	  computed: {
	    ...mapState('newlyAddressModule', ['isAdd', 'aid', 'isDefault', 'isDelete', 'isPostal', 'addressMail', 'title', 'temporaryAddressData'])
	  },
	  
	   methods: {
	    //返回上一级
	    back() {
	      this.$router.go(-1);
	    },
		
		 traversalObj(obj1,obj2){
			 for(let key in obj1){
				 if(obj1[key] != obj2[key]){
					 return false;
				 }
			 }
			 return true;
		 },
		//保存地址
		saveAddress(addressContent) {
		  //addressContent: 地址内容
		  
		  
		  
		  
		  delete addressContent.country;
		  
		  //复制对象
		  let data = Object.assign({}, addressContent);
		  
		  let url = '';
		  if (this.isAdd == 1) {
		    delete data.aid;
		    //新增地址
		    url = '/addAddress';
		  } else {
			  if(this.traversalObj(addressContent,this.temporaryAddressData)){
				  alert("地址一致无法修改");
			  }else{
				  //编辑地址
				  url = '/editAddress';
			  }
		  }
		  
		  
		  //获取token字符串
		  let tokenString = localStorage.getItem('_t');
		  data.tokenString = tokenString;
		  data.appkey = this.appkey;
		  
		  //将isDefault转为数字类型
		  data.isDefault = Number(data.isDefault);
		  
		  this.axios({
		    method: 'POST',
		    url,
		    data,
		    transformRequest: along.transformRequest
		  }).then(result => {
		    
		    this.$toast.clear();
		  
		    this.$router.push({name: 'Address'});
		  }).catch(err => {
		    
		    this.$toast.clear();
		  })
		},
		
		removeAddress(){
			let tokenString = localStorage.getItem('_t');
			
			this.$toast.loading({
			  forbidClick: true,
			  duration: 0,
			  message: "加载中..."
			});
			
			this.axios({
			  method: 'POST',
			  url: '/deleteAddress',
			  data: {
			    appkey: this.appkey,
			    tokenString,
			    aid: this.aid
			  },
			  transformRequest: along.transformRequest
			}).then(result => {
			  this.$toast.clear();
			  
			  this.$router.push({name: 'Address'});
			}).catch(err => {
			  this.$toast.clear();
			  
			})
		}
	   }
	}
</script>

<style lang="less" scoped>
	.newly-address{
		padding-top: 46PX;
		height: 621px;
		background-color: #F4E4CA;
		.van-nav-bar{
			background-color: #5E0E08;
			.van-nav-bar__title{
				color: white;
			}
			.van-icon{
				color: white;
			}
		}
		/deep/.van-button--default{
			background-color: #F26B00;
			color: white;
		}
	}
</style>
