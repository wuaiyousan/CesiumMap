/*
 * @Author: fishScola
 * @Date: 2020-12-22 09:28:56
 * @LastEditors: wangzhipeng
 * @LastEditTime: 2023-08-28 10:44:04
 * @Description: 项目工程配置
 */

// 项目名称
export let projName = "visualization";
// 网关地址
export let api = "/api";
// 系统标题
export let projTitle = "东阿县城乡供水一体化智慧大屏";

// 运行环境参数
let runningConfObj = {
  // 1.开发环境
  development: {
    // 开发环境下代理标识（生产环境一般置空）
    proxyTag: "",
    // baseUrl必须以proxyTag为后缀（开发环境下,baseUrl可以与proxyTag非空一致）
    baseUrl: "",
  },
  // 2.生产环境
  production: {
    proxyTag: "",
    baseUrl: "",
  },
};
// 设置环境参数（不修改） - 从process.env取得
export let runningConf = runningConfObj[process.env.NODE_ENV || "production"];

// 全局配置
export let website = {
  clientId: "saber", // 客户端id
  clientSecret: "saber_secret", // 客户端密钥
  tenantMode: false, // 是否开启租户模式
  tenantId: "000000", // 管理组租户编号
  captchaMode: true, // 是否开启验证码模式
  tokenHeader: "Blade-Auth",
};

// 登录后导向的主界面 | router.push(mainRoute)
export let mainRoute = { name: "overview" };
