<!--
 * @Author: fishScola
 * @Date: 2022-06-23 15:45:47
 * @LastEditors: fishScola
 * @LastEditTime: 2023-07-26 14:24:02
 * @Description: 天气和时间
-->
<script setup>
import dayjs from "dayjs";
import { getCurrentWeather, getWeather } from "@/api/business/common.js";
import UseWeather from "./UseWeather";
import UseGlobalMessage from "./UseGlobalMessage";
import thermometerBg from "@/assets/img/overview/thermometer.png";
const { getWeatherImg } = UseWeather();

let info = reactive({
  timer: null,
  interval: 1000,
  toTime: "",
  toDate: "",
  // 天气
  toTemperature: "",
  //   toWind: "",
  //   toHumidity: "",
  toWeather: "",
  toWeatherImg: "",
});

function updateTime() {
  let arr = dayjs().format("YYYY-MM-DD HH:mm:ss").split(" ");
  info.toTime = arr[1];
  info.toDate = arr[0];
}

const getWeatherData = () => {
  // 天气
  getWeather().then((res) => {
    let { weather } = res.data.data.real;
    info.toTemperature = weather.temperature;
    // info.toHumidity = weather.humidity;
    // info.toWind = wind.direct;
    info.toWeather = weather.info;
    // 天气图片
    info.toWeatherImg = getWeatherImg(info.toWeather);
  });
};

let timeCount = 0;
onMounted(() => {
  // 时间
  updateTime();
  // 天气
  getWeatherData();
  info.timer = window.setInterval(() => {
    timeCount++;
    updateTime();
    // 10分钟更新一次天气
    if (timeCount % 600 === 0) {
      getWeatherData();
      timeCount = 0;
    }
  }, info.interval);
});

onBeforeUnmount(() => {
  if (info.timer) {
    window.clearInterval(info.timer);
    info.timer = null;
  }
  if (info.timer) {
    clearInterval(info.timer);
  }
});
// });
</script>

<template>
  <div class="component-wrapper time-info">
    <div class="info-time">
      <div class="time">{{ info.toTime }}</div>
    </div>
    <div class="seperator"></div>
    <div class="date">{{ info.toDate }}</div>
    <div class="seperator"></div>
    <div class="info-temperature">
      <img
        class="weather"
        :src="info.toWeatherImg"
        alt=""
        v-if="info.toWeather"
      />
      <img class="image" :src="thermometerBg" alt="温度计" />
      <span class="item">{{ info.toTemperature }}℃</span>
    </div>
  </div>
</template>

<style lang="less" scoped>
.component-wrapper.time-info {
  display: flex;
  height: 44px;
  font-size: 13px;
  font-weight: 400;
  color: #ffffff;
  position: absolute;
  align-items: center;
  left: 36px;
  top: 20px;
  .info-time {
    text-align: right;
    .time {
      font-weight: 500;
      font-size: 34px;
      line-height: 28px;
    }
  }
  .date {
    font-weight: 400;
    font-size: 34px;
    line-height: 28px;
  }
  .weather {
    width: 40px;
    margin-right: 10px;
    // height: 40px;
  }
  .info-temperature {
    display: flex;
    height: 40px;
    align-items: center;
    .image {
      width: 20px;
    }
    .item {
      font-weight: 500;
      font-size: 28px;
      margin-left: 10px;
    }
  }

  .info-humidity {
    .text {
      line-height: 20px;
    }
  }
  .weather {
    width: 40px;
    height: 40px;
  }
  .seperator {
    margin: 0 24px;
    width: 5px;
    height: 33px;
    background: url("@/assets/img/common/Frame.png") no-repeat;
  }
}
</style>
