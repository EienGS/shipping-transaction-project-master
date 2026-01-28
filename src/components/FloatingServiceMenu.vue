<template>
  <div class="floating-service-menu" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
    <div class="menu-wrapper" :class="{ 'button-expanded': isButtonExpanded, 'menu-expanded': isMenuExpanded }">
      <!-- 子菜单项 -->
      <div v-for="(item, index) in menuItems" :key="item.name" class="menu-item"
        :style="{ transitionDelay: isMenuExpanded ? `${index * 80}ms` : '0ms' }" @click="handleMenuClick(item.name)">
        <div class="menu-icon">
          <svg v-html="item.icon" viewBox="0 0 24 24" fill="none"></svg>
        </div>
        <span class="menu-text">{{ item.label }}</span>
      </div>

      <!-- 主按钮 -->
      <button class="main-button">
        <svg class="main-icon" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" />
          <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" />
          <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" />
        </svg>
        <span class="main-text">我的服务</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isButtonExpanded = ref(false)
const isMenuExpanded = ref(false)
let expandTimer = null

const handleMouseEnter = () => {
  if (expandTimer) clearTimeout(expandTimer)

  // 第一阶段：按钮平滑展开为圆角矩形
  isButtonExpanded.value = true

  // 第二阶段：延迟300ms后展开子菜单（等待按钮展开完成）
  expandTimer = setTimeout(() => {
    isMenuExpanded.value = true
  }, 300)
}

const handleMouseLeave = () => {
  if (expandTimer) clearTimeout(expandTimer)

  // 立即收起所有
  isMenuExpanded.value = false
  isButtonExpanded.value = false
}

const menuItems = [
  {
    name: 'intentions',
    label: '意向记录',
    icon: '<path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M12 12H15M12 16H15M9 12H9.01M9 16H9.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
  },
  {
    name: 'demands',
    label: '需求管理',
    icon: '<path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M12 12H15M12 16H15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
  },
    {
    name: 'fuwushangguanli',
    label: '服务管理',
    icon: '<path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M12 12H15M12 16H15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
  },
  {
    name: 'verification',
    label: '交易鉴证',
    icon: '<path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
  },
    {
    name: 'zuhoujiance',
    label: '租后监测',
    icon: '<path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M12 12H15M12 16H15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
  },
  {
    name: 'favorites',
    label: '我的收藏',
    icon: '<path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
  }
]

const handleMenuClick = (menuName) => {
  console.log('[v0] 点击菜单:', menuName)

  const routes = {
    intentions: '/user-center/intentions/trade',
    verification: '/user-center/verification',
    demands: '/user-center/demands/sale',
    favorites: '/user-center/favorites/trade'
  }

  if (routes[menuName]) {
    window.location.href = routes[menuName]
  }
}
</script>

<style scoped>
.floating-service-menu {
  position: fixed;
  right: 40px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 9999;
}

.menu-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
}

/* 主按钮 - 初始为圆形 */
.main-button {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  width: 56px;
  height: 56px;
  padding: 0;
  background: linear-gradient(135deg, #1B3F6B 0%, #2A5A8F 100%);
  color: white;
  border: none;
  border-radius: 28px;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(27, 63, 107, 0.4);
  transition: width 0.5s ease, padding 0.5s ease, gap 0.5s ease, box-shadow 0.3s ease;
  overflow: hidden;
}

.main-icon {
  width: 28px;
  height: 28px;
  color: white;
  flex-shrink: 0;
  transition: margin 0.5s ease;
  margin-left: 0;
}

.main-text {
  font-size: 15px;
  font-weight: 600;
  white-space: nowrap;
  opacity: 0;
  max-width: 0;
  overflow: hidden;
  transition: opacity 0.4s ease 0.1s, max-width 0.5s ease;
}

/* 按钮展开状态 - 平滑展开为圆角矩形 */
.menu-wrapper.button-expanded .main-button {
  width: 150px;
  padding: 0 20px;
  gap: 10px;
  box-shadow: 0 6px 24px rgba(27, 63, 107, 0.5);
}

.menu-wrapper.button-expanded .main-icon {
  margin-left: 0;
}

.menu-wrapper.button-expanded .main-text {
  opacity: 1;
  max-width: 100px;
}

/* 菜单项 - 初始隐藏 */
.menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 18px;
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 24px;
  cursor: pointer;
  opacity: 0;
  visibility: hidden;
  transform: translateX(40px);
  transition: opacity 0.4s ease, transform 0.5s ease, visibility 0s linear 0.4s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  min-width: 130px;
}

/* 菜单展开状态 */
.menu-wrapper.menu-expanded .menu-item {
  opacity: 1;
  visibility: visible;
  transform: translateX(0);
  transition: opacity 0.4s ease, transform 0.5s ease, visibility 0s linear 0s;
}

.menu-item:hover {
  background: linear-gradient(135deg, #1B3F6B 0%, #2A5A8F 100%);
  border-color: #1B3F6B;
  transform: translateX(-6px);
  box-shadow: 0 4px 16px rgba(27, 63, 107, 0.3);
}

.menu-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-icon svg {
  width: 100%;
  height: 100%;
  color: #1B3F6B;
  transition: color 0.3s;
}

.menu-item:hover .menu-icon svg {
  color: white;
}

.menu-text {
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  color: #374151;
  transition: color 0.3s;
}

.menu-item:hover .menu-text {
  color: white;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .floating-service-menu {
    right: 20px;
  }

  .main-button,
  .menu-item {
    min-width: 120px;
  }

  .main-text {
    font-size: 14px;
  }

  .menu-text {
    font-size: 13px;
  }
}
</style>
