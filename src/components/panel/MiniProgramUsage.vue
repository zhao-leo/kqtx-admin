<template>
  <div class="box">
    <div class="tit">小程序使用情况</div>
    <div ref="chart" class="boxnav"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { onMounted, ref, onUnmounted } from 'vue'

export default {
  name: 'MiniProgramUsage',
  setup() {
    const chart = ref(null)
    let myChart = null

    const initChart = () => {
      myChart = echarts.init(chart.value)
      const option = {
        color: ['#00ff7f', '#00ffff'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: ['日活用户', '累计用户'],
          textStyle: {
            color: '#fff'
          },
          top: 0
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '15%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            axisLine: {
              lineStyle: {
                color: '#fff'
              }
            }
          }
        ],
        yAxis: [
          {
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
          }
        ],
        series: [
          {
            name: '日活用户',
            type: 'line',
            smooth: true,
            stack: '总量',
            areaStyle: {
              opacity: 0.3
            },
            emphasis: {
              focus: 'series'
            },
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: '累计用户',
            type: 'line',
            smooth: true,
            stack: '总量',
            areaStyle: {
              opacity: 0.3
            },
            emphasis: {
              focus: 'series'
            },
            data: [220, 382, 491, 634, 790, 1030, 1200]
          }
        ]
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
