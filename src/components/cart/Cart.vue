<template>
  <div id="cart">
    <div class="content">
      <div class="content-left">
        <div class="logo-wrapper">
          <div class="logo">
            <i class="icon-shopping_cart"></i>
          </div>
          <div class="num">{{ totalCount }}</div>
        </div>
        <div class="price">¥{{ totalPrice}}</div>
        <div class="delivery-fee">另需配送费 ¥{{this.deliveryFee}}</div>
      </div>
      <div class="content-right">
        <div class="pay">
          ¥{{ this.minPrice }}起送
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
    }
  }
};
</script>

<style lang="stylus" scoped>
#cart
  position fixed
  left 0
  bottom 0
  z-index 50
  width 100%
  height 48px
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
          .icon-shopping_cart
            // 设置水平居中 方法一：
            // position absolute
            // left 50%
            // transform: translateX(-50%)
            font-size 24px
            color #80858a
            // line-height要设置为父元素的高度才能垂直居中！
            line-height 44px
        .num
          position absolute
          top 0
          right 0
          width 24px
          height 16px
          line-height: 16px
          text-align center
          border-radius: 16px
          font-size 9px
          font-weight: 700
          color #fff
          background: rgb(240, 20, 20)
          box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4)
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
        color: rgba(255, 255, 255, 0.4)
      .delivery-fee
        display inline-block
        vertical-align: top
        line-height 24px
        margin 12px 0 0 12px
        color rgba(255, 255, 255, 0.4)
        font-size: 10px
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
</style>
