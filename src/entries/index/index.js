/*
 * @Author: fishScola
 * @Date: 2022-04-25 11:09:09
 * @LastEditors: xionghaiying
 * @LastEditTime: 2024-04-03 10:54:06
 * @Description: index
 */
import { createApp } from "vue";
import App from "./App.vue";
import router from "@/router/index";
import store from "@/store/index";
import "virtual:svg-icons-register";
import eventHub from "@/utils/eventHub";
import eventBus from "@/utils/eventBus.js";
import "./style.less";
import ElementPlus from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
// 引入全局样式
import "@/assets/style/index.less";

function getTheApp() {
  // 创建应用
  const app = createApp(App);
  app.use(ElementPlus, {
    locale: zhCn,
  });
  // 配置全局事件总线
  app.config.globalProperties.eventHub = eventHub;
  app.config.globalProperties.$eventBus = eventBus;
  app.use(router).use(store).mount("#app");
  return app;
}

if (typeof XE !== "undefined") {
  // XE.ready()会加载Cesium.js等其他资源，注意ready()返回一个Promise对象。
  XE.ready().then(() => {
    window.vueInstance = getTheApp();
  });
} else {
  // 原先逻辑

  // // 引入ui依赖

  // import ElementPlus from 'element-plus'
  // import 'element-plus/lib/theme-chalk/index.css'
  // app.use(ElementPlus)

  // // 引入webgl3d组件包
  // import '@supermap/iclient3d-vue-for-webgl/lib/theme/index.css'
  // import webgl3d from '@supermap/iclient3d-vue-for-webgl'
  // app.use(webgl3d)

  window.vueInstance = getTheApp();
}
