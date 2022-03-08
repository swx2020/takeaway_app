<template>
  <div id="cart">
    <div
      class="content"
      @click="toggleCartList()"
    >
      <div class="content-left">
        <div class="logo-wrapper">
          <div
            class="logo"
            :class="{'highlight': totalCount > 0}"
          >
            <i
              class="icon-shopping_cart"
              :class="{'highlight': totalCount > 0}"
            ></i>
          </div>
          <div
            class="num"
            v-show="totalCount"
          >{{ totalCount }}</div>
        </div>
        <div
          class="price"
          :class="{'highlight': totalPrice > 0}"
        >¥{{ totalPrice}}</div>
        <div class="delivery-fee">另需配送费 ¥{{this.deliveryFee}}</div>
      </div>
      <div class="content-right" @click.stop.prevent="pay">
        <div
          class="pay"
          :class="payClass"
        >
          <!-- ¥{{ this.minPrice }}起送 -->
          {{ payDesc }}
        </div>
      </div>
    </div>
    <!-- 添加购物车时，小球drop到底部购物车中 -->
    <!-- <div class="ball-container">
      <transition name="drop">
        <div class="ball" v-for="(ball, index) in balls" :key="index" v-show="ball.show">
          <div class="inner"></div>
        </div>
      </transition>
    </div> -->
    <!-- 购物车列表 -->
    <transition
      name="fold"
    >
      <div
        class="cart-list"
        v-show="showCartList"
      >
        <div class="cart-list-header">
          <h1 class="title">购物车</h1>
          <span class="empty" @click="cleanGoods()">清空</span>
        </div>
        <div class="cart-list-content" ref="cart-list-content">
          <ul>
            <li
              class="cart-item"
              v-for="(item, index) in selectGoods"
              :key="index"
            >
              <span class="name"> {{item.name}} </span>
              <div class="price">
                <span>¥{{item.price*item.count}}</span>
              </div>
              <div class="cart-control-wrapper">
                <cart-control :food="item"></cart-control>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </transition>
    <!-- <div
      class="cart-list"
      v-show="showCartList"
    >
      <div class="cart-list-header">
        <h1 class="title">购物车</h1>
        <span class="empty" @click="cleanGoods()">清空</span>
      </div>
      <div
        class="cart-list-content"
        ref="cart-list-content"
      >
        <ul>
          <li
            class="cart-item"
            v-for="(item, index) in selectGoods"
            :key="index"
          >
            <span class="name"> {{item.name}} </span>
            <div class="price">
              <span>¥{{item.price*item.count}}</span>
            </div>
            <div class="cart-control-wrapper">
              <cart-control :food="item"></cart-control>
            </div>
          </li>
        </ul>
      </div>
    </div> -->
    <div class="cart-mask" v-show="showCartList" @click="closeCartList()"></div>
  </div>
</template>

<script>
// 引入 better-scroll
import BScroll from 'better-scroll';
import CartControl from '../cartControl/CartControl.vue';
export default {
  name: 'Cart',
  props: {
    selectGoods: {
      type: Array,
      // vue中props类型为ARRAY或OBJECT时，默认值为工厂函数形式
      default() {
        return [];
      }
    },
    // deliveryFee 在Goods组件中一般转换为 短横杠连接的方式,即 delivery-fee
    // 所以Goods组件中具体传值为  :delivery-fee="seller.deliveryPrice"
    deliveryFee: {
      type: Number,
      default: 0
    },
    // minPrice 在Goods组件中一般转换为 短横杠连接的方式,即 min-price
    // 所以Goods组件中具体传值为  :min-price="seller.minPrice"
    minPrice: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      show: false
      // balls: [
      //   {
      //     show: false
      //   },
      //   {
      //     show: false
      //   },
      //   {
      //     show: false
      //   },
      //   {
      //     show: false
      //   },
      //   {
      //     show: false
      //   }
      // ]
    };
  },
  components: {
    CartControl
  },
  computed: {
    totalPrice() {
      let total = 0;
      this.selectGoods.forEach((food) => {
        total += food.price * food.count;
      });
      return total;
    },
    totalCount() {
      let count = 0;
      this.selectGoods.forEach((food) => {
        count += food.count;
      });
      return count;
    },
    payDesc() {
      if (this.totalPrice === 0) {
        return `¥${this.minPrice}起送`;
      } else if (this.totalPrice < this.minPrice) {
        return `还差¥${(this.minPrice - this.totalPrice)}起送`;
      }
      return '去结算';
    },
    payClass() {
      if (this.totalPrice < this.minPrice) {
        return 'not-enough';
      }
      return 'enough';
    },
    showCartList: {
      // 如果totalCount为0，则证明没有商品加入购物车，所以返回false
      // if (!this.totalCount) {
      //   return false;
      // }
      // // 有商品加入购物车，就根据用户需要，通过点击购物车内容区决定是否显示商品列表
      // //            （即使有商品加入，也不应该立即更改为true，而是给用户来选择是否打开）
      // return this.show;
      get() {
        return !this.totalCount ? false : this.show;
      },
      set() {}
    }
  },
  methods: {
    closeCartList() {
      // console.log('click');
      this.show = false;
      //  为什么用  this.showCartList = false; 无效？？？？
    },
    toggleCartList() {
      if (!this.totalCount) {
        return;
      }
      this.show = !this.show;
      if (this.show) {
        this.$nextTick(() => {
          // 由于使用的cartControl组件是基于better-scroll开发的，所以也要通过better-scroll开启click事件
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs['cart-list-content'], {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        });
      }
    },
    cleanGoods() {
      // 遍历数组selectGoods，【 思路重点 --> 将每个商品的count都置为 0 】
      this.selectGoods.forEach((good) => {
        good.count = 0;
      });
      // 清空后，由于count为0，所以showCartList变为false；但是data中show的值并没有发生变化！
      // 如果 这里不设置this.show = false; 会导致 再次添加商品到购物车 时，由于show仍为true，使得 showCartList计算属性返回 this.show=ture, 从而导致购物车列表自动打开！
      this.show = false;
      /*
        不要采用把数组直接清空的方式，（this.this.selectGoods=[] × × × ！！！）这样的结果是整个列表消失
            而 商品列表中的选择商品数量没有改变。即商品中的count并没有改变
              再次加入商品到购物车的时候，原来删除的仍旧存在！！！
                所以这个操作并不能实现 删除购物车中的商品
       */
    },
    pay() {
      if (this.totalPrice < this.minPrice) {
        return;
      }
      window.alert(`支付${this.totalPrice}`);
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '../../assets/css/stylus/mixin'
#cart
  position fixed
  left 0
  bottom 0
  z-index 99
  width 100%
  height 48px
  .cart-mask
    position: fixed
    top: 0
    right: 0
    width 100%
    height calc(100% - 68px)
    background rgba(7, 17, 27, 0.6)
    z-index: -5
    backdrop-filter: blur(0.8px)
  .content
    display flex
    background #141d27
    font-size 0
    .content-left
      flex 1
      .logo-wrapper
        display inline-block
        position relative
        top -10px
        width 56px
        height 56px
        margin 0 12px
        padding 6px
        box-sizing border-box
        vertical-align top
        border-radius 50%
        background #141d27
        .logo
          width 100%
          height 100%
          border-radius 50%
          // 方法二： 父元素设置 text-align！！！
          // 行内元素居中，要设置在其父元素text-align
          // text-align属性是用来描述一个行内元素是如何在身为父元素的块级元素中对齐
          text-align center
          background #2b343c
          &.highlight
            background rgb(0, 160, 220)
          .icon-shopping_cart
            // 设置水平居中 方法一：
            // position absolute
            // left 50%
            // transform: translateX(-50%)
            font-size 24px
            color #80858a
            // line-height要设置为父元素的高度才能垂直居中！
            line-height 44px
            &.highlight
              color #fff
        .num
          position absolute
          top 0
          right 0
          width 24px
          height 16px
          line-height 16px
          text-align center
          border-radius 16px
          font-size 9px
          font-weight 700
          color #fff
          background rgb(240, 20, 20)
          box-shadow 0 4px 8px 0 rgba(0, 0, 0, 0.4)
      .price
        display inline-block
        vertical-align top
        margin-top 12px
        line-height 24px
        // 没有定义height时， 撑开div高度的是line-height而不是font-size
        // 设置line-height 48px后，文字虽然垂直居中了，但是 右边框同样变长撑满整个div!!!
        // 所以这里不用line-height 48px来实现文字垂直居中；而是结合margin-top:12px和 line-height:24px
        // line-height 48px
        padding-right 12px
        box-sizing border-box
        border-right 1px solid rgba(255, 255, 255, 0.1)
        font-size 16px
        font-weight 700
        color rgba(255, 255, 255, 0.4)
        &.highlight
          color #fff
      .delivery-fee
        display inline-block
        vertical-align top
        line-height 24px
        margin 12px 0 0 12px
        color rgba(255, 255, 255, 0.4)
        font-size 10px
    .content-right
      flex 0 0 105px
      width 105px
      .pay
        height 48px
        line-height 48px
        text-align center
        font-size 12px
        font-weight 700
        color rgba(255, 255, 255, 0.4)
        background #2b333b
        &.not-enough
          background #2b333b
        &.enough
          background #00b43c
          color #fff
  // .fold-enter-active, .fold-leave-active
  // // opacity 1
  // transform translate3d(0, -100%, 0)
  // transition all 5s
  // .fold-enter, .fold-leave-active
  // // opacity 0
  // transform translate3d(0, 0, 0)
  .cart-list
    position absolute
    top 0
    left 0
    z-index: -1
    width 100%
    transform: translate3d(0, -100%, 0)
    &.fold-enter-active, &.fold-leave-active
      transition: all 0.8s
    &.fold-enter, &.fold-leave-to
      transform: translate3d(0, 0, 0)
    &-header
      height 40px
      line-height 40px
      padding 0 18px
      background #f3f5f7
      border-bottom 1px solid rgba(7, 17, 27, 0.1)
      .title
        float left
        font-size 14px
        color rgb(7, 17, 27)
      .empty
        float right
        font-size 12px
        color rgb(0, 160, 220)
    &-content
      padding 0 18px
      max-height 217px
      overflow hidden
      background #fff
      .cart-item
        position relative
        padding 12px 0
        box-sizing border-box
        border-1px(rgba(7, 17, 27, 0.1))
        .name
          line-height 24px
          font-size 14px
          color rgb(7, 17, 27)
        .price
          position absolute
          right 90px
          bottom 12px
          line-height 24px
          font-size 14px
          font-weight 700
          color rgb(240, 20, 20)
        .cart-control-wrapper
          position absolute
          right 0
          bottom 6px
</style>
