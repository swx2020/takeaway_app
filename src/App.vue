<template>
  <div id="app">
    <!--  不可以使用header作为组件标签名
      因为h5存在原生标签header标签，可能会混淆导致报错（解析时认为已经注册的组件没有使用时会报错） -->
    <Header :sellerInfo='seller'></Header>
    <!--
      v-bind:属性名="属性值"
        缩写为 :属性名="属性值"
          父子之间的通信中，【属性名】是在子组价的props属性中定义，【属性值】即要传递的值
     -->
    <!-- tab -->
    <div class="tab mobile_border-1px">
      <div class="tab-item">
        <!-- 声明式导航 必须带有to属性 -->
        <router-link
          class="tab-item-content"
          to="/goods"
        > 商品 </router-link>
      </div>
      <div class="tab-item">
        <router-link
          class="tab-item-content"
          to="/ratings"
        > 评价 </router-link>
      </div>
      <div class="tab-item">
        <router-link
          class="tab-item-content"
          to="/seller"
        > 商家 </router-link>
      </div>
    </div>
    <!-- 商品内容区 -->
    <div class="content">
      <!-- <router-view :seller="seller"></router-view> -->
      <!-- 使用keep-alive可以减少请求的次数
        将组件的状态都缓存到内存里
        切换router时，如果组件已经保存在内存，就直接从内存中恢复
       -->
       <keep-alive>
        <!-- 将 seller传入 -->
        <router-view
          :seller="seller"
        ></router-view>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import Header from 'components/header/Header.vue';

const ERR_OK = 0;
export default {
  name: 'App',
  // 由于组件是可以被复用的，如果data是一个对象，会导致修改一个组件时，另一个组件也会被修改；而函数则不会
  data() {
    return {
      seller: {}
    };
  },
  components: {
    Header
  },
  created() {
    this.$http.get('/api/seller?id=' + this.seller.id).then((response) => {
      // 成功时的回调
      response = response.body;
      if (response.errno === ERR_OK) {
        // this.seller = response.data;
        // 相当于 extend方法 扩展  es6语法   vue推荐的给对象扩展属性方法
        this.seller = Object.assign({}, this.seller, response.data);
      }
    });
  },
  methods: {
  }
};
</script>

<style lang="stylus" scoped>
// 这里不能使用别名的方法
// 因为设置的别名只针对 import引入 js库
// 而@import是CSS方式！
@import './assets/css/stylus/mixin.styl'
#app
  .tab
    display flex
    width 100%
    // 标注中的高度为80，但是移动端的设计一般是按照2倍的大小去设计的，（这里是按照iPhone6,设备独立像素？是375，物理像素(又称设备像素)是750，dpr是2）所以尺寸也是按照2倍大小标注的
    // dpr设备像素比：devicePixelRatio
    // 设备像素(device independent pixels): 设备屏幕的【物理像素】
    // 设备独立像素（Device Independent Pixel）：与设备无关的逻辑像素，代表可以通过程序控制使用的虚拟像素，是一个总体概念，【包括了CSS像素】
    // CSS像素（CSS Pixel）:指的是我们在样式代码中使用到的逻辑像素
    height 40px
    line-height 40px
    // 1px的实现：结合伪类和缩放实现（mixin.styl和base.styl）
    border-1px(rgba(7, 17, 27, 0.1))
    .tab-item
      flex 1
      text-align center
      &-content
        display block
        font-size 14px
        color rgb(77, 85, 93)
      .active
        color rgb(240, 20, 20)
</style>
