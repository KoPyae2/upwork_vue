export const configurationManagement = [
  {
    name: "banner",
    path: "/configurationManagement/banner",
    component: () => import("@/pages/configurationManagement/banner/index.vue"),
    meta: {
      title: "banner",
      auth: true,
      layout: "admin",
      tagsView: true,
    },
  },
  {
    name: "notice",
    path: "/configurationManagement/notice",
    component: () => import("@/pages/configurationManagement/notice/index.vue"),
    meta: {
      title: "notice",
      auth: true,
      layout: "admin",
      tagsView: true,
    },
  },
  {
    name: "advertise",
    path: "/configurationManagement/advertise",
    component: () =>
      import("@/pages/configurationManagement/advertiseManagement/index.vue"),
    meta: {
      title: "advertise",
      auth: true,
      layout: "admin",
      tagsView: true,
    },
  },
  {
    name: "gamelist",
    path: "/configurationManagement/gameList",
    component: () =>
      import("@/pages/configurationManagement/gameList/index.vue"),
    meta: {
      title: "game_list",
      auth: true,
      layout: "admin",
      tagsView: true,
    },
  },
  {
    name: "coinConfiguration",
    path: "/configurationManagement/coinConfiguration",
    component: () =>
      import("@/pages/configurationManagement/coinConfiguration/index.vue"),
    meta: {
      title: "exchange_configuration",
      auth: true,
      layout: "admin",
      tagsView: true,
    },
  },
  {
    name: "versionManagement",
    path: "/configurationManagement/versionManagement",
    component: () =>
      import("@/pages/configurationManagement/versionManagement/index.vue"),
    meta: {
      title: "version",
      auth: true,
      layout: "admin",
      tagsView: true,
    },
  },
  {
    name: "channelManagement",
    path: "/configurationManagement/channelManagement",
    component: () =>
      import("@/pages/configurationManagement/channelManagement/index.vue"),
    meta: {
      title: "channel_management",
      auth: true,
      layout: "admin",
      tagsView: true,
    },
  },
  {
    name: "gameRedirect",
    path: "/configurationManagement/gameRedirect",
    component: () =>
      import("@/pages/configurationManagement/gameRedirect/index.vue"),
    meta: {
      title: "重定向",
      auth: true,
      layout: "admin",
      tagsView: true,
    },
  },
];
