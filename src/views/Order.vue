<template>
	<div class="order">
		<van-nav-bar title="提交订单" left-arrow :fixed="true" @click-left="back" />
		<van-tabs v-model="activeName" class="fixd-box" sticky @change="toggleTab">
			<van-tab :title="item.title" :name="item.name" v-for="(item, index) in tabData" :key="index">
				<div class="order-box" v-for="(item1, idx) in orderData" :key="idx">
					<div class="goods">
						<div class="title-box">
							<div class="left-box">{{item1.oid}}</div>
							<div class="right-box">
								<template v-if="item1.status == 1">
								  <span @click="confirmReceive(item1.oid, idx)">确定收货</span>
								</template>
								<template v-else>
								  <span>已收货</span>
								  <span class="delete-icon" @click="removeOrder(item1.oid, idx)">
								  	<van-icon name="delete" />
								  </span>
								</template>
							</div>
						</div>
						<div class="goods-find" v-for="(item2, idex) in item1.data" :key="idex">
							<div class="img-box">
								<img :src="item2.smallImg" alt="" class="auto-img">
							</div>
							<div class="describe">
								<div class="coffee">{{item2.name}}</div>
								<div class="select-type">{{item2.rule}}</div>
							</div>
							<div class="amount">X{{item2.count}}</div>
							<div class="money">￥{{item2.price}}</div>
						</div>
					</div>
					<div class="sum-numbor">
						<div class="left-box">{{item1.orderTime}}</div>
						<div class="right-box">合计:￥{{item1.total}}</div>
					</div>
				</div>
			</van-tab>
		</van-tabs>
	</div>
</template>

<script>
	import {mapState} from 'vuex'
	
	import {along} from '../utils/along'
	export default {
		name: "Pay",
		data(){
			return{
				activeName:"a"
			}
		},
		created() {
		
		  //全部
		  this.getOrderData(0);
		
		},
		
		computed: {
		  ...mapState('orderModule', ['orderData', 'tabData'])
		},
		
		methods:{
			 getOrderData(status) {
			  let tokenString = localStorage.getItem('_t');
			  //加载提示
			  this.$toast.loading({
			    forbidClick: true,
			    duration: 0,
			    message: "加载中..."
			  });
			  
			  this.axios({
			    method: 'GET',
			    url: '/findOrder',
			    params: {
			      appkey: this.appkey,
			      tokenString,
			      status
			    }
			  }).then(result => {
			    this.$toast.clear();
			    
				
				//获取所有订单号数据
				let orderData = [];
				
				//查询订单oid
				let orderId = [];
				result.data.result.forEach(v => {
				  if (orderId.indexOf(v.oid) === -1) {
				    orderId.push(v.oid);
				  }
				})
				
				orderId.forEach(v => {
				
				  
				  //当前订单数据
				  let currentOrderData = {
				    oid: v,
				    count: 0,
				    total: 0,
				    //当前订单的所有商品数据
				    data: []
				  };
				
				  result.data.result.forEach(item => {
				
				    if (item.oid == v) {
				
				      currentOrderData.data.push(item);
				
				      currentOrderData.count += item.count;
				
				      currentOrderData.total += item.count * item.price;
				    }
				
				  })
				
				
				  //订单时间
				  currentOrderData.orderTime = along.formatDate(new Date(currentOrderData.data[0].createdAt), 'yyyy-MM-dd hh:mm:ss');
				
				  currentOrderData.status = currentOrderData.data[0].status;
				
				  orderData.push(currentOrderData);
				
				})
				
				orderData.sort((a, b) => {
				  return new Date(b.orderTime) - new Date(a.orderTime);
				})
				
				
				this.$store.commit('orderModule/changeData', {key: 'orderData', value: orderData})
				
				}).catch(err => {
					
				})
			 },
			 
			 //确认收货
			 confirmReceive(oid, index) {
			 
			   let tokenString = localStorage.getItem('_t');
			 
			   //加载提示
			   this.$toast.loading({
			     forbidClick: true,
			     duration: 0,
			     message: "加载中..."
			   });
			 
			   this.axios({
			     method: 'POST',
			     url: '/receive',
			     data: {
			       appkey: this.appkey,
			       tokenString,
			       oid
			     },
			     transformRequest: along.transformRequest
			   }).then(result => {
			     this.$toast.clear();
			     
			 
			     this.orderData[index].status = 2;
			 
			     if (this.activeName == 1) {
			       //删除orderData数组的元素
			       this.$store.commit('orderModule/removeOrderData', index);
			     }
			 
			   }).catch(err => {
			     this.$toast.clear();
			     
			   })
			 
			 },
			 
			 //删除订单
			 removeOrder(oid, index) {
			 
			   let tokenString = localStorage.getItem('_t');
			 
			   //加载提示
			   this.$toast.loading({
			     forbidClick: true,
			     duration: 0,
			     message: "加载中..."
			   });
			 
			   this.axios({
			     method: 'POST',
			     url: '/removeOrder',
			     data: {
			       appkey: this.appkey,
			       tokenString,
			       oid
			     },
			     transformRequest: along.transformRequest
			   }).then(result => {
			     this.$toast.clear();
			     
			     //删除orderData数组的元素
			     this.$store.commit('orderModule/removeOrderData', index);
			   }).catch(err => {
			     this.$toast.clear();
			     
			   })
			 },
			 
			 //切换标签
			 toggleTab(status) {
			   
			   this.getOrderData(status);
			 },
			 
			back(){
				this.$router.push({name:"My"});
			}
		}
	}
	
</script>

<style leng="less" lang="less" scoped>
	.order {
		padding-top: 46px;
		padding-bottom: 10px;
		min-height: 621px;
		background-color: #F4E4CA;
		/deep/ .van-sticky--fixed{
			top: 46px;
		}
		.order-content{
		  padding: 10px;
		}
		.delete-icon{
		  font-size: 16px;
		  position: relative;
		  top: 2px;
		  margin-left: 10px;
		}
		.van-nav-bar {
			background-color: #5D0900;
		
			.van-nav-bar__title {
				color: #F6F3EE;
			}
		
			.van-icon {
				color: white;
			}
		}

		.order-box {
			margin-bottom: 20px;
		}

		.goods {
			padding: 10px;
			background-color: #EEEDED;
		}

		.title-box {
			display: flex;
			padding-bottom: 10px;
			border-bottom: 1px solid #EEEDED;

			>div {
				width: 50%;
			}

			.left-box {
				font-size: 12px;
				color: #8F8F8F;
			}

			.right-box {
				font-size: 12px;
				color: #8F8F8F;
				text-align: right;
			}
		}

		.goods-find {
			display: flex;
			height: 60px;
			position: relative;
			margin-bottom: 10px;
		}

		.img-box {
			width: 60px;
			margin-right: 10px;
		}

		.coffee {
			font-size: 18px;
			font-weight: 500;
			color: #A3726B;
			margin-bottom: 10px;
		}

		.select-type {
			font-size: 12px;
			color: #A3726B;
		}

		.money {
			position: absolute;
			right: 0;
			top: 50%;
			font-size: 20px;
			font-weight: 500;
			transform: translateY(-50%);
			color: #D44738;
		}

		.amount {
			position: absolute;
			right: 90px;
			top: 50%;
			transform: translateY(-50%);
			font-size: 12px;
			color: #803E37;
		}

		.sum-numbor {
			display: flex;
			padding: 10px 0;
			// border-bottom: 1px solid #5D0900;

			// background-color: #F7F3EE;
			>div {
				width: 50%;
			}

			.left-box {
				font-size: 14px;
				color: #8F8F8F;
			}

			.right-box {
				color: #8F8F8F;
				font-size: 16px;
				text-align: right;
				font-weight: 600;
			}
		}
	}
</style>
