<template>
  <div class="box">
    <div class="tit">重点关注对象</div>
    <div class="boxnav">
      <div class="people-list" :style="{ transform: `translateY(${scrollTop}px)` }">
        <!-- 原始列表 -->
        <div v-for="person in recommendations" :key="person.serial_number" class="person-item">
          <img :src="getImageUrl(person.avatar)" alt="avatar" />
          <div class="person-info">
            <h3>{{ person.username }}</h3>
            <span>{{ person.serial_number || '暂无' }}</span>
            <p>{{ person.address }}</p>
          </div>
        </div>
        <!-- 克隆列表用于无缝滚动 -->
        <div
          v-for="person in recommendations"
          :key="person.serial_number + '_clone'"
          class="person-item"
        >
          <img :src="getImageUrl(person.avatar)" alt="avatar" />
          <div class="person-info">
            <h3>{{ person.username }}</h3>
            <span>{{ person.serial_number || '暂无' }}</span>
            <p>{{ person.address }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import request from '../../logic/register.js'
import default_avatar from '../../assets/images/miao.png'
export default {
  name: 'KeyPeople',
  setup() {
    const scrollTop = ref(0)
    const scrollHeight = ref(0)
    let timer = null
    let dataTimer = null
    const recommendations = ref([])

    // 获取图片完整URL
    const getImageUrl = (avatar) => {
      if (!avatar) return default_avatar
      const base_url = import.meta.env.VITE_API_BASE_URL.replace(/\/api$/, '')
      return `${base_url}${avatar}`
    }

    const calculateHeight = () => {
      const listElement = document.querySelector('.people-list')
      if (listElement && recommendations.value.length > 0) {
        const items = listElement.querySelectorAll('.person-item')
        scrollHeight.value = Array.from(items)
          .slice(0, recommendations.value.length)
          .reduce((acc, item) => acc + item.offsetHeight, 0)
      }
    }

    const startScroll = () => {
      if (timer) clearInterval(timer)
      const speed = 1
      timer = setInterval(() => {
        scrollTop.value -= speed
        if (Math.abs(scrollTop.value) >= scrollHeight.value) {
          scrollTop.value = 0
        }
      }, 50)
    }

    const fetchData = async () => {
      try {
        const response = await request.get('/analysis/user_form')
        if (response.code === 200 && response.data) {
          recommendations.value = response.data
          setTimeout(calculateHeight, 100)
        }
      } catch (error) {
        console.error('获取数据失败:', error)
      }
    }

    watch(
      recommendations,
      () => {
        calculateHeight()
        if (!timer && recommendations.value.length > 0) startScroll()
      },
      { deep: true },
    )

    onMounted(async () => {
      await fetchData()
      dataTimer = setInterval(fetchData, 5000)
    })

    onUnmounted(() => {
      if (timer) clearInterval(timer)
      if (dataTimer) clearInterval(dataTimer)
    })

    return {
      recommendations,
      scrollTop,
      getImageUrl,
    }
  },
}
</script>

<style scoped>
.box {
  height: 100%;
  background: rgba(0, 24, 106, 0.6);
  display: flex;
  flex-direction: column;
}

.tit {
  color: #fff;
  font-size: 18px;
  padding: 10px 15px;
}

.boxnav {
  flex: 1;
  padding: 0 15px;
  overflow: hidden;
  position: relative;
}

.people-list {
  transition: transform 0.3s linear;
}

.person-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background: rgba(255, 255, 255, 0.1);
  margin-bottom: 10px;
  border-radius: 6px;
}

.person-item img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 15px;
  object-fit: cover;
}

.person-info {
  flex: 1;
}

.person-info h3 {
  font-size: 16px;
  color: #fff;
  margin-bottom: 5px;
}

.person-info span {
  display: inline-block;
  padding: 2px 8px;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 12px;
  border-radius: 4px;
  margin-bottom: 5px;
}

.person-info p {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.4;
}

.boxnav:hover .people-list {
  animation-play-state: paused;
}
</style>
