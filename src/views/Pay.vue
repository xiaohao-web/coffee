<template>
	<div class="pay">
		<van-nav-bar title="提交订单" left-arrow :fixed="true" @click-left="back" />
		<div class="GOaddress">
			<div class="address" @click="showAddress">{{addressData.address}}</div>
		</div>
		<div class="goods" v-for="(item,index) in orderData" :key="index">
			<div class="goods-find">
				<div class="img-box">
					<img class="auto-img" :src="item.small_img">
				</div>
				<div class="describe">
					<div class="coffee">{{item.name}}</div>
					<div class="select-type">{{item.rule}}</div>
				</div>
				<div class="amount">X{{item.count}}</div>
				<div class="money">￥{{item.count*item.price}}</div>
			</div>
		</div>
		<div class="sum-numbor">
			<div class="right-box">合计:￥{{orderPrice.total}}</div>
		</div>
		<van-submit-bar :price="orderPrice.total * 100" button-text="确定订单" @submit="sumpay" />

		<van-action-sheet v-model="isShow" title="选择地址">
			<van-address-list v-model="chosenAddressId" :switchable="true" :list="list" default-tag-text="默认"  @add="newlyAddress" @select="selectAddress"/>
		</van-action-sheet>
	</div>
</template>

<script>
	import {along} from '../utils/along'
	
	import {mapState} from 'vuex'
	export default {
		name: "Pay",
		data() {
			return {
				isShow: false,
				chosenAddressId: '1',
			};
		},
		created() {
		
		  this.$store.commit('payModule/emptyData');
		
		  //截取查询查询参数
		  let sids = this.$route.query.sids.split('-');
		  
		
		  this.$store.commit('payModule/changeData', {key: 'sids', value: sids});
		
		  this.findBuyProduct(sids);
		  this.getfindAddress()
		
		},
		computed: {
		  ...mapState('payModule', ['orderData', 'orderPrice', 'isSelect', 'list', 'addressData', 'sids'])
		},
		
		methods: {
			findBuyProduct(sids){
				let tokenString = localStorage.getItem('_t');
				this.axios({
					method: 'GET',
					url: '/commitShopcart',
					params: {
					  appkey: this.appkey,
					  tokenString,
					  sids: JSON.stringify(sids)
					}
				}).then(result => {
					this.orderPrice.count = 0;
					this.orderPrice.total = 0;
					result.data.result.forEach(v => {
					
					  this.orderPrice.total += v.count * v.price;
					})
					
					
					this.$store.commit('payModule/changeData', {key: 'orderData', value: result.data.result});
				}).catch(err =>{
					
				})
			},
			
			//新增地址
			newlyAddress() {
			  this.$router.push({name: 'newlyAddress', query: {isAdd: 1}});
			},
			
			//选择地址
			selectAddress(item, index) {
			
			  if (!this.isSelect) {
			    this.$store.commit('payModule/changeData', {key: 'isSelect', value: true});
			  }
			
			  this.addressData.phone = item.tel;
			  this.addressData.receiver = item.name;
			  this.addressData.address = item.address;
			
			  this.isShow = false;
			},
			
			//查询地址
			getfindAddress(){
				let tokenString = localStorage.getItem('_t');
				this.axios({
				  method: 'GET',
				  url: '/findAddress',
				  params: {
				    appkey: this.appkey,
				    tokenString
				  }
				}).then(result => {
					
					let list = [];
					result.data.result.forEach((v, i) => {
					  
					  let address = {
					    id: i + '',
					    name: v.name,
					    tel: v.tel,
					    address: v.province + v.city + v.county + v.addressDetail
					  };
					
					  list.push(address);
					
					  if (v.isDefault == 1) {
					    this.$store.commit('payModule/changeData', {key: 'isSelect', value: true});
					    this.addressData.address = address.address;
					    this.chosenAddressId = i + '';
					  }
						this.$store.commit('payModule/changeData', {key: 'list', value: list});
					})
					
					
				}).catch(err =>{
					
				})
			},
			back() {
				this.$router.go(-1);
			},
			showAddress() {
				this.isShow = true;
			},
			sumpay(){
				let tokenString = localStorage.getItem('_t');
				
				let sids = this.sids.concat();
				
				
				//加载提示
				this.$toast.loading({
				  forbidClick: true,
				  duration: 0,
				  message: "加载中..."
				});
				
				this.axios({
				  method: 'POST',
				  url: '/pay',
				  data: {
				    appkey: this.appkey,
				    tokenString,
				    sids: JSON.stringify(sids),
				    phone: this.addressData.phone,
				    receiver: this.addressData.receiver,
				    address: this.addressData.address
				  },
				  transformRequest: along.transformRequest
				}).then(result => {
				  this.$toast.clear();
				  
				  this.$router.push({name: 'Order'});
				}).catch(err => {
				  this.$toast.clear();
				  
				})
			}
		},
	}
</script>

<style lang="less" scoped>
	.pay {
		padding: 46px 20px 80px;
		min-height: 511px;
		background-color: #F4E4CA;

		.van-nav-bar {
			background-color: #5D0900;

			.van-nav-bar__title {
				color: #F6F3EE;
			}

			.van-icon {
				color: white;
			}
		}

		.GOaddress {
			margin-bottom: 30px;
			margin-top: 10px;

			.address {
				color: #A3726B;
				min-height: 40px;
				line-height: 40px;
				background-color: #EEEDED;
			}

		}

		.goods {
			background-color: #EEEDED;
			padding: 10px;
		}

		.goods-find {
			display: flex;
			height: 60px;
			position: relative;
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
			padding: 10px 0;
			border-bottom: 1px solid #5D0900;
			// background-color: #F7F3EE;

			.right-box {
				text-align: right;
			}
		}
		/deep/.van-address-item .van-radio__icon--checked .van-icon{
			background-color: #690200;
			border-color: #690200;
		}
		.van-address-list__bottom{
			background-color: #EEEDED;
		}
		.van-tag--danger{
			background-color: #690200;
		}
		.van-submit-bar{
			background-color: #EEEDED;
		}
		/deep/ .van-icon-edit::before{
		  content: ''
		}
	}
</style>
