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
    <el-carousel v-if="banners.length" class="banner-carousel">
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

    <!-- 删除确认对话框 -->
    <el-dialog
      v-model="deleteDialogVisible"
      title="删除确认"
      width="400px"
      modal-class="custom-dialog"
      lock-scroll
    >
      <p>确定要删除这张图片吗？</p>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="deleteDialogVisible = false">取消</el-button>
          <el-button type="danger" @click="confirmDelete" :loading="loading">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '../../stores/token.js'

const banners = ref([])
const loading = ref(false)
const uploading = ref(false)
const deleteDialogVisible = ref(false)
const currentBanner = ref(null)

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
      banners.value = response.data.data.data.map((banner) => ({
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
const deleteBanner = (banner) => {
  currentBanner.value = banner
  deleteDialogVisible.value = true
}

// 确认删除
const confirmDelete = async () => {
  if (!currentBanner.value) return

  try {
    loading.value = true
    await axios.delete(`${api}?pk=${currentBanner.value.id}`)
    await getBanners() // 重新获取列表
    ElMessage.success('删除成功')
  } catch (error) {
    ElMessage.error('删除失败')
    console.error('删除失败:', error)
  } finally {
    loading.value = false
    deleteDialogVisible.value = false
    currentBanner.value = null
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
  padding: 25px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.05);
  height: 80vh;
  position: relative;
}

.upload-section {
  margin-bottom: 25px;
}

:deep(.el-upload-dragger) {
  background: rgba(255, 255, 255, 0.03);
  border: 2px dashed rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  color: rgba(255, 255, 255, 0.9);
}

:deep(.el-upload__text) {
  color: rgba(255, 255, 255, 0.9);
}

:deep(.el-upload-dragger i) {
  color: rgba(255, 255, 255, 0.6);
}

:deep(.el-upload-dragger:hover) {
  background: rgba(255, 255, 255, 0.05);
  border-color: #409eff;
}

:deep(.el-button--primary) {
  background: linear-gradient(45deg, #409eff, #60acff);
  border: none;
  padding: 12px 24px;
  font-weight: 500;
  transition: all 0.3s ease;
}

:deep(.el-button--primary:hover) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

.banner-carousel {
  width: 100%;
  margin-top: 25px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.15);
}

:deep(.el-carousel__item) {
  border-radius: 12px;
  overflow: hidden;
}

.carousel-item {
  position: relative;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #000;
  transition: all 0.3s ease;
}

.carousel-item img {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
  transition: all 0.5s ease;
}

.carousel-item:hover img {
  transform: scale(1.05);
}

.banner-actions {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  padding: 30px 10px 20px;
  transform: translateY(100%);
  transition: transform 0.3s ease;
}

.carousel-item:hover .banner-actions {
  transform: translateY(0);
}

:deep(.el-button--danger) {
  background: linear-gradient(45deg, #ff4757, #ff6b81);
  border: none;
  padding: 8px 20px;
  transition: all 0.3s ease;
}

:deep(.el-button--danger:hover) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 71, 87, 0.3);
}

.no-banner {
  text-align: center;
  padding: 60px 40px;
  color: rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  border: 2px dashed rgba(255, 255, 255, 0.1);
  font-size: 16px;
  animation: fadeIn 0.5s ease-out;
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

:deep(.el-carousel__button) {
  width: 30px;
  height: 3px;
  background-color: rgba(255, 255, 255, 0.4);
  transition: all 0.3s ease;
}

:deep(.el-carousel__button:hover),
:deep(.el-carousel__button--active) {
  background-color: #fff;
}

:deep(.el-carousel__arrow) {
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border-radius: 50%;
  transition: all 0.3s ease;
}

:deep(.el-carousel__arrow:hover) {
  background: rgba(0, 0, 0, 0.5);
  transform: scale(1.1);
}

/* 对话框样式 */
:deep(.el-dialog) {
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  margin-top: 15vh !important;
}

:deep(.custom-dialog) {
  padding-right: 0 !important;
}

:deep(.el-dialog__title) {
  color: #333;
  font-size: 18px;
  font-weight: 600;
}

:deep(.el-dialog__body) {
  color: #333;
  padding: 20px;
}

:deep(.el-dialog__footer) {
  padding: 15px 20px;
  border-top: 1px solid #eee;
}

:deep(.el-dialog__header) {
  margin: 0;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
