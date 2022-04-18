<template>
  <transition name="move">
    <div
      id="good-detail"
      v-show="showGoodDetail"
      ref="good-detail-wrapper"
    >
      <!-- 注意：better-scroll必须是外层【一个父容器】，里面包裹【【一个】子容器】！！！否则（多个子容器或外层没有父容器包裹）无效 -->
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
        <!-- 分割线 -->
        <split v-show="good.info"></split>
        <div class="good-info" v-show="good.info">
          <h1 class="title">商品信息</h1>
          <p class="text"> {{good.info}} </p>
        </div>
        <split></split>
        <div class="good-ratings">
          <h1 class="title">商品评价</h1>
          <!-- 事件方法中，如果不传参，就不写括号！ -->
          <!-- 不加括号时，函数第一个参数为 event，加了括号后，需要手动传入 $event 才能获得事件对象 -->
          <!-- 不需要参数或者默认参数的情况下，用一个定义的方法名即可 -->
          <ratings-category @showRatings="ratingsContent" @toggleContent="showContentRatings" :ratings="good.ratings" :selectType="selectType" :onlyContent="onlyContent" :desc="desc"></ratings-category>
          <div class="rating-wrapper">
            <!-- 没有评价或是空数组时就不显示 -->
            <ul v-show="good.ratings && good.ratings.length">
              <li v-show="needShow(rating.rateType, rating.text)" class="rating-item  mobile_border-1px" v-for="(rating, index) in good.ratings" :key="index">
                <div class="user">
                  <span class="username"> {{rating.username}} </span>
                  <img :src="rating.avatar" width="12" height="12" class="avatar" />
                </div>
                <!-- 时间戳转换 -->
                <div class="time"> {{rating.rateTime | formatDate}} </div>
                <p class="text">
                  <!-- 对象中可以写多个键值对，所以这里也可以一次绑定多个动态class -->
                  <i :class="{'icon-thumb_up': rating.rateType === 0, 'icon-thumb_down': rating.rateType === 1}"></i>
                  {{rating.text}}
                </p>
              </li>
            </ul>
            <!-- 没有评价或是空数组时就显示 -->
            <div class="no-rating" v-show="!good.ratings || !good.ratings.length">
              暂无评价
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
// 移入js
// 注意：用大括号！
// 因为组件使用 export default导出的，所以不加{}；而js是export导出的，所以要加{}
import { formatDate } from 'assets/js/date.js';
import BScroll from 'better-scroll';
import CartControl from 'components/cartControl/CartControl.vue';
import Split from '../split/Split.vue';
import RatingsCategory from '../ratings-category/RatingsCategory.vue';
// 增加代码的可读性，将数字用描述性常量来定义
// const POSITIVE = 0;
// const NEGATIVE = 1;
const ALL = 2;

export default {
  name: 'GoodDetail',
  filters: {
    formatDate(time) {
      const date = new Date(time);
      // 定义一个date.js
      // 传递两个参数，第一个是要转换的date，第二个是要转换的格式
      return formatDate(date, 'yyyy-MM-dd hh:mm');
    }
  },
  components: {
    CartControl,
    Split,
    RatingsCategory
  },
  props: {
    // 从Goods组件传过来的 被选择的商品信息
    good: {
      type: Object
    }
  },
  data() {
    return {
      showGoodDetail: false,
      // 选择评价的类型
      selectType: ALL,
      // 是否展示有内容的评价
      onlyContent: false,
      // 具体评价类型
      desc: {
        all: '全部',
        positive: '推荐',
        negative: '吐槽'
      }
    };
  },
  created() { },
  methods: {
    needShow(type, text) {
      // 点击‘只看有内容的评价’ 如果没有内容，则返回false，即不显示
      if (this.onlyContent && !text) {
        return false;
      }
      // 没有点击‘只看有内容的评价’时：
      // 如果点击“全部”就都显示
      if (this.selectType === ALL) {
        return true;
      } else {
        // 不是“全部”就根据当前点击的类型来显示
        // type是当前的li，而this.selectType是点击选项类型时，子组件传过来的当前用户选择显示的类型
        return type === this.selectType;
      }
    },
    showContentRatings(boo) {
      this.onlyContent = boo;
      // DOM更新是异步的！更新scroll也应该在DOM更新之后
      this.$nextTick(() => {
        this.scroll.refresh();
      });
      console.log(this.onlyContent);
    },
    // 根据子组件传递过来的类型（type）展示相应的评价
    ratingsContent(type) {
      // console.log(type);
      this.selectType = type;
      // DOM更新是异步的！
      this.$nextTick(() => {
        this.scroll.refresh();
      });
      console.log(this.selectType);
    },
    addGood(event) {
      if (!event._constructed) {
        return;
      }
      // console.log('click');
      if (!this.good.count) {
        this.$set(this.good, 'count', 1);
        console.log(this.good.count);
        // console.log(this.$root);
        // // 更新vuex中的 cart_goods
        this.$store.commit('addGoodToCart', this.good);
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
            // console.log('滚动2');
          } else {
            this.scroll.refresh();
            // console.log('滚动3');
          }
        });
      }
      // this.selectType = 1;
      // this.onlyContent = true;
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '../../assets/css/stylus/mixin'
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
  .good-detail-content
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
    .good-info
      padding 18px
      .title
        line-height 14px
        margin-bottom 6px
        font-size 14px
        color rgb(7, 17, 27)
      .text
        line-height 24px
        padding 0 8px
        font-size 12px
        color rgb(77, 85, 93)
    .good-ratings
      padding-top: 18px
      .title
        line-height 14px
        margin-left: 18px
        font-size 14px
        color rgb(7, 17, 27)
      .rating-wrapper
        padding 0 18px
        .rating-item
          position relative
          padding 16px 0
          border-1px(rgba(7, 17, 27, 0.1))
          .user
            position absolute
            right 0
            top 16px
            line-height 12px
            font-size 0
            .username
              display inline-block
              vertical-align top
              margin-right 6px
              font-size 10px
              color rgb(147, 153, 159)
            .avatar
              border-radius 50%
          .time
            margin-bottom 6px
            line-height 12px
            font-size 10px
            color rgb(147, 153, 159)
          .text
            line-height 16px
            font-size 12px
            color: rgb(7, 17, 27)
            .icon-thumb_up, .icon-thumb_down
              line-height 16px
              margin-right 4px
              font-size 12px
              color rgb(0, 160, 220)
            .icon-thumb_down
              color rgb(147, 153, 159)
        .no-rating
          padding 16px 0
          font-size 12px
          color rgb(147, 153, 159)
</style>
