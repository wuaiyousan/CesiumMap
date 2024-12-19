<!--
 * @Author: fishScola
 * @Date: 2022-10-13 18:26:02
 * @LastEditors: wangzhipeng
 * @LastEditTime: 2023-07-21 16:11:53
 * @Description:
-->
<script setup>
const { params, colors } = defineProps({
  params: {
    type: Object,
    default: function () {
      return {
        percent: "",
        lable: "",
        text: "",
        unit: "个",
      };
    },
  },
  colors: {
    type: [Array, String],
    default: function () {
      return [
        { color: "#29FF98", percentage: 20 },
        { color: "#0095FF", percentage: 40 },
        { color: "#FFC102", percentage: 60 },
        { color: "#FF6A29", percentage: 80 },
        { color: "#FF5754", percentage: 100 },
      ];
    },
  },
});
</script>

<template>
  <div class="component-wrapper warning-item">
    <!-- <el-progress
      class="progress"
      type="circle"
      stroke-width="8"
      :percentage="params.percent"
      color="#00E8FF"
    /> -->
    <p class="label">{{ params.lable }}</p>
    <p class="text">
      {{ params.text }}&nbsp;<span class="minor">{{ params.unit }}</span>
    </p>
  </div>
</template>

<style lang="less" scoped>
.component-wrapper.warning-item {
  position: relative;
  text-align: center;
  color: rgb(201, 214, 255);

  .progress {
    width: 95px;
    height: 95px;

    :deep(.el-progress-circle) {
      width: 100% !important;
      height: 100% !important;
    }
    :deep(.el-progress__text) {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      color: #fff;
    }
  }

  .label {
    font-size: 22px;
    line-height: 50px;
  }

  .text {
    font-size: 20px;
    color: #fff;

    .minor {
      font-size: 20px;
    }
  }
}
</style>
