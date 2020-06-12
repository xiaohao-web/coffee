<template>
	<div class="address">
		<van-nav-bar title="地址管理" left-arrow :fixed="true" @click-left="back" />
		<div class="address-box">
			<van-address-list v-model="chosenAddressId" :switchable="false" :list="list" default-tag-text="默认"  @add="increaseAddress" @edit="editAddress"/>
		</div>
	</div>
</template>

<script>
	import {mapState} from 'vuex'
	import {along} from "../utils/along";
	export default {
		name: "Address",
		data() {
			return {
				chosenAddressId: '0',
			}
		},
		
		computed: {
		  ...mapState('addressModule', ['list'])
		},
		
		created(){
			//获取token字符串
			let tokenString = localStorage.getItem('_t');
			this.axios({
			  method: 'GET',
			  url: '/findAddress',
			  params: {
			    appkey: this.appkey,
			    tokenString
			  }
			}).then(result => {
			  this.$toast.clear();
			  
			  
			  let list = [];
			  result.data.result.forEach((v, i) => {
			    let o = {
			      id: i + '',
			      aid: v.aid,
			      name: v.name,
			      tel: v.tel,
			      isDefault: Boolean(v.isDefault),
			      address: v.province + v.city + v.county + v.addressDetail
			    }
						
					if (o.isDefault) {
						this.chosenAddressId = o.id;
					}
				list.push(o);
				this.$store.commit("addressModule/changeData", {key: "list", value: list});
			  })
				
			}).catch(err => {
				this.$toast.clear();
				
			})
		},
		
		methods: {

			//返回上一级
			back() {
				this.$router.go(-1);
			},
			
			increaseAddress() {
				//isAdd为1的时候添加，0就是编辑
			  this.$router.push({name: "newlyAddress", query: {isAdd: 1}});
			},
			
			editAddress(item){
				this.$router.push({name:"newlyAddress",query: {isAdd: 0, aid: item.aid}})
			}
		},
	}
</script>

<style lang="less" scoped>
	.address{
		.van-nav-bar{
			background-color: #5E0E08;
			.van-nav-bar__title{
				color: white;
			}
			.van-icon{
				color: white;
			}
		}
		min-height: 571.03px;
		background-color: #F4E4CA;
		padding-top: 46px;
		padding-bottom: 49.97px;
		.van-address-list{
			padding-bottom: 0;
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
		
	}
</style>
