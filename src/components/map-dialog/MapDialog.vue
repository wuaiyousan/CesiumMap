<!--
 * @Author: wangzhipeng
 * @Date: 2023-05-25 10:42:40
 * @LastEditors: wangzhipeng
 * @LastEditTime: 2023-11-28 14:56:52
 * @Description: 
-->
<script setup>
import DetailIndex from "./DetailIndex.vue";
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "测站详情",
  },
});
const emit = defineEmits(["update:visible"]);
const visible = computed({
  get() {
    return props.visible;
  },
  set(value) {
    emit("update:visible", value);
  },
});
const paramData = {
  deviceType: "MS003",
  alarmInstance: "",
  address: "",
  regionName: "云龙村民委员会",
  values: [
    {
      key: "status",
      name: "阀门状态",
      value: 1,
      valueExplain: "开",
      accessMode: ["ZOOM_IN_TIP", "LIST", "DETAILS"],
      order: 1,
      unit: " ",
      status: "NORMAL",
    },
    {
      key: "pressure1",
      name: "压力1",
      value: null,
      valueExplain: null,
      accessMode: ["ZOOM_IN_TIP", "DETAILS"],
      order: 2,
      unit: "Mpa",
      status: "NORMAL",
    },
    {
      key: "flow",
      name: "瞬时流量",
      value: null,
      valueExplain: null,
      accessMode: ["ZOOM_IN_TIP", "LIST", "DETAILS", "ZOOM_OUT_TIP"],
      order: 3,
      unit: "m³/h",
      status: "NORMAL",
    },
    {
      key: "todayAmount",
      name: "今日用水量",
      value: 0,
      valueExplain: null,
      accessMode: ["ZOOM_IN_TIP", "LIST", "DETAILS"],
      order: 4,
      unit: "m³",
      status: "NORMAL",
    },
    {
      key: "yearWaterAmount",
      name: "年累计水量",
      value: 0,
      valueExplain: null,
      accessMode: ["ZOOM_IN_TIP", "LIST", "DETAILS"],
      order: 5,
      unit: "m³",
      status: "NORMAL",
    },
    {
      key: "pressure2",
      name: "压力2",
      value: null,
      valueExplain: null,
      accessMode: [],
      order: 21,
      unit: "Mpa",
      status: "NORMAL",
    },
    {
      key: "pressure3",
      name: "压力3",
      value: null,
      valueExplain: null,
      accessMode: [],
      order: 22,
      unit: "Mpa",
      status: "NORMAL",
    },
    {
      key: "pressure4",
      name: "压力4",
      value: null,
      valueExplain: null,
      accessMode: [],
      order: 23,
      unit: "Mpa",
      status: "NORMAL",
    },
    {
      key: "waterAmount",
      name: "累计流量",
      value: 0,
      valueExplain: null,
      accessMode: ["DETAILS"],
      order: 25,
      unit: " m³",
      status: "NORMAL",
    },
    {
      key: "closeCardSurplusAmount",
      name: "关泵剩余水量",
      value: null,
      valueExplain: null,
      accessMode: ["ZOOM_IN_TIP", "LIST"],
      order: 31,
      unit: " ",
      status: "NORMAL",
    },
    {
      key: "serialNum",
      name: "卡序列号",
      value: "00000000",
      valueExplain: null,
      accessMode: [],
      order: 51,
      unit: " ",
      status: "NORMAL",
    },
    {
      key: "currentdate",
      name: "插入时间",
      value: "2023-08-23 09:58:23",
      valueExplain: null,
      accessMode: [],
      order: 52,
      unit: " ",
      status: "NORMAL",
    },
  ],
  deviceTypeName: "取用水测站",
  deviceCode: "532327203201212",
  deviceName: "直苴片区1#幸福水库分水口",
  regionCode: "532327101207",
  commStatus: "ONLINE",
  alarmStatus: "NORMAL",
  mot: "2023-08-23 10:00:01",
  facilityName: "直苴片区1#幸福水库分水口",
  iconUrl:
    '[{"uid":1694592161921,"name":"闸阀icon.png","url":"https://172.16.142.252:9093/swp/upload/20230913/2fd3b37002c3402fd39b3aa29173a17f.png","fileId":"upload/20230913/2fd3b37002c3402fd39b3aa29173a17f.png","status":"success"},{"name":"闸阀icon备份 6.png","url":"https://172.16.142.252:9093/swp/upload/20230913/0cf613135fcc057d376f69d7ef96d054.png","fileId":"upload/20230913/0cf613135fcc057d376f69d7ef96d054.png"}]',
  id: "532327203201212",
};
</script>

<template>
  <el-dialog
    v-model="visible"
    class="map-site-dialog"
    width="1250px"
    top="10vh"
    :title="props.title"
  >
    <DetailIndex :params="paramData"> </DetailIndex>
  </el-dialog>
</template>

<style lang="less">
.map-site-dialog {
  width: 1250px;
  height: 700px;
}
</style>
