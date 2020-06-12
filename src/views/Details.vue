<template>
	<div class="datails">
		<van-nav-bar :title="productDetailData.name" left-arrow :fixed="true" class="DlColor"  @click-left="back"/>
		<div class="product-box">
		  <div>
		    <img class="auto-img" :src="productDetailData.large_img" alt="">
		  </div>
		
		  <div class="box">
			  <ul class="pro-box">
			    <li class="pro-name">{{productDetailData.name}}</li>
			    <li class="pro-like" :class="{active: isLike}" @click="like"></li>
			  </ul>
			  
			  <!-- 商品规格 -->
			  <div class="pro-rule">
			    <div class="rule-item" v-for="(item, index) in rules" :key="index">
			      <span class="fl rule-title">{{item.title}}</span>
			      <ul class="fl rule-list">
			        <li v-for="(value, i) in item.rule" :key="i" :class="{active: value.isActive}" @click="toggleRule(value, index)">{{value.text}}</li>
			      </ul>
			    </div>
			  </div>
		 
			   <!-- 商品描述 -->
			  <div class="pro-desc">
			    <div class="desc-title">商品描述</div>
			    <div class="desc-info">
			    <p v-for="(item, index) in desc" :key="index">{{item}}</p>
			    </div>
			  </div>
			  
			  <!-- 价格数量 -->
			  <div class="pro-price-count">
			    <div class="price">￥{{productDetailData.price}}</div>
			    <div class="count clearfix">
			      <span class="icon fl left" @click="decrease"></span>
			      <input class="pro-count fl" type="text" v-model="count" readonly>
			      <span class="icon fl right" @click="increase"></span>
			    </div>
			  </div>
		  </div>
		</div>
		<van-goods-action>
		  <van-goods-action-icon icon="cart-o" text="购物车" :badge="shopcartTotal == 0 ? '' : shopcartTotal >= 100 ? '99+' : shopcartTotal" @click="goshop" />
		  <van-goods-action-button color="#600F08" type="warning" text="加入购物车"  @click="addshop"/>
		  <van-goods-action-button color="##600F08" type="danger" text="立即购买" />
		</van-goods-action>
	</div>
</template>

<script>
	import {mapState} from 'vuex'
	
	//导入公共方法
	import { along } from "../utils/along";
	
	export default {
		name: "Details",
		computed: {
		  ...mapState('detailModule', ['productDetailData', 'rules', 'desc', 'count',"isLike","shopcartTotal"])
		},
		created() {
			
			//加载提示
			this.$toast.loading({
			  forbidClick: true,
			  duration: 0,
			  message: "加载中..."
			});
			
			//清空state
			this.$store.commit('detailModule/emptyData');
			
			let pid = this.$route.params.pid;
			
			
			//查看商品详情get请求
			this.axios({
				method:"GET",
				url: '/productDetail',
				params:{
					appkey:this.appkey,
					pid
				}
			}).then(result => {
				
				//关闭加载提示
				this.$toast.clear();
				if (result.data.code == 600) {
					
				this.$store.commit('detailModule/changeProductDetailData', result.data.result[0]);
				
				//查看商品是否收藏
				this.Togglelike();
				
				//查询购物车商品总数量接口
				this.shopCount();
				}
			}).catch(err => {
				//关闭加载提示
				this.$toast.clear();
				
			})
		},
		 methods: {
		  //增加数量
		  increase() {
		    let count = this.count + 1;
		    this.$store.commit('detailModule/changeData', {key: 'count', value: count});
		  },
		
		  //减少数量
		  decrease() {
		
		    if (this.count == 1) {
		      return;
		    }
		
		    let count = this.count - 1;
			
		    this.$store.commit('detailModule/changeData', {key: 'count', value: count});
		  },
		
		  //切换商品规格
		  toggleRule(item, index) {
		    
		    if (item.isActive) {
		      
		      return;
		    }
		
		    let cuurentRule = this.rules[index];
		    
		    for (let i = 0; i < cuurentRule.rule.length; i++) {
		      if (cuurentRule.rule[i].isActive) {
		        cuurentRule.rule[i].isActive = false;
		        break;
		      }
		    }
		
		    item.isActive = true;
		  },
		
		  //商品是否收藏
		  Togglelike(){
			let tokenString = localStorage.getItem('_t');
			this.axios({
				method:"GET",
				url:"/findlike",
				params:{
					appkey:this.appkey,
					pid:this.productDetailData.pid,
					tokenString
				},
			}).then(result =>{
				
				
				if (result.data.code == 1000) {
				  //修改isLike
				  this.$store.commit("detailModule/changeData", {
				    key: "isLike",
				    value: result.data.result.length > 0
				  });
				}
			}).catch(err =>{
				
			})
		  },
		  
		  //商品的收藏和取消
		  like() {
			  //加载提示
			  this.$toast.loading({
			    forbidClick: true,
			    duration: 0,
			    message: "加载中..."
			  });
			  let tokenString = localStorage.getItem('_t');
			  let url = this.isLike ? "/notlike" : "/like";
			  this.axios({
			    method: "POST",
			    url,
			    data: {
			      appkey: this.appkey,
			      pid: this.productDetailData.pid,
			      tokenString
			    },
			  
			    transformRequest: along.transformRequest
			  }).then(result => {
				  //关闭加载提示
				  this.$toast.clear();
				  
				  
				  //加载提示
				  this.$toast({
				    message: result.data.msg
				  });
				  //修改isLike
				  this.$store.commit("detailModule/changeData", {
				    key: "isLike",
				    value: !this.isLike
				  });
				}).catch(err =>{
					this.$toast.clear();
					
				})
		  },
		  
		  //加入购物车
		  addshop(){
			  let tokenString = localStorage.getItem('_t');
			  
			  //加载提示
			  this.$toast.loading({
			    forbidClick: true,
			    duration: 0,
			    message: "加载中..."
			  });
			  
			  //改成需要的商品规格商品数据
			  let ruleData = [];
			  this.rules.forEach(v => {
			    for (let i = 0; i < v.rule.length; i++) {
			      if (v.rule[i].isActive) {
			        ruleData.push(v.rule[i].text);
			        break;
			      }
			    }
			  });
			  
			  //post请求
			  this.axios({
				  method:"POST",
				  url:"/addShopcart",
				  data:{
					  pid:this.productDetailData.pid,
					  count: this.count,
					  rule: ruleData.join("/"),
					  appkey: this.appkey,
					  tokenString
				  },
				  transformRequest: along.transformRequest
			  }).then(result =>{
					   //关闭加载提示
					  this.$toast.clear();
					  
					  //加载提示
					  this.$toast({
					    message: result.data.msg
					  });
					  
					  if(result.data.code == 3000){
						  
						  //修改前端购物车总数量
						  this.$store.commit("detailModule/changeData", {
						    key: "shopcartTotal",
						    value: this.shopcartTotal + this.count
						  });
					  }
				  }).catch(err =>{
					   //关闭加载提示
					  this.$toast.clear();
					  
				  })
		  },
		  
		  //查询购物车商品总数量接口
		  shopCount(){
			  let tokenString = localStorage.getItem('_t');
			  
			  this.axios({
				  method:"GET",
				  url:"/shopcartCount",
				  params:{
					  appkey:this.appkey,
					  tokenString
				  }
			  }).then(result =>{
				  
				   if (result.data.code == 4000) {
					   this.$store.commit("detailModule/changeData", {
					     key: "shopcartTotal",
					     value: result.data.result
					   });
				   }
			  }).catch(err =>{
				  
			  })
		  },
		  
		  //跳转购物车
		  goshop(){
			  this.$router.push({name : "Shop"});
		  },
		  
		  //返回上一级
		  back() {
		    this.$router.go(-1);
		  },
		}
	}
</script>

<style lang="less" scoped>
	.datails{
		padding-top: 46px;
		padding-bottom: 60px;
		.DlColor{
			background-color: #531103;
			.van-icon,.van-nav-bar__title{
				color: white !important
			}
		}
		.pro-box{
		  display: flex;
		  padding-top: 20px;
		}
		.pro-name{
		  font-size: 16px;
		  color: #444;
		  line-height: 24px;
		  color: #808080;
		  margin-left: 10px;
		}
		.pro-like{
		  margin-left: auto;
		  width: 24px;
		  height: 24px;
		  background: url('../imgs/like.png') no-repeat center center;
		  background-size: cover;
		  margin-right: 10px;
		  &.active{
		    background-image: url('../imgs/redlike.png');
		  }
		}
		.pro-rule{
		  margin-top: 20px;
		  border-bottom: 1px solid #E9E9E9;
		  padding-bottom: 20px;
		}
		.rule-item{
		  height: 30px;
		  padding: 10px 0;
		}
		.rule-list>li{
		  float: left;
		  width: 70px;
		  height: 30px;
		  line-height: 30px;
		  color: #666;
		  background-color: #E5E5E5;
		  margin-right: 20px;
		  border-radius: 20px;
		  text-align: center;
		  font-size: 14px;
		  &.active{
		     background-color: #F9E3BD;
		     color: #FFC355;
		  }
		}
		.rule-title{
		  line-height: 30px;
		  width: 60px;
		  font-size: 16px;
		  color: #444;
		  margin-left: 10px;
		}
		.pro-desc{
		  margin-top: 20px;
		  padding-bottom: 20px;
		  border-bottom: 1px solid #e9e9e9;
		}
		.desc-title{
		  color: #444;
		  font-size: 16px;
		  margin-left: 10px;
		}
		.desc-info{
		  color: #666;
		  font-size: 14px;
		  >p{
		    margin: 10px 0 0 10px;
		  }
		}
		.pro-price-count{
		  display: flex;
		  height: 50px;
		}
		.price{
		  color: #1989FA;
		  font-size: 16px;
		  line-height: 50px;
		  margin-left: 10px;
		}
		.count{
		  margin-top: 13px;
		  margin-left: auto;
		  font-size: 14px;
		  margin-right: 10px;
		}
		.icon{
		  width: 24px;
		  height: 24px;
		  border-radius: 50%;
		  background-position: center center;
		  background-size: cover;
		  background-repeat: no-repeat;
		  &.left{
		    background-image: url("../imgs/decrease.png");
		  }
		  &.right{
		    background-image: url("../imgs/increase.png");
		  }
		}
		.pro-count{
		  height: 24px;
		  width: 30px;
		  margin: 0 5px;
		  text-align: center;
		}
	}
	
	
</style>
