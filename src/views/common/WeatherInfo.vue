<!--
 * @Author: fishScola
 * @Date: 2022-06-23 15:45:47
 * @LastEditors: fishScola
 * @LastEditTime: 2023-07-26 14:24:02
 * @Description: 天气和时间
-->
<script setup>
import thermometerBg from "@/assets/img/overview/thermometer.png";
import dayjs from "dayjs";
import { getCurrentWeather, getWeather } from "@/api/business/common.js";
import UseWeather from "./UseWeather";
import UseGlobalMessage from "./UseGlobalMessage";

const { getWeatherImg } = UseWeather();

let info = reactive({
  timer: null,
  interval: 1000,
  toTime: "",
  toDate: "",
  // 天气
  toTemperature: "",
  toWind: "",
  toHumidity: "",
  toWeather: "",
  toWeatherImg: "",
});

function updateTime() {
  let arr = dayjs().format("YYYY-MM-DD HH:mm:ss").split(" ");
  info.toTime = arr[1];
  info.toDate = arr[0];
}

function updateWeather(res) {
  info.toTemperature = res.temperature;
  info.toWind = res.windDirect;
  info.toHumidity = res.humidity;
  info.toWeather = res.weatherInfo;
  // 天气图片
  info.toWeatherImg = getWeatherImg(info.toWeather);
}

const getWeatherData = () => {
  // 天气
  getWeather().then((res) => {
    let { weather, wind } = res.data;
    info.toTemperature = weather.temperature;
    info.toHumidity = weather.humidity;
    info.toWind = wind.direct;
    info.toWeather = weather.info;
    // 天气图片
    info.toWeatherImg = getWeatherImg(info.toWeather);
  });
};

const onHome = () => {
  const url = window.location.hostname;
  window.open(`https://${url}/#/wel/index`);
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
  if (timer) {
    clearInterval(timer);
  }
});

// const { useWebsocketEvent } = UseGlobalMessage();
// useWebsocketEvent('/fddp/futurerain/ForecastWeather', (data) => {
// 	updateWeather(data);
// });
</script>

<template>
  <div class="component-wrapper weather-info">
    <div class="info-home">
      <div class="home" @click.stop="onHome()"></div>
    </div>
    <div class="info-time">
      <div class="time">{{ info.toTime }}</div>
      <div class="date">{{ info.toDate }}</div>
    </div>
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
    <div class="seperator"></div>
    <div class="info-humidity">
      <div class="text">湿度：{{ info.toHumidity }}</div>
      <div class="text">风向：{{ info.toWind }}</div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.component-wrapper.weather-info {
  display: flex;
  height: 44px;
  font-size: 13px;
  font-weight: 400;
  color: #ffffff;
  position: absolute;
  right: 10px;
  .info-home {
    width: 50px;
    text-align: right;
    .home {
      width: 36px;
      height: 36px;
      font-weight: 500;
      line-height: 36px;
      cursor: pointer;
      background: url("@/assets/img/common/home.svg") no-repeat center
        center/100%;
    }
  }
  .info-time {
    width: 100px;
    text-align: right;

    .time {
      font-weight: 500;
      font-size: 18px;
      line-height: 28px;
    }

    .date {
      font-weight: 400;
      font-size: 12px;
      line-height: 12px;
    }
  }

  .info-temperature {
    display: flex;
    align-items: center;
    padding-top: 4px;

    .weather {
      margin-right: 6px;
      height: 100%;
    }

    .image {
      margin: 0 12px;
      width: 10px;
      height: 17px;
    }

    .item {
      font-weight: 500;
      font-size: 22px;
    }
  }

  .info-humidity {
    .text {
      line-height: 20px;
    }
  }

  .seperator {
    margin: 0 24px;
    width: 1px;
    height: 50px;
    opacity: 0.3;
    border: 1px solid;
    border-image: radial-gradient(
        circle,
        rgba(255, 255, 255, 1),
        rgba(255, 255, 255, 0)
      )
      1 1;
  }
}
</style>
