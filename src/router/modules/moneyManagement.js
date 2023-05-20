export const moneyManagement = [
  // {
  //   name: "bank",
  //   path: "/moneyManagement/bank",
  //   component: () => import("@/pages/moneyManagement/bank/index.vue"),
  //   meta: {
  //     title: "支付列表",
  //     auth: true,
  //     layout: "admin",
  //     tagsView: true,
  //   },
  // },
  // {
  //   name: "userBank",
  //   path: "/moneyManagement/userbank",
  //   component: () => import("@/pages/moneyManagement/userBank/index.vue"),
  //   meta: {
  //     title: "用户银行",
  //     auth: true,
  //     layout: "admin",
  //     tagsView: true,
  //   },
  // },
  // {
  //   name: "withdraw",
  //   path: "/moneyManagement/withdraw",
  //   component: () => import("@/pages/moneyManagement/withdraw/index.vue"),
  //   meta: {
  //     title: "兑换列表",
  //     auth: true,
  //     layout: "admin",
  //     tagsView: true,
  //   },
  // },
  // {
  //   name: "recharge",
  //   path: "/moneyManagement/recharge",
  //   component: () => import("@/pages/moneyManagement/recharge/index.vue"),
  //   meta: {
  //     title: "充值列表",
  //     auth: true,
  //     layout: "admin",
  //     tagsView: true,
  //   },
  // },
  // {
  //   name: "withdrawConfig",
  //   path: "/moneyManagement/withdrawConfig",
  //   component: () => import("@/pages/moneyManagement/withdrawConfig/index.vue"),
  //   meta: {
  //     title: "兑换配置",
  //     auth: true,
  //     layout: "admin",
  //     tagsView: true,
  //   },
  // },

  {
    name: "revenueRecord",
    path: "/moneyManagement/revenueRecord",
    component: () => import("@/pages/moneyManagement/revenueRecord/index.vue"),
    meta: {
      title: "revenue_record",
      auth: true,
      layout: "admin",
      tagsView: true,
    },
  },
  {
    name: "提现记录",
    path: "/moneyManagement/moneyWithdraw",
    component: () => import("@/pages/moneyManagement/moneyWithdraw/index.vue"),
    meta: {
      title: "withdraw_record",
      auth: true,
      layout: "admin",
      tagsView: true,
    },
  },
  {
    name: "兑换配置",
    path: "/moneyManagement/withdrawConfig",
    component: () => import("@/pages/moneyManagement/withdrawConfig/index.vue"),
    meta: {
      title: "exchange_configuration",
      auth: true,
      layout: "admin",
      tagsView: true,
    },
  },
];
