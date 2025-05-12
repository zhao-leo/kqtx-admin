<template>

  <div class="dashboard">
    <div class="head clearfix">
      <h1 class="pulll_left">矿桥东街社区服务数据管理平台</h1>
      <div class="time" id="showTime">2018/6/12 17:00:12</div>

    </div>
    <div class="mainbox">
      <ul class="clearfix nav1">
        <li style="width: 33%">
          <div class="box">
            <div class="tit">居民投诉情况</div>
            <div class="boxnav" id="echart1">

            </div>
          </div>
          <div class="box">
            <div class="tit">重点关注对象</div>
            <div class="boxnav">
              <ul class="zjia">

                <li>
                  <img src="../assets/images/aunt.png">
                  <h3>王阿姨</h3>
                  <span>待处理</span>
                  <span>暂无</span>
                  <p>北京市门头沟区汤臣一品1栋1单元1号</p>

                </li>
                <li>
                  <img src="../assets/images/grandma.png">
                  <h3>李奶奶</h3>
                  <span>待处理</span>
                  <span>暂无</span>
                  <p>北京市门头沟区汤臣一二品1栋1单元1号</p>

                </li>

                <li>
                  <img src="../assets/images/miao.png">
                  <h3>苗叔</h3>
                  <span>待处理</span>
                  <span>T-20250113-56</span>
                  <p>北京市门头沟区汤臣一三品1栋1单元1号</p>

                </li>

                <li>
                  <img src="../assets/images/grandpa.png">
                  <h3>马爷爷</h3>
                  <span>待处理</span>
                  <span>暂无</span>
                  <p>北京市门头沟区汤臣一四品1栋1单元1号</p>

                </li>
              </ul>
            </div>
          </div>

        </li>
        <li style="width: 33%">
          <div class="box">
            <div class="boxnav" id="map" style="height:433px;">


            </div>


          </div>
          <div class="box">
            <div class="tit">分类</div>
            <div class="boxnav" id="echart5"></div>
          </div>
        </li>
        <li style="width: 33%">

          <div class="box">
            <div class="tit">推荐处理方式</div>
            <div class="boxnav" id="ai_recommend">
              <div class="ai-recommend-container">
                <!-- <div class="ai-recommend-title">AI智能分析结果</div> -->
                <div class="ai-recommend-list">
                  <div class="ai-item">
                    <div class="ai-item-category">物业问题</div>
                    <div class="ai-item-solution">建议由物业专员处理，预计解决周期: 48小时</div>
                  </div>
                  <div class="ai-item">
                    <div class="ai-item-category">噪音扰民</div>
                    <div class="ai-item-solution">建议由调解员介入，预计解决周期: 72小时</div>
                  </div>
                  <div class="ai-item">
                    <div class="ai-item-category">安全隐患</div>
                    <div class="ai-item-solution">建议由安全专员紧急处理，预计解决周期: 24小时</div>
                  </div>
                  <div class="ai-item">
                    <div class="ai-item-category">环境卫生</div>
                    <div class="ai-item-solution">建议由环卫部门处理，预计解决周期: 36小时</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="box">
            <div class="tit">小程序使用情况</div>
            <div class="boxnav" id="echart6">
            </div>
          </div>

        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import '../assets/panel.css'
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
const currentTime = ref('')
const echart1 = ref(null)

// 更新时间的函数
const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleString('zh-CN')
}

// 初始化投诉情况图表
const initComplaintChart = () => {
  const chart = echarts.init(echart1.value)
  // 这里添加图表配置
  const option = {
    // 图表配置将在这里添加
  }
  chart.setOption(option)
}

let timer

onMounted(() => {
  // 初始化时间
  updateTime()
  // 设置定时器每秒更新时间
  timer = setInterval(updateTime, 1000)

  // 初始化图表
  initComplaintChart()
})

onUnmounted(() => {
  // 清除定时器
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style scoped>
.dashboard {
  width: 100vw;
  height: 100vh;
  background: #000d4a;
  color: #fff;
  font-family: 'Microsoft YaHei';
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
</style>
