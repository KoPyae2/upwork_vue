import { checkPermissions } from "@/utils/permissions";

export const commentManagement = [
  {
    id: "2",
    name: "comment_management",
    icon: " fa-solid fa-comments",
    url: "/commentManagement",
    type: "group",
    permission: true,
    per_name: "comment:management:view",
    permission: checkPermissions("comment:management:view"),
    children: [
      // {
      //   id: "2-1",
      //   name: "頭像審核",
      //   icon: "",
      //   type: "page",
      //   permission: true,
      //   url: "/commentManagement/avatar",
      //   per_name: "comment:lottery:view",
      //   children: [
      //     {
      //       name: "list",
      //       per_name: "comment:lottery:list",
      //     },

      //     {
      //       name: "edit",
      //       per_name: "comment:lottery:edit",
      //     },
      //   ],
      // },

      {
        id: "2-2",
        name: "comment_list",
        icon: "",
        type: "page",
        permission: true,
        url: "/commentManagement/commentList",
        permission: checkPermissions("comment:view"),
        per_name: "comment:view",
        children: [
          {
            name: "list",
            per_name: "comment:list",
          },

          {
            name: "edit",
            per_name: "comment:edit",
          },
          {
            name: "delete",
            per_name: "comment:remove",
          },
        ],
      },
      {
        id: "2-3",
        name: "comment_reply",
        icon: "",
        type: "page",
        permission: true,
        url: "/commentManagement/commentReply",
        per_name: "reply:view",
        permission: checkPermissions("reply:view"),
        children: [
          {
            name: "list",
            per_name: "reply:list",
          },
          {
            name: "edit",
            per_name: "reply:edit",
          },
          {
            name: "delete",
            per_name: "reply:remove",
          },
        ],
      },
    ],
  },
];
