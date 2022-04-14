import Vue from 'vue';
// 引入router/index.js中导出的router
import router from './router';
// 引入VueResource
import VueResource from 'vue-resource';
import App from './App.vue';
import './assets/css/reset.css';
import './assets/css/stylus/index.styl';

import store from './store/index.js';

Vue.config.productionTip = false;
// 注册！
Vue.use(VueResource);
// 注册后给 每个vue实例 扩展了一个 【$htttp】！！！

new Vue({
  // 注册挂载！
  router,
  store,
  render: (h) => h(App)
}).$mount('#app');
