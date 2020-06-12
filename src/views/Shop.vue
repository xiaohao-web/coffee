<template>

	<div class="shopcart">
		<van-nav-bar title="购物车" :fixed="true" :right-text="isManage ? '完成' : '管理'" @click-right="manage" />
		<van-list finished-text="没有数据了喔亲" :finished="isBottom" v-model="isLoading" @load="loadData">
			<van-swipe-cell v-for="(item,index) in shopData" :key="index" :disabled="!isManage">
				<div class="content-item">
					<div class="shopcart-checkbox">
						<van-checkbox v-model="item.isChecked" @change="oneSelect(item)"></van-checkbox>
					</div>
					<div class="pro-img">
						<img class="auto-img" :src="item.small_img" alt @click="Particulars(item.pid)" />
					</div>
					<div class="pro-desc">
						<div class="pro-name">
							<div class="clearfix">
								<div class="ch-name fl">{{item.name}}</div>
								<div class="rule fl">{{item.rule}}</div>
							</div>
							<div class="en-name">{{item.enname}}</div>
						</div>
						<div class="pro-price">
							<div class="fl div-Color">￥{{item.price}}</div>
							<div class="fr clearfix">
								<span class="icon fl left" @click="reduce(item)"></span>
								<input class="pro-count fl" type="tex" readonly v-model="item.count" />
								<span class="icon fl right" @click="increase(item)"></span>
							</div>
						</div>
					</div>
				</div>
				<template #right>
					<van-button square text="删除" type="danger" class="delete-button v-btn" @click="Removeoneshop(item.sid, index)" />
				</template>
			</van-swipe-cell>
			<!-- 提交订单 -->
			<van-submit-bar :price="total" button-text="提交订单" button-type="info" :safe-area-inset-bottom="true" v-show="!isManage"
			 @submit="Submit">
				<van-checkbox v-model="isAllSelect" @click="allSelect">全选</van-checkbox>
			</van-submit-bar>
			<!-- 删除 -->
			<van-submit-bar class="v-submit" button-text="删除" button-type="info" :safe-area-inset-bottom="true" v-show="isManage"
			 @submit="Removemoreshop">
				<van-checkbox v-model="isAllSelect" @click="allSelect">全选</van-checkbox>
			</van-submit-bar>
		</van-list>
	</div>

</template>

<script>
	import {
		mapState
	} from 'vuex'

	// 导入公共部分
	import {
		along
	} from '../utils/along'

	export default {
		name: "Shop",
		data() {
			return {
				//触底加载提示
				isLoading: false,

				//全选
				isAllSelect: false

			};
		},

		created() {

			//清空
			this.$store.commit('shopModule/emptyData');

			// 查看购物车的所有商品
			this.getshopAll();

		},

		computed: {
			...mapState('shopModule', ['isBottom', "allshopData", "shopData", "isManage", "total", "count"])
		},

		methods: {

			//提交订单 
			Submit() {
				
				// 没有数据不能跳转
				if(this.shopData.length == 0){
					this.$toast({
						forbidClick: true,
						duration: 2000,
						message: '亲，购物车为空...'
					});
					return;
				}
				
				// 获取勾选商品的购物车的sid
				let sids = []
				for (let i = 0; i < this.shopData.length; i++) {
					if (this.shopData[i].isChecked) {
						sids.push(this.shopData[i].sid);
					} else {
						this.$toast({
							forbidClick: true,
							duration: 2000,
							message: '请勾选商品...'
						});
						return;
					}
				}

				this.$router.push({
					name: 'Pay',
					query: {
						sids: sids.join('-')
					}
				});
			},

			// 查询用户所有购物车商品接口
			getshopAll() {
				
				//获取token字符串
				let tokenString = localStorage.getItem('_t');
				this.axios({
					method: 'GET',
					url: '/findAllShopcart',
					params: {
						appkey: this.appkey,
						tokenString
					}
				}).then(result => {
					
					if (result.data.code == 5000) {

						//添加判断勾选的属性
						result.data.result.forEach(v => {
							v.isChecked = false;
						})

						this.$store.commit('shopModule/changeData', {
							key: 'allshopData',
							value: result.data.result
						});
						
					}
				}).catch(err => {
					
				})
			},

			//加载商品数据
			loadData() {
				setTimeout(() => {
					
					this.isLoading = false;
					if (this.shopData.length >= this.allshopData.length) {
						//没有数据可加载
						this.$store.commit('shopModule/changeData', {
							key: 'isBottom',
							value: true
						});

						//最后一个外边距为0
						let itmeS = document.querySelectorAll(".content-item");
						if (itmeS.length == 0) {
							return;
						}
						itmeS[itmeS.length - 1].style.marginBottom = 0;
						return;
					}
					this.$store.commit('shopModule/loadShopData');
					this.isAllSelect = false;
				}, 1000)

			},

			//修改购物车商品数量
			modifyShopCount(sid, count) {
				//加载提示
				this.$toast.loading({
					forbidClick: true,
					duration: 0,
					message: '处理中...'
				})
				//获取token字符串
				let tokenString = localStorage.getItem('_t');

				this.axios({
					method: 'POST',
					url: '/modifyShopcartCount',
					data: {
						appkey: this.appkey,
						tokenString,
						sid,
						count
					},
					transformRequest: along.transformRequest
				}).then(result => {
					this.$toast.clear();
					
					this.sum();
				}).catch(err => {
					this.$toast.clear();
					
				})
			},

			//增加商品数量
			increase(item) {
				// 
				++item.count;

				
				this.modifyShopCount(item.sid, item.count);
			},

			//减小商品数量
			reduce(item) {
				if (item.count == 1) {
					return;
				}
				--item.count
				this.modifyShopCount(item.sid, item.count);
			},

			//管理
			manage() {
				this.$store.commit('shopModule/changeData', {
					key: 'isManage',
					value: !this.isManage
				});
			},

			//全选
			allSelect() {
				this.shopData.forEach(v => {
					console.log(v)
					v.isChecked = !this.isAllSelect;
				})
			},

			//单选
			oneSelect(item) {

				

				this.sum();

				if (!item.isChecked) {
					//没有全选
					this.isAllSelect = false;
					return;
				}

				for (let i = 0; i < this.shopData.length; i++) {
					if (!this.shopData[i].isChecked) {
						//没有全选
						this.isAllSelect = false;
						return;
					}
				}

				this.isAllSelect = true;

			},

			//计算总价
			sum() {

				let total = 0;
				this.shopData.forEach(v => {
					if (v.isChecked) {
						total += v.price * v.count * 100;
					}
				})

				this.$store.commit('shopModule/changeData', {
					key: 'total',
					value: total
				});
			},

			//删除单个商品
			Removeoneshop(sid, index) {
				let sids = JSON.stringify([sid]);
				console.log(sids);
				

				this.removeshop(sids).then(result => {
					
					this.$toast.clear();
					this.$store.commit('shopModule/removeShopData', [sid]);
					
					this.sum();
				}).catch(err => {
					this.$toast.clear();
					
				})
			},

			//删除多个商品
			Removemoreshop() {

				//获取勾选的商品
				let sids = [];
				this.shopData.forEach(v => {
					console.log(v)
					if (v.isChecked) {
						sids.push(v.sid);
					}
				})

				if (sids.length == 0) {
					this.$toast({
						message: '没有选择商品'
					})
					return;
				}

				this.removeshop(JSON.stringify(sids)).then(result => {
					this.$toast.clear();
					
					this.$store.commit('shopModule/removeShopData', sids);
					this.sum();
				}).catch(err => {
					this.$toast.clear();
					
				})

			},

			//删除商品
			removeshop(sids) {
				//加载提示
				this.$toast.loading({
					forbidClick: true,
					duration: 0,
					message: '处理中...'
				})
				//获取token字符串
				let tokenString = localStorage.getItem('_t');

				return this.axios({
					method: 'POST',
					url: '/deleteShopcart',
					data: {
						appkey: this.appkey,
						tokenString,
						sids
					},
					transformRequest: along.transformRequest
				})
			},

			//查看详情
			Particulars(pid) {
				this.$router.push({
					name: 'Details',
					params: {
						pid
					}
				});
			},


		},



	}
</script>

<style lang="less" scoped>
	.shopcart {
		padding-top: 46px;
		padding-bottom: 80px;
		min-height: 511px;
		background-color: #F4E4CA;
		/deep/.van-checkbox__icon--checked .van-icon{
			background-color: #690200;
			border-color: #690200;
		}
		.van-nav-bar {
			background-color: #5D0900;

			.van-nav-bar__title {
				color: white;
			}
		}

		.content-item {
			height: 80px;
			display: flex;
			padding: 10px;
			background-color: #F6F3EE;
			margin-bottom: 20px;

			&:last-child {
				margin-bottom: 0px;
			}
		}

		.pro-img {
			width: 80px;
		}

		.pro-desc {
			width: calc(~"100% - 80px - 10px - 26px");
			margin-left: 10px;
		}

		.pro-name {
			height: 56px;
		}

		.pro-price {
			height: 24px;
			font-size: 15px;
			line-height: 24px;
			color: #165dad;
		}

		.ch-name {
			font-size: 18px;
			color: #530000;
		}

		.rule {
			font-size: 14px;
			color: #B5908B;
			margin-left: 10px;
			line-height: 24px;
		}

		.en-name {
			font-size: 12px;
			color: #854540;
		}

		.div-Color {
			color: #CF3C2F;
		}

		.icon {
			width: 24px;
			height: 24px;
			border-radius: 50%;
			background-position: center center;
			background-size: cover;
			background-repeat: no-repeat;

			&.left {
				background-image: url("../imgs/decrease.png");
			}

			&.right {
				background-image: url("../imgs/increase.png");
			}
		}

		.pro-count {
			height: 24px;
			width: 30px;
			margin: 0 5px;
			text-align: center;
		}

		.shopcart-checkbox {
			margin-top: 30.5px;
			margin-right: 10px;
		}

		.v-btn {
			height: 100%;
		}

		.van-button--danger {
			background-color: #5D0900;
			border: none;
		}

		.van-button--info {
			background-color: #F17000;
		}

		.van-submit-bar__price {
			color: #BC0000;
		}

		.van-submit-bar {
			bottom: 44.98px;
		}

		.van-nav-bar__text {
			color: white;
			background-color: #5D0900;
		}

	}
</style>
