import request from "@/api/instance.js";

// 历史数据记录 - 获取参数
function getRecordParams(params) {
  let {
    startTime,
    endTime,
    stId,
    stcd,
    sttp,
    monitorType = "",
    deviceCode,
    deviceType,
    dataFields = "",
    timeField = "",
    contemporaneous = [],
    querySetting = {},
  } = params;
  let to = {};
  if (stId !== undefined) {
    to.stId = stId;
  }
  if (stcd !== undefined) {
    to.stcd = stcd;
  }
  if (sttp !== undefined) {
    to.sttp = sttp;
  }
  if (startTime) {
    to.startTime = startTime;
  }
  if (endTime) {
    to.endTime = endTime;
  }
  if (monitorType) {
    to.monitorType = monitorType;
  }
  if (deviceCode) {
    to.deviceCode = deviceCode;
  }
  if (deviceType) {
    to.deviceType = deviceType;
  }
  if (dataFields) {
    to.dataFields = dataFields;
  }
  if (timeField) {
    to.timeField = timeField;
  }
  if (contemporaneous.length) {
    let order = 0;
    contemporaneous.forEach((it) => {
      let { date, dimension } = it || {};
      if (date && dimension) {
        to[`contemporaneous[${order}].date`] = date;
        to[`contemporaneous[${order++}].dimension`] = dimension;
      }
    });
  }
  if (querySetting && Object.keys(querySetting).length) {
    let { dataDilute, filterOutliers, supplement } = querySetting;
    if (dataDilute !== undefined) {
      for (const key in dataDilute) {
        if (Object.hasOwnProperty.call(dataDilute, key)) {
          to[`querySetting.dataDilute.${key}`] = dataDilute[key];
        }
      }
    }
    if (filterOutliers !== undefined) {
      to["querySetting.filterOutliers"] = filterOutliers;
    }
    if (supplement !== undefined) {
      to["querySetting.supplement"] = supplement;
    }
  }
  return to;
}

// 获取地图实时测站数据
export const getHistoryRecords = (params) => {
  return request({
    url: "/api/swp-base-device/device/monitor/his",
    method: "post",
    params: getRecordParams(params),
  });
};

export const exportHistoryRecords = (params) => {
  return request({
    url: "/api/swp-computing/monitor/export-his",
    method: "post",
    params: getRecordParams(params),
    responseType: "blob",
  }).then((res) => exportFile(res));
};

// 导出文件
function exportFile(res, defaultName = "数据导出.xlsx") {
  let { headers, data } = res;
  let fileBlob = new Blob([data]);
  let fileName = defaultName;
  let attachment = decodeURI(headers["content-disposition"]).split(";", 2);
  if (attachment.length > 1) {
    let parts = attachment[1].split("=", 2);
    if (parts.length > 1) {
      fileName = parts[1];
    }
  }
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(fileBlob, fileName);
  } else {
    const downloadElement = document.createElement("a");
    const href = window.URL.createObjectURL(fileBlob);
    downloadElement.href = href;
    downloadElement.download = fileName;
    document.body.appendChild(downloadElement);
    downloadElement.click();
    document.body.removeChild(downloadElement);
    window.URL.revokeObjectURL(href);
  }
}
