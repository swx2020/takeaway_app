<template>
  <div id="cart-control">
    <transition name="move">
      <div
        class="cart-substract icon-remove_circle_outline"
        v-show="food.count>0"
        @click.stop.prevent="substractCart($event)"
      ></div>
    </transition>
    <div
      class="cart-count"
      v-show="food.count>0"
    > {{food.count}} </div>
    <div
      class="cart-add icon-add_circle"
      @click.stop.prevent="addCart($event)"
    ></div>
  </div>
</template>

<script>
export default {
  name: 'CartControl',
  props: {
    food: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  // created() {
  //   // console.log(this.food);
  // },
  methods: {
    // 同样，better-scroll需要自定义打开click事件
    addCart(event) {
      if (!event._constructed) {
        return;
      }
      // 传进来的对象本身没有count 这个属性，所以这里直接给新定义的属性赋值不生效
      // 如果想要实现这个功能需要用vue 的一个接口
      if (!this.food.count) {
        // 点击“+”按钮后，如果food中还没有count，那就添加一个count属性，并赋值为1
        // this.$root即Vue根组件，其中有一个$set的API(Vue.$set是将set()方法绑定在Vue上)
        // 但是不需要查找根组件！
        // 只需要直接使用 this.$set (this.$set是将set()方法绑定在Vue的原型上，但实际上与Vue.$set原理是一样的)
        // console.log(this);
        this.$set(this.food, 'count', 1);
        // console.log(this.$root);
        console.log(this.food.count);

        // // 更新vuex中的 cart_goods
        this.$store.commit('addGoodToCart', this.food);
      } else {
        // 如果已经存在count属性，则直接 ++
        this.food.count++;
        // // 更新vuex中的 cart_goods 对应food的数量
        // console.log(this.food);
        this.$store.commit('updateGoodCount', this.food);
      }
    },
    substractCart(event) {
      if (!event._constructed) {
        return;
      }
      this.food.count--;
      // // 更新vuex中的 cart_goods 对应food的数量
      // console.log(this.food);
      this.$store.commit('updateGoodCount', this.food);
    }
  }
};
</script>

<style lang="stylus" scoped>
#cart-control
  font-size 0
  .move-enter-active, .move-leave-active
    opacity 1
    transform translate3d(0, 0, 0)
    transition all 0.4s
  .move-enter, .move-leave-active
    opacity 0
    transform translate3d(24px, 0, 0)
  .cart-substract, .cart-add
    display inline-block
    padding 6px
    font-size 24px
    line-height 24px
    color rgb(0, 160, 220)
  .cart-count
    display inline-block
    vertical-align top
    width 12px
    padding-top 6px
    line-height 24px
    text-align center
    font-size 10px
    color rgb(147, 153, 159)
  .cart-add
    display inline-block
</style>
