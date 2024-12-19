/*
 * @Author: xionghaiying
 * @Date: 2024-06-26 15:42:21
 * @LastEditors: xionghaiying
 * @LastEditTime: 2024-07-09 08:55:07
 * @FilePath: \visualization\src\views\map\uses\UsePrimitive.js
 * @Description: Primitive
 */
export default function UsePrimitive() {
  // PrimitiveCollection只能根据索引来查找。。。。。。
  async function loadPrimitiveByParams({ id: code, width, zIndex, entity }) {
    if (!entity) {
      return;
    }
    let toScene = (window.earthObj && window.earthObj._scene) || null;
    if (!toScene) {
      return;
    }
    // 先判断当前primitive集合是否存在
    let primCol = findPrimitiveLayer({key: code});
    if(!primCol){
      primCol = new Cesium.PrimitiveCollection()
      primCol.code = code
      toScene.primitives.add(primCol,zIndex)
    }

    let primitive = addPrimitiveFlowAppear(
      entity.polyline.positions._value,
      "rgba(255,255,255,0.6)",
      width * 0.6
    );
    // 添加到集合
    primCol.add(primitive);
    // 临时流动效果
    animateFlowItem(primitive);
    return true;
  }

  // --------------------------------------- 3Dtile start ------------------------------------- //
  async function load3Dtile({ code, url, zIndex, elevation }) {
    let viewer = window.earthObj._viewer;
    // 先判断是否已经有模型
    let tileModel = findPrimitiveLayer({key : ''  ,modelCode: code});
    if(tileModel){
      return
    }

    tileModel = new Cesium.Cesium3DTileset({
      url: url,
      skipLevelOfDetail: true,
      baseScreenSpaceError: 1024,
      skipScreenSpaceErrorFactor: 16,
      skipLevels: 1,
      immediatelyLoadDesiredLevelOfDetail: false,
      loadSiblings: false,
      cullWithChildrenBounds: true,
    });
    // 补充数据，todo:直接将Cesium3DTileset对象绑定到对应的Entity对象内
    tileModel.code = code;
    let tileset = viewer.scene.primitives.add(tileModel);

    tileset.readyPromise
      .then(function (tileModel) {
        // 当tileset准备就绪时，执行一些操作
        console.log("Tileset is ready.", url);
        //高度偏差，正数为向上偏，负数为向下偏，根据真实的模型位置不断进行调整
        var heightOffset = elevation;
        //计算tileset的绑定范围
        var boundingSphere = tileset.boundingSphere;
        //计算中心点位置
        var cartographic = Cesium.Cartographic.fromCartesian(
          boundingSphere.center
        );
        //计算中心点位置坐标
        var surface = Cesium.Cartesian3.fromRadians(
          cartographic.longitude,
          cartographic.latitude,
          0
        );
        //偏移后的三维坐标
        var offset = Cesium.Cartesian3.fromRadians(
          cartographic.longitude,
          cartographic.latitude,
          heightOffset
        );

        var translation = Cesium.Cartesian3.subtract(
          offset,
          surface,
          new Cesium.Cartesian3()
        );
        //tileset.modelMatrix转换
        tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
      })
      .otherwise(function (error) {
        // 处理加载错误
        console.error("An error occurred: ", error);
      });
  }

  // 地形开挖
  function excavationTerrain() {
    let viewer = window.earthObj._viewer;
    const globe = viewer.scene.globe;
    // For tracking state when switching exampleTypes
    let clippingPlanesEnabled = true; // 地形是否隐藏
    const position = Cesium.Cartesian3.fromDegrees(116.213676, 36.312812, 50.0);

    const entity = viewer.entities.add({
      position: position,
      box: {
        material: Cesium.Color.WHITE.withAlpha(0.0),
        outlineColor: Cesium.Color.WHITE,
      },
    });

    globe.depthTestAgainstTerrain = true;
    globe.clippingPlanes = new Cesium.ClippingPlaneCollection({
      modelMatrix: entity.computeModelMatrix(Cesium.JulianDate.now()),
      // 东 西 北
      planes: [
        new Cesium.ClippingPlane(new Cesium.Cartesian3(1.0, 0.0, 0.0), -62.0),
        new Cesium.ClippingPlane(new Cesium.Cartesian3(-1.0, 0.0, 0.0), -60.0),
        new Cesium.ClippingPlane(new Cesium.Cartesian3(0.0, 1.0, 0.0), -27.0),
        new Cesium.ClippingPlane(new Cesium.Cartesian3(0.0, -1.0, 0.0), -27.0),
      ],
      edgeWidth: 1.0, // 应用于剪裁对象的边的高光的宽度
      edgeColor: Cesium.Color.WHITE,
      enabled: clippingPlanesEnabled,
    });
    globe.backFaceCulling = true;
    globe.showSkirts = true;
  }

  // 定义一个回调函数来获取构件信息
  function getTileModelComponents(model) {
    if (Cesium.defined(model)) {
      var components = model.getComponents();
      for (var i = 0; i < components.length; i++) {
        var component = components[i];
        // 输出构件信息，例如构件ID或构件类型
        console.log("Component " + i + ": " + component.id);
      }
    }
  }
  // --------------------------------------- 3Dtile start ------------------------------------- //
  // 增加Primitive对象
  function addPrimitiveFlowAppear(pos, color, width) {
    return new Cesium.Primitive({
      geometryInstances: new Cesium.GeometryInstance({
        geometry: new Cesium.PolylineGeometry({
          positions: pos,
          width: width,
          vertexFormat: Cesium.PolylineMaterialAppearance.VERTEX_FORMAT, //可以不设置，一般会根据 appearance的类型自动默认对应的类型
        }),
      }),
      appearance: new Cesium.PolylineMaterialAppearance({
        material: Cesium.Material.fromType(Cesium.Material.FadeType, {
          repeat: false,
          fadeInColor: Cesium.Color.fromCssColorString(color).withAlpha(1.0),
          fadeOutColor: Cesium.Color.fromCssColorString(color).withAlpha(0.2),
          time: new Cesium.Cartesian2(100.0, 1.0),
          maximumDistance: 0.15 / 2.5,
          fadeDirection: {
            x: true,
            y: false,
          },
        }),
      }),
    });
  }
  // 添加流动效果
  function animateFlowItem(toPri) {
    let timex = 0;
    function render() {
      timex += 0.005;
      if (timex >= 1) {
        timex = 0; // 控制在0.0到1.0之间
      }
      toPri.appearance.material.uniforms.time.x = timex - 0.003;
      Cesium.requestAnimationFrame(render);
    }
    Cesium.requestAnimationFrame(render);
  }

  function getRadialGradientAppearance(color) {
    const fs = `czm_material czm_getMaterial(czm_materialInput materialInput)
        {
            czm_material material = czm_getDefaultMaterial(materialInput);
            vec2 st = materialInput.st;
            float dis = distance(st, vec2(0.5));
            material.diffuse = color.rgb;
            //material.alpha =clamp(1.0 - dis * 2.0,0.1,1.0) ;//内向外颜色变淡
            //material.alpha =clamp(dis * 1.25,0.0,1.0) ;//外向内颜色变淡
            material.alpha = color.a * dis * alphaPower * globalAlpha;
            material.diffuse = color.rgb * diffusePower;
            return material;
        }`;
    let material = new Cesium.Material({
        fabric: {
            uniforms:
            {
                animationSpeed: 0,
                diffusePower: 1.8,
                alphaPower: 1.2,
                globalAlpha: 0x1,
                color: new Cesium.Color(color.red, color.green, color.blue, color.alpha)
            },
            source: fs
        },
    });
    var aper = new Cesium.MaterialAppearance({
        material: material,
        source: fs
    });
    return aper;
  }
  
  function xhytest({entity, id: code, zIndex }) {
    if (!entity) {
      return;
    }
    let toScene = (window.earthObj && window.earthObj._scene) || null;
    if (!toScene) {
      return;
    }
    // 先判断当前primitive集合是否存在
    let primCol = findPrimitiveLayer({key: code});
    if(!primCol){
      primCol = new Cesium.PrimitiveCollection()
      primCol.code = code
      toScene.primitives.add(primCol,zIndex)
    }

    primCol.add(addBaseRegion(entity))
  }

  function addBaseRegion(entity, color={red: 0.0,green: 0.2,blue: 0.4,alpha: 1}) {
    let polygonHierarchy = entity.polygon.hierarchy._value;
    //primitive方式
    let polygonInstance = new Cesium.GeometryInstance({
      geometry: new Cesium.PolygonGeometry({
        polygonHierarchy: polygonHierarchy,
        height:2000.3,
        vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT,
        outline: true,
        outlineColor: Cesium.Color.MAGENTA,
      })
    });
    // ???? 没有用
    let polylineInstance = new Cesium.GeometryInstance({
      geometry: new Cesium.PolylineGeometry({
        positions: polygonHierarchy.positions.slice(1, 3),
        width: 20.0,
        colors: Cesium.Color.BLACK,
        vertexFormat: Cesium.PolylineMaterialAppearance.VERTEX_FORMAT, 
      }),
    })

    return new Cesium.Primitive({
      geometryInstances: [polygonInstance],
      appearance: getRadialGradientAppearance(color),
      asynchronous: false,
    })
  }

  function cartesian3ToCarto(cartesian3, byDegrees = false) {
    let toEarth = window.earthObj
    let scene = toEarth._scene
    let cartographic = scene.globe.ellipsoid.cartesianToCartographic(cartesian3)
    if (byDegrees) {
      let toD = Cesium.Math.toDegrees
      return {
        lon: toD(cartographic.longitude),
        lat: toD(cartographic.latitude),
        height: cartographic.height,
      }
    }
    return {
      lon: cartographic.longitude,
      lat: cartographic.latitude,
      height: cartographic.height,
    }
  }

  // 卸载
  function unloadPrimitiveLayer(key) {
    let primCol = findPrimitiveLayer({ key })
    primCol.destroy()
  }

  // 显影
  function hideOrShowPrimitiveLayer(key, modelCode, show) {
    let primCol = findPrimitiveLayer({key, modelCode });
    if (primCol) {
      primCol.show = show;
    }
  }

  // 分2次找，第一次通过图层id（找效果），第2次通过层级（找模型）
  function findPrimitiveLayer({ key, modelCode, keyVal = 'code' }) { 
    let primCols = window.earthObj._viewer.scene.primitives._primitives;
    let primCol = primCols.find((it) => it[keyVal] === key)
    if(primCol){
      return primCol
    }else if(modelCode) {
      primCol = primCols.find((it) => it[keyVal] === modelCode)
      return primCol
    }
    return false;
  }

  return {
    loadPrimitiveByParams,
    hideOrShowPrimitiveLayer,
    load3Dtile,
    excavationTerrain,
    addBaseRegion,
    xhytest,
  };
}
