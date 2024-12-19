<!--
 * @Author: duanlian
 * @Date: 2023-04-17 15:27:42
 * @LastEditors: duanlian
 * @LastEditTime: 2023-04-26 16:52:34
 * @Description: 
-->
<template>
  <div class="orderInfo">
    <div class="pageSearch">
      <el-form :model="form" label-width="70px" size="small" inline>
        <el-form-item label="任务名称">
          <el-select v-model="form.taskName" clearable style="width:120px">
            <el-option v-for="item in taskNameList" :key="item.value" :label="item.label"
              :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工单类别">
          <el-select v-model="form.taskType" clearable style="width:120px">
            <el-option v-for="item in taskTypeList" :key="item.value" :label="item.label"
              :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务状态">
          <el-select v-model="form.taskStatus" clearable style="width:120px">
            <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="执行人">
          <el-input v-model="form.executor" placeholder="执行人" style="width:130px"></el-input>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-select v-model="form.bgtime" clearable style="width:120px">
            <el-option label="近一周" value="week"></el-option>
            <el-option label="近一月" value="month"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button type="primary" @click="onSubmit">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table">
      <el-table :data="tableData" stripe style="width: 100%" class="table-box" header-cell-class-name="alarmRankList">
        <el-table-column type="index" label="序号" align='center' width="50"></el-table-column>
        <el-table-column prop="oid" label="工单编号" align='center'></el-table-column>
        <el-table-column label="工单来源">
          <template slot-scope="{row}">
            <span v-if="row.taskType == 1">巡检工单</span>
            <span v-else-if="row.taskType == 2">报警工单</span>
          </template>
        </el-table-column>
        <el-table-column label="任务状态" align='center' width="90">
          <template slot-scope="{row}">
            <span v-if="row.status == 1">待指派</span>
            <span v-else-if="row.status == 2">待执行</span>
            <span v-else-if="row.status == 3">执行中</span>
            <span v-else-if="row.status == 4">待审核</span>
            <span v-else-if="row.status == 5">已完成</span>
          </template>
        </el-table-column>
        <el-table-column prop="executor" label="节点执行人" align='center' show-overflow-tooltip></el-table-column>
        <el-table-column prop="bgtime" label="工单开始时间"></el-table-column>
        <el-table-column prop="endtime" label="实际结束时间"></el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="{row}">
            <span>详情</span>
            <span v-if="row.status != 4 && row.status != 5"> | 改派 </span>
            <span v-if="row.status == 4"> | 审核 </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pages">
      <el-pagination background @current-change="handlePageChange" :current-page="page.currentPage"
        :page-size="page.pageSize" layout="total, prev, pager, next" :total="page.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderInfo',
  data() {
    return {
      search: {},
      form: {
        taskName: '',
        taskType: '',
        taskStatus: '',
        executor: '',
        bgtime: '',
      },
      taskNameList: [
        { label: '河道', value: 1 },
        { label: '水库', value: 2 },
        { label: '湖泊', value: 3 },
        { label: '水厂', value: 4 },
        { label: '管网', value: 5 },
      ],
      taskTypeList: [
        { label: '巡检工单', value: 1 },
        { label: '报警工单', value: 2 },
      ],
      statusList: [
        { label: '待指派', value: 1 },
        { label: '待执行', value: 2 },
        { label: '执行中', value: 3 },
        { label: '待审核', value: 4 },
        { label: '已完成', value: 5 },
      ],
      // loading: true,
      page: {
        total: 10,
        currentPage: 1,
        pageSize: 10,
      },
      tableData: [
        {
          bgtime: '2023-02-14 10:00:00',
          oid: 'XJ0001',
          taskType: '1',
          status: '3',
          executor: 'xxx',
          threshold: 'x>0.300',
          endtime: '',
        },
        {
          bgtime: '2023-02-14 10:00:00',
          oid: 'bjgd0001',
          taskType: '2',
          status: '2',
          executor: '管理员',
          endtime: '',
        },
        {
          bgtime: '2023-02-14 10:00:00',
          oid: 'XJ0001',
          taskType: '2',
          status: '4',
          executor: '汪应宏',
          threshold: '2023-01-12 19:40:20',
          endtime: '',
        },
      ],
      visible: false,
      detailData: {},
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
    onLoad(page, params = {}) {},
    handleExport() {
      this.$confirm('是否导出用户数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        //   window.open(`/api/blade-user/export-user?${this.website.tokenHeader}=${getToken()}&account=${this.search.account}&realName=${this.search.realName}`);
      })
    },
    getRowData(row) {
      this.visible = !this.visible
      this.detailData = row
    },
    closeD(v) {
      this.visible = v
    },
  },
}
</script>

<style lang="less" scoped>
.orderInfo {
  position: relative;
  width: 100%;
  height: 100%;
  .table {
    height: calc(100% - 100px);
    .table-box {
      width: 100%;
      height: 100%;
    }
  }
  .pages {
    display: flex;
    justify-content: flex-end;
  }
}
</style>