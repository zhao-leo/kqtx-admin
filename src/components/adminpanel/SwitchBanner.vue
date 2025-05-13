<template>
  <div class="banner-manager">
    <!-- 上传按钮 -->
    <el-upload
      class="upload-section"
      accept=".jpg,.jpeg,.png"
      :on-success="handleUploadSuccess"
      :on-error="handleUploadError"
      :before-upload="beforeUpload"
      :show-file-list="false"
      :drag="true"
      :http-request="uploadFile"
    >
      <el-button type="primary" :loading="uploading"> 上传新图片 </el-button>
    </el-upload>

    <!-- 轮播图展示 -->
    <el-carousel v-if="banners.length" height="400px" class="banner-carousel">
      <el-carousel-item v-for="banner in banners" :key="banner.id">
        <div class="carousel-item">
          <img :src="banner.banner_image" alt="banner" />
          <div class="banner-actions">
            <el-button
              type="danger"
              size="small"
              @click.stop="deleteBanner(banner)"
              :loading="loading"
            >
              删除
            </el-button>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>

    <div v-else class="no-banner">暂无轮播图</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAuthStore } from '../../stores/token.js'

const banners = ref([])
const loading = ref(false)
const uploading = ref(false)

const IMAGE_BASEURL =
  import.meta.env.VITE_API_BASE_URL.split('/')[0] +
  '//' +
  import.meta.env.VITE_API_BASE_URL.split('/')[2]
const api = import.meta.env.VITE_API_BASE_URL + '/community/banners'
const token = useAuthStore().getToken()
axios.defaults.headers.common['Authorization'] = token
axios.defaults.headers.common['Content-Type'] = 'multipart/form-data'

// 获取轮播图列表
const getBanners = async () => {
  try {
    loading.value = true
    const response = await axios.get(api)
    if (response.data.data.length === 0) {
      banners.value = []
    } else {
      banners.value = response.data.data.map((banner) => ({
        ...banner,
        banner_image: IMAGE_BASEURL + banner.banner_image,
      }))
    }
  } catch (error) {
    ElMessage.error('获取轮播图列表失败')
    console.error('获取轮播图列表失败:', error)
  } finally {
    loading.value = false
  }
}

const uploadFile = async (file) => {
  const formData = new FormData()
  formData.append('banner', file.file)

  try {
    loading.value = true
    await axios.post(api, formData)
    await getBanners() // 刷新列表
  } catch (error) {
    ElMessage.error('上传失败')
    console.error('上传失败:', error)
  } finally {
    loading.value = false
  }
}

// 删除轮播图
const deleteBanner = async (banner) => {
  try {
    await ElMessageBox.confirm('确定要删除这张图片吗？', '提示', {
      type: 'warning',
    })

    loading.value = true
    await axios.delete(`${api}?pk=${banner.id}`)
    await getBanners() // 重新获取列表
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

// 上传前验证
const beforeUpload = (file) => {
  const allowedTypes = ['image/jpeg', 'image/png']
  const isImage = allowedTypes.includes(file.type)
  const isLt2M = file.size / 1024 / 1024 < 5

  if (!isImage) {
    ElMessage.error('只能上传图片文件！')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 5MB！')
    return false
  }
  uploading.value = true
  return true
}

// 上传成功处理
const handleUploadSuccess = async () => {
  uploading.value = false
  ElMessage.success('上传成功')
  await getBanners() // 刷新列表
}

// 上传失败处理
const handleUploadError = () => {
  uploading.value = false
  ElMessage.error('上传失败')
}

// 组件加载时获取轮播图列表
onMounted(() => {
  getBanners()
})
</script>

<style scoped>
.banner-manager {
  padding: 20px;
}

.upload-section {
  margin-bottom: 20px;
}

.banner-carousel {
  width: 100%;
  margin-top: 20px;
}

.carousel-item {
  position: relative;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.carousel-item img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.banner-actions {
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  padding: 10px;
}

.no-banner {
  text-align: center;
  padding: 40px;
  color: #909399;
  background: #f5f7fa;
  border-radius: 4px;
}
</style>
