<template>
  <div class="engineering">
      <iframe :src="src"
            class="iframe"
            ref="iframe"></iframe>
  </div>
</template>

<script>
export default {
    name:'Engineering',
    data() {
        return {
            src:'http://47.108.170.157:9011/#/visual/board/preview?bid$=1648136789134139392'
        }
    }
}
</script>

<style lang="less" scoped>
.engineering{
    position: relative;
    width: 100%;
    height: 100%;
    overflow: auto;
    iframe{
        width: 100%;
        height: 100%;
    }
}
</style>