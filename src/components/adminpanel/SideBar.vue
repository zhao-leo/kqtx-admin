<template>
  <el-menu
    class="sidebar-menu"
    :default-active="activeIndex"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
    :router="true"
  >
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
  background: rgba(20, 29, 47, 0.9) !important;
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
}

.sidebar-menu::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, rgba(0, 150, 255, 0.05) 0%, rgba(0, 0, 0, 0) 100%);
  pointer-events: none;
  z-index: -1;
}

.el-menu {
  border-right: none;
  background-color: transparent !important;
}

.el-menu-item {
  margin: 8px 0;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.el-menu-item:hover {
  background: rgba(255, 255, 255, 0.05) !important;
  transform: translateX(5px);
}

.el-menu-item.is-active {
  background: rgba(255, 255, 255, 0.1) !important;
  border-right: 3px solid #409eff;
}

.el-menu-item .el-icon {
  margin-right: 12px;
  font-size: 18px;
  transition: all 0.3s ease;
}

.el-menu-item:hover .el-icon {
  transform: scale(1.1);
  color: #409eff;
}

.el-menu-item span {
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.5px;
}
</style>
