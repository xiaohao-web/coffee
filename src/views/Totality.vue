<template>
	<div class="totality">
		
		<!-- 二级路由 -->
		<router-view/>

		<van-tabbar v-model="tabbarName" active-color="#F27B2A" inactive-color="#EAE9E9" class="base" @change="toggleTab">
		  <van-tabbar-item :name="item.name" :icon="item.icon" v-for="(item, index) in tabbarData" :key="index">{{item.text}}</van-tabbar-item>
		</van-tabbar>
	</div>
</template>

<script>
	export default {
		name: "Totality",
		
		data() {
		  return {
		    //底部导航索引
		    tabbarName: this.$route.name
		  };
		},
		
		methods:{
			toggleTab(){
				console.log(this.tabbarName);
				this.$router.push({name: this.tabbarName});
			}
		},
		
		computed: {
		
		  tabbarData() {
		    return this.$store.state.TotalityModule.tabbarData;
		  }
		}
	}
</script>

<style lang="less" scoped>
	.base{
		background: #531103;
	}
</style>
