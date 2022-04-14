<template>
  <div id="goods">
    <!-- 菜单导航 -->
    <div
      class="menu-wrapper"
      ref="menu"
    >
      <ul>
        <li
          class="menu-item"
          :class="{'current': currentIndex === index}"
          v-for="(item,index) in goods"
          :key="index"
          @click="toggleGoods(index, $event)"
        >
          <!-- better-scroll 默认会阻止【移动端】浏览器的原生 click 事件!需手动设置click:true ；不会阻止PC端-->
          <!-- :class="{'current': currentIndex === index}" 三目运算符？？？符合条件就是 存在类名current -->
          <span class="text mobile_border-1px">
            <span
              class="icon"
              :class="classMap[item.type]"
              v-show="item.type > 0"
            ></span>
            {{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <!-- 商品列表 -->
    <div
      class="goods-wrapper"
      ref="goods"
    >
      <ul>
        <li
          class="goods-item"
          ref="goods-item-hook"
          v-for="(item,index) in goods"
          :key="index"
        >
          <h1 class="title"> {{ item.name }} </h1>
          <ul>
            <li
              class="foods-item  mobile_border-1px"
              v-for="(food,index1) in item.foods"
              :key="index1"
              @click="selectGood(food,$event)"
            >
              <!-- 在 ref="goods-item-hook" 内部，即在better-scroll作用范围内，所以仍要传递一个$event-->
              <div class="food-icon">
                <img
                  width="57"
                  height="56"
                  :src="food.icon"
                />
              </div>
              <div class="food-info">
                <h2 class="food-name"> {{ food.name }} </h2>
                <p class="food-desc"> {{ food.description }} </p>
                <div class="extra">
                  <span class="count">月售{{ food.sellCount }}份</span>
                  <span>好评率{{ food.rating }}%</span>
                </div>
                <div class="price">
                  <span class="new-price"> ¥{{ food.price }} </span><span
                    class="old-price"
                    v-show="food.oldPrice"
                  > ¥{{ food.oldPrice }} </span>
                </div>
              </div>
              <!-- 右：添加商品按钮 -->
              <div class="cart-control-wrapper">
                <cart-control :food="food"></cart-control>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <!-- 点击商品进入详情页 -->
    <good-detail
      :good="goodSelected"
      ref="good-detail"
    ></good-detail>
    <!-- 底部购物车 -->
    <cart
      :delivery-fee="seller.deliveryPrice"
      :min-price="seller.minPrice"
    ></cart>
  </div>
</template>

<script>
// import { mapState, mapActions } from 'vuex';
// 引入 better-scroll
import BScroll from 'better-scroll';
// 引入组件
import Cart from 'components/cart/Cart.vue';
import CartControl from 'components/cartControl/CartControl.vue';
import GoodDetail from 'components/good-detail/GoodDetail.vue';

const ERR_OK = 0;

export default {
  name: 'Goods',
  props: {
    seller: {
      type: Object
    }
  },
  components: {
    Cart,
    CartControl,
    GoodDetail
  },
  data() {
    return {
      // 商品信息
      goods: [],
      listHeight: [],
      // scrollY 存储的是【商品列表】 【滚动时】的滚动高度
      scrollY: 0,
      // 用户选择并点击商品，进入商品详情页
      // 函数方法名与data中的属性名不能相同！！！！
      goodSelected: {}
    };
  },
  computed: {
    // ...mapState({
    //   goods: 'goodsList'
    // }),
    currentIndex() {
      for (let i = 0; i < this.listHeight.length; i++) {
        const h1 = this.listHeight[i];
        const h2 = this.listHeight[i + 1];
        if ((this.scrollY >= h1 && this.scrollY) < h2 || !h2) {
          // this.scrollY > h1 && this.scrollY < h2 --> 如果符合条件则证明当前区间都属于第i个li
          // !h2 --> 表示当前在最后一个li区间内
          return i;
        }
      }
      // 如果listHeight为空就返回0。即currentIndex为0
      return 0;
    }
    // selectGoods() {
    //   const foods = [];
    //   this.goods.forEach((good) => {
    //     good.foods.forEach((food) => {
    //       if (food.count) {
    //         foods.push(food);
    //       }
    //     });
    //   });
    //   return foods;
    // }
  },
  created() {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];

    this.$http.get('api/goods').then((response) => {
      response = response.body;
      if (response.errno === ERR_OK) {
        this.goods = response.data;
        console.log(this.goods);
        /* 【异步请求都完成以后,才进行对better-scroll的初始化】.
                如果不这样做的话,better-scroll无法正确取到content的高度.从而无法实现滚动.
        */
        // 另外： vue更新数据是异步的，实际上DOM真正发生变化是在$nextTick回调函数后（DOM更新）
        this.$nextTick(() => {
          // 此时才能正确计算高度
          this._initScroll();
          this._calHeight();
        });
      }
    });
  },
  methods: {
    // ...mapActions(['getGoodsData']),
    selectGood(food, event) {
      if (!event._constructed) {
        return;
      }
      this.goodSelected = food;
      // 调用子组件方法
      // console.log(this.$refs['good-detail']);
      this.$refs['good-detail'].show();
    },
    toggleGoods(index, event) {
      // 传递过来的event就是这个点击事件
      // 但 better-scroll 的点击事件 与 原生的点击事件有区别： 即better-scroll的点击事件带有一个_constructed, 而原生的点击事件没有
      // 所以为了防止PC端触发两次点击事件，可以通过if判断，将原生的点击事件return
      if (!event._constructed) {
        // 不执行原生的click
        return;
      }
      const goodList = this.$refs['goods-item-hook'];
      // 获取商品列表中与当前选中的菜单栏 相对应的li节点
      const el = goodList[index];
      // 调用better-scroll的接口scrollToElement()
      this.goodsScroll.scrollToElement(el, 300);
      // 第一次点击了精选热菜这个导航栏，然后计算对应的li列表的位置并滚动到对应位置，那下次再次点击到这个导航栏时。还要计算吗
      // 如果需要的话，是不是可以存储起来，下次使用的时候直接使用存储起来的数据
      // 初步想法：每次点击并滚动后，将index与el对应的高度存储在一个对象中（键值对），下次再次点击相同的导航栏，就使用对象中的数据
    },
    _initScroll() {
      this.menuScroll = new BScroll(this.$refs.menu, {
        click: true
      });
      // console.log(this.$refs.menu);
      // console.log('滚动1');

      this.goodsScroll = new BScroll(this.$refs.goods, {
        click: true,
        // 作用：滚动时实时告知滚动的位置
        probeType: 3
      });
      // // 设置了probeType之后，就可以通过 on事件 接收 实时滚动的位置
      this.goodsScroll.on('scroll', (pos) => {
        this.scrollY = Math.abs(Math.round(pos.y));
      });
    },
    _calHeight() {
      // console.log(this.$refs['goods-item-hook']);
      const goodList = this.$refs['goods-item-hook'];
      console.log(goodList);
      let height = 0;
      this.listHeight.push(height);
      for (let i = 0; i < goodList.length; i++) {
        const item = goodList[i];
        height += item.clientHeight;
        this.listHeight.push(height);
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '../../assets/css/stylus/mixin'
#goods
  display flex
  position absolute
  width 100%
  top 174px
  bottom 46px
  overflow hidden
  .menu-wrapper
    // 菜单栏宽度固定
    flex 0 0 80px
    width 80px
    background-color #f3f5f7
    .menu-item
      display table
      height 54px
      width 56px
      line-height 14px
      padding 0 12px
      &.current
        // 提高层级
        position relative
        margin-top -1px
        background-color #fff
        font-weight 700
        .text
          border-none()
      .icon
        display inline-block
        vertical-align top
        width 12px
        height 12px
        margin-right 2px
        background-size 12px 12px
        background-repeat no-repeat
        // &.decrease ==> .icon.decrease 表示同时拥有icon和decrease两个类名的元素！！！
        &.decrease
          bg-image('./goods-img/decrease_3')
        &.discount
          bg-image('./goods-img/discount_3')
        &.special
          bg-image('./goods-img/special_3')
        &.invoice
          bg-image('./goods-img/invoice_3')
        &.guarantee
          bg-image('./goods-img/guarantee_3')
      .text
        display table-cell
        width 56px
        // text-align: center
        // 在 display:table中， vertical-align: middle就是指定垂直居中
        vertical-align middle
        border-1px(rgba(7, 17, 27, 0.1))
        font-size 12px
  .goods-wrapper
    // 商品部分宽度自适应！！！
    flex 1
    .title
      padding-left 14px
      height 26px
      line-height 26px
      border-left 2px solid #d9dde1
      font-size 12px
      color rgb(147, 153, 159)
      background-color #f3f5f7
    .foods-item
      display flex
      margin 18px
      padding-bottom 18px
      border-1px(rgba(7, 17, 27, 0.1))
      &:last-child
        border-none()
        margin-bottom 0
      .food-icon
        flex 0 0 57px
        margin-right 10px
      .food-info
        flex 1
        .food-name
          margin 2px 0 8px
          height 14px
          line-height 14px
          font-size 14px
          color rgb(7, 17, 27)
        .food-desc
          margin-bottom 8px
          line-height 12px
          font-size 10px
          color rgb(147, 153, 159)
        .extra
          line-height 10px
          font-size 10px
          color rgb(147, 153, 159)
          .count
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
        right 0
        bottom 12px
</style>
