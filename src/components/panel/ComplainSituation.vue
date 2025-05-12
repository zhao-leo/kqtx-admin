<template>
  <div class="box">
    <div class="tit">居民投诉情况</div>
    <div ref="chart" class="boxnav"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { onMounted, ref, onUnmounted } from 'vue'

export default {
  name: 'ComplainSituation',
  setup() {
    const chart = ref(null)
    let myChart = null

    const initChart = () => {
      myChart = echarts.init(chart.value)
      const colors = [
        '#37A2FF',
        '#00ff7f',
        '#FF0087',
        '#FFBF00',
        '#56D0E3',
        '#9FE6B8',
        '#FFDB5C'
      ]

      const option = {
        color: colors,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '0%',
          right: '4%',
          bottom: '3%',
          top: '3%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
          axisTick: {
            alignWithLabel: true
          },
          axisLine: {
            lineStyle: {
              color: '#fff'
            }
          }
        }],
        yAxis: [{
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#fff'
            }
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(255,255,255,0.1)'
            }
          }
        }],
        series: [{
          name: '投诉数量',
          type: 'bar',
          barWidth: '60%',
          itemStyle: {
            borderRadius: [8, 8, 0, 0]
          },
          data: [10, 52, 20, 34, 39, 30, 20].map(value => ({
            value,
            // 为每个柱子随机选择一个颜色
            itemStyle: {
              color: function () {
                return colors[Math.floor(Math.random() * colors.length)];
              }()
            }
          }))
        }]
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
  padding: 5px 15px 15px;
}
</style>
