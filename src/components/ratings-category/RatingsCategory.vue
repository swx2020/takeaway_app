<template>
  <div id="ratings-category">
    <div class="ratings-type mobile_border-1px">
      <span @click="select(2,$event)" class="block positive" :class="{'active': currentType===2}">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
      <span @click="select(0,$event)" class="block positive" :class="{'active': currentType===0}">{{desc.positive}}<span class="count">{{positiveRatings.length}}</span></span>
      <span @click="select(1,$event)" class="block negative" :class="{'active': currentType===1}">{{desc.negative}}<span class="count">{{negativeRatings.length}}</span></span>
    </div>
    <div @click="showOnlyContent($event)" class="switch" :class="{'on': currentOnlyContent}">
      <i class="icon-check_circle"></i>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script>
/*
  分析：首先这个组件每个选项（分类）中的内容是通过外部传入的
        其次需要知道每个分类对应的评价内容的数组，从而知道【当前分类的评价的数量！】，需要在选项中显示
        另外：还要管理是否只展示有内容的评价
    这几点都需从外部传入
      通过props中接收
*/
// 增加代码的可读性，将数字用描述性常量来定义
const POSITIVE = 0;
const NEGATIVE = 1;
const ALL = 2;

export default {
  name: 'RatingsCategory',
  props: {
    // 评价
    ratings: {
      type: Array,
      default() {
        return [];
      }
    },
    // 选择评价的类型
    selectType: {
      type: Number,
      // 增加代码的可读性，将数字用描述性常量来定义
      default: ALL
    },
    // 是否展示有内容的评价
    onlyContent: {
      type: Boolean,
      default: true
    },
    // 具体评价类型
    desc: {
      type: Object,
      default() {
        return {
          all: '全部',
          positive: '满意',
          negative: '不满意'
        };
      }
    }
  },
  data() {
    return {
      // 由于Vue内部的机制，传入的props中的值,是不允许被修改的！！！！
      // 如果要修改，可以将props中的值保存在data中
      currentType: this.selectType,
      currentOnlyContent: this.onlyContent
      // currentRatingsCount: this.ratings.length
    };
  },
  computed: {
    positiveRatings() {
      return this.ratings.filter((rating) => {
        // ratings数组中的属性即当前评价的类型（1 --> NEGATIVEs)
        return rating.rateType === POSITIVE;
        // 返回所以positive类型的评价的数组
      });
    },
    negativeRatings() {
      return this.ratings.filter((rating) => {
        // ratings数组中的属性即当前评价的类型（0 --> positive)
        return rating.rateType === NEGATIVE;
      });
    }
  },
  methods: {
    select(type, event) {
      if (!event._constructed) {
        return;
      }
      this.currentType = type;
      // 子组件向父组件通信，发送一个事件
      this.$emit('showRatings', this.currentType);
    },
    showOnlyContent(event) {
      if (!event._constructed) {
        return;
      }
      this.currentOnlyContent = !this.currentOnlyContent;
      // 子组件向父组件通信，发送一个事件
      this.$emit('toggleContent', this.currentOnlyContent);
    }
  }
};
</script>

<style lang="stylus">
@import '../../assets/css/stylus/mixin'
#ratings-category
  .ratings-type
    padding 18px 0
    margin: 0 18px
    border-1px(rgb(1, 17, 27, 0.1))
    font-size 0
  .block
    display: inline-block
    padding 8px 12px
    margin-right 8px
    line-height 16px
    border-radius: 1px
    color rgb(77, 85, 93)
    font-size 12px
    &.active
      color #fff
    .count
      font-size 8px
      margin-left 2px
    &.positive
      background rgba(0, 160, 220, 0.2)
      &.active
        background rgb(0, 160, 220)
    &.negative
      background rgba(77, 85, 93, 0.2)
      &.active
        background rgb(77, 85, 93)
  .switch
    padding 12px 18px
    line-height 24px
    border-bottom: 1px solid rgba(7, 17, 27, 0.1)
    color rgb(147, 153, 159)
    font-size 0
    &.on
      .icon-check_circle
        color #00c850
    .icon-check_circle
      display: inline-block
      vertical-align: top
      margin-right 4px
      font-size 24px
    .text
      display: inline-block
      vertical-align: top
      font-size 12px
</style>
