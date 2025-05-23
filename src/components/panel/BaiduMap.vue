<template>
  <div class="box">
    <div class="boxnav map-container" ref="map"></div>
  </div>
</template>

<script>
import request from '../../logic/register.js'

/* eslint-disable no-undef */
export default {
  name: 'BaiduMap',
  data() {
    return {
      map: null,
      markers: [],
      timer: null,
      dataTimer: null,
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
      this.startDataFetch()
    }
  },
  beforeUnmount() {
    if (this.timer) clearInterval(this.timer)
    if (this.dataTimer) clearInterval(this.dataTimer)
  },
  methods: {
    initMap() {
      if (typeof BMap === 'undefined') {
        console.error('BMap is not defined')
        return
      }

      // 创建Map实例
      this.map = new BMap.Map(this.$refs.map)
      // 初始化地图,设置中心点坐标和地图级别
      this.map.centerAndZoom(new BMap.Point(116.397128, 39.916527), 13)
      this.map.setCurrentCity('北京')
      this.map.enableScrollWheelZoom(true)

      // 设置地图颜色
      const mapStyle = {
        style: 'midnight',
      }
      this.map.setMapStyle(mapStyle)
    },

    // 获取图片完整URL
    getImageUrl(avatar) {
      if (!avatar) return ''
      const base_url = import.meta.env.VITE_API_BASE_URL.replace(/\/api$/, '')
      return `${base_url}${avatar}`
    },

    // 更新标记点
    updateMarkers(data) {
      // 清除旧的标记点
      this.markers.forEach((marker) => {
        this.map.removeOverlay(marker)
      })
      this.markers = []

      // 添加新的标记点
      data.forEach((item) => {
        const [lng, lat] = item.Latitude_Longitude.split(',').map(Number)
        const pt = new BMap.Point(lng, lat)

        // 创建自定义图标
        const myIcon = new BMap.Icon(this.getImageUrl(item.avatar), new BMap.Size(32, 32), {
          imageSize: new BMap.Size(32, 32),
          anchor: new BMap.Size(16, 16),
        })

        const marker = new BMap.Marker(pt, { icon: myIcon })
        this.map.addOverlay(marker)
        this.markers.push(marker)
      })
    },

    // 开始定时获取数据
    startDataFetch() {
      this.fetchData() // 立即获取一次数据
      this.dataTimer = setInterval(this.fetchData, 5000) // 每5秒更新一次
    },

    // 获取数据
    async fetchData() {
      try {
        const response = await request.get('/analysis/user_location')
        if (response.code === 200 && response.data) {
          this.updateMarkers(response.data)
        }
      } catch (error) {
        console.error('获取位置数据失败:', error)
      }
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
  /* min-height: 300px; */
  /* 设置最小高度防止地图太小 */
}

.BMap_Marker img {
  border-radius: 30px;
  overflow: hidden;
  border: 2px solid rgba(155, 155, 155, 1) !important;
}
</style>
