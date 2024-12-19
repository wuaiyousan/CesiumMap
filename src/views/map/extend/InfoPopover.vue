<!--
 * @Author: fishScola
 * @Date: 2022-09-28 16:15:17
 * @LastEditors: fishScola
 * @LastEditTime: 2023-06-05 17:42:29
 * @Description: Popover
-->
<script setup>
const { params } = defineProps({
  params: {
    type: Object,
    default: function () {
      return {
        title: "",
        list: [
          // {label:'', value:'', unit:''}
        ],
      };
    },
  },
});
</script>

<template>
  <div class="component-wrapper info-popover">
    <p class="title" v-show="params.title">{{ params.title || "--" }}</p>
    <div class="info-list">
      <div class="info-item" v-for="(it, index) in params.list" :key="index">
        <span class="lbl">{{ it.label }}：</span>
        <p class="txt">
          {{ it.value }}<span class="unit">{{ it.unit }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.component-wrapper.info-popover {
  // width: 330px;
  height: fit-content;
  padding: 8px 12px;

  .title {
    height: 25px;
    font-size: 18px;
    font-family: PingFangSC-Medium;
    font-weight: 500;
    color: #96faff;
    line-height: 25px;
  }

  .info-list {
    padding: 4px 0;

    .info-item {
      display: flex;
      margin-bottom: 4px;
      height: 24px;
      line-height: 24px;
      font-size: 16px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: #ffffff;

      .lbl {
        text-align: left;
      }
      .txt {
        text-align: right;
        display: flex;
        align-items: center;
        height: 24px;

        .unit {
          // margin-top: 2px;
          margin-left: 6px;
        }
      }

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
