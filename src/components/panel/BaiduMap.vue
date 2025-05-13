<template>
  <div class="box">
    <div class="boxnav map-container" ref="map"></div>
  </div>
</template>

<script>
/* eslint-disable no-undef */
export default {
  name: 'BaiduMap',
  data() {
    return {
      iconUrls: {
        grandma: '../../assets/images/grandma.png',
        miao: '../../assets/images/miao.png',
      },
    }
  },
  mounted() {
    // 动态加载百度地图API
    const script = document.createElement('script')
    const api_key = import.meta.env.VITE_BAIDU_MAP_AK
    script.src = `https://api.map.baidu.com/api?v=3.0&ak=${api_key}&callback=initBMap`
    document.body.appendChild(script)

    // 定义全局回调函数
    window.initBMap = () => {
      this.initMap()
    }
  },
  methods: {
    initMap() {
      if (typeof BMap === 'undefined') {
        console.error('BMap is not defined')
        return
      }

      // 创建Map实例
      const map = new BMap.Map(this.$refs.map)
      // 初始化地图,设置中心点坐标和地图级别
      map.centerAndZoom(new BMap.Point(116.10137, 39.94043), 15)
      map.setCurrentCity('北京')
      map.enableScrollWheelZoom(true)

      // 设置地图颜色
      const mapStyle = {
        style: 'midnight',
      }
      map.setMapStyle(mapStyle)

      // 创建标记点
      const pt1 = new BMap.Point(116.1, 39.9368)
      const pt2 = new BMap.Point(116.102, 39.95)

      let myIcon1, myIcon2

      try {
        myIcon1 = new BMap.Icon('../../assets/images/grandma.png', new BMap.Size(32, 32))
      } catch (e) {
        console.error('Error loading grandpa.png', e)
        myIcon1 = new BMap.Icon('', new BMap.Size(32, 32))
      }

      try {
        myIcon1 = new BMap.Icon(this.iconUrls.grandma, new BMap.Size(32, 32))
      } catch (e) {
        console.error('Error loading grandma.png', e)
        myIcon1 = new BMap.Icon('', new BMap.Size(32, 32))
      }

      try {
        myIcon2 = new BMap.Icon(this.iconUrls.miao, new BMap.Size(32, 32))
      } catch (e) {
        console.error('Error loading miao.png', e)
        myIcon2 = new BMap.Icon('', new BMap.Size(32, 32))
      }

      const marker1 = new BMap.Marker(pt1, { icon: myIcon1 })
      const marker2 = new BMap.Marker(pt2, { icon: myIcon2 })

      map.addOverlay(marker1)
      map.addOverlay(marker2)
    },
  },
}
/* eslint-enable no-undef */
</script>

<style scoped>
.anchorBL {
  display: none;
}

.map-container {
  width: 100%;
  height: 100%;
  min-height: 300px;
  /* 设置最小高度防止地图太小 */
}

.BMap_Marker img {
  border-radius: 30px;
  overflow: hidden;
  border: 2px solid rgba(155, 155, 155, 1) !important;
}
</style>
