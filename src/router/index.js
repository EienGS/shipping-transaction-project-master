import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/shipping-trade',
    name: 'ShippingTrade',
    redirect: '/shipping-trade/vessel-trading'
  },
  {
    path: '/shipping-trade/vessel-trading',
    name: 'VesselTrading',
    component: () => import('../views/shipping-trade/VesselTrading.vue')
  },
  {
    path: '/shipping-trade/vessel-repair',
    name: 'VesselRepair',
    component: () => import('../views/shipping-trade/VesselRepair.vue')
  },
  {
    path: '/vessel-leasing',
    name: 'VesselLeasingHome',
    component: () => import('../views/vessel-leasing/VesselLeasingHome.vue')
  },
  {
    path: '/vessel-leasing/publish-lease',
    name: 'PublishLease',
    component: () => import('../views/vessel-leasing/PublishLease.vue')
  },
  {
    path: '/vessel-leasing/publish-demand',
    name: 'PublishLeaseDemand',
    component: () => import('../views/vessel-leasing/PublishLeaseDemand.vue')
  },
  {
    path: '/vessel-leasing/publish-idle',
    name: 'PublishIdle',
    component: () => import('../views/vessel-leasing/PublishIdle.vue')
  },
  {
    path: '/vessel-leasing/idle/:id',
    name: 'IdleVesselDetail',
    component: () => import('../views/vessel-leasing/IdleVesselDetail.vue')
  },
  {
    path: '/vessel-leasing/demand/:id',
    name: 'LeaseDemandDetail',
    component: () => import('../views/vessel-leasing/LeaseDemandDetail.vue')
  },
  {
    path: '/shipping-trade/buy-vessel',
    name: 'BuyVesselForm',
    component: () => import('../views/shipping-trade/BuyVesselForm.vue')
  },
  {
    path: '/shipping-trade/sell-vessel',
    name: 'SellVesselForm',
    component: () => import('../views/shipping-trade/SellVesselForm.vue')
  },
  {
    path: '/shipping-trade/vessel/:id',
    name: 'VesselDetail',
    component: () => import('../views/shipping-trade/VesselDetail.vue')
  },
  {
    path: '/shipping-trade/purchase/:id',
    name: 'PurchaseDetail',
    component: () => import('../views/shipping-trade/PurchaseDetail.vue')
  },
  {
    path: '/user-center',
    component: () => import('../views/user-center/UserCenterLayout.vue'),
    redirect: '/user-center/intentions/trade',
    children: [
      {
        path: 'intentions/trade',
        name: 'TradeIntentions',
        component: () => import('../views/user-center/TradeIntentions.vue')
      },
      {
        path: 'intentions/repair',
        name: 'RepairIntentions',
        component: () => import('../views/user-center/RepairIntentions.vue')
      },
      {
        path: 'intentions/lease',
        name: 'LeaseIntentions',
        component: () => import('../views/user-center/LeaseIntentions.vue')
      },
      {
        path: 'demands/sale',
        name: 'SaleDemands',
        component: () => import('../views/user-center/SaleDemands.vue')
      },
      {
        path: 'demands/purchase',
        name: 'PurchaseDemands',
        component: () => import('../views/user-center/PurchaseDemands.vue')
      },
      {
        path: 'favorites/trade',
        name: 'TradeFavorites',
        component: () => import('../views/user-center/TradeFavorites.vue')
      },
      {
        path: 'rental-monitoring',
        name: 'LeaseMonitoringCenter',
        component: () => import('../views/user-center/LeaseMonitoringCenter.vue')
      },
      {
        path: 'favorites/repair',
        name: 'RepairFavorites',
        component: () => import('../views/user-center/RepairFavorites.vue')
      },
      {
        path: 'favorites/lease',
        name: 'LeaseFavorites',
        component: () => import('../views/user-center/LeaseFavorites.vue')
      },
      {
        path: 'trade-verification',
        name: 'TradeVerificationCenter',
        component: () => import('../views/user-center/TradeVerificationCenter.vue')
      },
      {
        path: 'service/center',
        name: 'ServiceCenter',
        component: () => import('../views/user-center/ServiceCenter.vue')
      },
      {
        path: 'service/design',
        name: 'DesignProviderMaintenance',
        component: () => import('../views/user-center/DesignProviderMaintenance.vue')
      },
    ]
  },
  {
    path: '/shipping-trade/all-vessels',
    name: 'AllVesselsPage',
    component: () => import('../views/shipping-trade/AllVesselsPage.vue')
  },
  {
    path: '/shipping-trade/all-purchases',
    name: 'AllPurchasesPage',
    component: () => import('../views/shipping-trade/AllPurchasesPage.vue')
  },
  {
    path: '/ship-repair',
    name: 'ShipRepairHome',
    component: () => import('../views/ship-repair/ShipRepairHome.vue')
  },
  {
    path: '/ship-repair/publish-demand/:type',
    name: 'PublishDemand',
    component: () => import('../views/ship-repair/PublishDemand.vue')
  },
  {
    path: '/ship-repair/design/:id',
    name: 'ProviderDetail',
    component: () => import('../views/ship-repair/ProviderDetail.vue')
  },
  {
    path: '/ship-repair/building/:id',
    name: 'BuildingYardDetail',
    component: () => import('../views/ship-repair/BuildingYardDetail.vue')
  },
  {
    path: '/ship-repair/repair/:id',
    name: 'RepairYardDetail',
    component: () => import('../views/ship-repair/RepairYardDetail.vue')
  },
  {
    path: '/ship-repair/demand/:id',
    name: 'DemandDetail',
    component: () => import('../views/ship-repair/DemandDetail.vue')
  },
  {
    path: '/monitoring-dashboard',
    name: 'MonitoringDashboard',
    component: () => import('../views/monitoring/MonitoringDashboard.vue')
  },
  {
    path: '/ship-repair/build-demand/:id',
    name: 'ShipbuildingDemandDetail',
    component: () => import('../views/ship-repair/ShipbuildingDemandDetail.vue')
  },
  {
    path: '/ship-repair/repair-demand/:id',
    name: 'RepairDemandDetail',
    component: () => import('../views/ship-repair/RepairDemandDetail.vue')
  },
  // 运营端路由
  {
    path: '/admin',
    component: () => import('../views/admin/AdminLayout.vue'),
    redirect: '/admin/home',
    children: [
      {
        path: 'home',
        name: 'AdminHome',
        component: () => import('../views/admin/AdminHome.vue')
      },
      // 船舶交易管理
      {
        path: 'trade/purchase-audit',
        name: 'PurchaseAudit',
        component: () => import('../views/admin/trade/PurchaseAudit.vue')
      },
      {
        path: 'trade/sale-audit',
        name: 'SaleAudit',
        component: () => import('../views/admin/trade/SaleAudit.vue')
      },
      {
        path: 'trade/transaction',
        name: 'TransactionManage',
        component: () => import('../views/admin/trade/TransactionManage.vue')
      },
      {
        path: 'trade/verification-audit',
        name: 'VerificationAudit',
        component: () => import('../views/admin/trade/VerificationAudit.vue')
      },
      {
        path: 'trade/certificate',
        name: 'CertificateManage',
        component: () => import('../views/admin/trade/CertificateManage.vue')
      },
      // 船舶修造管理
      {
        path: 'repair/design-audit',
        name: 'DesignDemandAudit',
        component: () => import('../views/admin/repair/DesignDemandAudit.vue')
      },
      {
        path: 'repair/building-audit',
        name: 'BuildingDemandAudit',
        component: () => import('../views/admin/repair/BuildingDemandAudit.vue')
      },
      {
        path: 'repair/repair-audit',
        name: 'RepairDemandAudit',
        component: () => import('../views/admin/repair/RepairDemandAudit.vue')
      },
      {
        path: 'repair/design-provider-audit',
        name: 'DesignProviderAudit',
        component: () => import('../views/admin/repair/DesignProviderAudit.vue')
      },
      {
        path: 'repair/shipyard-audit',
        name: 'ShipyardAudit',
        component: () => import('../views/admin/repair/ShipyardAudit.vue')
      },
      {
        path: 'repair/repair-yard-audit',
        name: 'RepairYardAudit',
        component: () => import('../views/admin/repair/RepairYardAudit.vue')
      },
      {
        path: 'repair/progress',
        name: 'ServiceProgress',
        component: () => import('../views/admin/repair/ServiceProgress.vue')
      },
      {
        path: 'repair/review',
        name: 'ReviewManage',
        component: () => import('../views/admin/repair/ReviewManage.vue')
      },
      // 船舶租赁管理
      {
        path: 'lease/lease-audit',
        name: 'LeaseInfoAudit',
        component: () => import('../views/admin/lease/LeaseInfoAudit.vue')
      },
      {
        path: 'lease/idle-audit',
        name: 'IdleVesselAudit',
        component: () => import('../views/admin/lease/IdleVesselAudit.vue')
      },
      {
        path: 'lease/demand-audit',
        name: 'LeaseDemandAudit',
        component: () => import('../views/admin/lease/LeaseDemandAudit.vue')
      },
      {
        path: 'lease/monitor-audit',
        name: 'MonitorAudit',
        component: () => import('../views/admin/lease/MonitorAudit.vue')
      },
      {
        path: 'lease/monitor-manage',
        name: 'MonitorManage',
        component: () => import('../views/admin/lease/MonitorManage.vue')
      },
      // 数据统计
      {
        path: 'statistics/trade',
        name: 'TradeStatistics',
        component: () => import('../views/admin/statistics/TradeStatistics.vue')
      },
      {
        path: 'statistics/repair',
        name: 'RepairStatistics',
        component: () => import('../views/admin/statistics/RepairStatistics.vue')
      },
      {
        path: 'statistics/lease',
        name: 'LeaseStatistics',
        component: () => import('../views/admin/statistics/LeaseStatistics.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
