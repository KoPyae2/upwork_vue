export const orderManagement = [
  {
    name: "orderTracking",
    path: "/orderManagement/orderTracking",
    component: () => import("@/pages/orderManagement/orderTracking/index.vue"),
    meta: {
      title: "order_tracking",
      auth: true,
      layout: "admin",
      tagsView: true,
    },
  },
  {
    name: "memberOrder",
    path: "/orderManagement/memberOrder",
    component: () => import("@/pages/orderManagement/memberOrder/index.vue"),
    meta: {
      title: "member_order",
      auth: true,
      layout: "admin",
      tagsView: true,
    },
  },
  {
    name: "teaCoinOrder",
    path: "/orderManagement/teaCoinOrder",
    component: () => import("@/pages/orderManagement/teaCoinOrder/index.vue"),
    meta: {
      title: "tea_coin_order",
      auth: true,
      layout: "admin",
      tagsView: true,
    },
  },
  //   {
  //     name: "withdrawlApplication",
  //     path: "/orderManagement/withdrawlApplication",
  //     component: () =>
  //       import("@/pages/orderManagement/withdrawlApplication/index.vue"),
  //     meta: {
  //       title: "提現申請",
  //       auth: true,
  //       layout: "admin",
  //       tagsView: true,
  //     },
  //   },
  //   {
  //     name: "gameCashWithdrawlRecord",
  //     path: "/orderManagement/gameCashWithdrawlRecord",
  //     component: () =>
  //       import("@/pages/orderManagement/gameCashWithdrawlRecord/index.vue"),
  //     meta: {
  //       title: "游戏提現記錄",
  //       auth: true,
  //       layout: "admin",
  //       tagsView: true,
  //     },
  //   },
  //   {
  //     name: "revenueAndExpenditureRecords",
  //     path: "/orderManagement/revenueAndExpenditureRecords",
  //     component: () =>
  //       import("@/pages/orderManagement/revenueAndExpenditureRecords/index.vue"),
  //     meta: {
  //       title: "收支記錄",
  //       auth: true,
  //       layout: "admin",
  //       tagsView: true,
  //     },
  //   },
  //   {
  //     name: "coinConfiguration",
  //     path: "/orderManagement/coinConfiguration",
  //     component: () =>
  //       import("@/pages/orderManagement/coinConfiguration/index.vue"),
  //     meta: {
  //       title: "硬币配置",
  //       auth: true,
  //       layout: "admin",
  //       tagsView: true,
  //     },
  //   },
  //   {
  //     name: "noteViewSettings",
  //     path: "/orderManagement/noteViewSettings",
  //     component: () =>
  //       import("@/pages/orderManagement/noteViewSettings/index.vue"),
  //     meta: {
  //       title: "笔记视图设置",
  //       auth: true,
  //       layout: "admin",
  //       tagsView: true,
  //     },
  //   },
];
