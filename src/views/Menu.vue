<template>
	<div class="menu">
		<!-- 轮播插件 -->
		<van-swipe :autoplay="3000" indicator-color="white">
			<van-swipe-item v-for="(item, index) in bannerData" :key="index">
				<img class="auto-img" :src="item.bannerImg" alt="">
			</van-swipe-item>
		</van-swipe>

		<div class="menu-tab">
			<div class="menu-tab-fl">
				<div class="menu-tab-item" :class="{active: item.isActive}" v-for="(item, index) in typeData" :key="index" @click="toggleType(item, index, $event)">{{item.typeDesc}}</div>
				<div class="line" :style="{top: top + 'px'}"></div>
			</div>
			<div class="menu-tab-fg">
				<div class="content-item" v-for="(item,index) in coffeeTypeProducts" :key="index" @click="goDetail(item.pid)">
					<div class="pro-img">
						<img class="auto-img" :src="item.smallImg" alt="">
					</div>
					<div class="pro-desc">
						<div class="pro-name">
							<div class="ch-name">{{item.name}}</div>
							<div class="en-name">{{item.enname}}</div>
						</div>
						<div class="pro-price">{{item.price}}</div>
					</div>
				</div>
				

			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: "Menu",

		created() {
			if (this.menuIsLoaded) {
			  //如果请求过，不再请求
			  return;
			}
			
			//初始化页面数据
			//获取banner图数据
			this.getBanner();

			//获取商品类型数据
			this.getType();
			
			this.$store.commit('changeData', {key: 'menuIsLoaded', value: true})
		},

		computed: {
			//菜单页面是否加载过
			menuIsLoaded() {
			  return this.$store.state.menuIsLoaded;
			},

			//banner图数据
			bannerData() {
				return this.$store.state.menuModule.bannerData;
			},

			//商品类型数据
			typeData() {
				return this.$store.state.menuModule.typeData;
			},

			//线条移动的距离
			top() {
				return this.$store.state.menuModule.top;
			},
			
			//当前类型商品数据
			coffeeTypeProducts() {
				return this.$store.state.menuModule.coffeeTypeProducts;
			}
		},

		methods: {
			getBanner() {
				this.axios({
					method: 'GET',
					url: '/banner',

					//get请求携带的参数
					params: {
						appkey: this.appkey
					}
				}).then(result => {
					

					if (result.data.code == 300) {
						this.$store.commit('menuModule/changeBannerData', result.data.result);
					}

				}).catch(err => {
					
				})
			},

			//获取商品类型
			getType() {
				this.axios({
					method: 'GET',
					url: '/type',

					//get请求携带的参数
					params: {
						appkey: this.appkey
					}
				}).then(result => {

					
					let types = result.data.result;

					//添加一个isActive, 用于判断激活标签
					types.forEach(v => {
						v.isActive = false;
					})

					types.unshift({
						type: 'isHot',
						typeDesc: '最新推荐',
						isActive: true
					})

					if (result.data.code == 400) {
						this.$store.commit('menuModule/changeTypeData', types);
						this.listcoffee(this.typeData[0]);
					}

					// 
				}).catch(err => {
					
				})
			},

			//切换商品类型
			toggleType(item, index, e) {
				console.log(item, index, e);
				if (item.isActive) {
					return;
				}

				let types = this.typeData.concat();
				for (let i = 0; i < types.length; i++) {
					if (types[i].isActive) {
						types[i].isActive = false;
						break;
					}
				}

				//将当前激活
				types[index].isActive = true;
				
				

				this.$store.commit('menuModule/changeTypeData', types);

				// 

				this.$store.commit('menuModule/changeTop', index * e.target.clientHeight);

				// 
				this.listcoffee(item);

			},
		
			//根据商品类型获取商品接口
			listcoffee(item){
				console.log(item)
				let params = {
					appkey:this.appkey
				};
				
				if(item.type == 'isHot'){
					params.key = 'isHot';
					params.value = 1;
				}else{
					params.key = 'type';
					params.value = item.type;
				}
				
				this.axios({
					method: 'GET',
					url: '/typeProducts',
					params
				}).then(result => {
					if(result.data.code == 500){
						 this.$store.commit('menuModule/changeTypeProducts',result.data.result);
						 
					}
				})
			},
			
			//携带商品pid跳转详情页
			goDetail(pid) {
			  this.$router.push({name: 'Details', params: {pid}});
			}
		}
	}
</script>

<style lang="less" scoped>
	.menu-tab {
		display: flex;
		position: fixed;
		top: 163.03px;
		bottom: 49.98px;
		left: 0;
		right: 0;

		.menu-tab-fl {
			background-color: #5D0900;
			width: 100px;
			position: relative;

			.line {
				position: absolute;
				top: 0;
				left: 0;
				width: 2px;
				height: 44px;
				background-color: #1989FA;
				transition: top .2s;
			}
		}

		.menu-tab-fg {
			width: calc(~"100% - 100px");
			background-color: #fff;
			height: 100%;
			overflow-y: auto;
		}

		.menu-tab-item {
			text-align: center;
			line-height: 44px;
			color: #fff;

			&.active {
				background-color: #fff;
				color: #FF7306;
			}
		}

		.content-item {
			height: 80px;
			display: flex;
			padding: 10px;
			border-bottom: 1px solid #f0f0f0;
		}

		.pro-img {
			width: 80px;
		}

		.pro-desc {
			width: calc(~"100% - 80px - 10px");
			margin-left: 10px;
		}

		.pro-name {
			height: 60px;
		}

		.pro-price {
			height: 20px;
			font-size: 15px;
			line-height: 20px;
			color: #165DAD;
		}

		.ch-name {
			font-size: 18px;
			color: #444;
		}

		.en-name {
			font-size: 14px;
			color: #C2C2C2;
		}
	}
</style>
