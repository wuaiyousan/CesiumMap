<!--
 * @Author: fishScola
 * @Date: 2022-04-25 11:09:09
 * @LastEditors: fishScola
 * @LastEditTime: 2022-06-10 16:52:31
 * @Description: PanelContainer
-->
<template>
  <div
    class="component-wrapper panel-container"
    :class="{ movable: movable, isDown: isDown }"
  >
    <div class="panel-title" @mousedown="onDown" ref="panelTilteRef">
      <div class="title-text">{{ showTitle }}</div>
      <span class="panel-closer" :title="panelCloserTitle" @click.stop="hidePanel">
        <svg-icon class="switcher-icon" name="close"></svg-icon>
      </span>
    </div>
    <div class="panel-content">
      <div class="content-wrapper">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script>
import { PreventQuick } from "@/utils/index.js";
export default {
  name: "PanelContainer",
  props: {
    panelParams: {
      type: Object,
      default: function () {
        return {
          panelTitle: "--",
        };
      },
    },
    // 关闭按钮提示
    panelCloserTitle: {
      type: String,
      default: function () {
        return "关闭";
      },
    },
    // 是否可移动
    movable: {
      type: Boolean,
      default: function () {
        return false;
      },
    },
  },
  data() {
    return {
      showTitle: "",
      // 鼠标按下标志
      isDown: false,
    };
  },
  watch: {
    panelParams: function (newVal) {
      this.showTitle = newVal.panelTitle || "--";
    },
  },
  created() {
    this.showTitle = this.panelParams.panelTitle;
  },
  methods: {
    updatePanel({ toTitle }) {
      this.showTitle = toTitle;
    },
    hidePanel() {
      if (PreventQuick.isClickable({ name: "panel-container-hide" })) {
        this.$emit("panel-hidden");
        this.resetMove();
      }
    },
    resetMove() {
      window.setTimeout(() => {
        if (this.movable) {
          let toRef = this.$refs.panelTilteRef;
          let panelEle = (toRef && toRef.parentElement) || null;
          if (panelEle) {
            panelEle.style.left = "";
            panelEle.style.top = "";
          }
        }
      }, 600);
    },
    // 按住鼠标，拖拽面板
    onDown(event) {
      if (!this.movable) {
        return;
      }
      let panelEle = this.$refs.panelTilteRef.parentElement;
      let panelParentEle = panelEle.parentElement;
      let outterDx = panelParentEle.clientWidth - panelEle.clientWidth;
      let outterDy = panelParentEle.clientHeight - panelEle.clientHeight;

      let innerDx = event.clientX - panelEle.offsetLeft;
      let innerDy = event.clientY - panelEle.offsetTop;

      // 鼠标按下
      this.isDown = true;

      document.onmousemove = (evt) => {
        if (this.isDown) {
          // 分别处理水平和竖直方向上
          let left = evt.clientX - innerDx;
          left < 0 && (left = 0);
          left > outterDx && (left = outterDx);
          let top = evt.clientY - innerDy;
          top < 0 && (top = 0);
          top > outterDy && (top = outterDy);
          panelEle.style.left = left + "px";
          panelEle.style.top = top + "px";
        }
      };
      document.onmouseup = () => {
        document.onmousemove = null;
        document.onmouseup = null;
        this.isDown = false;
      };
    },
  },
};
</script>
<style lang="less">
.component-wrapper.panel-container {
  position: relative;
  width: 100%;
  height: 100%;
  background: @panelBgColor;

  &.movable {
    .panel-title {
      cursor: move;
    }
  }

  &.isDown {
    background: @panelBgColorOnHover;
  }

  .panel-title {
    display: flex;
    align-items: center;
    padding-left: 16px;
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #cdcdcd;
    user-select: none;

    .title-text {
      width: calc(~"100% - 40px");
      font-size: 16px;
      color: #fff;
    }

    .panel-closer {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 100%;
      font-size: 20px;
      cursor: pointer;

      &:hover {
        font-size: 22px;
      }
    }
  }

  .panel-content {
    padding: 4px 4px 6px 6px;
    height: calc(~"100% - 40px");

    .content-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
    }
  }

  // vuescroll样式异常
  .__vuescroll.hasHBar {
    .__panel {
      overflow-x: hidden !important;
    }
  }
}
</style>
