<!--
 * @Author: fishScola
 * @Date: 2022-11-04 16:58:45
 * @LastEditors: fishScola
 * @LastEditTime: 2022-12-05 20:38:39
 * @Description: 监测曲线表格
-->
<template>
  <div class="component-wrapper monitor-table" ref="monitorTableRef">
    <el-table
      v-if="tableHeight"
      class="table-box"
      header-cell-class-name="monitor-header"
      cell-class-name="monitor-cell"
      :data="showList"
      border
      :height="tableHeight"
      ref="tableRef"
    >
      <el-table-column
        v-if="showHeaders.length"
        prop="order"
        label="序号"
        align="center"
        width="64"
      ></el-table-column>
      <el-table-column
        :label="it.label"
        :prop="it.prop"
        align="center"
        v-for="(it, index) in showHeaders"
        :key="index"
      ></el-table-column>
    </el-table>
    <el-pagination
      class="pager-box"
      v-show="pager.total"
      small
      background
      @current-change="handleCurrent"
      :current-page.sync="pager.current"
      :page-size="pager.size"
      layout="prev, pager, next, total"
      :total="pager.total"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "MonitorTable",
  props: {
    tableObj: {
      type: Object,
      default: function () {
        return {};
      },
    },
    emptyTips: {
      type: String,
      default: function () {
        return "暂无数据";
      },
    },
  },
  data() {
    return {
      tableHeight: 0,
      pager: {
        current: 1,
        size: 10,
        total: 0,
      },
      totalList: [],
      showList: [],
      showHeaders: [],
    };
  },
  watch: {
    tableObj: function (newVal, oldVal) {
      if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
        this.updatePanel(newVal);
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.updatePanel(this.tableObj);
    });
  },
  beforeDestroy() {
    this.totalList = [];
    this.showList = [];
    this.showHeaders = [];
  },
  methods: {
    handleCurrent(pageNo) {
      this.showByParams(pageNo);
    },
    updatePanel(obj = {}) {
      let { headers, list } = obj || {};
      let out = []
        .concat(list || [])
        .map((item, index) => Object.assign({ order: index + 1 }, item));
      this.totalList = out;
      let pager = this.pager;
      pager.current = 1;
      pager.total = out.length;
      this.showHeaders = headers || [];
      if (!pager.total) {
        this.$nextTick(() => {
          this.updateHeight(0);
        });
      } else {
        this.$nextTick(() => {
          this.updateHeight();
        });
      }
      this.showByParams(1);
    },
    showByParams(current, size) {
      size = size || this.pager.size;
      this.showList = this.totalList.slice(
        Math.max((current - 1) * size, 0),
        Math.min(current * size, this.pager.total)
      );
      // 还原垂直滚动条
      this.updateScroll();
    },
    updateHeight(dh = -40, defVal = 460) {
      let toRef = this.$refs.monitorTableRef;
      if (toRef) {
        let total = Math.max(0, toRef.parentElement.offsetHeight - 14);
        // footer - 40
        this.tableHeight = (toRef.offsetHeight || total || defVal) + dh;
      }
    },
    updateScroll() {
      let toRef = this.$refs.tableRef;
      if (toRef) {
        // 重置垂直滚动条
        if (toRef.bodyWrapper) {
          toRef.bodyWrapper.scrollTop = 0;
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
.component-wrapper.monitor-table {
  width: 100%;
  height: 100%;

  .table-box {
    height: calc(100% - 40px);
    border: none;
    border-top: 1px solid #dde2e6;
    border-left: 1px solid #dde2e6;

    .monitor-header {
      color: #303e67;
      border-bottom: 1px solid #dde2e6;
      border-right: 1px solid #dde2e6;
      border-left: none;
    }

    .monitor-cell {
      border-bottom: 1px solid #dde2e6;
      border-right: 1px solid #dde2e6;
      border-left: none;
    }
  }

  .pager-box {
    height: 40px;
    padding: 12px 0 0 0;
    display: flex;
    justify-content: flex-end;
    box-sizing: border-box;
  }
}
</style>
