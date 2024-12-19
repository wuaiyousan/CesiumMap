<!--
 * @Author: fishScola
 * @Date: 2022-04-26 09:04:33
 * @LastEditors: fishScola
 * @LastEditTime: 2022-04-26 10:10:11
 * @Description: SvgIcon
-->
<template>
  <svg aria-hidden="true" class="svg-icon">
    <use :href="symbolId" :fill="color" />
  </svg>
</template>
<script setup>
import { computed } from 'vue'
const props = defineProps({
  prefix: {
    type: String,
    default: 'icon',
  },
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: '#333',
  },
})

const symbolId = computed(() => `#${props.prefix}-${props.name}`)
</script>
<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: middle;
  fill: currentColor;
  overflow: hidden;
}
</style>
