export const businessManagement = [
  {
    name: "noteImage",
    path: "/businessManagement/noteImage",
    component: () =>
      import("@/pages/businessManagement/noteResource/noteImage/index.vue"),
    meta: {
      title: "image_resource",
      auth: true,
      layout: "admin",
      tagsView: true,
    },
  },
  {
    name: "noteVideo",
    path: "/businessManagement/noteVideo",
    component: () =>
      import("@/pages/businessManagement/noteResource/noteVideo/index.vue"),
    meta: {
      title: "video_resource",
      auth: true,
      layout: "admin",
      tagsView: true,
    },
  },
  {
    name: "noteAudio",
    path: "/businessManagement/noteAudio",
    component: () =>
      import("@/pages/businessManagement/noteResource/noteAudio/index.vue"),
    meta: {
      title: "音頻资源",
      auth: true,
      layout: "admin",
      tagsView: true,
    },
  },
  {
    name: "noteTopic",
    path: "/businessManagement/noteTopic",
    component: () =>
      import("@/pages/businessManagement/noteResource/noteTopic/index.vue"),
    meta: {
      title: "topic_management",
      auth: true,
      layout: "admin",
      tagsView: true,
    },
  },
  {
    name: "noteTag",
    path: "/businessManagement/noteTag",
    component: () =>
      import("@/pages/businessManagement/noteResource/noteTag/index.vue"),
    meta: {
      title: "tag_management",
      auth: true,
      layout: "admin",
      tagsView: true,
    },
  },
  {
    name: "noteLongVideo",
    path: "/businessManagement/noteLongVideo",
    component: () =>
      import("@/pages/businessManagement/noteLongVideo/vodResource/index.vue"),
    meta: {
      title: "long_video",
      auth: true,
      layout: "admin",
      tagsView: true,
    },
  },
  {
    name: "noteLongVideoTopic",
    path: "/businessmanagement/noteLongVideoTopic",
    component: () =>
      import("@/pages/businessManagement/noteLongVideo/vodTopic/index.vue"),
    meta: {
      title: "long_video_topic",
      auth: true,
      layout: "admin",
      tagsView: true,
    },
  },
  {
    name: "noteLongVideoType",
    path: "/businessmanagement/noteLongVideoType",
    component: () =>
      import("@/pages/businessManagement/noteLongVideo/vodType/index.vue"),
    meta: {
      title: "long_video_classification",
      auth: true,
      layout: "admin",
      tagsView: true,
    },
  },
  {
    name: "noteLongVideoStar",
    path: "/businessmanagement/noteLongVideoStar",
    component: () =>
      import("@/pages/businessManagement/noteLongVideo/vodStar/index.vue"),
    meta: {
      title: "long_video_star",
      auth: true,
      layout: "admin",
      tagsView: true,
    },
  },
  {
    name: "noteLiveVideo",
    path: "/businessManagement/noteLiveVideo",
    component: () =>
      import("@/pages/businessManagement/liveResource/liveVideo/index.vue"),
    meta: {
      title: "live_resources",
      auth: true,
      layout: "admin",
      tagsView: true,
    },
  },
  {
    name: "liveCommentList",
    path: "/businessManagement/noteLiveVideo/:liveid/commentList",
    component: () =>
      import("@/pages/businessManagement/liveResource/commentList/index.vue"),
    meta: {
      title: "评论列表",
      auth: true,
      layout: "admin",
      tagsView: true,
    },
  },
  {
    name: "liveAudienceList",
    path: "/businessManagement/noteLiveVideo/:liveid/audienceList",
    component: () =>
      import("@/pages/businessManagement/liveResource/audienceList/index.vue"),
    meta: {
      title: "观众列表",
      auth: true,
      layout: "admin",
      tagsView: true,
    },
  },
  {
    name: "feedback",
    path: "/businessManagement/feedback",
    component: () =>
      import("@/pages/businessManagement/report/feedback/index.vue"),
    meta: {
      title: "播放反饋",
      auth: true,
      layout: "admin",
      tagsView: true,
    },
  },
  {
    name: "reportWeb",
    path: "/businessManagement/reportWeb",
    component: () => import("@/pages/businessManagement/report/web/index.vue"),
    meta: {
      title: "舉報茶社",
      auth: true,
      layout: "admin",
      tagsView: true,
    },
  },
  {
    name: "reportUser",
    path: "/businessManagement/reportUser",
    component: () => import("@/pages/businessManagement/report/user/index.vue"),
    meta: {
      title: "舉報用戶",
      auth: true,
      layout: "admin",
      tagsView: true,
    },
  },

  {
    name: "version",
    path: "/businessManagement/version",
    component: () =>
      import("@/pages/businessManagement/operation/version/index.vue"),
    meta: {
      title: "版本管理",
      auth: true,
      layout: "admin",
      tagsView: true,
    },
  },
  {
    name: "sensitiveWords",
    path: "/businessManagement/sensitiveWords",
    component: () =>
      import("@/pages/businessManagement/operation/sensitiveWords/index.vue"),
    meta: {
      title: "敏感词库",
      auth: true,
      layout: "admin",
      tagsView: true,
    },
  },
  {
    name: "channel",
    path: "/businessManagement/channel",
    component: () =>
      import("@/pages/businessManagement/operation/channel/index.vue"),
    meta: {
      title: "渠道管理",
      auth: true,
      layout: "admin",
      tagsView: true,
    },
  },
  {
    name: "imRecommend",
    path: "/businessManagement/imRecommend",
    component: () =>
      import("@/pages/businessManagement/noteResource/imRecommend/index.vue"),
    meta: {
      title: "im_recommend",
      auth: true,
      layout: "admin",
      tagsView: true,
    },
  },
];
