<template>
  <div class="box">
    <div class="tit">分类</div>
    <div ref="chart" class="boxnav"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { onMounted, ref, onUnmounted } from 'vue'

export default {
  name: 'CategoryCount',
  setup() {
    const chart = ref(null)
    let myChart = null

    const initChart = () => {
      myChart = echarts.init(chart.value)
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'horizontal',
          bottom: 0,
          textStyle: {
            color: '#fff'
          },
          data: ['物业问题', '噪音扰民', '安全隐患', '环境卫生', '其他']
        },
        series: [
          {
            name: '问题类型',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: true,
              position: 'outside',
              formatter: '{b}: {d}%',
              color: '#fff'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '16',
                fontWeight: 'bold'
              }
            },
            data: [
              { value: 35, name: '物业问题' },
              { value: 25, name: '噪音扰民' },
              { value: 20, name: '安全隐患' },
              { value: 15, name: '环境卫生' },
              { value: 5, name: '其他' }
            ]
          }
        ],
        color: ['#00ff7f', '#00ffff', '#ff69b4', '#7b68ee', '#ff7f50']
      }
      myChart.setOption(option)
    }

    onMounted(() => {
      initChart()
      window.addEventListener('resize', () => {
        myChart?.resize()
      })
    })

    onUnmounted(() => {
      window.removeEventListener('resize', () => {
        myChart?.resize()
      })
      myChart?.dispose()
    })

    return {
      chart
    }
  }
}
</script>

<style scoped>
.box {
  height: 100%;
  background: rgba(0, 24, 106, 0.6);
  display: flex;
  flex-direction: column;
}

.tit {
  /* padding: 10px 15px; */
  color: #fff;
  font-size: 18px;
  letter-spacing: normal;
}

.boxnav {
  flex: 1;
  height: 100%;
  padding: 5px 15px 15px;
}
</style>
