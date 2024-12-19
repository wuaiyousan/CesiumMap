<!--
 * @Author: fishScola
 * @Date: 2022-06-23 15:45:47
 * @LastEditors: fishScola
 * @LastEditTime: 2023-05-11 19:16:36
 * @Description: WaterLeakage
-->
<script setup>
import BasePanel from "../components/BasePanel.vue";
import { getall } from "@/api/business/supply/dma.js";
import dayjs from "dayjs";
import { toRefs } from "vue";

let info = ref({
  leakRate: null,
  monthLeakRate: null,
  monthSaleWaterRate: null,
  monthSupplyWaterRate: null,
  saleWater: null,
  supplyWater: null,
  yearLeakRate: null,
  yearSaleWaterRate: null,
  yearSupplyWaterRate: null,
});
const pickerOptions = (time) => {
  return time.getTime() > Date.now();
};
const selectedMonth = ref(dayjs().subtract(1, "months").format("YYYY-MM"));
onMounted(() => {
  getData();
});
function getData() {
  let params = {
    date: selectedMonth.value,
  };
  getall(params).then((result) => {
    info.value = toRefs(result);
  });
}
const timeChange = (time) => {
  selectedMonth.value = time;
  getData();
};
</script>

<template>
  <BasePanel class="component-wrapper water-leakage">
    <template v-slot:headerLeft>漏损总览</template>
    <template v-slot:headerRight>
      <div class="head-right">
        <el-date-picker
          v-model="selectedMonth"
          type="month"
          placeholder="选择月份"
          format="YYYY-MM"
          value-format="YYYY-MM"
          style="width: 180px"
          size="large"
          :editable="false"
          :clearable="false"
          :disabled-date="pickerOptions"
          @change="timeChange"
        >
        </el-date-picker>
      </div>
    </template>
    <div class="con_box">
      <div class="water-volume">
        <span class="water-supply">供水量</span>
        <span class="quantity"
          >{{ info.supplyWater }} <span class="company">万m³</span></span
        >
        <div class="yoy">
          <div class="row up">
            <span>同比：</span>
            <span
              :class="{
                red: info.yearSupplyWaterRate > 0,
                green: info.yearSupplyWaterRate < 0,
              }"
              >{{ info.yearSupplyWaterRate }}%</span
            >
            <span
              :class="{
                up: info.yearSupplyWaterRate > 0,
                down: info.yearSupplyWaterRate < 0,
              }"
            ></span>
          </div>
          <div class="row down">
            <span>环比：</span>
            <span
              :class="{
                red: info.monthSupplyWaterRate > 0,
                green: info.monthSupplyWaterRate < 0,
              }"
              >{{ info.monthSupplyWaterRate }}%</span
            >
            <span
              :class="{
                up: info.monthSupplyWaterRate > 0,
                down: info.monthSupplyWaterRate < 0,
              }"
            ></span>
          </div>
        </div>
      </div>
      <div class="water-volume">
        <span class="water-supply">售水量</span>
        <span class="quantity"
          >{{ info.saleWater }} <span class="company">万m³</span></span
        >
        <div class="yoy">
          <div class="row up">
            <span>同比：</span>
            <span
              :class="{
                red: info.yearSaleWaterRate > 0,
                green: info.yearSaleWaterRate < 0,
              }"
              >{{ info.yearSaleWaterRate }}%</span
            >
            <span
              :class="{
                up: info.yearSaleWaterRate > 0,
                down: info.yearSaleWaterRate < 0,
              }"
            ></span>
          </div>
          <div class="row down">
            <span>环比：</span>
            <span
              :class="{
                red: info.monthSaleWaterRate > 0,
                green: info.monthSaleWaterRate < 0,
              }"
              >{{ info.monthSaleWaterRate }}%</span
            >
            <span
              :class="{
                up: info.monthSaleWaterRate > 0,
                down: info.monthSaleWaterRate < 0,
              }"
            ></span>
          </div>
        </div>
      </div>
      <div class="water-volume">
        <span class="water-supply">综合漏损率</span>
        <span class="quantity"
          >{{ info.leakRate || "--" }}<span class="company rate">%</span></span
        >
        <div class="yoy">
          <div class="row up">
            <span>同比：</span>
            <span
              :class="{
                red: info.yearLeakRate > 0,
                green: info.yearLeakRate < 0,
              }"
              >{{ info.yearLeakRate }}%</span
            >
            <span
              :class="{
                up: info.yearLeakRate > 0,
                down: info.yearLeakRate < 0,
              }"
            ></span>
          </div>
          <div class="row down">
            <span>环比：</span>
            <span
              :class="{
                red: info.monthLeakRate > 0,
                green: info.monthLeakRate < 0,
              }"
              >{{ info.monthLeakRate }}%</span
            >
            <span
              :class="{
                up: info.monthLeakRate > 0,
                down: info.monthLeakRate < 0,
              }"
            ></span>
          </div>
        </div>
      </div>
    </div>
  </BasePanel>
</template>

<style lang="less" scoped>
.component-wrapper.water-leakage {
  height: 348px;
  background: @panelBgColor;
  .con_box {
    display: flex;
    justify-content: space-between;
  }
  .water-volume {
    margin: 0px 0;
    display: flex;
    align-items: center;
    flex-direction: column;
    height: 244px;
    width: 201px;
    background: url("@/assets/img/supply/wrapBg.png") no-repeat;
    background-size: 100% 100%;
    background-position: 100%;
    .water-supply {
      font-size: @titleSize7;
      color: rgb(230, 247, 255);
      height: 58px;
      line-height: 58px;
      text-align: center;
    }
    .quantity {
      color: @active-color;
      font-size: @titleSize5;
      line-height: 100px;
      font-family: PingFangSC-Regular;
      text-shadow: rgb(19 128 255) 0px 0px 10px;
      .company {
        padding-left: 2px;
        font-size: 18px;
        color: @active-color;
      }
    }
    .yoy {
      .row {
        display: flex;
        align-items: center;
        font-size: 20px;
        .red {
          color: @red-color;
        }
        .up {
          display: inline-block;
          width: 34px;
          height: 17px;
          margin-left: 8px;
          background: url("@/assets/img/supply/up.png") no-repeat;
        }
        .green {
          color: @green-color;
        }
        .down {
          display: inline-block;
          width: 34px;
          height: 17px;
          margin-left: 8px;
          background: url("@/assets/img/supply/down.png") no-repeat;
        }
      }
    }
  }
}
</style>
