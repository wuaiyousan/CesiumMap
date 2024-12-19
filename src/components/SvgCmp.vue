<!--
 * @Author: fishScola
 * @Date: 2022-04-26 09:04:33
 * @LastEditors: fishScola
 * @LastEditTime: 2023-05-16 18:45:47
 * @Description: SvgCmp
-->
<template>
  <div v-html="svg" ref="svgRef"></div>
</template>

<script setup>
const { icon, loadedFn } = defineProps({
  icon: {
    type: String,
    required: true,
  },
  loadedFn: {
    type: Function,
  },
});

const modules = import.meta.glob('../icons/**/*.svg', {
  as: 'raw',
  eager: true,
});

const svg = computed(() => {
  return modules['../icons/' + icon + '.svg'];
});
const svgRef = ref(null);

if (loadedFn) {
  nextTick(() => {
    let it = svgRef.value;
    if (it && it.children && it.children.length) {
      loadedFn(it.getElementsByTagName('svg')[0]);
    }
  });
}
</script>
