<template>
  <div class="community-show">
    <!-- 左栏 -->
    <div class="left-panel">
      <div class="add-section">
        <el-button type="primary" @click="showAddDialog">添加风采</el-button>
      </div>
      <div class="show-list">
        <div v-for="item in showList" :key="item.id" class="show-item" :class="{ active: currentShow?.id === item.id }"
          @click="selectShow(item)">
          <span class="title">{{ item.title }}</span>
          <el-icon class="delete-icon" @click.stop="deleteShow(item)">
            <Close />
          </el-icon>
        </div>
      </div>
    </div>

    <!-- 右栏 -->
    <div class="right-panel">
      <div v-if="!currentShow" class="empty-hint">
        选择一个以打开
      </div>
      <div v-else class="show-content">
        <el-image :src="currentShow.url" fit="contain" />
      </div>
    </div>

    <!-- 添加对话框 -->
    <el-dialog v-model="dialogVisible" title="添加新风采" width="500px">
      <el-form :model="newShow" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="newShow.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="图片URL">
          <el-input v-model="newShow.url" placeholder="请输入图片URL" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="addShow" :loading="loading">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Close } from '@element-plus/icons-vue'
import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'

const showList = ref([])
const currentShow = ref(null)
const dialogVisible = ref(false)
const loading = ref(false)
const newShow = ref({
  title: '',
  url: ''
})

// 获取风采列表
const getShowList = async () => {
  try {
    loading.value = true
    const response = await axios.get('/api/shows')
    showList.value = response.data.data
  } catch (error) {
    ElMessage.error('获取风采列表失败')
    console.error('获取风采列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 选择风采
const selectShow = (show) => {
  currentShow.value = show
}

// 显示添加对话框
const showAddDialog = () => {
  newShow.value = {
    title: '',
    url: ''
  }
  dialogVisible.value = true
}

// 添加风采
const addShow = async () => {
  if (!newShow.value.title || !newShow.value.url) {
    ElMessage.warning('请填写完整信息')
    return
  }

  try {
    loading.value = true
    await axios.post('/api/shows', newShow.value)
    ElMessage.success('添加成功')
    dialogVisible.value = false
    await getShowList()
  } catch (error) {
    ElMessage.error('添加失败')
    console.error('添加失败:', error)
  } finally {
    loading.value = false
  }
}

// 删除风采
const deleteShow = async (show) => {
  try {
    await ElMessageBox.confirm('确定要删除这条风采吗？', '提示', {
      type: 'warning'
    })

    loading.value = true
    await axios.delete(`/api/shows/${show.id}`)
    if (currentShow.value?.id === show.id) {
      currentShow.value = null
    }
    await getShowList()
    ElMessage.success('删除成功')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
      console.error('删除失败:', error)
    }
  } finally {
    loading.value = false
  }
}

// 组件加载时获取风采列表
onMounted(() => {
  getShowList()
})
</script>

<style scoped>
.community-show {
  display: flex;
  height: 100vh;
  background-color: #f5f7fa;
}

.left-panel {
  width: 300px;
  border-right: 1px solid #dcdfe6;
  background-color: white;
  display: flex;
  flex-direction: column;
}

.add-section {
  padding: 20px;
  border-bottom: 1px solid #dcdfe6;
}

.show-list {
  flex: 1;
  overflow-y: auto;
}

.show-item {
  padding: 15px 20px;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.show-item:hover {
  background-color: #f5f7fa;
}

.show-item.active {
  background-color: #ecf5ff;
  color: #409eff;
}

.delete-icon {
  opacity: 0;
  transition: opacity 0.3s;
}

.show-item:hover .delete-icon {
  opacity: 1;
}

.right-panel {
  flex: 1;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  margin: 20px;
  border-radius: 4px;
}

.empty-hint {
  color: #909399;
  font-size: 14px;
}

.show-content {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.show-content .el-image {
  max-width: 100%;
  max-height: 100%;
}
</style>
