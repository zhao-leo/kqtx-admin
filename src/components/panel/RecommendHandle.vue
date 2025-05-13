<template>
  <div class="box">
    <div class="tit">推荐处理方式</div>
    <div class="boxnav" id="ai_recommend">
      <div class="ai-recommend-container">
        <div class="ai-recommend-list" :style="{ transform: `translateY(${scrollTop}px)` }">
          <!-- 原始列表 -->
          <div v-for="item in recommendations" :key="item.category" class="ai-item">
            <div class="ai-item-category">{{ item.category }}</div>
            <div class="ai-item-solution">{{ item.solution }}</div>
          </div>
          <!-- 克隆列表用于无缝滚动 -->
          <div v-for="item in recommendations" :key="item.category + '_clone'" class="ai-item">
            <div class="ai-item-category">{{ item.category }}</div>
            <div class="ai-item-solution">{{ item.solution }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  name: 'RecommendHandle',
  setup() {
    const scrollTop = ref(0)
    const scrollHeight = ref(0)
    let timer = null

    const recommendations = [
      {
        category: '物业问题',
        solution: '建议由物业专员处理，预计解决周期: 48小时',
      },
      {
        category: '噪音扰民',
        solution: '建议由调解员介入，预计解决周期: 72小时',
      },
      {
        category: '安全隐患',
        solution: '建议由安全专员紧急处理，预计解决周期: 24小时',
      },
      {
        category: '环境卫生',
        solution: '建议由环卫部门处理，预计解决周期: 36小时',
      },
    ]

    const startScroll = () => {
      const speed = 0.5 // 调整滚动速度
      timer = setInterval(() => {
        scrollTop.value -= speed
        // 当滚动到第一组列表底部时，重置位置到顶部
        if (Math.abs(scrollTop.value) >= scrollHeight.value) {
          scrollTop.value = 0
        }
      }, 30)
    }

    onMounted(() => {
      // 获取一组列表的高度
      const listElement = document.querySelector('.ai-recommend-list')
      if (listElement) {
        const items = listElement.querySelectorAll('.ai-item')
        scrollHeight.value = Array.from(items)
          .slice(0, recommendations.length)
          .reduce((acc, item) => acc + item.offsetHeight + 15, 0) // 15是gap的值
      }
      startScroll()
    })

    onUnmounted(() => {
      if (timer) {
        clearInterval(timer)
      }
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
