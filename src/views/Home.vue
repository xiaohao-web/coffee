<template>
	<div class="home">
		<div class="smallImg">
			<img class="auto-img" src="http://www.kangliuyong.com:10002/images/banner/bga2.jpg" alt="">
		</div>
		<div class="tuijian">
			<div class="title-box">今日推荐&nbsp;></div>
			<div class="commodity clearfix">
				<div class="like-box">
					<div :class="[index % 2 == 0 ? 'a' : 'b']" v-for="(item,index) in dataList" :key="index">
					  <div @click="goDetail(item.pid)">
					    <img class="auto-img" :src="item.url" alt="">
					  </div>
					  <div class="title">
						<span class="fl clearfix">{{item.name}}</span>
						<span class="fr price">￥{{item.price}}</span>
					  </div>
					</div>
					
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
	  name: "Home",
	  data(){
		  return {
			  dataList:[
				  {url:"http://www.kangliuyong.com:10002/images/product_small/IMG_0384_02p.jpg",price:"28.00",name:"焦糖拿铁",pid:"latte004"},
				  {url:"http://www.kangliuyong.com:10002/images/product_small/IMG_0388_02p.jpg",price:"28.00",name:"抹茶瑞纳冰",pid:"rena_ice002"},
				  {url:"http://www.kangliuyong.com:10002/images/product_small/IMG_0390_02p.jpg",price:"28.00",name:"奥瑞白",pid:"coffee006"},
				  {url:"http://www.kangliuyong.com:10002/images/product_small/IMG_0392_02p.jpg",price:"28.00",name:"黑糖啵啵拿铁",pid:"latte006"}
			  ]
		  }
	  },
	  methods:{
		  
			  goDetail(pid) {
			    this.$router.push({name: 'Details', params: {pid}});
			  }
	  }
	}
</script>

<style lang="less">
	.home{
		background-color: #F8E3CA;
		margin-bottom: 43.98px;
		.smallImg{
			height: 163.03px;
		}
		.title-box{
			color: #514E47;
			font-size: 18px;
			margin-top: 10px;
		}
		.like-box{
		  margin-top: 10px;
		  >div{
		    float: left;
		    width: calc(~"50% - 5px - 20px");
		    background-color: #fff;
		    padding: 10px;
		    margin-bottom: 10px;
			background-color: #F6F3EE;
		    &.a{
		      margin-right: 5px;
		    }
		    &.b{
		      margin-left: 5px;
		    }
		  }
		}
		.title{
		  padding: 10px 0;
		  color: #444;
		  font-size: 16px;
		}
		.price{
		  font-size: 14px;
		  color: #BB0000;
		  line-height: 24px;
		}
	}
</style>
