<!--
 * @Author: fishScola
 * @Date: 2022-05-23 14:24:15
 * @LastEditors: fishScola
 * @LastEditTime: 2023-02-23 15:19:23
 * @Description: Login
-->
<script setup>
import { getToken, removeToken } from "@/utils/auth";
import UserLogin from "./UserLogin.vue";
import { mainRoute } from "@/common/ProjConfig.js";

const flag = ref(false);
const router = useRouter();
const isProduction = process.env.NODE_ENV === "production";

function checkLogin() {
  if (!isProduction && getToken()) {
    removeToken();
  }
  if (getToken()) {
    router.push(mainRoute);
  } else {
    flag.value = true;
  }
}
checkLogin();
</script>

<template>
  <div class="component-wrapper login">
    <div class="login-wrapper" v-show="flag">
      <div class="title">欢迎登录</div>
      <UserLogin></UserLogin>
    </div>
  </div>
</template>

<style lang="less" scoped>
.component-wrapper.login {
  position: relative;
  width: 100%;
  height: 100%;
  background: url("@/assets/img/background.jpg") no-repeat;
  background-size: 100% 100%;

  .login-wrapper {
    padding-top: 14%;
    margin: 0 auto;
    width: 540px;
    text-align: center;

    .title {
      color: #cbfdff;
      margin-bottom: 24px;
      font-weight: 500;
      font-size: 22px;
      text-align: center;
      letter-spacing: 4px;
    }
  }
}
</style>
