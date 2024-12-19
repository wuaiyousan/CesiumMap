<!--
 * @Author: fishScola
 * @Date: 2022-10-28 13:56:47
 * @LastEditors: fishScola
 * @LastEditTime: 2023-06-07 18:38:44
 * @Description: 图例面板
-->
<script setup>
const { legendList } = defineProps({
  legendList: {
    type: Array,
    default: function () {
      return [
        {
          tag: "health",
          title: "管道健康",
          list: [
            // 颜色与场景中绘制有色差!
            { label: "正常运行", color: "#29FF98" },
            { label: "较低风险", color: "#FFC102" },
            { label: "较高风险", color: "#FF5754" },
          ],
        },
      ];
    },
  },
});
</script>

<template>
  <div class="component-wrapper legend-box" v-show="legendList.length">
    <div class="single-legend" v-for="(it, index) in legendList" :key="index">
      <div class="title">{{ it.title }}</div>
      <div class="legend-item" v-for="(lgItem, lgIndex) in it.list" :key="lgIndex">
        <span class="label">{{ lgItem.label }}</span>
        <span class="color" :style="{ background: lgItem.color }"></span>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.component-wrapper.legend-box {
  padding: 6px 12px;
  border: 1px solid #14283c;
  border-radius: 4px;
  font-family: PingFangSC-Regular;
  font-weight: 400;
  user-select: none;

  .single-legend {
    margin-bottom: 4px;

    &:last-child {
      margin-bottom: 0;
    }

    .title {
      font-size: 18px;
      line-height: 24px;
    }

    .legend-item {
      display: flex;
      align-items: center;
      padding-left: 16px;
      line-height: 22px;
      font-size: 16px;

      .label {
        min-width: 60px;
        margin-right: 12px;
        color: #fff;
      }
      .color {
        width: 60px;
        height: 6px;
      }
    }
  }
}
</style>
