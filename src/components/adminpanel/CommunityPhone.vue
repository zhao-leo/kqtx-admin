<template>
  <div class="phone-list">
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
          <el-button v-else type="primary" size="small" @click="editPhone(row)">
            修改
          </el-button>
          <el-button type="danger" size="small" @click="deletePhone(row)" :loading="loading">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'

const phoneList = ref([])
const loading = ref(false)

// 获取电话列表
const getPhoneList = async () => {
  try {
    loading.value = true
    const response = await axios.get('/api/phones')
    phoneList.value = response.data.data.map(item => ({
      ...item,
      isEdit: false
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
    phone_number: row.phone_number
  }
}

// 保存电话
const savePhone = async (row) => {
  try {
    loading.value = true
    await axios.put(`/api/phones/${row.id}`, {
      phone_name: row.phone_name,
      phone_number: row.phone_number
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
      type: 'warning'
    })

    loading.value = true
    await axios.delete(`/api/phones/${row.id}`)
    phoneList.value = phoneList.value.filter(item => item.id !== row.id)
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
</style>
