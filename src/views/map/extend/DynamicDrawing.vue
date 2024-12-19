<!--
 * @Author: xionghaiying
 * @Date: 2024-07-08 14:47:23
 * @LastEditors: xionghaiying
 * @LastEditTime: 2024-07-09 16:07:29
 * @Description: 所有动态加载图层，样式方法集合。专门针对外部数据对球体要素的操作
-->
<script setup>
  import UseGlobalMessage from '../../common/UseGlobalMessage';
  import UseDataSource from '../uses/UseDataSource';
  import UseEntity from '../uses/UseEntity';
  import boradImg from './../assets/images/borad.svg'

  const {
    doEventSubscribe,
    doEventSend,
  } = UseGlobalMessage();

  onMounted(() => {

  });

  onBeforeUnmount(() => {

  });

  doEventSubscribe("entity-billboard-change", entityBillboardChange);
  // 球体上已有当前对象
  function entityBillboardChange({list = [], show, callback = null}){
    list.forEach((item)=>{
      let viewer = window.earthObj._viewer
      let theEntity = viewer.entities.getById(item.code);
      if(show){ 
        if(theEntity){
          theEntity.show = show
          // 更新要素
          chagnePointEntity({ entity:theEntity, item })
        }else {
          // 创建点要素，不走DataSource方法
          let polyCenter = new Cesium.Cartesian3.fromDegrees(item.x, item.y, 2000.2)
          addPointEntity({ viewer, polyCenter, item, icon: boradImg})
        }
      }else {
        theEntity.show = show
      }
    })

    let flag = typeof callback === 'function'
    // 回调消息
    if (flag) {
      callback({ success: true, msg: '' })
    }
  }
  
  function addPointEntity({ viewer, polyCenter, item, icon}){
    let { code, name, value, level} = item
    let scale = level  * 0.3
    const point = viewer.entities.add({  // 点
      position: polyCenter,
      id: code, 
      name,                                           
      point: {
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      },
      billboard: {
        image:  icon,
        scale,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      },
      label: {
        text: value,
        font: "24px Helvetica",
        pixelOffset: new Cesium.Cartesian2(0, -40),
        fillColor: Cesium.Color.SKYBLUE,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 2,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      }
    });
  }

  function chagnePointEntity({entity, item}){
    let { code, name, value, level} = item
    let scale = level  * 0.3
    entity.billboard.scale = scale;
    entity.label.text = value;
  }
</script>

<template>
</template>

<style lang="less" scoped>
</style>
