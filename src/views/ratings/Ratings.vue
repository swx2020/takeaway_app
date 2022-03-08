<template>
  <!-- better-scroll,获取的是父级容器的节点！！！！所以ref要写在父级容器 -->
  <div id="ratings"  ref="ratings">
    <div class="ratings-content">
      <div class="overview">
        <div class="overview-left">
          <h1 class="score"> {{ seller.score }} </h1>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家{{seller.rankRate}}</div>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <!-- 引入star组件，并传入需要的值size, score -->
            <star :size="36" :score="seller.serviceScore"></star>
            <span class="score"> {{ seller.serviceScore }} </span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <!-- 引入star组件，并传入需要的值size, score -->
            <star :size="36" :score="seller.foodScore"></star>
            <span class="score"> {{ seller.foodScore }} </span>
          </div>
          <div class="delivery-wrapper">
            <span class="title">送达时间</span>
            <span class="delivery-time">{{ seller.deliveryTime }}分钟</span>
          </div>
        </div>
      </div>
      <!-- 分割线 -->
      <split></split>
      <!-- 选择展示评价的类型 -->
      <ratings-category @showRatings="ratingsContent" @toggleContent="showContentRatings" :ratings="ratings" :selectType="selectType" :onlyContent="onlyContent" :desc="desc"></ratings-category>
      <!-- 评价内容 -->
      <div class="ratings-wrapper">
        <ul>
          <li v-show="needShow(rating.rateType, rating.text)" class="rating-item mobile_border-1px" v-for="(rating, index) in ratings" :key="index">
            <div class="avatar">
              <img :src="rating.avatar" width="28" height="28" />
            </div>
            <div class="content">
              <h1 class="username"> {{ rating.username }} </h1>
              <div class="star-wrapper">
                <star :size="24" :score="rating.score"></star>
                <span class="delivery-time" v-show="rating.deliveryTime">{{ rating.deliveryTime }}分钟送达</span>
              </div>
              <p class="text">{{ rating.text }}</p>
              <div class="recommend" v-show="rating.recommend && rating.recommend.length">
                <i class="icon-thumb_up"></i>
                <span class="recommend-content" :key="index" v-for="(item, index) in rating.recommend">{{item}}</span>
              </div>
              <div class="time">
                {{rating.rateTime | formatDate}}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { formatDate } from 'assets/js/date.js';
import BScroll from 'better-scroll';
import RatingsCategory from '../../components/ratings-category/RatingsCategory.vue';
import Split from '../../components/split/Split.vue';
import Star from '../../components/star/Star.vue';

// 定义常量
const ERR_OK = 0;
const POSITIVE = 0;
// const NEGATIVE = 1;
const ALL = 2;

export default {
  name: 'Ratings',
  filters: {
    formatDate(time) {
      const date = new Date(time);
      // 定义一个date.js
      // 传递两个参数，第一个是要转换的date，第二个是要转换的格式
      return formatDate(date, 'yyyy-MM-dd hh:mm');
    }
  },
  components: {
    Star,
    Split,
    RatingsCategory
  },
  props: {
    // APP.vue中的router-view 传入了商家的信息，这里用props接收
    seller: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      // 评价页面('/ratings')的数据
      ratings: [],
      // 选择评价的类型
      selectType: POSITIVE,
      // 是否展示有内容的评价
      onlyContent: false,
      // 具体评价类型
      desc: {
        all: '全部',
        positive: '满意',
        negative: '不满意'
      }
    };
  },
  created() {
    this.$http.get('api/ratings').then((response) => {
      response = response.body;
      if (response.errno === ERR_OK) {
        this.ratings = response.data;
        this.$nextTick(() => {
          // console.log('click');
          this.scroll = new BScroll(this.$refs.ratings, {
            click: true
          });
        });
      }
    });
  },
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
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '../../assets/css/stylus/mixin'
#ratings
  position absolute
  // 除去Header的高度
  top 174px
  bottom 0
  left 0
  width 100%
  overflow hidden
  .ratings-content
    .overview
      display: flex
      padding 18px 0
      .overview-left
        flex: 0 0 137px
        padding 6px 0
        width 137px
        border-right: 1px solid rgba(7, 17, 27, 0.1)
        text-align center
        // 这样的布局对于宽度小于375的屏幕会导致布局错乱，所以需要加一个@media适应屏幕宽度
        // 当宽度为320px时：
        @media only screen and (max-width: 320px)
          flex 0 0 120px
          width 120px
        .score
          margin-bottom 6px
          line-height 28px
          font-size 24px
          color rgb(255, 153, 0)
        .title
          margin-bottom 8px
          line-height 12px
          font-size 12px
          color rgb(7, 17, 27)
        .rank
          line-height 10px
          font-size 10px
          color rgb(147, 153, 159)
      .overview-right
        flex 1
        padding 6px 0 6px 24px
        @media only screen and (max-width: 320px)
          padding-left 6px
        .score-wrapper
          margin-bottom 8px
          font-size 0
          .title
            display: inline-block
            line-height 18px
            // title和score是文字，而star是图片，对齐方式不同，所以需要加vertical-align，统一对齐方式
            vertical-align: top
            font-size 12px
            color rgb(7, 17, 27)
          #star
            display: inline-block
            vertical-align: top
            margin 0 12px
          .score
            display: inline-block
            line-height 18px
            vertical-align: top
            font-size 12px
            color rgb(255, 153, 0)
        .delivery-wrapper
          font-size 0
          // title和delivery-time都是文字，对齐方式相同，所以不用加vertical-align
          .title
            line-height 18px
            font-size 12px
            color rgb(7, 17, 27)
          .delivery-time
            margin-left 12px
            font-size 12px
            color rgb(147, 153, 159)
    .ratings-wrapper
      padding 0 18px
      .rating-item
        display: flex
        padding 18px 0
        border-1px(rgba(7, 17, 27, 0.2))
        .avatar
          flex 0 0 28px
          width 28px
          margin-right 12px
          img
            border-radius: 50%
        .content
          flex: 1
          position relative
          .username
            margin-bottom 4px
            line-height 12px
            font-size 10px
            color rgb(7, 17, 27)
          .star-wrapper
            margin-bottom 6px
            font-size 0
            #star
              display inline-block
              vertical-align: top
              margin-right 6px
            .delivery-time
              display inline-block
              vertical-align: top
              line-height 12px
              font-size 10px
              color rgb(147, 153, 159)
          .text
            margin-bottom 8px
            line-height 18px
            font-size 12px
            color rgb(7, 17, 27)
          .recommend
            line-height 16px
            font-size 0
            .icon-thumb_up, .recommend-content
              display: inline-block
              margin 0 8px 4px 0
              font-size 9px
            .icon-thumb_up
              color rgb(0, 160, 220)
            .recommend-content
              padding 0 6px
              border: 1px solid rgba(7, 17, 27, 0.2)
              border-radius: 1px
              color rgb(147, 153, 159)
              background #fff
          .time
            position absolute
            top 0
            right 0
            line-height 12px
            font-size 10px
            color rgb(147, 153, 159)
</style>
