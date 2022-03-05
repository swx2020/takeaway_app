<template>
  <div id="header">
      <div class="content-wrapper">
        <div class="avatar">
          <img width="64" height="64" :src="sellerInfo.avatar">
          <!-- 没有 :alt="sellerInfo.name" 这个用法？ -->
        </div>
        <div class="content">
          <div class="title">
            <span class="brand"></span>
            <span class="name"> {{sellerInfo.name}} </span>
          </div>
          <div class="description">
            {{sellerInfo.description}} / {{sellerInfo.deliveryTime}}
            <span>分钟送达</span>
          </div>
          <div class="support" v-if="sellerInfo.supports">
            <!--
              v-if="sellerInfo.supports" 的作用：数据请求完成后再渲染
                浏览器解析渲染时，数据请求是异步的，
                  当浏览器解析到sellerInfo时，数据还未请求过来，导致sellerInfo此时仍然是空对象
                    而从空对象中找数组中的元素是找不到的，所以会报错
             -->
            <span class="icon" :class="classMap[sellerInfo.supports[0].type]"></span>
            <span class="text"> {{sellerInfo.supports[0].description}} </span>
          </div>
        </div>
        <div class="support-count" v-if="sellerInfo.supports" @click="isShowSellerDetailShow">
          <span class="count"> {{sellerInfo.supports.length}} 个</span>
          <i class="icon-keyboard_arrow_right"></i>
        </div>
      </div>
      <div class="bulletin-wrapper" @click="isShowSellerDetailShow">
        <span class="bulletin-title"></span>
        <span class="bulletin-text"> {{sellerInfo.bulletin}} </span>
        <i class="icon-keyboard_arrow_right"></i>
      </div>
      <div class="background">
        <img :src="sellerInfo.avatar" width="100%" height="100%">
      </div>
      <transition name="fade">
        <div class="seller-detail" v-show="showSellerDetailShow">
        <!-- <div class="seller-detail" v-show="showSellerDetailShow" transition="fade"> -->
          <div class="seller-detail-wrapper clearfix">
            <div class="seller-detail-wrapper-main">
              <h1 class="seller-name"> {{sellerInfo.name}} </h1>
              <div class="star-wrapper">
                <star :size="48" :score="sellerInfo.score"></star>
              </div>
              <div class="title">
                <div class="line"></div>
                <div class="text">优惠信息</div>
                <div class="line"></div>
              </div>
              <ul class="support-list" v-if="sellerInfo.supports">
                <li class="support-item" v-for="item in sellerInfo.supports" :key="item.type">
                  <span class="icon" :class = "classMap[item.type]"></span>
                  <span class="text"> {{item.description}} </span>
                </li>
              </ul>
              <div class="title">
                <div class="line"></div>
                <div class="text">商家公告</div>
                <div class="line"></div>
              </div>
              <div class="bulletin-content-wrapper">
                <p class="bulletin-content"> {{sellerInfo.bulletin}} </p>
              </div>
            </div>
          </div>
          <div class="seller-detail-close" @click="hideSellerDetailShow">
            <i class="icon-close"></i>
          </div>
        </div>
      </transition>
  </div>
</template>

<script>
import Star from 'components/star/Star.vue';

export default {
  name: 'Header',
  props: {
    sellerInfo: {
      type: Object
    }
  },
  components: {
    Star
  },
  data() {
    return {
      showSellerDetailShow: false
    };
  },
  methods: {
    isShowSellerDetailShow() {
      this.showSellerDetailShow = !this.showSellerDetailShow;
    },
    hideSellerDetailShow() {
      this.showSellerDetailShow = !this.showSellerDetailShow;
    }
  },
  created() {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
  }
};
</script>

<style lang="stylus" scoped>
@import '../../assets/css/stylus/mixin'
#header
  position: relative
  overflow hidden
  color: #fff
  background-color: rgba(7, 17, 27, 0.5)
  .content-wrapper
    position: relative
    padding: 24px 12px 18px 24px
    font-size: 0
    .avatar
      display: inline-block
      vertical-align: top
      margin-right: 16px
      border-radius: 2px
      // avatar内部的图片多余的部分会遮挡父元素！！！！
      overflow hidden
    .content
      display: inline-block
      .title
        margin: 2px 0 8px 0
        .brand
          display: inline-block
          vertical-align: top
          width: 30px
          height: 18px
          bg-image('./header-img/brand')
          background-size: 30px 18px
          background-repeat: no-repeat
        .name
          line-height: 18px
          margin-left: 6px
          font-size: 16px
          font-weight: bold
      .description
        font-size: 12px
        line-height: 12px
        margin-bottom: 10px
      .support
        .icon
          display: inline-block
          vertical-align: top
          width: 12px
          height: 12px
          margin: 0 4px 2px 0
          background-size: 12px 12px
          background-repeat: no-repeat
          // &.decrease ==> .icon.decrease 表示同时拥有icon和decrease两个类名的元素！！！
          &.decrease
            bg-image('./header-img/decrease_1')
          &.discount
            bg-image('./header-img/discount_1')
          &.special
            bg-image('./header-img/special_1')
          &.invoice
            bg-image('./header-img/invoice_1')
          &.guarantee
            bg-image('./header-img/guarantee_1')
        .text
          line-height: 12px
          font-size: 10px
    .support-count
      position: absolute
      right: 12px
      bottom: 14px
      padding: 0 8px
      height: 24px
      line-height: 24px
      border-radius: 14px
      background-color: rgba(0, 0, 0, 0.2)
      text-align: center
      .count
        // 文字与字体图标的对齐方式不同，为了对齐，这里设置vertical-align
        vertical-align top
        // 由于父元素设置了font-size为0，所以后面子元素都要设置font-size！！！
        font-size: 10px
      .icon-keyboard_arrow_right
        margin-left: 2px
        // base中设置了line-height为1，所以这里要重新设置
        line-height: 24px
        // 字体图标也要设置font-size
        font-size: 10px
  .bulletin-wrapper
    position: relative
    height: 28px
    line-height: 28px
    padding: 0 22px 0 12px
    background-color: rgba(7, 17, 27, 0.2)
    white-space: nowrap
    overflow: hidden
    text-overflow: ellipsis
    // 两个行内元素相邻，中间会有空隙，但是使用会影响ellipsis
    // font-size: 0
    .bulletin-title
      display: inline-block
      vertical-align: top
      margin-top: 8px
      width: 22px
      height: 12px
      bg-image('./header-img/bulletin')
      background-size: 22px 12px
      background-repeat: no-repeat
    .bulletin-text
      vertical-align: top
      font-size: 10px
      margin: 0 4px
    .icon-keyboard_arrow_right
      position: absolute
      right: 12px
      font-size:10px
      line-height: 28px
  .background
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    z-index -1
    // 模糊效果
    filter: blur(10px)
  .seller-detail
    position: fixed
    top: 0
    left: 0
    z-index: 999
    width: 100%
    height: 100%
    overflow: auto
    background-color: rgba(7, 17, 27, 0.8)
    &.fade-enter-active, &.fade-leave-active
      opacity: 1
      background: rgba(7, 17, 27, 0.8)
      transition: all 0.4s
    &.fade-enter, &.fade-leave-active
      opacity: 0
      background: rgba(7, 17, 27, 0)
    &-wrapper
      width: 100%
      min-height: 100%
      &-main
        margin-top: 64px
        padding-bottom: 64px
        .seller-name
          line-height: 16px
          text-align: center
          font-size: 16px
          font-weight: 700
        .star-wrapper
          margin-top: 18px
          padding: 2px 0
          text-align: center
        .title
          display: flex
          width: 80%
          margin: 28px auto 24px
          .line
            flex: 1
            position: relative
            top: -6px
            border-bottom: 1px solid rgba(255, 255, 255, 0.2)
          .text
            padding: 0 12px
            font-size: 14px
            font-weight: 700
        .support-list
          width: 80%
          margin: 0 auto
          .support-item
            padding: 0 12px
            margin-bottom: 12px
            font-size: 0
            &:last-child
              margin-bottom: 0
            .icon
              display: inline-block
              vertical-align: top
              width: 16px
              height: 16px
              margin-right: 6px
              background-size: 16px 16px
              background-repeat: no-repeat
              &.decrease
                bg-image('./header-img/decrease_2')
              &.discount
                bg-image('./header-img/discount_2')
              &.special
                bg-image('./header-img/special_2')
              &.invoice
                bg-image('./header-img/invoice_2')
              &.guarantee
                bg-image('./header-img/guarantee_2')
            .text
              line-height: 16px
              font-size: 12px
        .bulletin-content-wrapper
          width: 80%
          // text-align: center
          margin: 0 auto
          .bulletin-content
            padding: 0 12px
            line-height: 24px
            font-size: 12px
    &-close
      position relative
      // 注意：position：absolute会使得margin：0 auto失效
      width: 32px
      height: 32px
      // margin: 0 auto
      margin: -64px auto 0 auto
      // margin: 0px auto 64px auto
      /*
        margin-top的值如果为负的，就是【向上移动】，
          而如果用margin-bottom，盒子的上边不会动，只不过是在【下方多“顶出来”150px的空白】，
            又因为下边本来就是空白的，所以看起来margin-bottom就像是没有效果的也就是不会发生移动。
              （实际商由于多出来150px空白，屏幕右侧多出了滚动条）
       */
      clear: both
      font-size: 32px
</style>
