<!--
 * @Author: fishScola
 * @Date: 2022-10-16 01:19:16
 * @LastEditors: xionghaiying
 * @LastEditTime: 2024-07-09 16:01:52
 * @Description: 页面头部统计
-->
<template>
  <div class="component-wrapper TopItem">
    <div
      class="itembox"
      :class="{ active: activeItem == 1 }"
      @click.stop="handleClick(1)"
    >
      <div class="img img1"></div>
      <div class="data">
        <p class="text">{{ info.baseTitle[0].value }}万m³</p>
        <p class="label">供水量</p>
      </div>
    </div>
    <div
      class="itembox"
      :class="{ active: activeItem == 2 }"
      @click.stop="handleClick(2)"
    >
      <div class="img img2"></div>
      <div class="data">
        <p class="text">{{ info.baseTitle[1].value }}万m³</p>
        <p class="label">售水量</p>
      </div>
    </div>
    <div
      class="itembox"
      :class="{ active: activeItem == 3 }"
      @click.stop="handleClick(3)"
    >
      <div class="img img3"></div>
      <div class="data">
        <p class="text">{{ info.baseTitle[2].value }}%</p>
        <p class="label">产销差率</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getPartitionInfo } from "@/api/business/supply/general.js";
import UseGlobalMessage from "../../common/UseGlobalMessage";

const { doEventSend } = UseGlobalMessage();

const eventBus = window.vueInstance.config.globalProperties.$eventBus;
let info = reactive({
  baseTitle: [
    { name: "供水量", value: "", unit: "万吨" },
    { name: "售水量", value: "", unit: "万吨" },
    { name: "产销差率", value: "", unit: "万吨" },
  ],
});

// 
let listInfo = reactive({
  // 供水量
  waterSupplyVolume: [],
  // 售水量
  waterSaleVolume:[],
  // 产销差率
  waterSupplySaleDifference:[],
});
const activeItem = ref("");
onMounted(() => {
  // 监听事件
  eventBus.on("topItem", (data) => {
    info.baseTitle[0].value = data.waterSupplyVolume;
    info.baseTitle[1].value = data.waterSaleVolume;
    info.baseTitle[2].value = data.waterSupplySaleDifference;
  });
  // 获取数据
  getInfo();
});

function getInfo(){
  getPartitionInfo({type:1}).then((res) => {
    res.forEach((item) => {
      let { code, name, x, y } = item
      // 供水量
      listInfo.waterSupplyVolume.push({
        code, name, x, y,
        value: `${item.waterSupplyVolume}万m³`, 
        level: item.level,
      })
      // 售水量
      listInfo.waterSaleVolume.push({
        code, name, x, y, 
        value: `${item.waterSaleVolume}万m³`, 
        level: item.level,
      })
      // 产销差率
      listInfo.waterSupplySaleDifference.push({
        code, name, x, y,
        value: `${item.waterSupplySaleDifference}%`, 
        level: item.level,
      })
    });
  });
} 

function handleClick(val) {
  let show = true;
  if (activeItem.value == val) {
    activeItem.value = "";
    show = false;
  } else {
    activeItem.value = val; 
    show = true;
  }
  
  let list = []
  if(val === 1){
    list = listInfo.waterSupplyVolume
  }else if(val === 2){
    list = listInfo.waterSaleVolume
  }else if(val === 3){
    list = listInfo.waterSupplySaleDifference
  }
  
  doEventSend('entity-billboard-change',{ 
    list, 
    show,
    callback: function({success, msg}){
    }  
  })


}
</script>

<style lang="less" scoped>
.component-wrapper.TopItem {
  display: flex;
  justify-content: space-around;
  position: absolute;
  top: 130px;
  left: 50%;
  transform: translate(-50%, 0);
  margin: 0 auto;
  width: 1000px;
  z-index: 10;
  user-select: none;

  .itembox {
    // height: 95px;
    height: 114px;
    padding: 10px 30px;
    cursor: pointer;
    text-align: center;
    user-select: none;
    display: flex;
    align-items: center;
    justify-content: center;
    .img {
      width: 95px;
      height: 95px;
      margin-right: 15px;
    }
    .img1 {
      background: url("@/assets/img/supply/supply-Icon.png") no-repeat center
        center;
    }
    .img2 {
      background: url("@/assets/img/supply/sell-Icon.png") no-repeat center
        center;
    }
    .img3 {
      background: url("@/assets/img/supply/trend-Icon.png") no-repeat center
        center;
    }
    .data {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
    .time {
      font-size: 17px;
    }
    .label {
      color: @active-color;
      font-size: @titleSize1;
      font-weight: 500;
    }
    .text {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 36px;
      font-weight: 500;
      color: @active-color;
    }
    .unit {
      width: 20px;
      line-height: 50px;
      font-size: 16px;
      color: @active-color;
      margin-top: 8px;
      margin-left: 6px;
      margin-right: 14px;
    }
    &.active {
      background: rgba(21, 183, 255, 0.3);
      border-radius: 57px;
    }
  }
}
</style>
