<template>
  <div class="history-panel">
    <!-- Date selection for Excel download -->
    <div class="download-section">
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD"
      />
      <el-button type="primary" @click="downloadExcel" :loading="downloading">
        下载Excel
      </el-button>
    </div>

    <!-- Form data table -->
    <el-table :data="formList" style="width: 100%" @row-click="handleRowClick">
      <el-table-column prop="serial_number" label="表单编号" width="120" />
      <el-table-column prop="title" label="标题" />
      <el-table-column prop="type" label="类型" width="100">
        <template #default="scope">
          {{ typeMap[scope.row.type] }}
        </template>
      </el-table-column>
      <el-table-column label="提交时间" width="180">
        <template #default="scope">
          {{ formatTime(scope.row.upload_time) }}
        </template>
      </el-table-column>
    </el-table>

    <!-- Pagination -->
    <div class="pagination-container">
      <el-pagination
        background
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="[3, 10, 16, 20, 30]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>

    <!-- Form detail dialog -->
    <el-dialog v-model="dialogVisible" title="表单详情" width="60%" destroy-on-close>
      <div v-if="currentForm" class="form-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="表单编号">
            {{ currentForm.serial_number }}
          </el-descriptions-item>
          <el-descriptions-item label="类型">
            {{ typeMap[currentForm.type] }}
          </el-descriptions-item>
          <el-descriptions-item label="标题" :span="2">
            {{ currentForm.title }}
          </el-descriptions-item>
          <el-descriptions-item label="提交时间" :span="2">
            {{ formatTime(currentForm.upload_time) }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { request } from '../../logic/register'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

// Data
const formList = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(6)
const dialogVisible = ref(false)
const currentForm = ref(null)
const dateRange = ref([])
const downloading = ref(false)

const typeMap = {
  complaint: '投诉',
  suggest: '建议',
}

const fetchForms = async () => {
  try {
    const response = await request.get(
      `/proceed/admin_form?page=${currentPage.value}&page_size=${pageSize.value}`,
    )
    if (response.code === 200) {
      formList.value = response.data.results || []
      total.value = response.data.total || 0
      // 确保当前页码不超过总页数
      const maxPage = Math.ceil(total.value / pageSize.value)
      if (currentPage.value > maxPage && maxPage > 0) {
        currentPage.value = maxPage
        await fetchForms()
      }
    } else {
      ElMessage.error(response.message || '获取表单列表失败')
    }
  } catch (error) {
    ElMessage.error('获取表单列表失败')
    console.error('Failed to fetch forms:', error)
  }
}
const handleCurrentChange = async (val=1) => {
  console.log('页码改变:', val)
  currentPage.value = val
  await fetchForms()
}

const handleSizeChange = async (val) => {
  pageSize.value = val
  currentPage.value = 1 // 切换每页显示数量时重置到第一页
  await fetchForms()
}
const formatTime = (timestamp) => {
  return dayjs.unix(timestamp).tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss')
}

const handleRowClick = (row) => {
  currentForm.value = row
  dialogVisible.value = true
}

const downloadExcel = async () => {
  if (!dateRange.value || dateRange.value.length !== 2) {
    ElMessage.warning('请选择日期范围')
    return
  }

  downloading.value = true
  try {
    const [startDate, endDate] = dateRange.value
    const response = await request.get(
      `/api/proceed/admin_form/export?start_date=${startDate}&end_date=${endDate}`,
      { responseType: 'blob' },
    )

    const url = window.URL.createObjectURL(new Blob([response]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `forms_${startDate}_${endDate}.xlsx`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    ElMessage.success('导出成功')
  } catch (error) {
    ElMessage.error('导出失败')
    console.error('Failed to download excel:', error)
  } finally {
    downloading.value = false
  }
}

// Lifecycle
onMounted(() => {
  fetchForms()
})
</script>

<style scoped>
.history-panel {
  background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 20px;
  flex: 1;
  overflow-y: auto;
  transition: all 0.3s ease;
}

.download-section {
  margin-bottom: 20px;
  display: flex;
  max-width: 40%;
  align-items: center;
  justify-content: flex-end;
  font-size: large;
  gap: 16px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  position: relative;
  z-index: 10; /* 增加z-index确保分页组件在顶层 */
}

/* 调整分页组件中各元素的层级 */
:deep(.el-pagination) {
  position: relative;
  z-index: 11;
}

:deep(.el-pagination button) {
  position: relative;
  z-index: 12;
  pointer-events: auto !important; /* 确保按钮可点击 */
}

:deep(.el-pagination .el-pager li) {
  position: relative;
  z-index: 12;
  pointer-events: auto !important;
}

.form-detail pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  max-height: 300px;
  overflow-y: auto;
}
</style>
