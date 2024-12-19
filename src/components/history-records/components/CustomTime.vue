<!--
 * @Author: fishScola
 * @Date: 2022-10-31 15:54:48
 * @LastEditors: fishScola
 * @LastEditTime: 2022-11-28 00:46:40
 * @Description: 时间选择
-->
<template>
  <div class="component-wrapper custom-time">
    <span class="label">时间选择：</span>
    <el-button-group class="time-selections">
      <el-button
        class="selection"
        round
        size="large"
        :type="majorType === 'customize' ? 'primary' : ''"
        @click.stop="onMajorType('customize')"
      >
        自定义
      </el-button>
      <el-button
        class="selection"
        round
        size="large"
        :type="majorType === 'period' ? 'primary' : ''"
        @click.stop="onMajorType('period')"
      >
        同期对比
      </el-button>
    </el-button-group>
    <!-- 自定义 -->
    <div class="customize-box" v-if="majorType === 'customize'">
      <span
        class="time-item"
        :class="{ active: customType === 'hour01' }"
        @click.stop="onCustomize('hour01')"
      >
        近1小时
      </span>
      <span
        class="time-item"
        :class="{ active: customType === 'hour04' }"
        @click.stop="onCustomize('hour04')"
      >
        近4小时
      </span>
      <span
        class="time-item"
        :class="{ active: customType === 'hour12' }"
        @click.stop="onCustomize('hour12')"
      >
        近12小时
      </span>
      <span
        class="time-item"
        :class="{ active: customType === 'hour24' }"
        @click.stop="onCustomize('hour24')"
      >
        近24小时
      </span>
      <span
        class="time-item"
        :class="{ active: customType === 'yesterday' }"
        @click.stop="onCustomize('yesterday')"
      >
        昨天
      </span>
      <span
        class="time-item"
        :class="{ active: customType === 'nearOneMonth' }"
        @click.stop="onCustomize('nearOneMonth')"
      >
        近一月
      </span>
      <span
        class="time-item"
        :class="{ active: customType === 'thisyear' }"
        @click.stop="onCustomize('thisyear')"
      >
        今年
      </span>
      <el-date-picker
        class="time-custom"
        popper-class="time-custom-popper"
        v-model="customDate"
        size="large"
        :editable="false"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD"
        @change="onDateChange"
      ></el-date-picker>
    </div>
    <!-- 同期对比 -->
    <div class="period-box" v-if="majorType === 'period'">
      <el-select
        v-model="periodType"
        class="period-select"
        size="large"
        @change="onPeriodTypeChange"
      >
        <el-option label="日" value="DAY" />
        <el-option label="月" value="MONTH" />
        <el-option label="年" value="YEAR" />
      </el-select>

      <div class="period-date-list">
        <div
          class="date-item-box"
          v-for="(it, index) in periodDates"
          :key="index"
        >
          <span class="item-label" v-show="index">与</span>
          <el-date-picker
            class="item-date"
            v-model="periodDates[index]"
            size="large"
            :editable="false"
            :type="periodObj.type"
            :format="periodObj.format"
            :value-format="periodObj.format"
            @change="onPeriodDate"
          ></el-date-picker>
        </div>
      </div>

      <div class="period-btn-list">
        <el-button
          class="btn"
          size="large"
          icon="el-icon-plus"
          circle
          v-show="periodConf.limit > periodDates.length"
          @click="onPeriodAdd"
          type="primary"
        ></el-button>
        <el-button
          class="btn"
          size="large"
          icon="el-icon-minus"
          circle
          v-show="periodDates.length > 2"
          @click="onPeriodRemove"
        ></el-button>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
const eventBus = window.vueInstance.config.globalProperties.$eventBus;
export default {
  name: "CustomTime",
  props: {
    params: {
      type: Object,
      default: function () {
        return {
          majorType: "customize",
          customType: "hour24",
          customDate: [],
          periodType: "",
          periodDates: [],
        };
      },
    },
    periodConf: {
      type: Object,
      default: function () {
        return {
          limit: 3,
        };
      },
    },
  },
  data() {
    return {
      // 时间类型 - 自定义|同期对比
      majorType: "",
      // 自定义
      customType: "",
      customDate: [],
      // 同期对比
      periodType: "DAY",
      pickerMap: {
        DAY: {
          type: "date",
          format: "YYYY-MM-DD",
          out: "YYYY-MM-DD",
        },
        MONTH: {
          type: "month",
          format: "YYYY-MM",
          out: "YYYY-MM",
        },
        YEAR: {
          type: "year",
          format: "YYYY",
          out: "YYYY",
        },
      },
      // 同期对比-日期
      periodDates: [null, null],
    };
  },
  computed: {
    periodObj: function () {
      return this.pickerMap[this.periodType] || {};
    },
  },
  created() {
    let { majorType, customType, customDate, periodType, periodDates } =
      this.params;
    if (periodDates !== undefined) {
      this.periodDates = periodDates;
    }
    if (periodType !== undefined) {
      this.periodType = periodType;
    }
    if (customDate !== undefined) {
      this.customDate = customDate;
    }
    if (customType !== undefined) {
      this.customType = customType;
    }
    if (majorType !== undefined) {
      this.onMajorType(majorType);
    }
  },
  beforeDestroy() {
    this.resetAll();
  },
  methods: {
    onMajorType(to) {
      if (this.majorType === to) {
        return;
      }
      this.majorType = to;
      // 数据更新
      if (to === "customize") {
        if (this.customDate) {
          this.onDateChange(this.customDate);
          this.customType = "";
        } else {
          this.onCustomize(this.customType);
        }
      } else if (to === "period") {
        if (!this.periodType) {
          this.periodType = "DAY";
        }
        this.fillPeriodDate();
        this.onPeriodDate();
      }
    },
    onCustomize(to) {
      if (this.customType === to) {
        this.customType = "";
        this.$emit("time-change", {
          customize: {},
          period: null,
        });
      } else {
        this.customType = to;
        let { start, end } = this.timeSpanByType(to);
        this.$emit("time-change", {
          customize: {
            startTime: start,
            endTime: end,
          },
          period: null,
        });
      }
      this.customDate = [];
    },
    timeSpanByType(customType) {
      let start = null;
      let end = null;
      let now = dayjs();
      switch (customType) {
        case "hour01":
          start = now.subtract(1, "hour").format("YYYY-MM-DD HH:mm:ss");
          end = now.format("YYYY-MM-DD HH:mm:ss");
          break;
        case "hour04":
          start = now.subtract(4, "hour").format("YYYY-MM-DD HH:mm:ss");
          end = now.format("YYYY-MM-DD HH:mm:ss");
          break;
        case "hour12":
          start = now.subtract(12, "hour").format("YYYY-MM-DD HH:mm:ss");
          end = now.format("YYYY-MM-DD HH:mm:ss");
          break;
        case "hour24":
          start = now.subtract(1, "day").format("YYYY-MM-DD HH:mm:ss");
          end = now.format("YYYY-MM-DD HH:mm:ss");
          break;
        case "yesterday":
          start = now.subtract(1, "day").format("YYYY-MM-DD 00:00:00");
          end = now.subtract(1, "day").format("YYYY-MM-DD 23:59:59");
          break;
        case "nearOneMonth":
          start = now.subtract(30, "day").format("YYYY-MM-DD 00:00:00");
          end = now.format("YYYY-MM-DD 23:59:59");
          break;
        case "thisyear":
          start = now.startOf("year").format("YYYY-MM-DD 00:00:00");
          end = now.format("YYYY-MM-DD 23:59:59");
          break;
        default:
          break;
      }
      return { start, end };
    },
    onDateChange(val) {
      if (val && val.length) {
        this.$emit("time-change", {
          customize: {
            startTime: dayjs(val[0]).format("YYYY-MM-DD 00:00:00"),
            endTime: dayjs(val[1]).format("YYYY-MM-DD 23:59:59"),
          },
          period: null,
        });
      } else {
        this.$emit("time-change", {
          customize: {},
          period: null,
        });
      }
      this.customType = "";
    },
    onPeriodDate() {
      this.periodMessage();
    },
    onPeriodAdd() {
      this.periodDates.push(null);
    },
    onPeriodRemove() {
      this.periodDates.pop();
      // 删除后，日期均可用
      this.periodMessage();
    },
    // 同期对比 - 日期
    periodMessage() {
      let last = this.periodDates.filter((k) => k);
      if (last.length === 0 || last.length === this.periodDates.length) {
        let thePeriod = this.periodObj;
        this.$emit("time-change", {
          period: {
            list: last.map((t) => {
              return {
                dimension: this.periodType,
                date: dayjs(t).format(thePeriod.out),
              };
            }),
          },
          customize: null,
        });
      }
    },
    onPeriodTypeChange() {
      eventBus.emit("set-dilution-on", this.periodType);
      this.fillPeriodDate();
      this.onPeriodDate();
    },
    // 默认填充同期对比的时间
    fillPeriodDate() {
      let thePeriod = this.periodObj;
      this.periodDates = [
        dayjs().format(thePeriod.out),
        dayjs()
          .subtract(1, this.periodType.toLowerCase())
          .format(thePeriod.out),
      ];
    },
    resetAll() {
      this.majorType = "customize";
      this.customType = "";
      this.customDate = [];
      this.periodType = "DAY";
      this.periodDates = [];
    },
  },
};
</script>

<style lang="less" scoped>
.component-wrapper.custom-time {
  display: flex;
  align-items: center;
  .label {
    margin-right: 8px;
    font-size: 18px;
    color: #ffffff;
  }
  .time-selections {
    display: flex;
    align-items: center;
    margin-right: 12px;

    .selection {
      width: 80px;

      &:first-child {
        border-radius: 20px 0 0 20px;
      }
      &:last-child {
        border-radius: 0 20px 20px 0;
      }
    }
  }

  .customize-box {
    display: flex;
    align-items: center;
  }

  .period-box {
    display: flex;
    align-items: center;

    .period-select {
      margin-right: 16px;
      width: 80px;
    }

    .period-date-list {
      display: flex;
      align-items: center;

      .date-item-box {
        display: flex;
        align-items: center;

        .item-label {
          margin: 0 10px;
        }

        .item-date {
          width: 140px;
        }
      }
    }

    .period-btn-list {
      display: flex;
      align-items: center;

      .btn {
        padding: 2px;
        border-radius: 50%;

        &:first-child {
          margin-left: 10px;
        }
      }
    }
  }

  .time-item {
    margin-right: 10px;
    width: 80px;
    height: 40px;
    line-height: 40px;
    border-radius: 2px;
    background: #0a4071;
    border: 1px solid #529dff;
    box-sizing: border-box;
    font-family: PingFangSC-Medium;
    font-weight: 500;
    text-align: center;
    color: #ffffff;
    font-size: 16px;
    cursor: pointer;

    &.active {
      background: #3276ff;
      color: #ffffff;
    }
  }

  .time-custom {
    width: 280px;
    border-color: #3276ff;

    .el-range-editor.el-input__wrapper {
      width: 100%;
      background: transparent;
      box-shadow: 0 0 0 1px #3276ff inset;

      .el-range__icon,
      .el-range__close-icon {
        font-size: 16px;
        color: #2357c2;
      }

      .el-range-separator {
        font-size: 16px;
        color: #3276ff;
      }

      .el-range-input {
        font-size: 16px;
        color: #2357c2;

        &::-webkit-input-placeholder {
          color: #2357c2;
        }
      }
    }

    .time-custom-popper {
      margin-left: -268px !important;
    }
  }
}
</style>
