<!--
 * @Author: fishScola
 * @Date: 2022-05-27 11:09:09
 * @LastEditors: fishScola
 * @LastEditTime: 2023-02-23 15:07:47
 * @Description: UserLogin
-->
<script setup>
import { getCaptcha } from "@/api/system/auth";
import { website } from "@/common/ProjConfig";
import { Message, User, Lock, View } from "@element-plus/icons-vue";
import { ElLoading } from "element-plus";
import { useAuthStore } from "@/store/useAuthStore";

let loginForm = reactive({
  //用户名
  username: "admin",
  //密码
  password: "admin",
  //账号类型
  type: "account",
  //验证码的值
  code: "",
  //验证码的索引
  key: "",
  //预加载白色背景
  image: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
});

const loginRules = {
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 1, message: "密码长度最少为6位", trigger: "blur" },
  ],
};
// 关于验证码 - 校验
if (website.captchaMode) {
  loginRules.code = [{ required: true, message: "请输验证码", trigger: "blur" }];
}

onMounted(() => {
  refreshCode();
});

// 刷新验证码
function refreshCode() {
  getCaptcha().then((res) => {
    let { key, image } = res || {};
    loginForm.key = key;
    loginForm.image = image;
  });
}

const loginFormRef = ref(null);
const authStore = useAuthStore();
const router = useRouter();

// 登录
function handleLogin() {
  loginFormRef.value.validate((valid) => {
    if (valid) {
      const loading = ElLoading.service({
        customClass: "custom-loading-login",
        lock: true,
        fullscreen: true,
        target: "#app",
        text: "登录中,请稍后。。。",
        background: "rgba(30,31,28, 0.9)",
      });

      authStore
        .doLoginByUser(loginForm)
        .then((res) => {
          router.push({ name: "supply" });
        })
        .catch((err) => {
          refreshCode();
        })
        .finally(() => {
          nextTick(loading.close);
        });
    }
  });
}

// 查看密码
let passwordType = ref("password");
function showPassword() {
  if (passwordType.value === "password") {
    passwordType.value = "";
  } else {
    passwordType.value = "password";
  }
}
</script>

<template>
  <el-form
    class="login-form"
    :rules="loginRules"
    ref="loginFormRef"
    :model="loginForm"
    label-width="0"
  >
    <el-form-item prop="username">
      <el-input
        size="large"
        @keyup.enter="handleLogin"
        v-model="loginForm.username"
        auto-complete="off"
        placeholder="请输入账号"
      >
        <template v-slot:prefix>
          <el-icon class="form-item-prefix"><User /></el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input
        size="large"
        @keyup.enter="handleLogin"
        :type="passwordType"
        v-model="loginForm.password"
        auto-complete="off"
        placeholder="请输入密码"
      >
        <template v-slot:suffix>
          <el-icon class="view-pass" title="查看密码" @click="showPassword">
            <View />
          </el-icon>
        </template>
        <template v-slot:prefix>
          <el-icon class="form-item-prefix"><Lock /></el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item class="item-captcha" v-if="website.captchaMode" prop="code">
      <el-input
        class="captcha-input"
        size="large"
        @keyup.enter="handleLogin"
        v-model="loginForm.code"
        auto-complete="off"
        placeholder="请输入验证码"
      >
        <template v-slot:prefix>
          <el-icon class="form-item-prefix"><Message /></el-icon>
        </template>
      </el-input>
      <img :src="loginForm.image" class="captcha-img" @click="refreshCode" alt="captcha" />
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        size="large"
        @click.prevent="handleLogin"
        class="login-submit"
      >
        登&emsp;录
      </el-button>
    </el-form-item>
  </el-form>
</template>

<style lang="less">
.login-form {
  margin: 0 auto;
  padding: 0 16px;
  width: 400px;

  .el-form-item {
    margin-bottom: 24px;

    .el-input__inner {
      border: none;
    }

    .view-pass {
      cursor: pointer;
    }
  }

  .login-submit {
    width: 100%;
    background: linear-gradient(115deg, rgb(15, 204, 255) 0%, rgb(0, 109, 255) 100%);
    color: rgb(255, 255, 255);
  }

  .item-captcha {
    height: 40px;

    .el-form-item__content {
      display: flex;
      justify-content: space-between;
    }

    .captcha-input {
      width: calc(~"100% - 128px");
    }

    .captcha-img {
      width: 108px;
      height: 40px;
      background-color: #fdfdfd;
      border: 1px solid #f0f0f0;
      border-radius: 2px;
      cursor: pointer;
    }
  }

  .form-item-prefix {
    width: 24px;
    font-size: 18px;
    line-height: 44px;
  }
}

.el-loading-mask.custom-loading-login {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2000;

  .el-loading-spinner {
    top: 50%;
    margin-top: -21px;
    width: 100%;
    text-align: center;
    position: absolute;

    .circular {
      display: inline;
      height: 42px;
      animation: loading-rotate 2s linear infinite;

      .path {
        animation: loading-dash 1.5s ease-in-out infinite;
        stroke-dasharray: 90, 150;
        stroke-dashoffset: 0;
        stroke-width: 2;
        stroke: #409eff;
        stroke-linecap: round;
      }
    }

    .el-loading-text {
      color: #409eff;
    }
  }
}
</style>
