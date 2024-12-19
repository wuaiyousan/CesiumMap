<!--
 * @Author: fishScola
 * @Date: 2022-05-25 15:34:14
 * @LastEditors: wangzhipeng
 * @LastEditTime: 2023-07-21 16:38:28
 * @Description: SplideView
-->
<script setup>
import { Splide, SplideSlide } from "@splidejs/vue-splide";
import "@splidejs/vue-splide/css";
import { PreventQuick } from "@/utils/index.js";

const props = defineProps({
  splide: {
    type: Object,
    default: function () {
      return {};
    },
  },
  // 奇偶行交替
  alternation: {
    type: Boolean,
    default: function () {
      return true;
    },
  },
  // 是否可点击选中行
  clickable: {
    type: Boolean,
    default: function () {
      return true;
    },
  },
  tableList: {
    type: Array,
    default: function () {
      return [];
    },
  },
});

let selectItem = ref(null);

const emit = defineEmits();
function onSplideClick(slideItem) {
  if (PreventQuick.isClickable({ name: "splide-view" })) {
    emit("slide-click", slideItem);
    selectItem.value = JSON.stringify(slideItem);
  }
}
</script>

<template>
  <div class="component-wrapper splide-view">
    <div class="splide-column header" v-if="$slots.splideHeader">
      <slot name="splideHeader"></slot>
    </div>
    <Splide :options="props.splide">
      <SplideSlide
        :class="[
          'splide-column',
          props.alternation ? (index % 2 === 1 ? 'even' : 'odd') : '',
          props.clickable
            ? selectItem === JSON.stringify(item)
              ? 'clickable selected'
              : 'clickable'
            : '',
        ]"
        v-for="(item, index) in props.tableList"
        :key="index"
      >
        <slot :item="item"></slot>
      </SplideSlide>
    </Splide>
  </div>
</template>

<style lang="less" scoped>
.component-wrapper.splide-view {
  overflow-y: hidden;
  .splide-column {
    display: flex;
    // justify-content: space-between;
    align-items: center;
    background: rgba(16, 74, 86, 0.4);
    font-size: 20px;
    font-weight: 400;
    height: 52px !important;
    color: rgba(239, 244, 255, 0.8);
    text-align: center;
    pointer-events: none;
    &.even {
      background: transparent; //rgba(106, 112, 124, 0.2);
    }

    &.odd {
      background: rgba(217, 217, 217, 0.1);
    }

    &.clickable {
      cursor: pointer;
      &:hover,
      &.selected {
        background: rgba(100, 174, 253, 0.25);
      }
    }

    &.header {
      height: 68px !important;
      background: none;
      font-weight: 500;
    }
  }
}
</style>
