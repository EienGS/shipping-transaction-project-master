<template>
  <header class="header">
    <div class="header-container">
      <div class="logo">
        <img src="../../public/images/logo.svg" alt="船行宝" class="logo-img" />
      </div>
      
      <nav class="nav">
        <router-link to="/" class="nav-item">首页</router-link>
        <router-link to="/shipping-finance" class="nav-item">航运金融</router-link>
        
        <div 
          class="nav-item dropdown"
          @mouseenter="handleMouseEnter"
          @mouseleave="handleMouseLeave"
        >
          <span class="nav-link">航运交易</span>
          <div 
            v-show="showDropdown" 
            class="dropdown-menu"
            @mouseenter="handleMouseEnter"
            @mouseleave="handleMouseLeave"
          >
            <router-link to="/shipping-trade/vessel-trading" class="dropdown-item">
              船舶交易
            </router-link>
            <router-link to="/ship-repair" class="dropdown-item">
              船舶修造
            </router-link>
            <router-link to="/vessel-leasing" class="dropdown-item">
              船舶租赁
            </router-link>
          </div>
        </div>
        
        <router-link to="/ship-supply" class="nav-item">船舶供位</router-link>
        <router-link to="/ship-service" class="nav-item">船员服务</router-link>
        <router-link to="/logistics-service" class="nav-item">航运性空服务</router-link>
        <router-link to="/logistics-goods" class="nav-item">物流服务</router-link>
        <router-link to="/data-service" class="nav-item">数据服务</router-link>
        <router-link to="/shipping-control" class="nav-item">航空智控</router-link>
      </nav>
      
      <div class="user-section">
        <router-link to="/admin" class="admin-btn">
          <svg class="admin-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7V11C2 16.55 6.84 21.74 12 23C17.16 21.74 22 16.55 22 11V7L12 2ZM12 11.99H18C17.47 15.11 15.2 17.78 12 18.92V12H6V8.3L12 5.19V11.99Z" fill="currentColor"/>
          </svg>
          <span>运营端</span>
        </router-link>
        <div class="divider"></div>
        <div class="more-menu">
          <span class="more-icon">⋯</span>
        </div>
        <div class="user-info">
          <span class="user-icon">👤</span>
          <span class="user-name">个人中心</span>
        </div>
        <div class="divider"></div>
        <div class="notification">
          <svg class="notification-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.37 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.64 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z" fill="currentColor"/>
          </svg>
          <span class="notification-badge">1</span>
        </div>
        <div class="company-info">
          <span class="company-name">江苏鑫和轮船...</span>
          <svg class="dropdown-arrow" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 4L6 8L10 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'

const showDropdown = ref(false)
let closeTimer = null

const handleMouseEnter = () => {
  if (closeTimer) {
    clearTimeout(closeTimer)
    closeTimer = null
  }
  showDropdown.value = true
}

const handleMouseLeave = () => {
  closeTimer = setTimeout(() => {
    showDropdown.value = false
  }, 200)
}
</script>

<style scoped>
.header {
  background-color: #e8ecf1;
  border-bottom: 1px solid #d0d7de;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 1000;
}

.header-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  height: 64px;
  gap: 32px;
}

.logo {
  display: flex;
  align-items: center;
}

.logo-img {
  height: 40px;
  width: auto;
}

.nav {
  display: flex;
  align-items: center;
  gap: 24px;
  flex: 1;
}

.nav-item {
  color: #2c3e50;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.2s;
  position: relative;
  padding: 8px 0;
}

.nav-item:hover,
.nav-item.router-link-active {
  color: #1890ff;
}

.nav-link {
  cursor: pointer;
}

.dropdown {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 0;
  padding-top: 8px;
  background-color: white;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  min-width: 120px;
  z-index: 1001;
}

.dropdown-menu::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 8px;
  background: transparent;
}

.dropdown-item {
  display: block;
  padding: 10px 20px;
  color: #2c3e50;
  font-size: 14px;
  transition: all 0.2s;
  white-space: nowrap;
  position: relative;
  z-index: 1;
}

.dropdown-item:hover {
  background-color: #f5f7fa;
  color: #1890ff;
}

.user-section {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-left: auto;
}

.admin-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s;
  box-shadow: 0 2px 4px rgba(102, 126, 234, 0.3);
}

.admin-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.4);
}

.admin-icon {
  width: 16px;
  height: 16px;
}

.more-menu {
  cursor: pointer;
  color: #606266;
  font-size: 20px;
  font-weight: bold;
  padding: 4px 8px;
  transition: color 0.2s;
}

.more-menu:hover {
  color: #1890ff;
}

.more-icon {
  display: block;
  line-height: 1;
}

.divider {
  width: 1px;
  height: 20px;
  background-color: #d0d7de;
}

.notification {
  position: relative;
  cursor: pointer;
  padding: 4px;
  transition: color 0.2s;
}

.notification:hover {
  color: #1890ff;
}

.notification-icon {
  width: 20px;
  height: 20px;
  color: #606266;
}

.notification:hover .notification-icon {
  color: #1890ff;
}

.notification-badge {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #ff4d4f;
  color: white;
  font-size: 10px;
  padding: 2px 5px;
  border-radius: 10px;
  min-width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  line-height: 1;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  color: #606266;
  font-size: 14px;
  transition: color 0.2s;
}

.user-info:hover {
  color: #1890ff;
}

.user-icon {
  font-size: 18px;
}

.user-name {
  white-space: nowrap;
}

.company-info {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  color: #606266;
  font-size: 13px;
  transition: color 0.2s;
}

.company-info:hover {
  color: #1890ff;
}

.company-name {
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dropdown-arrow {
  width: 12px;
  height: 12px;
  flex-shrink: 0;
}
</style>
