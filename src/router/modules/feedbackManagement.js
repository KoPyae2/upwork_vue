export const feedbackManagement = [
  {
    name: "resourceFeedback",
    path: "/feedbackManagement/resourceFeedback",
    component: () =>
      import("@/pages/feedbackManagement/resourceFeedback/index.vue"),
    meta: {
      title: "resource_feedback",
      auth: true,
      layout: "admin",
      tagsView: true,
    },
  },
  {
    name: "playbackFeedback",
    path: "/feedbackManagement/playbackFeedback",
    component: () =>
      import("@/pages/feedbackManagement/playbackFeedback/index.vue"),
    meta: {
      title: "playback_feedback",
      auth: true,
      layout: "admin",
      tagsView: true,
    },
  },
  {
    name: "userFeedback",
    path: "/feedbackManagement/userFeedback",
    component: () =>
      import("@/pages/feedbackManagement/userFeedback/index.vue"),
    meta: {
      title: "user_feedback",
      auth: true,
      layout: "admin",
      tagsView: true,
    },
  },
  {
    name: "helpFeedback",
    path: "/feedbackManagement/helpFeedback",
    component: () =>
      import("@/pages/feedbackManagement/helpFeedback/index.vue"),
    meta: {
      title: "help_feedback",
      auth: true,
      layout: "admin",
      tagsView: true,
    },
  },
  {
    name: "feedbackReason",
    path: "/feedbackManagement/feedbackReason",
    component: () =>
      import("@/pages/feedbackManagement/feedbackReason/index.vue"),
    meta: {
      title: "feedback_reason",
      auth: true,
      layout: "admin",
      tagsView: true,
    },
  },

  {
    name: "dislikeReason",
    path: "/feedbackManagement/dislikeReason",
    component: () =>
      import("@/pages/feedbackManagement/dislikeReason/index.vue"),
    meta: {
      title: "dislike_reason",
      auth: true,
      layout: "admin",
      tagsView: true,
    },
  },
  {
    name: "helpReason",
    path: "/feedbackManagement/helpReason",
    component: () => import("@/pages/feedbackManagement/helpReason/index.vue"),
    meta: {
      title: "help_reason",
      auth: true,
      layout: "admin",
      tagsView: true,
    },
  },
];
