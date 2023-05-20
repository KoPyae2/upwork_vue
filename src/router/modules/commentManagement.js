export const commentManagement = [
  // {
  //   name: "avatar",
  //   path: "/commentManagement/avatar",
  //   component: () => import("@/pages/commentManagement/avatar/index.vue"),
  //   meta: {
  //     title: "頭像審核",
  //     auth: true,
  //     layout: "admin",
  //     tagsView: true,
  //   },
  // },
  {
    name: "commentList",
    path: "/commentManagement/commentList",
    component: () => import("@/pages/commentManagement/commentList/index.vue"),
    meta: {
      title: "comment_list",
      auth: true,
      layout: "admin",
      tagsView: true,
    },
  },
  {
    name: "commentReply",
    path: "/commentManagement/commentReply",
    component: () => import("@/pages/commentManagement/commentReply/index.vue"),
    meta: {
      title: "comment_reply",
      auth: true,
      layout: "admin",
      tagsView: true,
    },
  },
];
