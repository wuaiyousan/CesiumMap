<!--
 * @Author: fishScola
 * @Date: 2022-04-28 15:38:06
 * @LastEditors: wangzhipeng
 * @LastEditTime: 2023-07-21 16:24:51
 * @Description: BasePanel
-->
<template>
  <div
    class="component-wrapper base-panel"
    :class="{ 'no-header': !($slots.headerLeft || $slots.headerRight) }"
  >
    <div class="header">
      <div class="left" v-if="$slots.headerLeft">
        <img src="../../../assets/img/supply/pageIcon.png" alt="" />
        <slot name="headerLeft"></slot>
      </div>
      <div class="right" v-if="$slots.headerRight">
        <slot name="headerRight"></slot>
      </div>
    </div>
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>
<style lang="less" scoped>
.base-panel {
  position: relative;
  width: @panelWidthLeft;
  height: 300px;
  border-radius: 10px;
  user-select: none;
  background: @panelBgColor;
  .header {
    position: relative;
    width: 100%;
    height: 58px;
    display: flex;
    align-items: center;
    background: url("@/assets/img/supply/pageTileBg.png") no-repeat;
    background-size: 100% 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0 55px 0 10px;
    .left {
      display: flex;
      flex-direction: row;
      align-items: center;
      font-size: @titleSize6;
      font-weight: 500;
      color: @font-color-light;
      letter-spacing: 4px;
      img {
        width: 28px;
        height: 33px;
        margin-right: 6px;
      }
    }
    .right {
      line-height: 58px;
    }
  }

  .content {
    padding: 20px;
    height: calc(~"100% - 58px");
    border: 1.43px solid;
    border-image: linear-gradient(
        270deg,
        rgba(5, 20, 37, 0.69) 0%,
        #539dff 51%,
        rgba(0, 0, 0, 0.68)
      )
      1.4307291507720947 1.4307291507720947;
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
}
</style>
