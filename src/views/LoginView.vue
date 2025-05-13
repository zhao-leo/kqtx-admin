<template>
  <div class="login-view">
    <div class="login-bg">
      <div class="bg-text">
        <h1>矿桥东街社区管理系统</h1>
        <p>智慧养老，为爱护航</p>
      </div>
    </div>
    <div class="login-container">
      <div class="login-box">
        <div class="login-tabs">
          <div class="tab-item" :class="{ active: currentTab === 'password' }" @click="currentTab = 'password'">
            账号登录
          </div>
          <div class="tab-item" :class="{ active: currentTab === 'qrcode' }" @click="currentTab = 'qrcode'">
            微信登录
          </div>
        </div>
        <div class="tab-content">
          <NameAndPassword v-if="currentTab === 'password'" />
          <WeiXinQRcode v-else />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import NameAndPassword from '@/components/login/NameAndPassword.vue';
import WeiXinQRcode from '@/components/login/WeiXinQRcode.vue';

const currentTab = ref('password');
</script>

<style scoped>
.login-view {
  width: 100vw;
  height: 100vh;
  display: flex;
  background-color: #f0f2f5;
}

.login-bg {
  flex: 1;
  background: url('@/assets/images/bg3.png') center center no-repeat;
  background-size: cover;
  position: relative;
}

.bg-text {
  position: absolute;
  left: 50%;
  top: 30%;
  transform: translateX(-50%);
  text-align: center;
  color: #fff;
}

.bg-text h1 {
  font-size: 36px;
  font-weight: 500;
  margin-bottom: 16px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.bg-text p {
  font-size: 20px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.login-container {
  width: 480px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
}

.login-box {
  width: 100%;
  padding: 40px;
}

.login-tabs {
  display: flex;
  margin-bottom: 24px;
  border-bottom: 1px solid #e4e7ed;
}

.tab-item {
  padding: 0 20px 12px;
  margin: 0 20px;
  font-size: 16px;
  color: #606266;
  cursor: pointer;
  position: relative;
}

.tab-item.active {
  color: #409eff;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #409eff;
}

.tab-content {
  display: flex;
  justify-content: center;
  padding-top: 20px;
}
</style>
