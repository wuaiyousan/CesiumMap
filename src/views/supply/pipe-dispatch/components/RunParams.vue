<!--
 * @Author: fishScola
 * @Date: 2022-10-13 22:04:39
 * @LastEditors: fishScola
 * @LastEditTime: 2023-06-05 16:56:33
 * @Description: 运行参数
-->
<script setup>
const { showList } = defineProps({
  showList: {
    type: Array,
    default: function () {
      return [];
    },
  },
});
</script>

<template>
  <div class="component-wrapper run-params">
    <div class="param-item" v-for="(item, index) in showList" :key="index">
      <p class="value">{{ item.value }}</p>
      <p class="label">{{ item.label }}</p>
    </div>
  </div>
</template>

<style lang="less" scoped>
.component-wrapper.run-params {
  position: relative;
  height: 100%;

  .param-item {
    margin: 2% 3% 1%;
    padding-top: 12px;
    width: 140px;
    height: 80px;
    background: rgba(65, 207, 255, 0.1);
    border-radius: 4px;
    text-align: center;

    .value {
      font-size: 20px;
      color: #FFC102;
      margin-bottom: 6px;
    }

    .label {
      font-size: 16px;
      font-family: PingFangSC-Medium;
      font-weight: 500;
      color: #fff;
    }
  }
}
</style>
