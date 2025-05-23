<template>
  <div class="box">
    <div class="tit">AI推荐</div>
    <div class="boxnav" id="ai_recommend">
      <div class="ai-recommend-container">
        <div class="ai-recommend-list" :style="{ transform: `translateY(${scrollTop}px)` }">
          <!-- 原始列表 -->
          <div v-for="item in recommendations" :key="item.category" class="ai-item">
            <div class="ai-item-category">{{ item.category }}</div>
            <div class="ai-item-solution">{{ item.solution_summary }}</div>
          </div>
          <!-- 克隆列表用于无缝滚动 -->
          <div v-for="item in recommendations" :key="item.category + '_clone'" class="ai-item">
            <div class="ai-item-category">{{ item.category }}</div>
            <div class="ai-item-solution">{{ item.solution_summary }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import request from '../../logic/register.js'

export default {
  name: 'RecommendHandle',
  setup() {
    const scrollTop = ref(0)
    const scrollHeight = ref(0)
    let timer = null
    let dataTimer = null
    const recommendations = ref([])

    const calculateHeight = () => {
      const listElement = document.querySelector('.ai-recommend-list')
      if (listElement && recommendations.value.length > 0) {
        const items = listElement.querySelectorAll('.ai-item')
        scrollHeight.value = Array.from(items)
          .slice(0, recommendations.value.length)
          .reduce((acc, item) => acc + item.offsetHeight + 15, 0)
      }
    }

    const startScroll = () => {
      if (timer) clearInterval(timer)
      const speed = 0.5
      timer = setInterval(() => {
        scrollTop.value -= speed
        // 当滚动到底部时重置位置
        if (Math.abs(scrollTop.value) >= scrollHeight.value) {
          scrollTop.value = 0
        }
      }, 30)
    }

    const fetchData = async () => {
      try {
        const response = await request.get('/analysis/event')
        if (response.data && response.data.length > 0) {
          recommendations.value = response.data
          // 数据更新后重新计算高度
          setTimeout(calculateHeight, 100)
        }
      } catch (error) {
        console.error('获取数据失败:', error)
      }
    }

    // 监听数据变化
    watch(
      recommendations,
      () => {
        calculateHeight()
        if (!timer) startScroll()
      },
      { deep: true },
    )

    onMounted(async () => {
      await fetchData()
      dataTimer = setInterval(fetchData, 5000)
    })

    onUnmounted(() => {
      if (timer) clearInterval(timer)
      if (dataTimer) clearInterval(dataTimer)
    })

    return {
      recommendations,
      scrollTop,
    }
  },
}
</script>

<style scoped>
.box {
  height: 100%;
  background: rgba(0, 24, 106, 0.6);
  margin-bottom: 15px;
}

.tit {
  /* padding: 10px 15px; */
  color: #fff;
  font-size: 18px;
  letter-spacing: normal;
}

.boxnav {
  padding: 15px;
  height: calc(100% - 50px);
  overflow: hidden;
}

.ai-recommend-container {
  height: 100%;
}

.ai-recommend-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 100%;
}

.ai-recommend-container {
  height: 100%;
}

.ai-recommend-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  transition: transform 0.3s linear; /* 添加平滑过渡效果 */
}

.ai-item {
  background: rgba(255, 255, 255, 0.1);
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 5px;
  flex-shrink: 0;
}

.ai-item-category {
  color: #00ff7f;
  font-size: 16px;
  margin-bottom: 8px;
}

.ai-item-solution {
  color: #fff;
  font-size: 14px;
  line-height: 1.4;
  opacity: 0.8;
}

.ai-recommend-container:hover .ai-recommend-list {
  animation-play-state: paused;
}
</style>
