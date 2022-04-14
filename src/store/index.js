// vue2对应vuex3（版本对应）

import Vue from 'vue';
import Vuex from 'vuex';
// 引入VueResource
import VueResource from 'vue-resource';

Vue.use(Vuex);
Vue.use(VueResource);

const store = new Vuex.Store({
  state: {

    // 收藏的状态
    favorite: false,

    // 每添加一个商品到购物车，就加入数组
    cart_goods: []
  },
  mutations: {

    // 更新商品数据信息
    // 当前商品的标识name，然后再更新当前商品的属性
    // 每个商品时一个对象
    addGoodToCart(state, good) {
      state.cart_goods.push(good);
      // console.log(state.cart_goods);
    },
    // 更新购物车中商品的count属性值
    updateGoodCount(state, good) {
      state.cart_goods.forEach(item => {
        if (item.name === good.name) {
          item.count = good.count;
        }
      });
      state.cart_goods = state.cart_goods.filter(item => {
        return item.count !== 0;
      });
      // console.log(state.cart_goods);
    },
    // 清空购物车
    cleanCartGoods(state) {
      state.cart_goods.forEach(item => {
        item.count = 0;
      });
      // console.log(state.cart_goods);
      state.cart_goods = [];
    },
    // 更改收藏状态
    updateCollection(state) {
      state.favorite = !state.favorite;
      console.log(state.favorite);
    }
  },
  actions: {
  },
  getters: {
    cart_num(state) {
      const num = state.cart_goods.reduce((preTotal, curValue) => {
        // console.log(preTotal);
        // console.log(curValue.count);
        // const sum = preTotal + curValue.count;
        // console.log(`sum: ${sum}`);
        return preTotal + curValue.count;
      }, 0);
      return num;
    },
    totalPrice(state) {
      const price = state.cart_goods.reduce((preTotal, curValue) => {
        // console.log(curValue.price);
        // console.log(typeof preTotal);
        // const mul = preTotal + (curValue.count * curValue.price);
        // console.log(`mul: ${mul}`);
        // console.log(`totalPrice: ${preTotal + (curValue.count * curValue.price)}`);
        return preTotal + (curValue.count * curValue.price);
      }, 0);
      return price;
    }
  }
});

export default store;
