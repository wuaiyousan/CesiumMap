<template>
  <div class="empty-box">
    <img src="../../../assets/img/map/empty.png" alt="" />
    <p>{{ description }}</p>
  </div>
</template>
<script>
export default {
  props: {
    description: {
      type: Object,
      default: () => '暂无数据',
    },
  },
  data() {
    return {}
  },
}
</script>
<style lang="less" scoped>
.empty-box {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  p {
    color: #999999;
    line-height: 40px;
  }
}
</style>
