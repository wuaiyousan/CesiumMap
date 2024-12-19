<!--
 * @Author: fishScola
 * @Date: 2022-07-06 10:56:21
 * @LastEditors: wangzhipeng
 * @LastEditTime: 2023-07-21 16:46:21
 * @Description: 专题内Tab切换
-->
<script setup>
const props = defineProps({
  tabList: {
    type: Array,
    default: function () {
      return [];
    },
  },
  defaultTab: {
    type: String,
    default: function () {
      return "";
    },
  },
});

const selectTab = ref("");
const emit = defineEmits();
const clickable = ref(true);

onMounted(() => {
  watchEffect(() => {
    if (props.defaultTab) {
      selectTab.value = props.defaultTab;
    }
  });
});

onBeforeUnmount(() => {
  selectTab.value = "";
});

const show = ref(true);
const handleShowTab = () => {
  show.value = !show.value;
};
// 切换Tab
function onClickTab(type) {
  if (selectTab.value === type) {
    return;
  }
  if (type === "_anchor_") {
    // 切换
  } else if (clickable.value) {
    // 其他点击tab
    selectTab.value = type;
    emit("thematic-tab-changed", type);
    // 让菜单禁止点击切换一段时间
    boolReducer(clickable);
  }
}

function boolReducer(refObj) {
  if (refObj.value) {
    refObj.value = false;
    window.setTimeout(() => {
      refObj.value = true;
    }, 2500);
  }
}
</script>

<template>
  <div class="component-wrapper thematic-tabs">
    <transition name="fade">
      <div class="box" v-show="show">
        <div
          :class="[
            tabItem.type === selectTab ? 'tab-item active' : 'tab-item',
            clickable ? '' : 'unclickable',
          ]"
          v-for="(tabItem, tabIndex) in props.tabList"
          :key="tabIndex"
          @click.stop="onClickTab(tabItem.type)"
        >
          <div v-if="tabItem.type === '_anchor_'" class="tab-anchor"></div>
          <template v-else>
            <div class="text">
              {{ tabItem.name }}
            </div>
            <div class="line"></div>
          </template>
        </div>
      </div>
    </transition>
    <img
      class="img-arrow"
      :class="show ? 'img-show' : 'img-hide'"
      src="../../assets/img/common/arrow-up.png"
      alt=""
      @click="handleShowTab"
    />
  </div>
</template>

<style lang="less">
.component-wrapper.thematic-tabs {
  position: absolute;
  z-index: 20;
  bottom: 40px;
  left: 50%;
  // height: 92px;
  display: flex;
  align-items: center;
  flex-direction: column;
  z-index: 20;
  transform: translate(-50%, 0);
  user-select: none;
  .img-arrow {
    margin-top: 6px;
    width: 60px;
    height: 30px;
    cursor: pointer;
  }
  .img-show {
    transform: rotate(180deg);
  }
  .img-hide {
    // transform: rotate(180deg);
  }
  .box {
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s ease;
  }
  .fade-enter-from /* 2.1.8版本及以上使用v-leave-to代替v-leave-active */ {
    transform: translateY(-20px);
    opacity: 1;
  }
  .fade-leave-to {
    transform: translateY(20px);
    opacity: 0;
  }
  .tab-item {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 80px;
    height: 92px;
    font-size: 34px;
    font-weight: 400;
    color: @font-color-light;
    cursor: pointer;
    .text {
      height: 52px;
      line-height: 52px;
      background: rgba(106, 112, 124, 0.5);
      padding: 9px 32px;
      margin-left: 24px;
      box-sizing: content-box;
    }
    .line {
      width: 1px;
      height: 34px;
      opacity: 0.4;
      background: #eff4ff;
      margin-left: 24px;
    }
    &:hover {
      color: @font-color-light;
    }
  }
  .active {
    font-weight: 500;
    color: #a2fbff;
    border-radius: 4px;
    border: 2px solid #15b7ffee;
    background: rgba(59, 196, 255, 0.2);
    .text {
      height: 52px;
      padding: 9px 0px;
      box-sizing: content-box;
      background: rgba(106, 112, 124, 0.2);
    }

    &.unclickable {
      cursor: not-allowed;
      pointer-events: none;
    }

    .tab-anchor {
      width: 50px;
      height: 61px;
      background: url("@/assets/img/common/tab-anchor.png") no-repeat 100% 100%;
    }
  }
}
</style>
