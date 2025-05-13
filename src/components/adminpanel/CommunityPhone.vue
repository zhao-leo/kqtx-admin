<template>
  <div class="phone-list">
    <div class="add-section">
      <el-button type="primary" @click="showAddDialog">添加电话</el-button>
    </div>
    <el-table :data="phoneList" style="width: 100%">
      <el-table-column prop="phone_name" label="姓名">
        <template #default="{ row }">
          <el-input v-if="row.isEdit" v-model="row.phone_name" size="small" />
          <span v-else>{{ row.phone_name }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="phone_number" label="电话">
        <template #default="{ row }">
          <el-input v-if="row.isEdit" v-model="row.phone_number" size="small" />
          <span v-else>{{ row.phone_number }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button v-if="row.isEdit" type="success" size="small" @click="savePhone(row)" :loading="loading">
            保存
          </el-button>
          <el-button v-else type="primary" size="small" @click="editPhone(row)"> 修改 </el-button>
          <el-button type="danger" size="small" @click="deletePhone(row)" :loading="loading">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="dialogVisible" title="添加新电话" width="500px" lock-scroll>
      <el-form :model="newPhone" label-width="80px">
        <el-form-item label="姓名">
          <el-input v-model="newPhone.phone_name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="newPhone.phone_number" placeholder="请输入电话号码" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="addPhone" :loading="loading"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAuthStore } from '../../stores/token.js'

const phoneList = ref([])
const loading = ref(false)
const dialogVisible = ref(false)
const newPhone = ref({
  phone_name: '',
  phone_number: '',
})

const api = import.meta.env.VITE_API_BASE_URL + '/community/phone_number'

const token = useAuthStore().getToken()
axios.defaults.headers.common['Authorization'] = token
axios.defaults.headers.common['Content-Type'] = 'multipart/form-data'
// 获取电话列表
const getPhoneList = async () => {
  try {
    loading.value = true
    const response = await axios.get(api)
    phoneList.value = response.data.data.map((item) => ({
      ...item,
      isEdit: false,
    }))
  } catch (error) {
    ElMessage.error('获取电话列表失败')
    console.error('获取电话列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 编辑电话
const editPhone = (row) => {
  row.isEdit = true
  // 保存原始数据，用于取消编辑
  row.originalData = {
    phone_name: row.phone_name,
    phone_number: row.phone_number,
  }
}

// 保存电话
const savePhone = async (row) => {
  try {
    loading.value = true
    const apiUrl = `${api}?pk=${row.id}`
    await axios.put(apiUrl, {
      phone_name: row.phone_name,
      phone_number: row.phone_number,
    })
    row.isEdit = false
    delete row.originalData
    ElMessage.success('修改成功')
  } catch (error) {
    // 恢复原始数据
    if (row.originalData) {
      row.phone_name = row.originalData.phone_name
      row.phone_number = row.originalData.phone_number
    }
    ElMessage.error('修改失败')
    console.error('修改失败:', error)
  } finally {
    loading.value = false
  }
}

// 删除电话
const deletePhone = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除这个电话吗？', '提示', {
      type: 'warning',
      lockScroll: true,
      customClass: 'custom-message-box'
    })

    loading.value = true
    const apiUrl = `${api}?pk=${row.id}`
    await axios.delete(apiUrl)
    phoneList.value = phoneList.value.filter((item) => item.id !== row.id)
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
const showAddDialog = () => {
  newPhone.value = {
    phone_name: '',
    phone_number: '',
  }
  dialogVisible.value = true
}

const addPhone = async () => {
  if (!newPhone.value.phone_name || !newPhone.value.phone_number) {
    ElMessage.warning('请填写完整信息')
    return
  }

  try {
    loading.value = true
    await axios.post(api, newPhone.value)
    ElMessage.success('添加成功')
    dialogVisible.value = false
    await getPhoneList() // 刷新列表
  } catch (error) {
    ElMessage.error('添加失败')
    console.error('添加失败:', error)
  } finally {
    loading.value = false
  }
}

// 组件加载时获取电话列表
onMounted(() => {
  getPhoneList()
})
</script>

<style scoped>
.phone-list {
  padding: 25px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.05);
  animation: fadeIn 0.5s ease-out;
  height: 80vh;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.add-section {
  margin-bottom: 25px;
}

:deep(.el-button) {
  margin-left: 12px;
  border-radius: 8px;
  padding: 8px 16px;
  font-weight: 500;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

:deep(.el-button:first-child) {
  margin-left: 0;
}

:deep(.el-button--primary) {
  background: linear-gradient(45deg, #409EFF, #60ACFF);
  border: none;
}

:deep(.el-button--primary:hover) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

:deep(.el-button--success) {
  background: linear-gradient(45deg, #67C23A, #85CE61);
  border: none;
}

:deep(.el-button--success:hover) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(103, 194, 58, 0.3);
}

:deep(.el-button--danger) {
  background: linear-gradient(45deg, #F56C6C, #FF7875);
  border: none;
}

:deep(.el-button--danger:hover) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(245, 108, 108, 0.3);
}

:deep(.el-table) {
  background: transparent !important;
  border-radius: 8px;
  overflow: hidden;
}

:deep(.el-table::before) {
  display: none;
}

:deep(.el-table--enable-row-hover .el-table__body tr:hover > td) {
  background: rgba(255, 255, 255, 0.05) !important;
}

:deep(.el-table td),
:deep(.el-table th) {
  background: rgba(255, 255, 255, 0.02);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
  color: rgba(0, 0, 0, 0.9);
}

:deep(.el-table th) {
  background: rgba(255, 255, 255, 0.05) !important;
  font-weight: 600;
  color: #000000;
}

:deep(.el-table__row) {
  transition: all 0.3s ease;
}

:deep(.el-table) {
  --el-table-text-color: rgba(0, 0, 0, 0.9);
  --el-table-header-text-color: #000000;
  color: rgba(0, 0, 0, 0.9);
}

:deep(.el-table span) {
  color: rgba(0, 0, 0, 0.9);
}

/* 表格内的输入框样式 */
:deep(.el-table .el-input__inner) {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #333333;
  border-radius: 6px;
  transition: all 0.3s ease;
}

:deep(.el-table .el-input__inner:focus) {
  background: rgba(255, 255, 255, 0.08);
  border-color: #409EFF;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
}

/* 弹窗样式 */
:deep(.el-dialog) {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  border: 1px solid #eee;
  margin-top: 15vh !important;
}

:deep(.el-dialog__title) {
  color: #333333;
  font-size: 18px;
  font-weight: 600;
}

:deep(.el-dialog__header) {
  border-bottom: 1px solid #eee;
  padding: 20px 24px;
  margin: 0;
}

:deep(.el-dialog__body) {
  padding: 24px;
  color: #333333;
}

:deep(.el-form-item__label) {
  color: #333333;
}

:deep(.el-input__inner) {
  color: #333333 !important;
  background-color: #ffffff !important;
  border-color: #dcdfe6 !important;
}

:deep(.el-input__inner:focus) {
  border-color: #409EFF !important;
}

:deep(.el-input__inner::placeholder) {
  color: #909399;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  border-top: 1px solid #eee;
  padding-top: 20px;
}

/* 消息框样式 */
:deep(.custom-message-box) {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  border: 1px solid #eee;
}

:deep(.custom-message-box .el-message-box__title) {
  color: #333333;
  font-size: 18px;
  font-weight: 600;
}

:deep(.custom-message-box .el-message-box__content) {
  color: #333333;
  padding: 20px 0;
}

:deep(.custom-message-box .el-message-box__btns) {
  border-top: 1px solid #eee;
  padding-top: 15px;
}

:deep(.custom-message-box .el-message-box__btns .el-button) {
  font-weight: 500;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

:deep(.custom-message-box .el-overlay) {
  overflow: hidden;
}
</style>
