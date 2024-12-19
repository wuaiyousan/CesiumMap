<template>
  <div class="header">
    <span class="overview" v-if="title">{{ title }}</span>
    <el-button-group v-if="!isShow">
      <el-button
        size="small"
        v-for="item in btnList"
        :key="item.value"
        :class="{ active: activeTab == item.value }"
        @click="chooseTime(item.value)"
      >
        <div class="dot" v-if="item.value == 'workOrder'"></div>
        {{ item.label }}
      </el-button>
    </el-button-group>
    {{ statisticalTime }}
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeTab: "today",
    };
  },
  props: {
    btnList: {
      type: Array,
      default: () => [
        {
          label: "今天",
          value: "today",
        },
        {
          label: "近7天",
          value: "sevenDays",
        },
        {
          label: "近15天",
          value: "halfMounth",
        },
        {
          label: "近1个月",
          value: "mounth",
        },
        {
          label: "近3个月",
          value: "threeMounth",
        },
      ],
    },
    title: {
      type: String,
    },
    isShow: {
      type: Boolean,
      default: false,
    },
    statisticalTime: {
      type: String,
      default: "",
    },
    active: {
      type: String,
      default: "TODAY",
    },
  },
  methods: {
    chooseTime(v) {
      this.activeTab = v;
      this.$emit("chooseTime", v);
    },
  },
  updated() {
    this.activeTab = this.active;
  },
};
</script>
<style scoped lang="less">
.header {
  position: relative;
  display: flex;
  justify-content: center;
  border-radius: 5px 5px 0 0;
  height: 50px;
  align-items: center;
  padding: 0 15px;
  font-weight: 500;
  .overview {
    margin-left: 10px;
  }
  .dot {
    position: absolute;
    border-radius: 50%;
    width: 6px;
    height: 6px;
    background: #ff4d4f;
    right: 6px;
    top: 6px;
  }
  .el-button{
    height: 30px;
    padding:  6px 16px;
    border: 1px solid rgba(22,119,255,0.3);
    background: rgba(22,119,255,0.3);
    color: rgba(255,255,255,0.7);
  }
  .active {
    background-color: #1677EE;
    color: #fff;
  }
}
</style>