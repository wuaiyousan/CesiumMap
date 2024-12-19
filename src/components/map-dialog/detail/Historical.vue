<!--
 * @Author: duanlian
 * @Date: 2023-04-18 15:30:28
 * @LastEditors: duanlian
 * @LastEditTime: 2023-05-15 16:22:00
 * @Description: 
-->
<template>
  <div class="historical">
    <div class="tops-search">
      <div class="time-select">
        <span class="label">时间选择：</span>
        <el-button-group class="time-selections">
          <el-button class="selection" round size="mini" :type="majorType === 'customize' ? 'primary' : ''"
            @click.stop="onMajorType('customize')">
            自定义
          </el-button>
          <el-button class="selection" round size="mini" :type="majorType === 'period' ? 'primary' : ''"
            @click.stop="onMajorType('period')">
            同期对比
          </el-button>
        </el-button-group>
        <!-- 自定义 -->
        <div class="customize-box" v-if="majorType === 'customize'">
          <span class="time-item" :class="{ active: customType === 'hour01' }" @click.stop="onCustomize('hour01')">
            近1小时
          </span>
          <span class="time-item" :class="{ active: customType === 'hour04' }" @click.stop="onCustomize('hour04')">
            近4小时
          </span>
          <span class="time-item" :class="{ active: customType === 'hour12' }" @click.stop="onCustomize('hour12')">
            近12小时
          </span>
          <span class="time-item" :class="{ active: customType === 'hour24' }" @click.stop="onCustomize('hour24')">
            近24小时
          </span>
          <span class="time-item" :class="{ active: customType === 'yesterday' }"
            @click.stop="onCustomize('yesterday')">
            昨天
          </span>
          <span class="time-item" :class="{ active: customType === 'nearOneMonth' }"
            @click.stop="onCustomize('nearOneMonth')">
            近一月
          </span>
          <span class="time-item" :class="{ active: customType === 'thisyear' }" @click.stop="onCustomize('thisyear')">
            今年
          </span>
          <el-date-picker class="time-custom" popper-class="time-custom-popper" v-model="customDate" size="mini"
            :editable="false" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
            format="yyyy-MM-dd" value-format="yyyy-MM-dd" @change="onDateChange"></el-date-picker>
        </div>
        <!-- 同期对比 -->
        <div class="period-box" v-if="majorType === 'period'">
          <el-select v-model="periodType" class="period-select" size="mini" @change="onPeriodTypeChange">
            <el-option label="日" value="DAY" />
            <el-option label="月" value="MONTH" />
            <el-option label="年" value="YEAR" />
          </el-select>

          <div class="period-date-list">
            <div class="date-item-box" v-for="(it, index) in periodDates" :key="index">
              <span class="item-label" v-show="index">与</span>
              <el-date-picker class="item-date" v-model="periodDates[index]" size="mini" :editable="false"
                :type="periodObj.type" :format="periodObj.format" :value-format="periodObj.format"
                @change="onPeriodDate"></el-date-picker>
            </div>
          </div>

          <div class="period-btn-list">
            <el-button class="btn" size="mini" icon="el-icon-plus" circle v-show="periodConf.limit > periodDates.length"
              @click="onPeriodAdd" type="primary"></el-button>
            <el-button class="btn" size="mini" icon="el-icon-minus" circle v-show="periodDates.length > 2"
              @click="onPeriodRemove"></el-button>
          </div>
        </div>
      </div>
      <div class="flex-row">
        <div class="label">曲线设置：</div>
        <el-checkbox-group v-model="checkList">
          <el-checkbox label="abnormal">过滤异常值</el-checkbox>
          <el-checkbox label="dilution">数据抽稀</el-checkbox>
        </el-checkbox-group>
        <el-select v-model="value" placeholder="请选择" size="mini" style="width:120px">
          <el-option label="30分钟" value="30M"></el-option>
          <el-option label="1小时" value="1H"></el-option>
          <el-option label="3小时" value="3H"></el-option>
          <el-option label="6小时" value="6H"></el-option>
          <el-option label="12小时" value="12H"></el-option>
          <el-option label="24小时" value="24H"></el-option>
        </el-select>
      </div>
      <div class="query-type">
        <div class="left">
          <div class="label">数据类别：</div>
          <base-header class="btns" :btnList="tabLists" @chooseTime="getValue"></base-header>
        </div>
        <div class="right">
          <el-radio-group v-model="type" size="small" class="right-radio">
            <el-radio-button label="curve">曲线</el-radio-button>
            <el-radio-button label="table">表格</el-radio-button>
          </el-radio-group>
          <el-button icon="el-icon-download" size="small">导出</el-button>
        </div>

      </div>
    </div>
    <div class="echarts-box">
      <v-chart :options="options" autoresize class="charts"></v-chart>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import BaseHeader from './BaseHeader.vue'
export default {
  name: 'Historical',
  components: { BaseHeader },
  props: {
    // params: {
    //     type: Object,
    //     default: function () {
    //         return {
    //             majorType: "customize",
    //             customType: "hour24",
    //             customDate: [],
    //             periodType: "",
    //             periodDates: [],
    //         };
    //     },
    // },
    periodConf: {
      type: Object,
      default: function () {
        return {
          limit: 3,
        }
      },
    },
  },
  data() {
    return {
      showTab: '',
      majorType: 'customize',
      customType: 'hour24',
      customDate: [],
      periodType: '',
      pickerMap: {
        DAY: {
          type: 'date',
          format: 'yyyy-MM-dd',
          out: 'YYYY-MM-DD',
        },
        MONTH: {
          type: 'month',
          format: 'yyyy-MM',
          out: 'YYYY-MM',
        },
        YEAR: {
          type: 'year',
          format: 'yyyy',
          out: 'YYYY',
        },
      },
      // 同期对比-日期
      periodDates: [null, null],
      options: {
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: ['水位（m）'],
          left: 'right',
        },
        xAxis: {
          type: 'category', //类型
          data: [],
        },
        yAxis: {
          type: 'value',
        },
        dataZoom: [
          {
            type: 'inside',
            start: 0,
            end: 100,
          },
        ],
        series: [
          {
            name: '水位（m）', //对应的名字
            data: [],
            type: 'line',
            symbol: 'none',
            smooth: true,
            markLine: {
              silent: true,
              symbol: 'none',

              data: [
                {
                  yAxis: 102,
                  lineStyle: {
                    color: '#d9e375',
                  },
                  label: {
                    normal: {
                      formatter: '警戒水位（m）：0.300',
                      position: 'insideEndTop',
                    },
                  },
                },
                {
                  yAxis: 87,
                  lineStyle: {
                    color: '#9f6370',
                  },
                  label: {
                    normal: {
                      formatter: '保证水位（m）：78.100',
                      position: 'insideEndTop',
                    },
                  },
                },
              ],
            },
          },
        ],
      },
      tabLists: [
        { label: '雨量', value: 'rain' },
        { label: '水位', value: 'water' },
        { label: '视频', value: 'video' },
      ],
      checkList: ['abnormal'],
      type: 'curve',
      value: '30M',
    }
  },
  methods: {
    onMajorType(to) {
      if (this.majorType === to) {
        return
      }
      this.majorType = to
      // 数据更新
      // if (to === "customize") {
      //     if (this.customDate) {
      //         this.onDateChange(this.customDate);
      //         this.customType = "";
      //     } else {
      //         this.onCustomize(this.customType);
      //     }
      // } else if (to === "period") {
      //     if (!this.periodType) {
      //         this.periodType = "DAY";
      //     }
      //     this.fillPeriodDate();
      //     this.onPeriodDate();
      // }
    },
    onCustomize(to) {
      if (this.customType === to) {
        this.customType = ''
        // this.$emit("time-change", {
        //     customize: {},
        //     period: null,
        // });
      } else {
        this.customType = to
        let { start, end } = this.timeSpanByType(to)
        // this.$emit("time-change", {
        //     customize: {
        //         startTime: start,
        //         endTime: end,
        //     },
        //     period: null,
        // });
      }
      this.customDate = []
    },
    timeSpanByType(customType) {
      let start = null
      let end = null
      let now = dayjs()
      switch (customType) {
        case 'hour01':
          start = now.subtract(1, 'hour').format('YYYY-MM-DD HH:mm:ss')
          end = now.format('YYYY-MM-DD HH:mm:ss')
          break
        case 'hour04':
          start = now.subtract(4, 'hour').format('YYYY-MM-DD HH:mm:ss')
          end = now.format('YYYY-MM-DD HH:mm:ss')
          break
        case 'hour12':
          start = now.subtract(12, 'hour').format('YYYY-MM-DD HH:mm:ss')
          end = now.format('YYYY-MM-DD HH:mm:ss')
          break
        case 'hour24':
          start = now.subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss')
          end = now.format('YYYY-MM-DD HH:mm:ss')
          break
        case 'yesterday':
          start = now.subtract(1, 'day').format('YYYY-MM-DD 00:00:00')
          end = now.subtract(1, 'day').format('YYYY-MM-DD 23:59:59')
          break
        case 'nearOneMonth':
          start = now.subtract(30, 'day').format('YYYY-MM-DD 00:00:00')
          end = now.format('YYYY-MM-DD 23:59:59')
          break
        case 'thisyear':
          start = now.startOf('year').format('YYYY-MM-DD 00:00:00')
          end = now.format('YYYY-MM-DD 23:59:59')
          break
        default:
          break
      }
      return { start, end }
    },
    getData() {
      this.options.xAxis.data = [
        '01-03 05:00',
        '01-04 17:00',
        '01-06 01:00',
        '01-09 02:00',
        '01-10 12:00',
        '01-12 01:00',
        '01-13 12:00',
        '01-15 00:00',
      ]
      this.options.series[0].data = [20, 220, 30, 80, 60, 90, 150, 100]
    },
    getValue() {
      this.showTab = v
    },
  },
  mounted() {
    this.getData()
  },
}
</script>

<style lang="less" scoped>
.historical {
  position: relative;
  width: 100%;
  height: 100%;
  .tops-search {
    padding: 0 16px;
    .time-select {
      display: flex;
      align-items: center;
      height: 30px;
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
        .time-item {
          margin-right: 10px;
          width: 80px;
          height: 28px;
          line-height: 28px;
          border-radius: 2px;
          border: 1px solid #3276ff;
          box-sizing: border-box;
          font-family: PingFangSC-Medium;
          font-weight: 500;
          text-align: center;
          color: #3276ff;
          cursor: pointer;
          &.active {
            background: #3276ff;
            color: #ffffff;
          }
        }
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
    .flex-row {
      display: flex;
      align-items: center;
      .label {
        margin-right: 15px;
      }
    }
    .query-type {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .left {
        display: flex;
        align-items: center;
      }
      .right {
        display: flex;
        align-items: center;
        .right-radio {
          margin-right: 10px;
        }
      }
    }
  }
  .echarts-box {
    height: calc(100% - 80px);
    width: 100%;
    .charts {
      width: 100%;
      height: 100%;
    }
  }
}
</style>