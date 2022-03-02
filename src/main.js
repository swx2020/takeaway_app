import Vue from 'vue';
import router from './router';
import App from './App.vue';
import './assets/css/reset.css';
import './assets/css/stylus/index.styl';

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app');
