<template>
  <el-menu class="sidebar-menu" :default-active="activeIndex" background-color="#545c64" text-color="#fff"
    active-text-color="#ffd04b" :router="true">
    <el-menu-item-group index="1">
      <el-menu-item index="/panel/basic">
        <el-icon>
          <UserFilled />
        </el-icon>
        <span>基本信息</span>
      </el-menu-item>
    </el-menu-item-group>

    <el-menu-item-group index="2">
      <el-menu-item index="/panel/show">
        <el-icon>
          <Picture />
        </el-icon>
        <span>社区风采</span>
      </el-menu-item>
    </el-menu-item-group>

    <el-menu-item-group index="3">
      <el-menu-item index="/panel/report">
        <el-icon>
          <Setting />
        </el-icon>
        <span>报告生成</span>
      </el-menu-item>
    </el-menu-item-group>
  </el-menu>
</template>

<script setup>
import { ref } from 'vue'
import { UserFilled, Picture, Setting } from '@element-plus/icons-vue'

const activeIndex = ref('/panel/basic')
</script>

<style scoped>
.sidebar-menu {
  height: 100vh;
  width: 200px;
}

.el-menu {
  border-right: none;
}
</style>
