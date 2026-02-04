<template>
  <div class="admin-layout">
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
                  <span class="item-label">{{ item.label }}</span>
                  <span class="expand-icon" :class="{ expanded: expandedGroups[item.label] }">›</span>
                </div>
                <div
                  class="menu-submenu"
                  v-show="expandedGroups[item.label]"
                >
                  <router-link
                    v-for="subitem in item.children"
                    :key="subitem.path"
                    :to="subitem.path"
                    class="menu-item menu-item-sub"
                    :class="{ active: isActive(subitem.path) }"
                  >
                    <span class="item-label">{{ subitem.label }}</span>
                    <span v-if="subitem.badge" class="item-badge">{{ subitem.badge }}</span>
                  </router-link>
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
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const expandedGroups = ref({})

const menuGroups = [
  {
    name: '船舶交易管理',
    items: [
      {
        label: '交易信息审核',
        children: [
          { label: '求购信息审核', path: '/admin/trade/purchase-audit' },
          { label: '出售信息审核', path: '/admin/trade/sale-audit' },
        ]
      },
      { label: '成交信息管理', path: '/admin/trade/transaction'},
      {
        label: '交易鉴证管理',
        children: [
          { label: '鉴证申请审核', path: '/admin/trade/verification-audit' },
          { label: '鉴证书管理', path: '/admin/trade/certificate' },
        ]
      },
    ]
  },
  {
    name: '船舶修造管理',
    items: [
      {
        label: '修造信息审核',
        children: [
          { label: '设计需求审核', path: '/admin/repair/design-audit' },
          { label: '建造需求审核', path: '/admin/repair/building-audit' },
          { label: '维修需求审核', path: '/admin/repair/repair-audit' },
          { label: '设计院信息审核', path: '/admin/repair/design-provider-audit' },
          { label: '造船厂信息审核', path: '/admin/repair/shipyard-audit' },
          { label: '修船厂信息审核', path: '/admin/repair/repair-yard-audit' },
        ]
      },
      { label: '服务进度管控', path: '/admin/repair/progress' },
      { label: '口碑评价管理', path: '/admin/repair/review' },
    ]
  },
  {
    name: '船舶租赁管理',
    items: [
      {
        label: '租赁信息审核',
        children: [
          { label: '租赁信息审核', path: '/admin/lease/lease-audit' },
          { label: '空船信息审核', path: '/admin/lease/idle-audit' },
          { label: '求租信息审核', path: '/admin/lease/demand-audit' },
        ]
      },
      {
        label: '租后监测管理',
        children: [
          { label: '监测申请审核', path: '/admin/lease/monitor-audit' },
          { label: '监测服务管控', path: '/admin/lease/monitor-manage' },
        ]
      },
    ]
  },
  {
    name: '数据统计',
    items: [
      { label: '交易数据统计', path: '/admin/statistics/trade'},
      { label: '修造数据统计', path: '/admin/statistics/repair'},
      { label: '租赁数据统计', path: '/admin/statistics/lease'},
    ]
  }
]

const isActive = (path) => {
  return route.path === path
}

const isItemGroupActive = (item) => {
  if (item.children) {
    return item.children.some(child => isActive(child.path))
  }
  return false
}

const toggleItemGroup = (label) => {
  expandedGroups.value[label] = !expandedGroups.value[label]
}
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
}

.layout-container {
  margin: 0 auto;
  display: grid;
  grid-template-columns: 280px 1fr;
}

/* Sidebar Menu */
.sidebar-menu {
  background: white;
  padding: 0;
  box-shadow: 2px 0 8px rgba(102, 126, 234, 0.08);
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
  margin: 20px 0;
  padding: 0 0 20px;
  border-bottom: 1px solid #F1F5F9;
}

.menu-group:last-child {
  border-bottom: none;
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  opacity: 0;
  transition: opacity 0.3s;
}

.menu-item:hover {
  background: linear-gradient(135deg, #667eea08 0%, #764ba208 100%);
  color: #667eea;
}

.menu-item.active {
  background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
  color: #667eea;
  font-weight: 600;
}

.menu-item.active::before {
  opacity: 1;
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
  background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
  color: #667eea;
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
  color: #667eea;
}

/* 子菜单 */
.menu-submenu {
  display: flex;
  flex-direction: column;
  background: #FAFBFC;
}

.menu-item-sub {
  padding-left: 52px;
  font-size: 13px;
}

/* Content Area */
.content-area {
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  min-height: calc(100vh - 112px);
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
