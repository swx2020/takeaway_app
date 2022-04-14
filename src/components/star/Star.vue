<template>
  <div
    id="star"
    :class="starType"
  >
    <span
      v-for="(itemClass, index) in starClasses"
      :key="index"
      :class="itemClass"
      class="star-item"
    >
    </span>
  </div>
</template>

<script>
const LEN = 5;
const CLASS_ON = 'on';
const CLASS_HALF = 'half';
const CLASS_OFF = 'off';

export default {
  name: 'Star',
  props: {
    size: {
      type: Number
    },
    score: {
      type: Number
    }
  },
  computed: {
    starType() {
      // console.log(this.size);
      return 'star-' + this.size;
    },
    starClasses() {
      const result = [];
      // 使得score的小数只有0.5（例如1.5、2.5、3.5、4.5），4.2、4.1等都被转换为整数
      const score = Math.floor(this.score * 2) / 2;
      // 是否有半星
      const hasDecimal = score % 1 !== 0;
      // 整星的数量
      const integerN = Math.floor(score);
      for (let i = 0; i < integerN; i++) {
        result.push(CLASS_ON);
      }
      if (hasDecimal) {
        result.push(CLASS_HALF);
      }
      while (result.length < LEN) {
        result.push(CLASS_OFF);
      }
      // console.log(result);
      return result;
    }
  }
};
</script>

<style lang="stylus" scoped>
@import "../../assets/css/stylus/mixin"

#star
  // height: 50px
  font-size: 0
  .star-item
    display: inline-block
    background-repeat: no-repeat
  &.star-48
    .star-item
      width: 20px !important
      height: 20px !important
      margin-right: 22px
      background-size: 20px 20px !important
      &:last-child
        margin-right: 0
      &.on
        bg-image('./star-img/star48_on')
      &.half
        bg-image('./star-img/star48_half')
      &.off
        bg-image('./star-img/star48_off')
  &.star-36
    .star-item
      width: 15px
      height: 15px
      margin-right: 6px
      background-size: 15px 15px
      &:last-child
        margin-right: 0
      &.on
        bg-image('./star-img/star36_on')
      &.half
        bg-image('./star-img/star36_half')
      &.off
        bg-image('./star-img/star36_off')
  &.star-24
    .star-item
      width: 10px
      height: 10px
      margin-right: 3px
      background-size: 10px 10px
      &:last-child
        margin-right: 0
      &.on
        bg-image('./star-img/star24_on')
      &.half
        bg-image('./star-img/star24_half')
      &.off
        bg-image('./star-img/star24_off')
</style>
