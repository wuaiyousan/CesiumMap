/*
 * @Author: wangzhipeng
 * @Date: 2023-06-14 16:35:22
 * @LastEditors: wangzhipeng
 * @LastEditTime: 2023-06-21 17:19:06
 * @Description:
 */
/**
 * http配置
 * axios参数说明
 * isToken是否需要token
 */
import axios from "axios";
import { getToken } from "@/utils/auth";
// import { ElMessage } from 'element-plus'; 按需导入了，再导入会有问题
import { website } from "@/common/ProjConfig";
import { Base64 } from "js-base64";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
const video_img = "http://106.60.9.184:9007"; //永仁生产环境图片

const http = axios.create({
  baseURL: "",
  timeout: 30000,
  headers: {},
  withCredentials: true,
  validateStatus: (status) => {
    return status >= 200 && status <= 500;
  },
});

//跨域请求，允许保存cookie
http.defaults.withCredentials = true;

// NProgress 配置
NProgress.configure({
  showSpinner: false,
});

//http request拦截
http.interceptors.request.use(
  (config) => {
    //开启 progress bar
    NProgress.start();
    config.headers["Authorization"] = `Basic ${Base64.encode(
      `${website.clientId}:${website.clientSecret}`
    )}`;
    //让每个请求携带token
    // if (getToken()) {
    // 	config.headers[website.tokenHeader] = 'bearer ' + getToken();
    // }
    // 暂时从localStorage拿去token
    config.headers[website.tokenHeader] =
      "bearer " + JSON.parse(localStorage.getItem("saber-token")).content;
    //headers中配置text请求
    if (config.text) {
      config.headers["Content-Type"] = "text/plain";
    }
    if (config.isFormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    }
    // 跨域获取视频流时取消携带cookie
    if (config.url && config.url.includes(video_img)) {
      config.withCredentials = false;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//http response 拦截
http.interceptors.response.use(
  (res) => {
    //关闭 progress bar
    NProgress.done();
    //获取状态码
    const status = res.data.code || res.status;
    // 获取白名单
    const statusWhiteList = website.statusWhiteList || [];
    // 获取报错信息
    const message = res.data.msg || res.data.message || "未知错误";
    //如果在白名单里则自行catch逻辑处理
    if (statusWhiteList.includes(status)) return Promise.reject(res.data);
    // 如果请求为非200否者默认统一处理
    if (status != 200) {
      ElMessage({
        message: message,
        grouping: true,
        type: "error",
      });
      return Promise.reject(new Error(message));
    }
    return res.data;
  },
  (error) => {
    NProgress.done();
    return Promise.reject(new Error(error));
  }
);

export default http;
