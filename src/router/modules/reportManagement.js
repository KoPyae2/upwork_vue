export const reportManagement = [
  {
    name: "userStatistic",
    path: "/reportManagement/userStatistic",
    component: () => import("@/pages/reportManagement/userStatistic/index.vue"),
    meta: {
      title: "user_report",
      auth: true,
      layout: "admin",
      tagsView: true,
    },
  },
  {
    name: "businessStatistic",
    path: "/reportManagement/businessStatistic",
    component: () =>
      import("@/pages/reportManagement/businessStatistic/index.vue"),
    meta: {
      title: "business_report",
      auth: true,
      layout: "admin",
      tagsView: true,
    },
  },
  {
    name: "noteStatistic",
    path: "/reportManagement/noteStatistic",
    component: () => import("@/pages/reportManagement/noteStatistic/index.vue"),
    meta: {
      title: "付费统计",
      auth: true,
      layout: "admin",
      tagsView: true,
    },
  },
  {
    name: "gameStatistic",
    path: "/reportManagement/gameStatistic",
    component: () => import("@/pages/reportManagement/gameStatistic/index.vue"),
    meta: {
      title: "游戏统计",
      auth: true,
      layout: "admin",
      tagsView: true,
    },
  },
  {
    name: "dailyStatistic",
    path: "/reportManagement/dailyStatistic",
    component: () =>
      import("@/pages/reportManagement/dailyStatistic/index.vue"),
    meta: {
      title: "日常统计",
      auth: true,
      layout: "admin",
      tagsView: true,
    },
  },
  {
    name: "agentStatistic",
    path: "/reportManagement/agentStatistic",
    component: () =>
      import("@/pages/reportManagement/agentStatistic/index.vue"),
    meta: {
      title: "代理统计",
      auth: true,
      layout: "admin",
      tagsView: true,
    },
  },
  {
    name: "operationStatistics",
    path: "/reportManagement/operationStatistics",
    component: () =>
      import("@/pages/reportManagement/operationStatistics/index.vue"),
    meta: {
      title: "operation_report",
      auth: true,
      layout: "admin",
      tagsView: true,
    },
  },
  {
    name: "paidStatistics",
    path: "/reportManagement/paidStatistics",
    component: () =>
      import("@/pages/reportManagement/paidStatistics/index.vue"),
    meta: {
      title: "paid_report",
      auth: true,
      layout: "admin",
      tagsView: true,
    },
  },
  {
    name: "auditTrail",
    path: "/reportManagement/auditTrail",
    component: () => import("@/pages/reportManagement/auditTrail/index.vue"),
    meta: {
      title: "audit_report",
      auth: true,
      layout: "admin",
      tagsView: true,
    },
  },
];
