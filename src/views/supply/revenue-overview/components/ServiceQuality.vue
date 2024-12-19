<!--
 * @Author: fishScola
 * @Date: 2022-10-18 14:31:52
 * @LastEditors: fishScola
 * @LastEditTime: 2023-01-16 16:51:47
 * @Description: 服务质量
-->
<script setup>
import BasePanel from "../../components/BasePanel.vue";
import { getServiceQuality } from "@/api/business/supply/pevenueoverview.js";
import manyiIcon from "../img/icon-manyi.png";
import lvyueIcon from "../img/icon-lvyue.png";
import jishiIcon from "../img/icon-jishi.png";

let info = reactive({
  data: [],
});
onMounted(() => {
  getServiceQuality().then((res) => {
    info.data = res;
  });
});
</script>

<template>
  <BasePanel class="component-wrapper service-quality">
    <template v-slot:headerLeft>服务质量</template>
    <div class="quaility">
      <div class="icon">
        <img :src="manyiIcon" alt="" />
        <img :src="lvyueIcon" alt="" />
        <img :src="jishiIcon" alt="" />
      </div>
      <div class="icon">
        <div v-for="(item, index) in info.data" :key="index">
          <span>{{ item.num }}</span>
          <p>{{ item.name }}</p>
        </div>
      </div>
    </div>
  </BasePanel>
</template>

<style lang="less" scoped>
.component-wrapper.service-quality {
  height: 240px;
  position: absolute;
  top: 820px;
  right: 10px;

  .quaility {
    width: 100%;

    .icon {
      display: flex;
      width: 100%;
      justify-content: space-around;
      font-size: 16px;
      font-weight: bold;
      text-align: center;
      span {
        color: #FFC102;
      }
      div {
        width: 180px;
      }
    }
    img {
      width: 80px;
    }
  }
}
</style>
