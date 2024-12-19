<template>
  <el-drawer :title="detailData.workOrder + '工单详情'" size="400px" :visible.sync="visible" :before-close="handleClose"
    :modal-append-to-body="false" :append-to-body="true">
    <el-timeline v-for="(activities, index) in allList ">
      <el-timeline-item v-for="(activity, index) in activities" :key="index" icon="#1677ff" placement="top"
        :type="activity.type" :color="activity.timestamp ? '#fff' : ''" :size="activity.size"
        :timestamp="activity.timestamp" :hide-timestamp="!activity.timestamp" :class="activity.timestamp?'hasColor':''">
        <div class="tags">
          <div v-for="it in activity.handlerTags" v-if="activity.handlerTags.length">
            <el-tag
              :type="it.status == 'finished' ? 'success' : it.status == 'pending' ? '' : it.status == 'reject' ? 'warning' : ''"
              size="mini" class="tagsItem"
              v-if="activity.content.type != 'mp3' && activity.content.type != 'img'">{{ it.label }}
            </el-tag>
          </div>
        </div>
        <div v-if="activity.content.label" class="label">{{ activity.content.label }}:</div>
        <div v-if="activity.content.value && activity.content.type != 'mp3' && activity.content.type != 'img'"
          class="text">
          {{ activity.content.value }}</div>
        <div v-if="activity.content.type == 'mp3'" style="margin-top: 16px;">
          <!-- <aplayer class="play" :music="activity.content.value[0]" listFolded :list="activity.content.value">
                    </aplayer> -->
          <audio :src="activity.content.value[0]"></audio>
        </div>
        <div v-if="activity.content.type == 'img'" class="imgWrap">
          <div v-for="item in activity.content.value">
            <el-image v-if="item" style="width: 100px; height: 100px" :src="item"></el-image>
          </div>
        </div>
      </el-timeline-item>
    </el-timeline>
  </el-drawer>
</template>
<script>
// import aplayer from "vue-aplayer";
export default {
  name: 'drawer',
  components: {
    // aplayer
  },
  props: {
    visible: {
      type: Boolean,
      default: function () {
        return false
      },
    },
    detailData: {
      type: Object,
      default: function () {
        return {}
      },
    },
  },
  data() {
    return {
      allList: [
        [
          {
            content: {
              label: '驳回理由',
              value:
                '因为不合规矩因为不合规矩因为不合规矩因为不合规矩因为不合规矩因为不合规矩因为不合规矩因为不合规矩因为不合规矩',
            },
            timestamp: '2018-04-03 20:46',
            handlerTags: [
              {
                label: '已完成',
                status: 'finished',
              },
              {
                label: '审核通过',
                status: 'finished',
              },
            ],
          },
          {
            content: {
              label: '处置措施',
              value:
                '都来加班都来加班都来加班都来加班都来加班都来加班都来加班都来加班都来加班都来加班都来加班都来加班都来加班都来加班',
            },
            timestamp: '2018-04-03 20:46',
            handlerTags: [
              {
                label: '待审核',
                status: 'pending',
              },
            ],
          },
          {
            content: {
              label: '音频描述',
              value: [
                {
                  title: '水表炸了',
                  artist: '老李',
                  url: 'https://img.tukuppt.com/newpreview_music/09/00/73/5c8948aa510b887278.mp3',
                },
                {
                  url: 'https://img.tukuppt.com/newpreview_music/08/98/97/5c88d1262d69915154.mp3',
                },
              ],
              type: 'mp3',
            },
            // timestamp: '2018-04-03 20:46'
          },
          {
            content: {
              label: '图片描述',
              value: [
                'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
                'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
                'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
                'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
                'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
                'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
                'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
                'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
                'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
              ],
              type: 'img',
            },
            // timestamp: '2018-04-03 20:46'
          },
          {
            content: {
              label: '驳回理由',
              value:
                '因为不合规矩因为不合规矩因为不合规矩因为不合规矩因为不合规矩因为不合规矩因为不合规矩因为不合规矩因为不合规矩',
            },
            timestamp: '2018-04-03 20:46',
            handlerTags: [
              {
                label: '已完成',
                status: 'finished',
              },
              {
                label: '审核通过',
                status: 'finished',
              },
            ],
          },
          {
            content: {
              label: '处置措施',
              value:
                '都来加班都来加班都来加班都来加班都来加班都来加班都来加班都来加班都来加班都来加班都来加班都来加班都来加班都来加班',
            },
            timestamp: '2018-04-03 20:46',
            handlerTags: [
              {
                label: '待审核',
                status: 'pending',
              },
            ],
          },
          {
            content: {
              label: '音频描述',
              value: [
                {
                  title: '水表炸了',
                  artist: '老李',
                  url: 'https://img.tukuppt.com/newpreview_music/09/00/73/5c8948aa510b887278.mp3',
                },
                {
                  url: 'https://img.tukuppt.com/newpreview_music/08/98/97/5c88d1262d69915154.mp3',
                },
              ],
              type: 'mp3',
            },
            // timestamp: '2018-04-03 20:46'
          },
          {
            content: {
              label: '图片描述',
              value: [
                'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
                'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
                'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
                'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
                'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
                'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
                'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
                'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
                'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
              ],
              type: 'img',
            },
            // timestamp: '2018-04-03 20:46'
          },
        ],
        [
          {
            content: {
              label: '驳回理由',
              value:
                '因为不合规矩因为不合规矩因为不合规矩因为不合规矩因为不合规矩因为不合规矩因为不合规矩因为不合规矩因为不合规矩',
            },
            timestamp: '2018-04-03 20:46',
            handlerTags: [
              {
                label: '审核驳回',
                status: 'reject',
              },
              {
                label: '执行中',
                status: 'pending',
              },
            ],
          },
          {
            content: {
              label: '处置措施',
              value:
                '都来加班都来加班都来加班都来加班都来加班都来加班都来加班都来加班都来加班都来加班都来加班都来加班都来加班都来加班',
            },
            timestamp: '2018-04-03 20:46',
            handlerTags: [
              {
                label: '待审核',
                status: 'pending',
              },
            ],
          },
          {
            content: {
              label: '音频描述',
              value: [
                {
                  title: '水表炸了',
                  artist: '老李',
                  url: 'https://img.tukuppt.com/newpreview_music/09/00/73/5c8948aa510b887278.mp3',
                },
                {
                  url: 'https://img.tukuppt.com/newpreview_music/08/98/97/5c88d1262d69915154.mp3',
                },
              ],
              type: 'mp3',
            },
            timestamp: '2018-04-03 20:46',
          },
          {
            content: {
              label: '图片描述',
              value: [
                'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
                'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
                'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
              ],
              type: 'img',
            },
            timestamp: '2018-04-03 20:46',
          },
        ],
      ],
    }
  },
  methods: {
    handleClose() {
      this.$emit('closeD', false)
    },
    // handleBeforePlay(next) {
    //     next()
    // }
  },
}
</script>
<style lang="less" scoped>
:deep( .el-drawer__header > :first-child) {
  font-size: 18px;
  font-family: PingFang SC, PingFang SC-Medium;
  font-weight: 500;
  color: #333333;
}

:deep( .el-drawer__header) {
  padding: 16px;
  background: rgba(53, 195, 255, 0.05);
}

:deep( .el-drawer__body) {
  overflow: hidden;
  overflow-y: auto;
}

.tags {
  position: absolute;
  left: 150px;
  top: 3px;
  display: flex;

  .tagsItem {
    margin-left: 4px;
  }
}

.label {
  font-size: 16px;
  font-family: PingFang SC, PingFang SC-Medium;
  font-weight: 500;
  color: #000;
}

.text {
  padding-top: 10px;
}

.imgWrap {
  padding-top: 10px;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}

:deep( .aplayer .aplayer-body) {
  flex-direction: row-reverse !important;
}

:deep( .aplayer .aplayer-icon-mode),
:deep( .aplayer .aplayer-icon-volume-down),
:deep(.aplayer-icon-menu),
:deep( .aplayer .aplayer-music) {
  display: none;
}

:deep( .aplayer-pic) {
  height: 40px;
  width: 40px;
  background-image: none;
}

:deep( .aplayer-pic .aplayer-pause) {
  width: 26px;
  height: 26px;
  border: 2px solid #fff;
  bottom: 50%;
  right: 50%;
  margin: 0 -15px -15px 0;
}

:deep( .aplayer-pic .aplayer-pause .aplayer-icon-pause) {
  height: 22px;
  width: 20px;
}

:deep( .aplayer) {
  background: rgba(74, 144, 226, 0.05);
  border-radius: 25px;
}

:deep(.aplayer .aplayer-body .aplayer-info ){
  padding: 12px;
  height: 100%;
  border-bottom: none;
}

:deep(.el-timeline-item__node) {
  background-color: transparent;
}
.hasColor :deep(.el-timeline-item__node) {
  border: 2px solid #1677ff;
}

:deep(.el-timeline) {
  padding: 0 20px;
}

:deep(.el-timeline-item) {
  padding-bottom: 4px;
}
:deep(.el-timeline-item__node--normal) {
  width: 8px;
  height: 8px;
}
</style>