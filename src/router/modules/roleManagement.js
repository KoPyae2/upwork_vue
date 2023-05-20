export const roleManagement = [
  {
    name: "role",
    path: "/roleManagement/role",
    component: () => import("@/pages/roleManagement/role/index.vue"),
    meta: {
      title: "role_permission",
      auth: true,
      layout: "admin",
      tagsView: true,
    },
  },
  {
    name: "systemUser",
    path: "/roleManagement/systemUser",
    component: () => import("@/pages/roleManagement/systemUser/index.vue"),
    meta: {
      title: "system_user",
      auth: true,
      layout: "admin",
      tagsView: true,
    },
  },
];
