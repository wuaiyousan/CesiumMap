<!--
 * @Author: fishScola
 * @Date: 2022-10-31 15:24:28
 * @LastEditors: wangzhipeng
 * @LastEditTime: 2023-05-25 14:02:38
 * @Description: 曲线设置项
-->
<template>
  <div class="component-wrapper curve-settings">
    <span class="label">曲线设置：</span>
    <!-- <el-checkbox class="setting-item" v-model="isCenter" @change="onCenter">
      曲线居中
    </el-checkbox> -->
    <el-checkbox
      class="setting-item"
      v-model="filtering"
      @change="settingChange"
      size="large"
      label="过滤异常值"
    >
    </el-checkbox>
    <el-checkbox
      class="setting-item"
      v-model="dilution"
      @change="settingChange"
      size="large"
      label="数据抽稀"
    >
    </el-checkbox>
    <el-select
      v-model="window"
      class="period-select"
      @change="onDilutionTime"
      size="large"
    >
      <el-option label="30分钟" value="30M" />
      <el-option label="1小时" value="1H" />
      <el-option label="3小时" value="3H" />
      <el-option label="6小时" value="6H" />
      <el-option label="12小时" value="12H" />
      <el-option label="24小时" value="24H" />
    </el-select>
  </div>
</template>

<script>
const eventBus = window.vueInstance.config.globalProperties.$eventBus;
export default {
  name: "CurveSettings",
  props: {
    option: {
      type: Object,
      default: function () {
        return {
          dilution: {
            // 抽稀参数
            // action: '',
            // window: ''
          },
        };
      },
    },
  },
  data() {
    return {
      // isCenter: false,
      filtering: true,
      dilution: false,
      window: "30M",
    };
  },
  created() {
    eventBus.on("set-dilution-on", this.setDilutionOn);
  },
  methods: {
    setDilutionOn(p) {
      if (p == "DAY") {
        this.dilution = false;
        this.window = "30M";
      } else {
        this.dilution = true;
        this.window = "12H";
      }
      this.$emit("setting-change-by-time", {
        filterOutliers: this.filtering,
        dataDilute: this.dilution
          ? Object.assign(
              { action: "DEFAULT", window: this.window },
              this.option.dilution || {}
            )
          : null,
      });
    },
    // onCenter() {},
    onDilutionTime() {
      if (this.dilution) {
        this.settingChange();
      }
    },
    settingChange() {
      this.$emit("setting-change", {
        filterOutliers: this.filtering,
        dataDilute: this.dilution
          ? Object.assign(
              { action: "DEFAULT", window: this.window },
              this.option.dilution || {}
            )
          : null,
      });
    },
  },
};
</script>

<style lang="less" scoped>
.component-wrapper.curve-settings {
  display: flex;
  align-items: center;
  .label {
    margin-right: 8px;
    font-size: 18px;
    color: #ffffff;
  }
  .setting-item {
    color: #ffffff;

    :deep(.el-checkbox__input.is-checked + .el-checkbox__label) {
      color: #3276ff;
      font-size: 17px;
    }
  }

  .period-select {
    margin-left: 8px;
    width: 100px;
  }
}
</style>
