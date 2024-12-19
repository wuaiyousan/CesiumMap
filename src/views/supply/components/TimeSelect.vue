<!--
 * @Author: fishScola
 * @Date: 2022-10-15 20:44:15
 * @LastEditors: fishScola
 * @LastEditTime: 2023-06-06 10:21:04
 * @Description: 时间选择
-->
<script setup>
const props = defineProps({
  timeList: {
    type: Array,
    default: function () {
      return [
        { name: "年", code: "YEAR" },
        { name: "月", code: "MONTH" },
      ];
    },
  },
  // 当前选项
  selection: {
    type: String,
    default: function () {
      return "";
    },
  },
});

let toTime = ref("");

onMounted(() => {
  watchEffect(() => {
    toTime.value = props.selection || "";
  });
});

const emit = defineEmits();
function onTime(code) {
  if (toTime.value === code) {
    return;
  }
  toTime.value = code;
  emit("time-change", code);
}
</script>

<template>
  <div class="component-wrapper time-select">
    <span
      class="item"
      :class="{ active: it.code === toTime }"
      v-for="(it, index) in props.timeList"
      :key="index"
      @click.stop="onTime(it.code)"
    >
      {{ it.name }}
    </span>
  </div>
</template>

<style lang="less" scoped>
.component-wrapper.time-select {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 58px;
  .item {
    border: 2px solid #4b89f0;
    border-left: none;
    background: rgba(55, 98, 171, 0.4);
    color: #539dff;
    // border-radius: 2px;
    padding: 4px 10px;
    line-height: 30px;
    font-size: 18px;
    cursor: pointer;
    &:first-child {
      border-top-left-radius: 3px;
      border-left: 2px solid #4b89f0;
      border-bottom-left-radius: 3px;
      border-right: none;
    }
    &:last-child {
      border-top-right-radius: 3px;
      border-bottom-right-radius: 3px;
    }
    &.active {
      border: 2px solid #1890ff;
      color: #ffffff;
      background: #529dff;
    }
  }
}
</style>
