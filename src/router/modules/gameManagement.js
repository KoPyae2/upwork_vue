export const gameManagement = [
  {
    name: "lottery",
    path: "/gameManagement/lottery",
    component: () => import("@/pages/gameManagement/lottery/index.vue"),
    meta: {
      title: "开奖数据",
      auth: true,
      layout: "admin",
      tagsView: true,
    },
  },
  {
    name: "gameRoom",
    path: "/gameManagement/gameRoom",
    component: () => import("@/pages/gameManagement/gameRoom/index.vue"),
    meta: {
      title: "game_list",
      auth: true,
      layout: "admin",
      tagsView: true,
    },
  },
  {
    name: "bettingRecord",
    path: "/gameManagement/bettingRecord",
    component: () => import("@/pages/gameManagement/bettingRecord/index.vue"),
    meta: {
      title: "投注记录",
      auth: true,
      layout: "admin",
      tagsView: true,
    },
  },
  {
    name: "gift",
    path: "/gameManagement/gift",
    component: () => import("@/pages/gameManagement/gift/index.vue"),
    meta: {
      title: "gift_box",
      auth: true,
      layout: "admin",
      tagsView: true,
    },
  },
  {
    name: "giftHistory",
    path: "/gameManagement/giftHistory",
    component: () => import("@/pages/gameManagement/giftHistory/index.vue"),
    meta: {
      title: "gift_history",
      auth: true,
      layout: "admin",
      tagsView: true,
    },
  },
];
