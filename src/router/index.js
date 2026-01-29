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
        path: 'verification',
        name: 'Verification',
        component: () => import('../views/user-center/Verification.vue')
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
      }
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
    path: '/ship-repair/build-demand/:id',
    name: 'ShipbuildingDemandDetail',
    component: () => import('../views/ship-repair/ShipbuildingDemandDetail.vue')
  },
  {
    path: '/ship-repair/repair-demand/:id',
    name: 'RepairDemandDetail',
    component: () => import('../views/ship-repair/RepairDemandDetail.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
