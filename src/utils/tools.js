/*
 * @Author: wangzhipeng
 * @Date: 2023-04-27 18:09:09
 * @LastEditors: xionghaiying
 * @LastEditTime: 2024-07-02 11:41:57
 * @Description:
 */
import { globalStore } from "@/store/globalStore";
// 大屏自适应方案1 使用scale比例缩放 1920*1080   3328×1560
const scaleScreen = (width = 2747, height = 1545) => {
  const designDraftWidth = width; //设计稿的宽度
  const designDraftHeight = height; //设计稿的高度
  const clientWidth =
    document.documentElement.clientWidth || window.clientWidth;
  const clientHeight =
    document.documentElement.clientHeight || window.clientHeight;
  //根据屏幕的变化适配的比例
  const scale =
    clientWidth / clientHeight < designDraftWidth / designDraftHeight
      ? clientWidth / designDraftWidth
      : clientHeight / designDraftHeight;
  const global = globalStore();
  global.setScale(scale);
  //缩放比例
  document.querySelector(
    "#layout"
  ).style.transform = `scale(${scale}) translate(-50%)`;
};
export const handleScreenAuto1 = () => {
  //初始化自适应  ----在刚显示的时候就开始适配一次
  scaleScreen();
  //绑定自适应函数   ---防止浏览器栏变化后不再适配
  window.addEventListener("resize", () => scaleScreen());
  // 触发一次resize
  window.dispatchEvent(new Event("resize"));
};
export const removeScreenAuto = () => {
  window.removeEventListener("resize", () => scaleScreen());
};

// 方案2 使用大屏自适应工具autofit
// import autofit from 'autofit.js';
// export const handleScreenAuto2 = () => {
// 	autofit.init(
// 		{
// 			designHeight: 1080,
// 			designWidth: 3840,
// 			renderDom: '#layout',
// 			resize: true,
// 		},
// 		false
// 	);
// };

/**
 * 浏览器判断是否全屏
 */
export const fullscreenEnable = () => {
  var isFullscreen =
    document.isFullScreen ||
    document.mozIsFullScreen ||
    document.webkitIsFullScreen;
  return isFullscreen;
};

/**
 * 浏览器全屏
 */
export const reqFullScreen = () => {
  if (document.documentElement.requestFullScreen) {
    document.documentElement.requestFullScreen();
  } else if (document.documentElement.webkitRequestFullScreen) {
    document.documentElement.webkitRequestFullScreen();
  } else if (document.documentElement.mozRequestFullScreen) {
    document.documentElement.mozRequestFullScreen();
  }
};
/**
 * 浏览器退出全屏
 */
export const exitFullScreen = () => {
  if (document.documentElement.requestFullScreen) {
    document.exitFullScreen();
  } else if (document.documentElement.webkitRequestFullScreen) {
    document.webkitCancelFullScreen();
  } else if (document.documentElement.mozRequestFullScreen) {
    document.mozCancelFullScreen();
  }
};

/**
 * 浏览器判断是否全屏
 */
export const fullscreenToggel = () => {
  if (fullscreenEnable()) {
    exitFullScreen();
  } else {
    reqFullScreen();
  }
};
