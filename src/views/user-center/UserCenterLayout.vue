<template>
  <div class="user-center-layout">
    <div class="layout-container">
      <!-- Left Sidebar Menu -->
      <aside class="sidebar-menu">
        <div v-for="group in menuGroups" :key="group.name" class="menu-group">
          <div class="group-title">{{ group.name }}</div>
          <div class="menu-items">
            <router-link
              v-for="item in group.items"
              :key="item.path"
              :to="item.path"
              class="menu-item"
              :class="{ active: isActive(item.path) }"
            >
              <span class="item-icon">{{ item.icon }}</span>
              <span class="item-label">{{ item.label }}</span>
              <span v-if="item.badge" class="item-badge">{{ item.badge }}</span>
            </router-link>
          </div>
        </div>
      </aside>

      <!-- Right Content Area -->
      <main class="content-area">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const menuGroups = [
  {
    name: '意向记录',
    items: [
      { label: '交易意向记录', path: '/user-center/intentions/trade', icon: '' },
      { label: '修造意向记录', path: '/user-center/intentions/repair', icon: '' },
      { label: '租赁意向记录', path: '/user-center/intentions/lease', icon: '' },
    ]
  },
  {
    name: '需求管理',
    items: [
      { label: '出售船舶列表', path: '/user-center/demands/sale', icon: '' },
      { label: '求购需求列表', path: '/user-center/demands/purchase', icon: '' },
    ]
  },
  {
    name: '服务管理',
    items: [
      { label: '设计院维护', path: '/user-center/service/design', icon: '' },
      { label: '造船厂维护', path: '/user-center/service/shipyard', icon: '' },
      { label: '修船厂维护', path: '/user-center/service/repair', icon: '' },
    ]
  },
  {
    name: '交易鉴证',
    items: [
      { label: '交易鉴证', path: '/user-center/trade-verification', icon: '' },
    ]
  },
  {
    name: '租后监测',
    items: [
      { label: '租后监测', path: '/user-center/rental-monitoring', icon: '' },
    ]
  },
  {
    name: '我的收藏',
    items: [
      { label: '购售需求收藏', path: '/user-center/favorites/trade', icon: '' },
      { label: '修造需求收藏', path: '/user-center/favorites/repair', icon: '' },
      { label: '租赁需求收藏', path: '/user-center/favorites/lease', icon: '' },
    ]
  }
]

const isActive = (path) => {
  return route.path === path
}
</script>

<style scoped>
.user-center-layout {
  min-height: 100vh;
  background: #F5F7FA;
}

.layout-container {
  margin: 0 auto;
  display: grid;
  grid-template-columns: 260px 1fr;
}

/* Sidebar Menu */
.sidebar-menu {
  background: white;
  padding: 20px 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  height: calc(100vh - 64px);
  position: sticky;
  top: 64px;
}

.menu-group {
  margin-bottom: 24px;
}

.menu-group:last-child {
  margin-bottom: 0;
}

.group-title {
  padding: 0 20px 12px;
  font-size: 13px;
  font-weight: 700;
  color: #94A3B8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.menu-items {
  display: flex;
  flex-direction: column;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  color: #64748B;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s;
  position: relative;
}

.menu-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: #1890FF;
  opacity: 0;
  transition: opacity 0.3s;
}

.menu-item:hover {
  background: #F8FAFC;
  color: #1890FF;
}

.menu-item.active {
  background: #EFF6FF;
  color: #1890FF;
  font-weight: 600;
}

.menu-item.active::before {
  opacity: 1;
}

.item-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.item-label {
  flex: 1;
}

.item-badge {
  padding: 2px 8px;
  background: #FEE2E2;
  color: #EF4444;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 700;
}

/* Content Area */
.content-area {
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  min-height: 600px;
  margin: 24px;
}
</style>
