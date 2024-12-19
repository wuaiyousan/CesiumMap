<!--
 * @Author: fishScola
 * @Date: 2022-10-13 21:33:35
 * @LastEditors: fishScola
 * @LastEditTime: 2023-06-05 17:18:29
 * @Description:
-->
<script setup>
const props = defineProps({
  // 选项列表
  typeList: {
    type: Array,
    default: function () {
      return [
        { code: 'FLOW', name: '流量监测点' },
        { code: 'STRESS', name: '压力监测点' },
        { code: 'WQ', name: '水质监测点' },
      ];
    },
  },
  // 当前选项
  selection: {
    type: String,
    default: function () {
      return '';
    },
  },
});

onMounted(() => {
  watchEffect(() => {
    theType.value = props.selection || '';
  });
});

const theType = ref('');
// 类型切换
const emit = defineEmits();
function onType({ code }) {
  if (theType.value === code) {
    return;
  }
  theType.value = code;
  emit('selection-change', code);
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
  height: 40px;
  display: flex;
  justify-content: space-evenly;
  user-select: none;

  .selection-type {
    border: 2px solid rgba(160, 169, 184, 0.3);
    background: rgba(15, 22, 34, 0.6);
    padding: 8px 16px;
    flex: 1;
    text-align: center;
    line-height: 20px;
    cursor: pointer;
    font-size: 16px;

    &.active {
      background: #0095ff;
      color: #fff;
    }
  }
}
</style>
