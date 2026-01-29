<template>
  <div class="user-center-layout">
    <div class="layout-container">
      <!-- Left Sidebar Menu -->
      <aside class="sidebar-menu">
        <div v-for="group in menuGroups" :key="group.name" class="menu-group">
          <div class="group-title">{{ group.name }}</div>
          <div class="menu-items">
            <template v-for="item in group.items" :key="item.path || item.label">
              <!-- 一级菜单项 -->
              <router-link
                v-if="!item.children"
                :to="item.path"
                class="menu-item"
                :class="{ active: isActive(item.path) }"
              >
                <span class="item-icon">{{ item.icon }}</span>
                <span class="item-label">{{ item.label }}</span>
                <span v-if="item.badge" class="item-badge">{{ item.badge }}</span>
              </router-link>

              <!-- 有子菜单的项 -->
              <div v-else class="menu-item-group">
                <div
                  class="menu-item menu-item-parent"
                  :class="{ active: isItemGroupActive(item) }"
                  @click="toggleItemGroup(item.label)"
                >
                  <span class="item-icon">{{ item.icon }}</span>
                  <span class="item-label">{{ item.label }}</span>
                  <span class="expand-icon" :class="{ expanded: expandedGroups[item.label] }">›</span>
                </div>
                <div
                  class="menu-submenu"
                  v-show="expandedGroups[item.label]"
                >
                  <template v-for="subitem in item.children" :key="subitem.path">
                    <!-- 二级菜单项 -->
                    <router-link
                      v-if="!subitem.children"
                      :to="subitem.path"
                      class="menu-item menu-item-sub"
                      :class="{ active: isActive(subitem.path) }"
                    >
                      <span class="item-label">{{ subitem.label }}</span>
                      <span v-if="subitem.badge" class="item-badge">{{ subitem.badge }}</span>
                    </router-link>

                    <!-- 三级菜单 -->
                    <div v-else class="menu-item-group">
                      <div
                        class="menu-item menu-item-sub menu-item-parent"
                        :class="{ active: isItemGroupActive(subitem) }"
                        @click="toggleItemGroup(subitem.label)"
                      >
                        <span class="item-label">{{ subitem.label }}</span>
                        <span class="expand-icon" :class="{ expanded: expandedGroups[subitem.label] }">›</span>
                      </div>
                      <div
                        class="menu-submenu menu-submenu-level3"
                        v-show="expandedGroups[subitem.label]"
                      >
                        <router-link
                          v-for="thirditem in subitem.children"
                          :key="thirditem.path"
                          :to="thirditem.path"
                          class="menu-item menu-item-third"
                          :class="{ active: isActive(thirditem.path) }"
                        >
                          <span class="item-label">{{ thirditem.label }}</span>
                          <span v-if="thirditem.badge" class="item-badge">{{ thirditem.badge }}</span>
                        </router-link>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </template>
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
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const expandedGroups = ref({})

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
      {
        label: '船舶交易需求',
        icon: '',
        children: [
          { label: '出售船舶列表', path: '/user-center/demands/sale' },
          { label: '求购需求列表', path: '/user-center/demands/purchase' },
        ]
      },
      {
        label: '船舶修造需求',
        icon: '',
        children: [
          { label: '我的设计需求', path: '/user-center/demands/design' },
          { label: '我的造船需求', path: '/user-center/demands/shipbuilding' },
          { label: '我的维修需求', path: '/user-center/demands/repair' },
        ]
      },
      {
        label: '船舶租赁需求',
        icon: '',
        children: [
          { label: '发布的出租需求列表', path: '/user-center/demands/lease-publish' },
          { label: '求租需求列表', path: '/user-center/demands/lease-request' },
        ]
      }
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

const isItemGroupActive = (item) => {
  if (item.children) {
    return item.children.some(child => 
      child.path ? isActive(child.path) : isItemGroupActive(child)
    )
  }
  return false
}

const toggleItemGroup = (label) => {
  expandedGroups.value[label] = !expandedGroups.value[label]
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
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.sidebar-menu::-webkit-scrollbar {
  display: none;
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
  user-select: none;
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
  margin-left: auto;
}

/* 菜单项分组 */
.menu-item-group {
  display: flex;
  flex-direction: column;
}

.menu-item-parent {
  cursor: pointer;
}

.menu-item-parent.active {
  background: #EFF6FF;
  color: #1890FF;
  font-weight: 600;
}

.expand-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  color: #94A3B8;
  transition: transform 0.3s;
  margin-left: auto;
}

.expand-icon.expanded {
  transform: rotate(90deg);
  color: #1890FF;
}

/* 子菜单 */
.menu-submenu {
  display: flex;
  flex-direction: column;
  background: #FAFBFC;
}

.menu-item-sub {
  padding-left: 40px;
  font-size: 13px;
}

.menu-item-sub.menu-item-parent {
  cursor: pointer;
}

/* 三级菜单 */
.menu-submenu-level3 {
  background: white;
}

.menu-item-third {
  padding-left: 60px;
  font-size: 13px;
}

/* Content Area */
.content-area {
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  min-height: 600px;
  margin: 24px;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: thin;
  scrollbar-color: #CBD5E1 #F1F5F9;
}

.content-area::-webkit-scrollbar {
  width: 6px;
}

.content-area::-webkit-scrollbar-track {
  background: #F1F5F9;
  border-radius: 3px;
}

.content-area::-webkit-scrollbar-thumb {
  background: #CBD5E1;
  border-radius: 3px;
}

.content-area::-webkit-scrollbar-thumb:hover {
  background: #94A3B8;
}
</style>
