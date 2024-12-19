<!--
 * @Author: fishScola
 * @Date: 2022-10-13 21:33:35
 * @LastEditors: fishScola
 * @LastEditTime: 2022-10-13 22:35:53
 * @Description:
-->
<script setup>
const props = defineProps({
  // 选项列表
  typeList: {
    type: Array,
    default: function () {
      return [
        { code: "1", name: "供水量" },
        { code: "2", name: "流量计1" },
        { code: "3", name: "流量计2" },
      ];
    },
    deep: true,
  },
  // 当前选项
  selection: {
    type: String,
    default: function () {
      return "all";
    },
  },
});

onMounted(() => {
  watchEffect(() => {
    console.log(222);
    theType.value = props.selection || "";
  });
});

const theType = ref("1");
// 类型切换
const emit = defineEmits();
function onType({ code }) {
  if (theType.value === code) {
    return;
  }
  theType.value = code;
  emit("selection-change", code);
}
</script>

<template>
  <div class="component-wrapper type-selections">
    <span
      class="selection-type"
      :class="{ active: item.code === theType }"
      v-for="(item, index) in props.typeList"
      :key="index"
      @click.stop="onType(item)"
    >
      {{ item.name }}
    </span>
  </div>
</template>

<style lang="less" scoped>
.component-wrapper.type-selections {
  // height: 40px;
  display: flex;
  justify-content: space-evenly;

  .selection-type {
    background: #0a4071;
    border: 1px solid #529dff;
    border-radius: 2px;
    padding: 4px 18px;
    margin: 0 4px;
    font-size: 17px;
    line-height: 20px;
    cursor: pointer;
    color: #fff;
    &.active {
      border: 2px solid rgb(24, 144, 255);
      background: #529dff;
      color: #fff;
    }
  }
}
</style>
