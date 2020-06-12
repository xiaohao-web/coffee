import Vue from 'vue'
import Vuex from 'vuex'

import {registerModule} from './register/store'
import {loginModule} from './login/store'
import {TotalityModule} from './totality/store'
import {menuModule} from './menu/store'
import {detailModule} from './detail/store'
import {shopModule} from './shop/store'
import {myModule} from './my/store'
import {likeModule} from './like/store'
import {newlyAddressModule} from './newlyAddress/store'
import {addressModule} from './address/store'
import {payModule} from './pay/store'
import {orderModule} from './order/store'


Vue.use(Vuex)

export default new Vuex.Store({
	 state: {
	 
	  //菜单页面是否已经加载过
	  menuIsLoaded: false
	},
	
	mutations: {
	  changeData(state, data) {
	    state[data.key] = data.value;
	  }
	},
  modules: {
    registerModule,
	loginModule,
	TotalityModule,
	menuModule,
	detailModule,
	shopModule,
	myModule,
	likeModule,
	newlyAddressModule,
	addressModule,
	payModule,
	orderModule
  }
})
