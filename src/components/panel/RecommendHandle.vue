<template>
  <div class="box">
    <div class="tit">推荐处理方式</div>
    <div class="boxnav" id="ai_recommend">
      <div class="ai-recommend-container">
        <div class="ai-recommend-list">
          <div v-for="item in recommendations" :key="item.category" class="ai-item">
            <div class="ai-item-category">{{ item.category }}</div>
            <div class="ai-item-solution">{{ item.solution }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RecommendHandle',
  setup() {
    const recommendations = [
      {
        category: '物业问题',
        solution: '建议由物业专员处理，预计解决周期: 48小时'
      },
      {
        category: '噪音扰民',
        solution: '建议由调解员介入，预计解决周期: 72小时'
      },
      {
        category: '安全隐患',
        solution: '建议由安全专员紧急处理，预计解决周期: 24小时'
      },
      {
        category: '环境卫生',
        solution: '建议由环卫部门处理，预计解决周期: 36小时'
      }
    ]

    return {
      recommendations
    }
  }
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
  overflow-y: auto;
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
</style>
