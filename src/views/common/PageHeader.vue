<!--
 * @Author: fishScola
 * @Date: 2022-06-23 11:34:20
 * @LastEditors: wangzhipeng
 * @LastEditTime: 2023-07-24 10:02:39
 * @Description: 页面头部
-->
<script setup>
import DateTime from "./DateTime.vue";

const { toTitle, thematics, params } = defineProps({
  toTitle: {
    type: String,
    default: function () {
      return "";
    },
  },
  thematics: {
    type: Array,
    default: function () {
      return [];
    },
  },
  // 默认的专题
  params: {
    type: Object,
    default: function () {
      return {
        active: "",
      };
    },
  },
});

let info = reactive({
  type: "",
});
const onHome = () => {
  const pro = window.location.protocol;
  const url = window.location.hostname;
  window.open(`${pro}//${url}:9092/#/wel/index`);
};
const onExit = () => {
  const pro = window.location.protocol;
  const url = window.location.hostname;
  window.location.href = `${pro}//${url}:9092/#/login`;
};
onMounted(() => {
  // watchEffect(() => {
  // 	if (params.active) {
  // 		info.type = params.active;
  // 	}
  // });
});

const emit = defineEmits();
// 切换主题
function onThematic(it) {
  if (it.type === info.type) {
    return;
  }
  info.type = it.type;
  emit("thematic-changed", it);
  window.open(it.route);
}
</script>

<template>
  <div class="component-wrapper page-header">
    <!-- 时间与天气 -->
    <date-time></date-time>
    <div class="title">{{ toTitle }}</div>
    <!-- <div class="thematic-list">
      <span
        :class="['thematic-item', info.type === item.type ? 'selected' : '']"
        v-for="(item, index) in thematics"
        :key="index"
        @click.stop="onThematic(item)"
      >
        {{ item.name }}
      </span>
    </div> -->
    <div class="head-home">
      <div class="home" @click.stop="onHome()">
        主页
        <span class="home-icon"></span>
      </div>
      <div class="home" @click.stop="onExit()">
        退出
        <span class="exit-icon"></span>
      </div>
    </div>
  </div>
</template>

<style lang="less">
.component-wrapper.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: url("@/assets/img/common/header-bg.png") no-repeat;
  background-size: 100% 100%;
  background-position: 100%;
  user-select: none;
  .title {
    margin: 0 auto;
    height: 60px;
    font-size: 52px;
    font-weight: 500;
    color: #ffffff;
    line-height: 50px;
    letter-spacing: 2px;
    font-weight: bold;
  }

  .thematic-list {
    display: flex;
    text-align: center;
    color: #b7cdd3;
    position: absolute;
    left: 690px;

    .thematic-item {
      width: 160px;
      line-height: 44px;
      font-size: 20px;
      letter-spacing: 4px;
      background: rgba(0, 246, 255, 0.16);
      border: 3px solid #00e8ff;
      cursor: pointer;

      &:hover {
        color: #a9fbff;
      }
    }

    .selected {
      font-size: 22px;
      color: #a9fbff;
      // background: linear-gradient(
      //   180deg,
      //   rgba(169, 251, 255, 0.5) 0%,
      //   rgba(169, 251, 255, 0.1) 10%,
      //   rgba(169, 251, 255, 0) 50%,
      //   rgba(169, 251, 255, 0.1) 89%,
      //   rgba(169, 251, 255, 0.5) 100%
      // );
    }
  }
  .head-home {
    display: flex;
    align-items: center;
    position: absolute;
    right: 20px;
    top: 20px;
    .home {
      display: flex;
      align-items: center;
      color: #b3e8ff;
      font-size: @titleSize1;
      margin: 0 17px;
      cursor: pointer;
      span {
        display: inline-block;
        width: 33px;
        height: 33px;
        margin-left: 8px;
      }
      .home-icon {
        background: url("@/assets/img/common/home.png");
      }
      .exit-icon {
        background: url("@/assets/img/common/off.png");
      }
    }
  }
}
</style>
