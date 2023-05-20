import { checkPermissions } from "@/utils/permissions";

export const gameManagement = [
  {
    id: "4",
    name: "game_management",
    icon: " fa-solid fa-gift",
    url: "/gameManagement",
    type: "group",
    permission: checkPermissions("game:management:view"),
    per_name: "game:management:view",
    children: [
      // {
      //   id: "4-1",
      //   name: "开奖数据",
      //   icon: "",
      //   type: "page",
      //   permission: checkPermissions("game:lottery:view"),
      //   url: "/gameManagement/lottery",
      //   per_name: "game:lottery:view",
      //   children: [
      //     {
      //       name: "list",
      //       per_name: "game:lottery:list",
      //     },

      //     {
      //       name: "edit",
      //       per_name: "game:lottery:edit",
      //     },
      //   ],
      // },

      {
        id: "4-2",
        name: "game_list",
        icon: "",
        type: "page",
        permission: checkPermissions("game:room:view"),
        url: "/gameManagement/gameRoom",
        per_name: "game:room:view",
        children: [
          {
            name: "create",
            per_name: "game:room:add",
          },
          {
            name: "list",
            per_name: "game:room:list",
          },

          {
            name: "edit",
            per_name: "game:room:edit",
          },
          {
            name: "delete",
            per_name: "game:room:remove",
          },
        ],
      },
      // {
      //   id: "4-3",
      //   name: "投注记录",
      //   icon: "",
      //   type: "page",
      //   permission: checkPermissions("game:record:view"),
      //   url: "/gameManagement/bettingRecord",
      //   per_name: "game:record:view",
      //   children: [
      //     {
      //       name: "list",
      //       per_name: "game:record:list",
      //     },
      //   ],
      // },
      {
        id: "4-4",
        name: "gift_box",
        icon: "",
        type: "page",
        permission: checkPermissions("game:gift:view"),
        url: "/gameManagement/gift",
        per_name: "game:gift:view",
        children: [
          {
            name: "list",
            per_name: "game:gift:list",
          },
          {
            name: "create",
            per_name: "game:gift:add",
          },
          {
            name: "edit",
            per_name: "game:gift:edit",
          },
          {
            name: "delete",
            per_name: "game:gift:remove",
          },
        ],
      },
      {
        id: "4-5",
        name: "gift_history",
        icon: "",
        type: "page",
        permission: checkPermissions("game:gifthistory:view"),
        url: "/gameManagement/giftHistory",
        per_name: "game:gifthistory:view",
        children: [
          {
            name: "list",
            per_name: "game:gifthistory:list",
          },
        ],
      },
    ],
  },
];
