<template>
  <div style="margin-top: 10px;">
    <avue-crud :option="option" :search.sync="search" :table-loading="loading" :data="data" ref="crud" v-model="form"
      :page.sync="page" @search-change="searchChange" @search-reset="searchReset" @selection-change="selectionChange"
      @current-change="currentChange" @size-change="sizeChange" @on-load="onLoad">
      <template slot="searchMenu">
        <el-button class="exportBtn" size="mini" plain icon="el-icon-download" @click="handleExport">导出
        </el-button>
      </template>
      <template slot-scope="{row}" slot="record">
        <span style="color: #1677ee" @click="getView(row)">查看</span>
      </template>
      <template slot-scope="{row}" slot="workOrder">
        <span style="color: #333;font-weight: 500;" @click="getRowData(row)">{{row.workOrder}}</span>
      </template>
    </avue-crud>
    <Drawer :visible="visible" :detailData="detailData" @closeD="closeD"></Drawer>
    <drag-dialog :caption="dialogControl.dialogTitle" :visible.sync="dialogControl.dialogVisible"
      :w.sync="dialogControl.w" :h.sync="dialogControl.h" :x.sync="dialogControl.x" :y.sync="dialogControl.y" :z="100"
      :min-width="600" :min-height="600" @close="close" append-to-body>
      <components :is="dialogControl.dialogCmpt" :params="dialogControl.paramData" @close="close"
        v-if="dialogControl.dialogVisible"></components>
    </drag-dialog>
  </div>
</template>
<script>
import Drawer from './Drawer.vue'
import HisTable from './HisTable.vue'
import DragDialog from './dragStretchDialog/index.vue'
import { getOffsetAndSize } from '@/utils/util.js'
export default {
  name: 'alarm',
  components: {
    DragDialog,
    HisTable,
    Drawer,
  },
  data() {
    return {
      search: {},
      form: {},
      // loading: true,
      page: {
        total: 1000,
        currentPage: 1,
        pageSize: 10,
      },
      option: {
        height: '450px',
        calcHeight: 80,
        tip: false,
        searchShow: true,
        searchMenuSpan: 6,
        border: true,
        viewBtn: true,
        dialogType: 'drawer',
        dialogClickModal: false,
        menu: false,
        addBtn: false,
        searchBtnText: '查询',
        emptyBtnText: '重置',
        refreshBtn: false,
        columnBtn: false,
        searchShowBtn: false,
        column: [
          {
            label: '报警时间',
            type: 'select',
            // dicUrl: "/api/blade-system/dict/dictionary?code=user_type",
            // props: {
            //     label: "dictValue",
            //     value: "dictKey"
            // },
            // dataType: "number",
            search: true,
            type: 'datetime', //使用的组件类型
            searchRange: true, //控制搜索时是否是日期范围默认为false是单独的一天
            format: 'yyyy-MM-dd HH:mm',
            valueFormat: 'yyyy-MM-dd HH:mm:ss',
            display: false,
            prop: 'alarmTime',
            size: 'mini',
          },
          {
            label: '报警类型',
            prop: 'alarmType',
            type: 'select',
            // dicUrl: "/api/blade-system/dict/dictionary?code=user_type",
            // props: {
            //     label: "dictValue",
            //     value: "dictKey"
            // },
            // dataType: "number",
            search: true,
            display: false,
          },
          {
            label: '报警内容',
            prop: 'alarmContent',
            display: false,
          },
          {
            label: '报警指标',
            prop: 'alarmIndicators',
            display: false,
          },
          {
            label: '检测值',
            prop: 'monitoringValue',
            display: false,
          },
          {
            label: '阈值',
            prop: 'threshold',
            display: false,
          },
          {
            label: '处理状态',
            type: 'select',
            // dicUrl: "/api/blade-system/dict/dictionary?code=user_type",
            // props: {
            //     label: "dictValue",
            //     value: "dictKey"
            // },
            // dataType: "number",
            prop: 'handlerStatus',
            search: true,
            display: false,
          },
          {
            label: '触发记录',
            prop: 'record',
            display: false,
            slot: true,
          },
          {
            label: '关联工单',
            prop: 'workOrder',
            display: false,
          },
        ],
      },
      data: [
        {
          alarmTime: '2023-02-14 10:00:00',
          alarmType: '地表水位预警',
          alarmContent: '超警戒水位',
          alarmIndicators: '水位(m)',
          monitoringValue: '0.499',
          threshold: 'x>0.300',
          handlerStatus: '未处理',
          workOrder: 'BJGD0001',
        },
        {
          alarmTime: '2023-02-14 10:00:00',
          alarmType: '地表水位预警',
          alarmContent: '超警戒水位',
          alarmIndicators: '水位(m)',
          monitoringValue: '0.499',
          threshold: 'x>0.300',
          handlerStatus: '未处理',
          workOrder: 'BJGD0002',
        },
        {
          alarmTime: '2023-02-14 10:00:00',
          alarmType: '地表水位预警',
          alarmContent: '超警戒水位',
          alarmIndicators: '水位(m)',
          monitoringValue: '0.499',
          threshold: 'x>0.300',
          handlerStatus: '未处理',
          workOrder: 'BJGD0003',
        },
      ],
      visible: false,
      detailData: {},
      dialogControl: {
        dialogVisible: false,
        dialogTitle: '',
        dialogCmpt: '',
        paramData: {},
        w: 900,
        h: 600,
        x: 50,
        y: 50,
      },
    }
  },
  methods: {
    searchChange(params, done) {
      this.query = params
      this.page.currentPage = 1
      this.onLoad(this.page, params)
      done()
    },
    searchReset() {
      this.query = {}
      this.treeDeptId = ''
      this.onLoad(this.page)
    },
    currentChange(currentPage) {
      this.page.currentPage = currentPage
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize
    },
    onLoad(page, params = {}) {
      // this.loading = true;
      // getList(page.currentPage, page.pageSize, Object.assign(params, this.query), this.treeDeptId).then(res => {
      //   const data = res.data.data;
      //   this.page.total = data.total;
      //   this.data = data.records;
      //   this.loading = false;
      //   this.selectionClear();
      // });
    },
    handleExport() {
      this.$confirm('是否导出用户数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        //   window.open(`/api/blade-user/export-user?${this.website.tokenHeader}=${getToken()}&account=${this.search.account}&realName=${this.search.realName}`);
      })
    },
    getView(row) {
      this.dialogControl.dialogCmpt = 'HisTable'
      this.dialogControl.dialogTitle = ''
      this.dialogControl.dialogVisible = true
      this.openDialog(0.4, 0.6)
    },
    getRowData(row) {
      this.visible = !this.visible
      this.detailData = row
    },
    closeD(v) {
      this.visible = v
    },
    openDialog(w = 0.6, h = 0.8) {
      const offSet = getOffsetAndSize(w, h)
      this.dialogControl.x = offSet[0]
      this.dialogControl.y = offSet[1]
      this.dialogControl.w = offSet[2]
      this.dialogControl.h = offSet[3]
    },
  },
}
</script>
<style lang="less" scoped>
:deep(.avue-crud__menu) {
  min-height: 0px !important;
}

.exportBtn {
  font-size: 14px;
  font-weight: 400;
  color: #1677ee;
  border: 1px solid #1677ee;
}

:deep(.el-table) {
  font-size: 14px !important;
}
</style>