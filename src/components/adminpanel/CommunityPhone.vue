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
          <el-button
            v-if="row.isEdit"
            type="success"
            size="small"
            @click="savePhone(row)"
            :loading="loading"
          >
            保存
          </el-button>
          <el-button v-else type="primary" size="small" @click="editPhone(row)"> 修改 </el-button>
          <el-button type="danger" size="small" @click="deletePhone(row)" :loading="loading">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="dialogVisible" title="添加新电话" width="500px">
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
  padding: 20px;
}

.el-button {
  margin-left: 10px;
}

.el-button:first-child {
  margin-left: 0;
}

.add-section {
  margin-bottom: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
