<template>
  <transition
    name="move"
  >
    <div
      id="good-detail"
      v-show="showGoodDetail"
      ref="good-detail-wrapper"
    >
      <div class="good-detail-content">
        <div class="header-img">
          <img :src="good.image">
          <div
            class="back-button"
            @click="hideGoodDetail()"
          >
            <i class="icon-arrow_lift"></i>
          </div>
        </div>
        <div class="content">
          <h1 class="title"> {{good.name}} </h1>
          <div class="detail">
            <span class="sell-count">月售{{good.sellCount}}份</span>
            <span class="rating">好评率{{good.rating}}%</span>
          </div>
          <div class="price">
            <span class="new-price"> ¥{{ good.price }} </span><span
              class="old-price"
              v-show="good.oldPrice"
            >¥{{ good.oldPrice }}</span>
          </div>
          <div class="cart-control-wrapper">
            <!--
          :子组件中用于接收的属性名="父组件中的属性名"
          后面的才是当前组件中的属性名！！！！不要搞混了！！！！
         -->
            <cart-control :food="good"></cart-control>
          </div>
          <div
            class="addToCart"
            @click.stop.prevent="addGood($event)"
            v-show="!good.count || good.count === 0"
          >加入购物车</div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import BScroll from 'better-scroll';
import CartControl from 'components/cartControl/CartControl.vue';

export default {
  name: 'GoodDetail',
  components: { CartControl },
  props: {
    // 从Goods组件传过来的 被选择的商品信息
    good: {
      type: Object
    }
  },
  data() {
    return {
      showGoodDetail: false
    };
  },
  methods: {
    addGood(event) {
      // if (!event._constructed) {
      //   return;
      // }
      if (!event._constructed) {
        return;
      }
      // 55555555一晚上！！！一晚上结果是ref加错了位置！！！！！哭死了！！！！
      // console.log('click');
      if (!this.good.count) {
        this.$root.$set(this.good, 'count', 1);
        console.log(this.good.count);
        // console.log(this.$root);
      }
      // console.log(this.$root);
    },
    hideGoodDetail() {
      this.showGoodDetail = false;
    },
    show() {
      // 定义一个显示商品详情页的方法，并在父组件Goods中调用这个方法！
      this.showGoodDetail = true;
      // 一定要在this.$nextTick() 函数内部初始化better-scroll；因为只有这样，才能保证DOM已经渲染！！！！
      if (this.$refs['good-detail-wrapper']) {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs['good-detail-wrapper'], {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        });
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
#good-detail
  position fixed
  top 0
  left 0
  z-index 30
  bottom 48px
  width 100%
  background-color #fff
  // transform: translate3d(0, 0, 0)
  // 给类名前面添加 &，可以增加选择器的优先级！
  // 动画结束
  &.move-enter-active, &.move-leave-active
    transform translate3d(0, 0, 0)
    transition all 0.4s
  // 动画开始
  &.move-enter, &.move-leave-to
    transform translate3d(100%, 0, 0)
  .header-img
    position relative
    width 100%
    height 0
    // padding-top设置为百分比的时候，值的计算是相对于盒子的【宽度】去计算的
    padding-top 100%
    // padding-top: 100%即宽度的100%
    img
      position absolute
      top 0
      left 0
      width 100%
      height 100%
    .back-button
      position absolute
      top 10px
      left 0
      .icon-arrow_lift
        display block
        padding 10px
        font-size 20px
        color #fff
  .content
    padding 18px
    position relative
    .title
      line-height 14px
      margin-bottom 8px
      font-size 14px
      font-weight 700
      color rgb(7, 17, 27)
    .detail
      margin-bottom 18px
      height 10px
      line-height 14px
      font-size 0
      .sell-count, .rating
        font-size 10px
        color rgb(147, 153, 159)
      .sell-count
        margin-right 12px
    .price
      font-weight 700
      line-height 24px
      .new-price
        margin-right 8px
        font-size 14px
        color rgb(240, 20, 20)
      .old-price
        text-decoration line-through
        font-size 10px
        color rgb(147, 153, 159)
    .cart-control-wrapper
      position absolute
      right 12px
      bottom 12px
    .addToCart
      position absolute
      right 18px
      bottom 18px
      z-index 999
      height 24px
      line-height 24px
      padding 0px 12px
      box-sizing border-box
      border-radius 12px
      font-size 10px
      color #fff
      background rgb(0, 160, 220)
</style>
