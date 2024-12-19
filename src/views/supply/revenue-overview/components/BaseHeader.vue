<!--
 * @Author: fishScola
 * @Date: 2022-04-28 15:38:06
 * @LastEditors: fishScola
 * @LastEditTime: 2022-07-16 14:26:49
 * @Description: BasePanel
-->
<template>

    <div class="header">
      <div class="header-box"></div>
      <div class="left" v-if="$slots.headerLeft">
        <slot name="headerLeft"></slot>
      </div>
      <div class="right" v-if="$slots.headerRight">
        <slot name="headerRight"></slot>
      </div>
    </div>
    <div class="content">
      <slot></slot>
    </div>
</template>
<style lang="less" scoped>

  .header {
    position: relative;
    width: 100%;


    .left {
      position: absolute;
      top: 0px;
      left: 57px;
      height: 29px;
      font-size: 21px;
      font-family: PingFangSC-Medium;
      font-weight: 500;
      color: #e1feff;
      line-height: 29px;
      letter-spacing: 4px;
    }

    .right {
      position: absolute;
      top: 20px;
      right: 20px;
    }
  }

  .content {
    padding: 20px;
    height: calc(~"100% - 58px");
  }

  &.no-header {
    .header {
      display: none;
    }

    .content {
      padding: 0;
      height: 100%;
    }
  }
</style>
