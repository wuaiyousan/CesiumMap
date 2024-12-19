/*
 * @Author: fishScola
 * @Date: 2022-11-01 15:25:33
 * @LastEditors: fishScola
 * @LastEditTime: 2022-11-10 17:06:36
 * @Description: 监测类型
 */
import { getOptionByParams } from "./chart.template.js";
import dayjs from "dayjs";

export default function UseMonitor() {
  // 测站数据解析 start
  function parseRes({
    data,
    params,
    monitorObj = {},
    theField = "",
    dataFn = null,
  }) {
    let { statistics, ...others } = data || {};
    if (!statistics) {
      return { status: false, data: null, msg: "数据为空！" };
    }
    let out = [];
    // 取数据，若statistics下仅有一项数据，直接取之；否则，可通过外部函数获取之。
    let fromObj = Object.assign({}, statistics);
    let info = fromObj;
    let fromKeys = Object.keys(fromObj);
    if (dataFn) {
      info = dataFn(fromObj);
    } else if (fromKeys.length === 1) {
      info = fromObj[fromKeys[0]];
    }
    let { unit, label } = monitorObj;
    // 同期对比
    let { contemporaneous } = params || {};
    if (contemporaneous && contemporaneous.length) {
      contemporaneous.forEach((it) => {
        let { date, dimension } = it || {};
        if (date && dimension) {
          let dateRes = info[date];
          let keys = Object.keys(dateRes);
          let deep = keys.length;
          if (deep > 1) {
            out.push({
              date: date,
              list: [].concat(dateRes || []),
            });
          } else if (deep == 1) {
            out.push({
              date: date,
              list: dateRes[keys[0]],
            });
          } else if (theField) {
            out.push({
              date: date,
              list: (dateRes && dateRes[theField]) || [],
            });
          }
        }
      });
    } else {
      let defaultTitle = unit || label || "数值";
      let keys = Object.keys(info);
      if (info[theField]) {
        out.push({
          date: defaultTitle,
          list: info[theField] || [],
        });
      } else if (keys.length == 1) {
        out.push({
          date: defaultTitle,
          list: info[keys[0]],
        });
      }
    }
    // 返回
    if (out.length) {
      return {
        status: true,
        data: {
          ...others,
          statistics: out,
        },
        msg: "",
      };
    }
    return { status: false, data: null, msg: "数据为空！" };
  }

  function formatList(rawList, dim = "", itemFn = handleSingle) {
    let tableList = [];
    let chartList = [];
    // 格式化并对图表所需数据翻转顺序
    [].concat(rawList).forEach((it) => {
      if (it) {
        let { list, ...others } = it;
        let arr = [].concat(list).map((k) => itemFn(k, dim));
        chartList.push({
          ...others,
          list: [].concat(arr).reverse(),
        });
        tableList.push({
          ...others,
          list: arr,
        });
      }
    });
    return {
      chartList,
      // 表格所需数据格式化
      tableObj: formatTableList(tableList),
    };
  }

  function formatTableList(fromList) {
    let out = [];
    let headers = [];
    while (fromList.length) {
      let item = fromList.pop();
      if (!item) {
        continue;
      }
      let { list, date } = item;
      let len = headers.length;
      if (len) {
        let toProp = `v${len}`;
        headers.push({
          label: date,
          prop: toProp,
        });
        // 粗略查找匹配
        list.forEach((it) => {
          if (it) {
            let tm = it[3] ? it[3] : it[0];
            let val = it[1];
            let index = out.findIndex((k) => k.time === tm);
            if (index > -1) {
              out[index][toProp] = val;
            } else {
              let descIndex = getDescIndex(out, tm);
              if (descIndex > -1) {
                out.splice(descIndex, 0, {
                  time: tm,
                  [toProp]: val,
                });
              } else {
                out.push({
                  time: tm,
                  [toProp]: val,
                });
              }
            }
          }
        });
      } else {
        headers.push({
          label: "采集时间",
          prop: "time",
        });
        headers.push({
          label: date,
          prop: "v1",
        });
        out = list.map((k) => {
          return {
            time: k[3] ? k[3] : k[0],
            v1: k[1],
          };
        });
      }
    }
    return {
      headers,
      list: out,
    };
  }

  // list - [{time:'',v1:'',v2:''}]
  function getDescIndex(list, tm) {
    for (let i = 0, len = list.length; i < len; i++) {
      if (list[i].time < tm) {
        return i;
      }
    }
    return -1;
  }

  // 测站数据解析 end
  function getMonitorResult({
    data,
    params,
    monitorObj = {},
    theField = "",
    dataFn = null,
    chartFn = null,
  }) {
    let resp = parseRes({ data, params, monitorObj, theField, dataFn });
    if (resp.status) {
      let { statistics, alarmThreshold: threshold } = resp.data || {};
      let chartFun = chartFn || getOptionByParams;
      // 同期对比
      let compareItem = params.contemporaneous && params.contemporaneous[0];
      let { chartList, tableObj } = formatList(
        statistics,
        (compareItem && compareItem.dimension) || ""
      );
      return {
        status: true,
        data: {
          option: chartFun(
            threshold,
            chartList,
            // monitorType
            params.monitorType || params.dataFields || ""
          ),
          table: tableObj,
        },
        msg: "",
      };
    }
    return resp;
  }

  // 处理单个数据记录项
  function handleSingle(it, dimen) {
    if (dimen === "DAY") {
      return [(dayjs(it.time).valueOf() - dayjs(it.time).startOf('day').valueOf()), it.value, formatTime(it.time, "HH:mm"), formatTime(it.time, "HH:mm")];
    } else if (dimen === "MONTH") {
      return [(dayjs(it.time).valueOf() - dayjs(it.time).startOf('month').valueOf()), it.value, formatTime(it.time, "YYYY-MM-DD HH:mm"), formatTime(it.time, "DD HH:mm")];
    } else if (dimen === "YEAR") {
      return [(dayjs(it.time).valueOf() - dayjs(it.time).startOf('year').valueOf()), it.value, formatTime(it.time, "YYYY-MM-DD HH:mm"), formatTime(it.time, "MM-DD HH:mm"),];
    }
    return [(dayjs(it.time).valueOf()), it.value, formatTime(it.time, "YYYY-MM-DD HH:mm"),formatTime(it.time, "YYYY-MM-DD HH:mm")];
  }

  function formatTime(str, fmt = "MM-DD HH:mm") {
    if (str) {
      return dayjs(str).format(fmt);
    }
    return str;
  }

  return {
    getMonitorResult,
  };
}
