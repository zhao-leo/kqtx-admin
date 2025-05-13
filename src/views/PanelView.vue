<template>
  <div class="panel">
    <!-- 左侧边栏 -->
    <SideBar />

    <!-- 右侧内容区 -->
    <div class="content">
      <!-- 基本信息面板 -->
      <div v-if="currentPanel === 'basic'" class="basic-info">
        <el-tabs>
          <el-tab-pane label="电话管理">
            <CommunityPhone />
          </el-tab-pane>
          <el-tab-pane label="轮播图管理">
            <SwitchBanner />
          </el-tab-pane>
          <el-tab-pane label="温馨提示">
            <WarmNotice />
          </el-tab-pane>
        </el-tabs>
      </div>

      <!-- 社区风采面板 -->
      <div v-else-if="currentPanel === 'show'" class="show-panel">
        <CommunityShow />
      </div>

      <!-- 报告生成面板 -->
      <div v-else-if="currentPanel === 'report'" class="report-panel">
        <!-- 预留报告生成功能 -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import SideBar from '@/components/adminpanel/SideBar.vue'
import CommunityPhone from '@/components/adminpanel/CommunityPhone.vue'
import SwitchBanner from '@/components/adminpanel/SwitchBanner.vue'
import WarmNotice from '@/components/adminpanel/WarmNotice.vue'
import CommunityShow from '@/components/adminpanel/CommunityShow.vue'

const route = useRoute()
const currentPanel = ref('basic')

// 监听路由变化以切换面板
onMounted(() => {
  const path = route.path
  if (path.includes('basic')) {
    currentPanel.value = 'basic'
  } else if (path.includes('show')) {
    currentPanel.value = 'show'
  } else if (path.includes('report')) {
    currentPanel.value = 'report'
  }
})
</script>

<style scoped>
.panel {
  display: flex;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.basic-info {
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.show-panel {
  height: calc(100vh - 40px);
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.report-panel {
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  min-height: 500px;
  padding: 20px;
}
</style>
