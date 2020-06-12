export const mutations = {

  //修改bannerData
  changeBannerData(state, data) {
    state.bannerData = data;
  },

  //修改商品类型数据
  changeTypeData(state, data) {
    state.typeData = data;
  },

  //修改top
  changeTop(state, data) {
    state.top = data;
  },
  
  //根据商品类型修改商品
  changeTypeProducts(state,data){
	  state.coffeeTypeProducts = data;
  }
}