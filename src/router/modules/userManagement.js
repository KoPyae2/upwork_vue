export const userManagement = [
  {
    name: "authUser",
    path: "/userManagement/authUser",

    meta: {
      title: "认证用户",
      auth: true,
      layout: "admin",
      tagsView: true,
    },
    children: [
      {
        name: "authUser",
        path: "",
        component: () => import("@/pages/userManagement/authUser/index.vue"),
        meta: {
          title: "auth_user",
          auth: true,
          layout: "admin",
          tagsView: true,
        },
      },
      {
        name: "userNote",
        path: ":id/userNote",
        component: () => import("@/pages/userManagement/userNote/index.vue"),
        meta: {
          title: "user_note",
          auth: true,
          layout: "admin",
          tagsView: true,
        },
      },
    ],
  },
  {
    name: "normalUser",
    path: "/userManagement/normalUser",
    component: () => import("@/pages/userManagement/normalUser/index.vue"),
    meta: {
      title: "normal_user",
      auth: true,
      layout: "admin",
      tagsView: true,
    },
  },
  {
    name: "testUser",
    path: "/userManagement/testUser",
    component: () => import("@/pages/userManagement/testUser/index.vue"),
    meta: {
      title: "test_user",
      auth: true,
      layout: "admin",
      tagsView: true,
    },
  },
  {
    name: "userLevel",
    path: "/userManagement/userLevel",
    component: () => import("@/pages/userManagement/userLevel/index.vue"),
    meta: {
      title: "user_level",
      auth: true,
      layout: "admin",
      tagsView: true,
    },
  },
];
