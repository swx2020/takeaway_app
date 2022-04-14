import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const Goods = () => import('views/goods/Goods.vue');
const Ratings = () => import('views/ratings/Ratings.vue');
const Seller = () => import('views/seller/Seller.vue');

const routes = [
  {
    path: '/',
    redirect: '/goods'
  },
  {
    path: '/goods',
    name: 'Goods',
    component: Goods
  },
  {
    path: '/ratings',
    name: 'Ratings',
    component: Ratings
  },
  {
    path: '/seller',
    name: 'Seller',
    component: Seller
  }
];

const router = new VueRouter({
  mode: 'history',
  routes,
  linkActiveClass: 'active'
});

// 将router对象导出，并传入到vue实例（在入口文件main.js的vue实例中注册）
export default router;
