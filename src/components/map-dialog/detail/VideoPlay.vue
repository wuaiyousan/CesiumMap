<!--
 * @Author: duanlian
 * @Date: 2023-04-18 10:09:45
 * @LastEditors: wangzhipeng
 * @LastEditTime: 2023-06-14 17:49:00
 * @Description: 
-->
<template>
  <div class="videoPlay">
    <div class="left-tree">
      <div class="tree">
        <el-scrollbar
          style="height: 100%"
          :native="false"
          :noresize="false"
          wrapStyle="overflow-x:hidden;background:transparent;padding-right;15px"
        >
          <li v-for="video in videoList" :key="video">
            <div class="video-name">{{ video.name }}</div>
          </li>
        </el-scrollbar>
      </div>
    </div>
    <div class="play-box">
      <div class="control">
        <div class="labelName">默认视图：</div>
        <div class="btns">
          <div
            v-for="(item, index) in crlList"
            :key="index"
            class="span"
            :class="[item.icon, { active: activeCrl == index }]"
            @click="changeCrl(item, index)"
          ></div>
        </div>
      </div>
      <div class="video-box">
        <div
          class="warp"
          v-for="video in videoList"
          :key="video"
          :style="liveStyle"
        >
          <div class="iner-warp">
            <div class="head">
              <h3>{{ video.name }}</h3>
            </div>
            <div class="panel">
              <video-panel
                :key="`video-${video.name}`"
                :params="{ url: video.flv }"
              ></video-panel>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VideoPanel from '../../VideoPanel.vue'
import { stationDetail } from '@/api/map/mapDetail.js'
import axios from 'axios'
const videoBase = 'http://106.60.9.184:9007/video/v1/play/video_play'

export default {
  name: 'videoPlay',

  components: { VideoPanel },

  props: {
    // 测站数据
    params: {
      type: Object,
      default: () => null,
    },
  },

  data() {
    return {
      stationName: '', // 测站名称
      videoList: [], //视频列表
      activeCrl: 0,
      treeList: [
        {
          id: 1,
          name: '101教室',
          showChild: false,
          children: [
            {
              id: 11,
              name: '1#电梯摄像头',
              status: 1,
            },
            {
              id: 12,
              name: '2#电梯摄像头',
              status: 2,
            },
          ],
        },
        {
          id: 2,
          name: '102教室',
          showChild: false,
          children: [
            {
              id: 21,
              name: '1#电梯摄像头',
              status: 1,
            },
            {
              id: 22,
              name: '2#电梯摄像头',
              status: 2,
            },
          ],
        },
      ],
      flvs: [],
      spilt: 1,
      crlList: [
        { name: '全屏', icon: 'el-icon-full-screen', value: 1 },
        { name: '4分屏', icon: 'el-icon-menu', value: 4 },
        { name: '9分屏', icon: 'el-icon-s-grid', value: 9 },
      ],
    }
  },

  async mounted() {
    await this.getVideos()
  },

  computed: {
    liveStyle() {
      let style = { width: '99%', height: '49%' }
      switch (this.activeCrl) {
        case 0:
          style = { width: '100%', height: '100%' }
          break
        case 1:
          style = { width: '48%', height: '49%' }
          break
        case 2:
          style = { width: '31%', height: '32%' }
          break
      }
      return style
    },
  },

  methods: {
    changeCrl(item, index) {
      this.activeCrl = index
      this.spilt = item.value
    },

    async getVideos() {
      //   const self = this
      const { id: stationId, stationName } = this.params
      this.stationName = stationName
      await stationDetail({ stationId }).then((res) => {
        const data = res.data.data
        this.videoList = data.videoList.map((v) => ({
          name: v.name,
          guid: v.guid,
          flv: '',
        }))
        // 获取视频flv地址
        this.videoList.forEach((v) => {
          axios
            .get(videoBase, {
              params: {
                guid: v.guid,
              },
              headers: {
                'Access-Control-Allow-Origin': '*',
              },
            })
            .then((res) => {
              v.flv = res.data.data.flv
            })
        })
      })
    },
  },
}
</script>

<style lang="less" scoped>
.videoPlay {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  .left-tree {
    width: 233px;
    height: calc(100% - 16px);
    // background: #f0f0f0;
    // box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
    padding: 8px 12px;
    .title {
      line-height: 40px;
      font-size: 16px;
      margin-left: 16px;
      color: #45505f;
      font-family: PingFang SC, PingFang SC-Medium;
      font-weight: 500;
    }
    .tree {
      height: calc(100% - 40px);
      box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
      margin-top: 35px;
      li {
        list-style-type: none;
        margin-left: 16px;
        margin: 8px 16px;
        .parent {
          display: flex;
          align-items: center;
          justify-content: space-between;
          .head {
            display: flex;
            align-items: center;
            i {
              margin-right: 10px;
              color: #666666;
            }
            .name {
              font-size: 14px;
              font-family: PingFang SC, PingFang SC-Regular;
              font-weight: 400;
              text-align: left;
              color: #000000;
            }
          }
          .icon {
            cursor: pointer;
          }
        }
        .child {
          margin-left: 26px;
          .child-list {
            height: 40px;
            display: flex;
            align-items: center;
            font-size: 14px;
            font-family: PingFang SC, PingFang SC-Regular;
            font-weight: 400;
            color: #999999;
            margin-right: 8px;
            .online {
              color: #52c41a;
            }
            .offline {
              color: #ff4d4f;
            }
          }
        }
      }
    }
  }
  .play-box {
    flex: 1;
    height: 100%;
    padding: 8px;
    .control {
      display: flex;
      align-items: center;
      .labelName {
        margin-right: 10px;
      }
      .btns {
        border: 1px solid #f5f5f5;
        display: flex;
        align-items: center;
        .span {
          cursor: pointer;
          font-size: 20px;
          padding: 6px 10px;
        }
        .active {
          color: #1677ee;
          background-color: #e8f4ff;
        }
      }
    }
    .video-box {
      display: flex;
      height: calc(100% - 50px);
      flex-wrap: wrap;
      .warp {
        padding: 4px 6px;
        .iner-warp {
          height: 100%;
          background: #e6e9eb;
          .head {
            h3 {
              line-height: 30px;
              margin-left: 8px;
              font-size: 12px;
              font-family: PingFang SC, PingFang SC-Regular;
              font-weight: 400;
              color: #6e7d93;
            }
          }
          .panel {
            margin: 0 8px;
            height: calc(100% - 38px);
          }
        }
      }
    }
  }
}
:deep( .el-scrollbar__view) {
  height: 90%;
}
</style>
