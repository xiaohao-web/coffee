export const mutations = {

  //置空数据
  emptyData(state) {
    state.isBottom = false;
    state.count = 10;
    state.start = 0;
    state.shopData = [];
    state.allshopData = [];
    state.isManage = false;
    state.total = 0;
  },

  changeData(state, data) {
    state[data.key] = data.value;
  },

  loadShopData(state) {
   //每次获取10条数据
    state.shopData.push(...state.allshopData.slice(state.start, state.count + state.start));

    state.start = state.count;
  },

  //删除shopData数组的元素
  removeShopData(state, data) {
  
    for (let i = state.shopData.length - 1; i >= 0; i--) {
      if (data.indexOf(state.shopData[i].sid) > -1) {
        state.shopData.splice(i, 1);
      }
    }

  }

}