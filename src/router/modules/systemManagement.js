export const systemManagement = [
  {
    name: "city",
    path: "/systemManagement/city",
    component: () => import("@/pages/systemManagement/city/index.vue"),
    meta: {
      title: "city",
      auth: true,
      layout: "admin",
      tagsView: true,
    },
  },
  {
    name: "province",
    path: "/systemManagement/province",
    component: () => import("@/pages/systemManagement/province/index.vue"),
    meta: {
      title: "province",
      auth: true,
      layout: "admin",
      tagsView: true,
    },
  },
  {
    name: "defaultCity",
    path: "/systemManagement/defaultCity",
    component: () => import("@/pages/systemManagement/defaultCity/index.vue"),
    meta: {
      title: "default_city",
      auth: true,
      layout: "admin",
      tagsView: true,
    },
  },
  // {
  //   name: "systemData",
  //   path: "/systemManagement/systemData",
  //   component: () => import("@/pages/systemManagement/systemData/index.vue"),
  //   meta: {
  //     title: "系统参数",
  //     auth: true,
  //     layout: "admin",
  //     tagsView: true,
  //   },
  // },
  {
    name: "defaultAvatar",
    path: "/systemManagement/defaultAvatar",
    component: () => import("@/pages/systemManagement/defaultAvatar/index.vue"),
    meta: {
      title: "default_avatar",
      auth: true,
      layout: "admin",
      tagsView: true,
    },
  },
  {
    name: "hotKeywords",
    path: "/systemManagement/hotKeywords",
    component: () => import("@/pages/systemManagement/hotKeywords/index.vue"),
    meta: {
      title: "hot_keywords",
      auth: true,
      layout: "admin",
      tagsView: true,
    },
  },
  {
    name: "bannedKeyword",
    path: "/systemManagement/bannedKeyword",
    component: () => import("@/pages/systemManagement/bannedKeyword/index.vue"),
    meta: {
      title: "banned_keywords",
      auth: true,
      layout: "admin",
      tagsView: true,
    },
  },
  {
    name: "systemLanguaes",
    path: "/systemManagement/systemLanguaes",
    component: () =>
      import("@/pages/systemManagement/systemLanguages/index.vue"),
    meta: {
      title: "system_language",
      auth: true,
      layout: "admin",
      tagsView: true,
    },
  },
  {
    name: "localization",
    path: "/systemManagement/localization",
    component: () => import("@/pages/systemManagement/localization/index.vue"),
    meta: {
      title: "localization",
      auth: true,
      layout: "admin",
      tagsView: true,
    },
  },
];
