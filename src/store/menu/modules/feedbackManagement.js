import { checkPermissions } from "@/utils/permissions";

export const feedbackManagement = [
  {
    id: "8",
    name: "feedback_management",
    icon: "fa-solid fa-message",
    url: "/feedbackManagement",
    type: "group",
    permission: checkPermissions("feedback:management:view"),
    per_name: "feedback:management:view",
    children: [
      {
        id: "8-1",
        name: "playback_feedback",
        icon: "",
        type: "page",
        url: "/feedbackManagement/playbackFeedback",
        permission: checkPermissions("feedback:playback:view"),
        per_name: "feedback:playback:view",
        children: [
          {
            name: "list",
            per_name: "feedback:playback:list",
          },
        ],
      },
      {
        id: "8-2",
        name: "resource_feedback",
        icon: "",
        type: "page",
        url: "/feedbackManagement/resourceFeedback",
        permission: checkPermissions("feedback:resource:view"),
        per_name: "feedback:resource:view",
        children: [
          {
            name: "list",
            per_name: "feedback:resource:list",
          },
        ],
      },
      {
        id: "8-3",
        name: "user_feedback",
        icon: "",
        type: "page",
        url: "/feedbackManagement/userFeedback",
        permission: checkPermissions("feedback:user:view"),
        per_name: "feedback:user:view",
        children: [
          {
            name: "list",
            per_name: "feedback:user:list",
          },
        ],
      },
      {
        id: "8-4",
        name: "help_feedback",
        icon: "",
        type: "page",
        url: "/feedbackManagement/helpFeedback",
        permission: checkPermissions("feedback:help:view"),
        per_name: "feedback:help:view",
        children: [
          {
            name: "list",
            per_name: "feedback:help:list",
          },
        ],
      },
      {
        id: "8-5",
        name: "feedback_reason",
        icon: "",
        type: "page",
        url: "/feedbackManagement/feedbackReason",
        permission: checkPermissions("feedback:reason:view"),
        per_name: "feedback:reason:view",
        children: [
          {
            name: "list",
            per_name: "feedback:reason:list",
          },
          {
            name: "create",
            per_name: "feedback:reason:add",
          },
          {
            name: "edit",
            per_name: "feedback:reason:edit",
          },
          {
            name: "delete",
            per_name: "feedback:reason:remove",
          },
        ],
      },
      {
        id: "8-6",
        name: "dislike_reason",
        icon: "",
        type: "page",
        url: "/feedbackManagement/dislikeReason",
        permission: checkPermissions("dislike:reason:view"),
        per_name: "dislike:reason:view",
        children: [
          {
            name: "list",
            per_name: "dislike:reason:list",
          },
          {
            name: "create",
            per_name: "dislike:reason:add",
          },
          {
            name: "edit",
            per_name: "dislike:reason:edit",
          },
          {
            name: "delete",
            per_name: "dislike:reason:remove",
          },
        ],
      },
      {
        id: "8-7",
        name: "help_reason",
        icon: "",
        type: "page",
        url: "/feedbackManagement/helpReason",
        permission: checkPermissions("feedback:helpreason:view"),
        permission: true,
        per_name: "feedback:helpreason:view",
        children: [
          {
            name: "list",
            per_name: "feedback:helpreason:list",
          },
          {
            name: "create",
            per_name: "feedback:helpreason:add",
          },
          {
            name: "edit",
            per_name: "feedback:helpreason:edit",
          },
          {
            name: "delete",
            per_name: "feedback:helpreason:remove",
          },
        ],
      },
    ],
  },
];
