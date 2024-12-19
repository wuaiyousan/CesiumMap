<!--
 * @Author: duanlian
 * @Date: 2023-04-24 14:16:33
 * @LastEditors: duanlian
 * @LastEditTime: 2023-04-24 14:53:20
 * @Description: 
-->
<template>
  <div class="hisTable">
    <avue-crud :option="option" :page.sync="page" :data="data" class="table" @current-change="currentChange"
      @size-change="sizeChange">
      <template slot-scope="{row}" slot="con">
        <el-tag type="danger" size="small">{{row.con}}</el-tag>
      </template>
    </avue-crud>
  </div>
</template>

<script>
export default {
  data() {
    return {
      page: {
        currentPage: 1,
        pageSize: 10,
        total: 2,
      },
      data: [
        {
          time: '2023-01-31 09:10:00',
          con: '低于保证水位',
          zhibiao: '水位（m）',
          jiancezhi: '-0.122',
          yuzhi: 'x<0.000',
        },
        {
          time: '2023-01-31 09:10:00',
          con: '低于保证水位',
          zhibiao: '水位（m）',
          jiancezhi: '-0.122',
          yuzhi: 'x<0.000',
        },
      ],
      option: {
        menu: false,
        // height: 'auto',
        searchLabelWidth: 80,
        calcHeight: 80,
        tip: false,
        border: true,
        viewBtn: false,
        header: false,
        column: [
          {
            label: '报警时间',
            prop: 'time',
          },
          {
            label: '报警内容',
            prop: 'con',
            slot: true,
          },
          {
            label: '报警指标',
            prop: 'zhibiao',
          },
          {
            label: '监测值',
            prop: 'jiancezhi',
          },
          {
            label: '阈值',
            prop: 'yuzhi',
          },
        ],
      },
    }
  },
}
</script>

<style lang="less" scoped>
.hisTable {
  position: relative;
  width: 100%;
  height: 100%;
  .table {
    height: 100%;
  }
}
</style>