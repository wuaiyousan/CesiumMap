<template>
  <transition-group name="dialog-fade">
    <div :key="'mask'" v-show="visible && modal" class="drag-stretch-dialog-mask" :style="{ zIndex: z }"></div>
    <vue-draggable-resizable
      :ref="'dragDialog'"
      :key="'content'"
      v-show="visible"
      v-bind="$props"
      v-on="$listeners"
      :class="{ 'drag-stretch-mask-dialog': modal }"
    >
      <div class="drag-stretch-dialog__header" :class="{ 'drag-stretch-dialog__header_mini': isMinimize }">
        <div class="drag-stretch-dialog__title">
          <!-- <img :src="require('@/_images/icon-title.png')" alt="" /> -->
          <b>{{ caption }}</b>
        </div>
        <span v-if="isShowMin && !isMinimize" @click="setMinimize">
          <i class="el-icon-minus" />
        </span>
        <span v-if="showMax && !isFullScreen && !isMinimize" @click="setFullScreen">
          <i class="el-icon-full-screen" />
        </span>
        <span v-if="isMinimize || isFullScreen" @click="setRestore">
          <i class="el-icon-copy-document" />
        </span>
        <span @click="close">
          <i class="el-icon-close" />
        </span>
      </div>
      <div class="drag-stretch-dialog__body" :class="$slots.footer ? 'has-footer' : ''">
        <slot></slot>
      </div>
      <div class="drag-stretch-dialog__footer" v-if="$slots.footer">
        <slot name="footer"></slot>
      </div>
      <iframe frameborder="0" marginheight="0" marginwidth="0" class="maskIfrm" src="about:blank"></iframe>
    </vue-draggable-resizable>
  </transition-group>
</template>

<script>
import VueDraggableResizable from './vue-draggable-resizable/index.vue'

export default {
  name: 'DragStretchDialog',
  props: {
    ...VueDraggableResizable.props,
    // 覆盖原属性的默认值
    className: {
      type: String,
      default: 'drag-stretch-dialog'
    },
    classNameHandle: {
      type: String,
      default: 'drag-stretch-handle'
    },
    active: {
      type: Boolean,
      default: true
    },
    preventDeactivation: {
      type: Boolean,
      default: true
    },
    disableUserSelect: {
      type: Boolean,
      default: false
    },
    z: {
      type: [String, Number],
      default: '100',
      validator: val => (typeof val === 'string' ? val === 'auto' : val >= 0)
    },
    // 新增属性
    caption: {
      type: String,
      default: ''
    },
    showMin: {
      type: Boolean,
      default: true
    },
    showMax: {
      type: Boolean,
      default: false
    },
    visible: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: ''
    },
    modal: {
      // 是否显示遮罩层
      type: Boolean,
      default: true
    },
    // 最小化 后完全隐藏。适用于自定义最小化后事件的情况，比如大屏
    allHiden: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isShowMin() {
      // 显示遮罩层时 最小化按钮属性无效，并隐藏最小化按钮
      return !this.modal && this.showMin
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.$emit('open')
        // this.$el.addEventListener('scroll', this.updatePopper)
        this.$nextTick(() => {
          // this.$refs.dragDialog.scrollTop = 0
        })
        // document.body.appendChild(this.$el)
      } else {
        // this.$el.removeEventListener('scroll', this.updatePopper)
        this.$emit('close')
      }
    }
  },
  data() {
    return {
      isFullScreen: false,
      isMinimize: false,
      currentX: this.x,
      currentY: this.y,
      currentWidth: this.w,
      currentHeight: this.h
    }
  },
  components: {
    VueDraggableResizable
  },
  methods: {
    setMinimize() {
      this.isMinimize = true
      this.recordCurrenState()
      // this.$el.classList.add('drag-stretch-dialog__minmize')

      this.updateState(
        // (document.getElementsByClassName('drag-stretch-dialog__minmize').length - 1) * 170,
        10,
        document.documentElement.clientHeight - 50,
        160,
        40
      )

      this.$el.getElementsByClassName('drag-stretch-dialog__body')[0].style.display = 'none'
      if (this.$el.getElementsByClassName('drag-stretch-dialog__footer').length) {
        this.$el.getElementsByClassName('drag-stretch-dialog__footer')[0].style.display = 'none'
      }
      if (this.allHiden) {
        this.$el.style.display = 'none'
      }

      this.$emit('minimize', this.currentX, this.currentY, this.currentWidth, this.currentHeight)
    },
    setFullScreen() {
      if (this.allHiden) {
        this.$el.style.display = 'block'
      }
      this.isFullScreen = true
      this.recordCurrenState()
      this.updateState(0, 0, document.documentElement.clientWidth, document.documentElement.clientHeight)
      this.$emit('fullScreen', this.currentX, this.currentY, this.currentWidth, this.currentHeight)
    },
    setRestore() {
      if (this.allHiden) {
        this.$el.style.display = 'block'
      }
      if (this.isFullScreen) this.isFullScreen = false
      if (this.isMinimize) {
        this.isMinimize = false
        // this.$el.classList.remove('drag-stretch-dialog__minmize')
        this.$el.getElementsByClassName('drag-stretch-dialog__body')[0].style.display = 'block'
        if (this.$el.getElementsByClassName('drag-stretch-dialog__footer').length) {
          this.$el.getElementsByClassName('drag-stretch-dialog__footer')[0].style.display = 'block'
        }
      }
      this.updateState(this.currentX, this.currentY, this.currentWidth, this.currentHeight)

      this.$emit('restore')
    },
    recordCurrenState() {
      this.currentX = parseInt(this.$refs.dragDialog.style.left.replace('px', ''))
      this.currentY = parseInt(this.$refs.dragDialog.style.top.replace('px', ''))
      this.currentWidth = parseInt(this.$refs.dragDialog.style.width.replace('px', ''))
      this.currentHeight = parseInt(this.$refs.dragDialog.style.height.replace('px', ''))
    },
    updateState(x, y, w, h) {
      // 注意：在父组件中传递以下几个值时，必须加上sync修饰符
      this.$emit('update:x', x)
      this.$emit('update:y', y)
      this.$emit('update:w', w)
      this.$emit('update:h', h)
    },
    updatePopper() {
      // TODO 下拉框的相关处理 可参考element-ui dialog
      // this.broadcast('ElSelectDropdown', 'updatePopper')
      // this.broadcast('ElDropdownMenu', 'updatePopper')
    },
    close() {
      this.$emit('update:visible', false)
      this.$emit('close', this.id)
    }
  },
  mounted() {
    // add DOM node to body
    document.body.appendChild(this.$el)
  },
  destroyed() {
    // remove DOM node after destroy
    if (this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el)
    }
  }
}
</script>

<style lang="less" scoped>
.maskIfrm {
  position: absolute;
  visibility: inherit;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  z-index: -1;
  filter: alpha(opacity=0);
}
.drag-stretch-dialog-mask {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
  background: rgba(0, 0, 0, 0.5);
}
.drag-stretch-mask-dialog {
  /*box-shadow: none !important;*/
  /*border: none !important;*/
  box-shadow: 0px 2px 8px 0px rgba(51, 128, 243, 0.2);
  border-radius: 10px;
}
.drag-stretch-dialog {
  /*box-shadow: 0px 0px 10px #888;*/
  box-shadow: 0px 2px 8px 0px rgba(51, 128, 243, 0.2);
  border-radius: 10px;
  touch-action: none;
  /*border: 1px solid #cccccc;*/
  /*border-radius: 5px;*/
  outline: none;
  .drag-stretch-dialog__header {
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #e4e4e4;
    color: #ffffff;
    font-size: 20px;
    border-radius: 10px 10px 0 0;
    .drag-stretch-dialog__title {
      border-radius: 10px 10px 0 0;
      position: absolute;
      padding-left: 10px;
      font-weight: 400;
      /*display: inline-block;*/
      width: 100%;
      cursor: move;
      display: flex;
      height: 50px;
      justify-content: flex-start;
      align-items: center;
      background-color: #1677FF;
      img {
        width: 39px;
      }
      b {
        margin-left: 4px;
        font-weight: 500;
      }
    }
    span {
      position: absolute;
      cursor: pointer;
    }
    span:nth-last-of-type(3) {
      right: 62px;
    }
    span:nth-last-of-type(2) {
      right: 36px;
    }
    span:nth-last-of-type(1) {
      right: 10px;
    }
  }
  .drag-stretch-dialog__header_mini {
    height: 39px;
    line-height: 39px;
  }
  .drag-stretch-dialog__body {
    width: 100%;
    height: calc(100% - 50px);
    padding: 10px 5px;
    overflow-y: hidden;
    background: #ffffff;
    border-radius: 0 0 10px 10px;
  }
  .has-footer {
    height: calc(100% - 120px);
  }
  .drag-stretch-dialog__footer {
    height: 60px;
    line-height: 60px;
    text-align: center;
  }
}
.dialog-fade-enter-active {
  -webkit-animation: dialog-fade-in 0.3s;
  animation: dialog-fade-in 0.3s;
}
.dialog-fade-leave-active {
  -webkit-animation: dialog-fade-out 0.3s;
  animation: dialog-fade-out 0.3s;
}
@-webkit-keyframes dialog-fade-in {
  0% {
    -webkit-transform: translate3d(0, -20px, 0);
    transform: translate3d(0, -20px, 0);
    opacity: 0;
  }
  100% {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}
@keyframes dialog-fade-in {
  0% {
    -webkit-transform: translate3d(0, -20px, 0);
    transform: translate3d(0, -20px, 0);
    opacity: 0;
  }
  100% {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}
@-webkit-keyframes dialog-fade-out {
  0% {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
  100% {
    -webkit-transform: translate3d(0, -20px, 0);
    transform: translate3d(0, -20px, 0);
    opacity: 0;
  }
}
@keyframes dialog-fade-out {
  0% {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
  100% {
    -webkit-transform: translate3d(0, -20px, 0);
    transform: translate3d(0, -20px, 0);
    opacity: 0;
  }
}
</style>
<style>
.drag-stretch-handle {
  box-sizing: border-box;
  position: absolute;
  /* background: #eee;
  border: 1px solid #333; */
}
.drag-stretch-handle-tl {
  top: -3px;
  left: -3px;
  cursor: nw-resize;
  width: 10px;
  height: 10px;
}
.drag-stretch-handle-tm {
  top: -3px;
  height: 6px;
  width: calc(100% - 10px);
  margin-left: 5px;
  cursor: n-resize;
}
.drag-stretch-handle-tr {
  top: -3px;
  right: -3px;
  cursor: ne-resize;
  height: 10px;
  width: 10px;
}
.drag-stretch-handle-ml {
  left: -3px;
  width: 6px;
  height: calc(100% - 10px);
  margin-top: 5px;
  cursor: w-resize;
}
.drag-stretch-handle-mr {
  right: -3px;
  width: 6px;
  height: calc(100% - 10px);
  margin-top: 5px;
  cursor: e-resize;
}
.drag-stretch-handle-bl {
  bottom: -3px;
  left: -3px;
  cursor: sw-resize;
  height: 10px;
  width: 10px;
}
.drag-stretch-handle-bm {
  bottom: -3px;
  height: 6px;
  width: calc(100% - 10px);
  margin-left: 5px;
  cursor: s-resize;
}
.drag-stretch-handle-br {
  bottom: -3px;
  right: -3px;
  cursor: se-resize;
  height: 10px;
  width: 10px;
}
</style>
