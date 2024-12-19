<!--
 * @Author: fishScola
 * @Date: 2022-06-23 18:59:44
 * @LastEditors: wangzhipeng
 * @LastEditTime: 2023-07-21 16:27:52
 * @Description: NumberCount
-->
<script setup>
const props = defineProps({
  // 显示的数字
  number: {
    type: Number,
  },
  // 显示的长度
  length: {
    type: Number,
  },
});

let info = reactive({
  // 默认总数
  orderNum: ["0", "0", "0", "0", "0", "0", "0", "0"],
});

onMounted(() => {
  // 监听数字变化
  watchEffect(() => {
    toOrderNum(props.number);
  });
});

// 处理总数字
function toOrderNum(num) {
  const numStr = num.toString();
  if (props.length) {
    // 添加前导0补位至固定位数
    info.orderNum = numStr.padStart(props.length, "0").split("");
  } else {
    info.orderNum = numStr.split("");
  }
  nextTick(setNumberTransform);
}

const numberItem = ref(null);
// 设置文字滚动
function setNumberTransform() {
  // 拿到数字的ref，计算元素数量
  const numberItems = numberItem.value;
  const numberArr = info.orderNum.filter((item) => !isNaN(item));
  // 结合CSS对数字字符进行滚动，显示数量
  for (let index = 0; index < numberItems.length; index++) {
    const elem = numberItems[index];
    elem.style.transform = `translate(-50%, -${numberArr[index] * 10}%)`;
  }
}
</script>

<template>
  <ul class="component-wrapper number-count">
    <li
      :class="[!isNaN(item) ? 'number-item' : 'number-symbol']"
      v-for="(item, index) in info.orderNum"
      :key="index"
    >
      <span v-if="!isNaN(item)">
        <i ref="numberItem">0123456789</i>
      </span>
      <span v-else class="comma">{{ item }}</span>
    </li>
  </ul>
</template>

<style lang="less" scoped>
.component-wrapper.number-count {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 32px;
  font-size: 28px;
  list-style: none;
  writing-mode: vertical-lr;
  text-orientation: upright;

  .number-item {
    width: 20px;
    margin-right: 1px;

    & > span {
      position: relative;
      width: 100%;
      overflow: hidden;
      display: flex;
      color: #fff;
      background: rgba(50, 80, 255, 0.49);
      border-radius: 2px;

      & > i {
        font-style: normal;
        position: absolute;
        top: 1px;
        left: 50%;
        transform: translate(-50%, 0);
        transition: transform 1s ease-in-out;
        letter-spacing: 6px;
      }
    }

    &:last-child {
      margin-right: 0;
    }
  }

  .number-symbol {
    width: 16px;
    line-height: 22px;

    .comma {
      display: flex;
      align-items: center;
      color: @font-color-light;
      justify-content: flex-end;
      font-size: 30px;
    }
  }
}
</style>
