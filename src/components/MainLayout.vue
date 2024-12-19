<!--
 * @Author: fishScola
 * @Date: 2022-04-25 11:09:09
 * @LastEditors: fishScola
 * @LastEditTime: 2022-06-10 16:12:19
 * @Description: MainLayout
-->
<script setup>
import { PreventQuick } from "@/utils/index.js";

// 面板开关
const switcherObj = reactive({
  openLeft: true,
  openRight: false,
  openBottom: false,
});

function toggleLeft() {
  if (PreventQuick.isClickable({ name: "mainlayout-panel-left" })) {
    switcherObj.openLeft = !switcherObj.openLeft;
  }
}
function toggleRight() {
  if (PreventQuick.isClickable({ name: "mainlayout-panel-right" })) {
    switcherObj.openRight = !switcherObj.openRight;
  }
}
function toggleBottom(flag) {
  if (PreventQuick.isClickable({ name: "mainlayout-panel-bottom" })) {
    if (typeof flag === "boolean") {
      switcherObj.openBottom = flag;
    } else {
      switcherObj.openBottom = !switcherObj.openBottom;
    }
  }
}
</script>

<template>
  <div class="component-wrapper main-layout">
    <!-- title -->
    <div class="panel-title" v-if="$slots.mainTitle">
      <slot name="mainTitle"></slot>
    </div>
    <div class="panel-content" :class="{ 'no-title': !$slots.mainTitle }">
      <!-- main -->
      <slot></slot>
      <!-- left -->
      <div
        v-if="$slots.mainLeft"
        class="panel-left"
        :class="{ open: switcherObj.openLeft }"
      >
        <span class="panel-switcher" @click.stop="toggleLeft">
          <svg-icon
            class="switcher-icon"
            :name="switcherObj.openLeft ? 'arrow-left' : 'arrow-right'"
          ></svg-icon>
        </span>
        <slot name="mainLeft"></slot>
      </div>
      <!-- right -->
      <div
        v-if="$slots.mainRight"
        class="panel-right"
        :class="{ open: switcherObj.openRight }"
      >
        <span class="panel-switcher" @click.stop="toggleRight">
          <svg-icon
            class="switcher-icon"
            :name="switcherObj.openRight ? 'arrow-left' : 'arrow-right'"
          ></svg-icon>
        </span>
        <slot name="mainRight"></slot>
      </div>
      <!-- bottom -->
      <div
        v-if="$slots.mainBottom"
        class="panel-bottom"
        :class="{ open: switcherObj.openBottom }"
      >
        <span class="panel-switcher" @click.stop="toggleBottom">
          <svg-icon
            class="switcher-icon"
            :name="switcherObj.openBottom ? 'arrow-bottom' : 'arrow-top'"
          ></svg-icon>
        </span>
        <div class="bottom-content">
          <slot name="mainBottom"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.component-wrapper.main-layout {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .panel-title {
    width: 100%;
    height: 60px;
    background: #17317e;
  }
  .panel-content {
    position: relative;
    width: 100%;
    height: calc(~"100% - 60px");
    // color: #f2f2f2;

    &.no-title {
      height: 100%;
    }

    .panel-left {
      padding: 8px 16px 8px 8px;
      width: 316px;
      height: calc(~"100% - 240px");
      position: absolute;
      top: 0;
      left: -300px;
      z-index: 2;
      background: @panelBgColor;
      transition: left 0.6s ease-in-out;

      &.open {
        left: 0;
      }

      .panel-switcher {
        position: absolute;
        top: 0;
        right: 0;
        width: 16px;
        height: 100%;
        cursor: pointer;

        &:hover {
          background: @switcherOnHover;
        }

        .switcher-icon {
          position: absolute;
          top: 50%;
          right: 0;
          height: 16px;
          margin-top: -8px;
          font-size: 16px;
        }
      }
    }

    .panel-right {
      padding: 8px 8px 8px 16px;
      width: 316px;
      // height: 100%;
      height: calc(~"100% - 240px");
      position: absolute;
      top: 0;
      right: 0;
      z-index: 2;
      background: @panelBgColor;
      transition: right 0.6s ease-in-out;

      &.open {
        right: -300px;
      }

      .panel-switcher {
        position: absolute;
        top: 0;
        left: 0;
        width: 16px;
        height: 100%;
        cursor: pointer;

        &:hover {
          background: @switcherOnHover;
        }

        .switcher-icon {
          position: absolute;
          top: 50%;
          right: 0;
          height: 16px;
          margin-top: -8px;
          font-size: 16px;
        }
      }
    }

    .panel-bottom {
      padding-top: 16px;
      width: calc(~"100% - 640px");
      // width: 100%;
      height: 0;
      position: absolute;
      bottom: 0;
      // left: 0;
      left: 320px;
      z-index: 2;
      background: @panelBgColor;
      box-shadow: rgba(0, 0, 0, 0.7) 0px 4px 80px 0px inset;
      transition: height 0.6s ease-in-out;

      &.open {
        height: 240px;
      }

      .panel-switcher {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 16px;
        cursor: pointer;

        &:hover {
          background: @switcherOnHover;
        }

        .switcher-icon {
          position: absolute;
          top: 0;
          left: 50%;
          height: 16px;
          margin-left: -8px;
          font-size: 14px;
        }
      }

      .bottom-content {
        padding: 0 8px;
        height: calc(~"100% - 16px");
        overflow: hidden;
      }
    }
  }
}
</style>
