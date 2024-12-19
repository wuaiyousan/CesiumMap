import dayjs from 'dayjs'
let lineTempl = {
  backgroundColor: "rgba(180,180,180,0.1)",
  color: [
    "#5470c6",
    "#91cc75",
    "#fac858",
    "#ee6666",
    "#73c0de",
    "#3ba272",
    "#fc8452",
    "#9a60b4",
    "#ea7ccc",
  ],
  grid: {
    top: 30,
    right: 32,
    bottom: 12,
    left: 12,
    containLabel: true,
  },
  legend: {
    right: 40,
  },
  tooltip: {
    formatter: function (val) {
      let res = val[0].data.length > 2 ? `${val[0].data[2]}<br/>` : ''
      val.forEach(i => {
        res += `${i.marker}${i.data[1]}<br/>`
      })
      return res
    },
    trigger: "axis",
    axisPointer: {
      type: "cross",
      crossStyle: {
        color: "#666",
        type: "solid",
      },
      label: {
        backgroundColor: "#999",
        formatter: function (val) {
          if (val.axisDimension == 'x') {
            return val.seriesData[0].data[2]
          } else {
            return val.value.toFixed(3)
          }
        }
      },
      lineStyle: {
        color: "#999",
        type: "solid",
      },
    },
  },
  xAxis: [
    {
      type: "time",
      // data: [],
      axisPointer: {
        type: "line",
      },
      boundaryGap: false,
      axisLine: {
        lineStyle: {
          color: "#E0E0E0",
        },
      },
      axisLabel: {
        show: true,
        color: "#666",
        fontSize: 14,
        lineHeight: 20,
        formatter: function (val) {
          return dayjs(val).format('D HH:mm')
        }
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: "#ccc",
        },
      },
    },
  ],
  yAxis: [
    {
      type: "value",
      name: "",
      nameTextStyle: {
        color: "#666",
        fontSize: 14,
        align: "left",
      },
      nameGap: 8,
      min: function (val) {
        return Math.floor(val.min / 10) * 10;
      },
      boundaryGap: false,
      axisLine: {
        lineStyle: {
          color: "#E0E0E0",
        },
      },
      axisLabel: {
        show: true,
        color: "#666",
        fontSize: 14,
        lineHeight: 20,
        showMinLabel: false,
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: "#ccc",
        },
      },
    },
  ],
  series: [],
};

function getAreaLineOption(list) {
  return makeLineOption(list, {
    name: "",
    type: "line",
    // smooth: true,
    data: [],
    markLine: {
      symbol: "none",
      data: [],
    },
    areaStyle: {
      color: {
        type: "linear",
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          {
            offset: 0,
            color: "rgba(36,108,255,0.15)",
          },
          {
            offset: 1,
            color: "rgba(255,255,255,0)",
          },
        ],
      },
    },
    lineStyle: {
      color: "#5470C6",
    },
  });
}

function getLineOption(list) {
  return makeLineOption(list, {
    name: "",
    type: "line",
    // smooth: true,
    data: [],
    markLine: {
      symbol: "none",
      data: [],
    },
  });
}

function getOptionByParams(threshold, list, monitorType) {
  let chartType = monitorType === "RAIN" ? "bar" : "line";
  if (chartType === "line") {
    // 水位
    if (monitorType === "WATER_REGIMEN") {
      threshold;
      return makeLineOption(list, {
        name: "",
        type: "line",
        // smooth: true,
        data: [],
        markLine: {
          symbol: "none",
          data: wlLinesFromList(threshold),
        },
      });
    } else {
      return makeLineOption(list, {
        name: "",
        type: "line",
        // smooth: true,
        data: [],
        markLine: {
          symbol: "none",
          data: [],
        },
      });
    }
  } else if (chartType === "bar") {
    let opt = makeLineOption(list, {
      name: "",
      type: "bar",
      // barWidth: 16,
      barMaxWidth: 20,
      // smooth: true,
      data: [],
      markLine: {
        symbol: "none",
        data: [],
      },
    });
    // 柱图 - 两侧留白
    if (opt.xAxis) {
      opt.xAxis[0].boundaryGap = true;
    }
    return opt;
  }
}

function makeLineOption(
  list,
  seriesTmpl = {},
  nameKey = "date",
  dateKey = "list",
  zoomLimit = 24
) {
  let theLineTmpl = Object.assign({}, lineTempl);
  let colors = theLineTmpl.color;
  let arr = [];
  let tmpl = null;
  let showZoom = false;
  [].concat(list).forEach((it) => {
    if (it) {
      tmpl = Object.assign({}, seriesTmpl);
      tmpl.name = it[nameKey] || "";
      tmpl.data = it[dateKey] || [];
      if (tmpl.data && tmpl.data.length > zoomLimit) {
        showZoom = true;
      }
      // series - line
      let toColor = colors[arr.length] || "#FFFFFF";
      if (tmpl.areaStyle && tmpl.areaStyle.color) {
        tmpl.areaStyle.color.colorStops[0].color = `${toColor}AF`;
      }
      if (tmpl.lineStyle) {
        tmpl.lineStyle.color = toColor;
      }
      arr.push(tmpl);
    }
  });
  // 是否显示 dataZoom
  if (showZoom) {
    theLineTmpl = Object.assign({}, theLineTmpl, {
      dataZoom: [
        {
          type: "slider",
          show: true,
          start: 50,
          end: 100,
          textStyle: {
            color: "#666",
          },
          backgroundColor: "#fff",
          showDetail: false
        },
      ],
    });
    if (theLineTmpl.grid) {
      theLineTmpl.grid = Object.assign({}, theLineTmpl.grid, {
        bottom: 40,
      });
    }
  }
  return Object.assign({}, theLineTmpl, {
    series: arr,
  });
}

// LOW_WL - 保证水位 | ALERT_WL - 警戒水位
function wlLinesFromList(list) {
  let out = [];
  list.forEach((it) => {
    if (it) {
      let { code, value } = it;
      if (code === "LOW_WL") {
        out.push({
          yAxis: Number(value),
          lineStyle: { color: "#D90000", type: "solid" },
          label: {
            position: "insideEndTop",
            formatter: `保证水位(m)：${value}`,
            fontSize: 14,
            lineHeight: 20,
            color: "#666",
            distance: [0, 0],
          },
        });
      }
      if (code === "ALERT_WL") {
        out.push({
          yAxis: Number(value),
          lineStyle: { color: "#E2BF09", type: "solid" },
          label: {
            position: "insideEndTop",
            formatter: `警戒水位(m)：${value}`,
            fontSize: 14,
            lineHeight: 20,
            color: "#666",
            distance: [0, 0],
          },
        });
      }
    }
  });
  return out;
}

export { lineTempl, getAreaLineOption, getLineOption, getOptionByParams };
