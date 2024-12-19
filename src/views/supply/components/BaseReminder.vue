<!--
 * @Author: fishScola
 * @Date: 2022-10-16 01:19:16
 * @LastEditors: wangzhipeng
 * @LastEditTime: 2023-07-21 16:34:34
 * @Description: 页面头部统计
-->
<template>
  <div class="component-wrapper base-reminder">
    <div class="itembox" v-for="(item, index) in props.baseTitle" :key="index">
      <p class="label">{{ item.name }}</p>
      <p class="text">
        {{ item.value }}<span class="unit">{{ item.company }}</span>
      </p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  baseTitle: {
    type: Array,
    default: function () {
      return [];
    },
  },
  // 宽文本
  large: {
    type: Boolean,
    default: function () {
      return false;
    },
  },
});
</script>

<style lang="less" scoped>
.component-wrapper.base-reminder {
  display: flex;
  justify-content: space-around;
  position: absolute;
  top: 130px;
  left: 50%;
  transform: translate(-50%, 0);
  margin: 0 auto;
  width: 860px;
  z-index: 10;
  user-select: none;

  .itembox {
    width: 199px;
    height: 60px;
    text-align: center;
    background: url("@/assets/img/supply/dma-item-bg.png") no-repeat;
    background-size: 100% 100%;
    background-position: 100%;
    user-select: none;
    display: flex;
    align-items: center;
    justify-content: center;
    .label {
      color: @font-color-light;
      font-size: @titleSize7;
      font-weight: 500;
      margin-right: 28px;
    }

    .text {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 40px;
      font-weight: 500;
      color: @active-color;
      .unit {
        font-size: 16px;
        margin-top: 8px;
        margin-left: 6px;
      }
    }
  }
}
</style>
