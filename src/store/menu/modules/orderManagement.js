import { checkPermissions } from "@/utils/permissions";

export const orderManagement = [
  {
    id: "6",
    name: "order_management",
    icon: "fa-solid fa-cart-plus",
    url: "/orderManagement",
    type: "group",
    permission: true,
    per_name: "order:management:view",
    permission: checkPermissions("order:management:view"),
    children: [
      {
        id: "6-1",
        name: "order_tracking",
        icon: "",
        type: "page",
        permission: true,
        url: "/orderManagement/orderTracking",
        per_name: "order:track:view",
        permission: checkPermissions("order:track:view"),
        children: [
          {
            name: "list",
            per_name: "order:track:list",
          },

          {
            name: "edit",
            per_name: "order:track:edit",
          },
        ],
      },

      {
        id: "6-2",
        name: "member_order",
        icon: "",
        type: "page",
        permission: true,
        url: "/orderManagement/memberOrder",
        per_name: "order:member:view",
        permission: checkPermissions("order:member:view"),
        children: [
          {
            name: "list",
            per_name: "order:member:list",
          },

          {
            name: "edit",
            per_name: "order:member:edit",
          },
        ],
      },
      {
        id: "6-3",
        name: "tea_coin_order",
        icon: "",
        type: "page",
        permission: checkPermissions("order:coin:view"),
        url: "/orderManagement/teaCoinOrder",
        per_name: "order:coin:view",
        children: [
          {
            name: "list",
            per_name: "order:coin:list",
          },
          {
            name: "edit",
            per_name: "order:coin:edit",
          },
        ],
      },
      //   {
      //     id: "6-4",
      //     name: "提現申請",
      //     icon: "",
      //     type: "page",
      //     permission: true,
      //     url: "/orderManagement/withdrawlApplication",
      //     per_name: "comment:record:view",
      //     children: [
      //       {
      //         name: "list",
      //         per_name: "comment:record:list",
      //       },
      //     ],
      //   },
      //   {
      //     id: "6-5",
      //     name: "游戏提現記錄",
      //     icon: "",
      //     type: "page",
      //     permission: true,
      //     url: "/orderManagement/gameCashWithdrawlRecord",
      //     per_name: "comment:record:view",
      //     children: [
      //       {
      //         name: "list",
      //         per_name: "comment:record:list",
      //       },
      //     ],
      //   },
      //   {
      //     id: "6-6",
      //     name: "收支記錄",
      //     icon: "",
      //     type: "page",
      //     permission: true,
      //     url: "/orderManagement/revenueAndExpenditureRecords",
      //     per_name: "comment:record:view",
      //     children: [
      //       {
      //         name: "list",
      //         per_name: "comment:record:list",
      //       },
      //     ],
      //   },

      //   {
      //     id: "6-7",
      //     name: "硬币配置",
      //     icon: "",
      //     type: "page",
      //     permission: true,
      //     url: "/orderManagement/coinConfiguration",
      //     per_name: "comment:record:view",
      //     children: [
      //       {
      //         name: "list",
      //         per_name: "comment:record:list",
      //       },
      //     ],
      //   },

      //   {
      //     id: "6-8",
      //     name: "笔记视图设置",
      //     icon: "",
      //     type: "page",
      //     permission: true,
      //     url: "/orderManagement/noteViewSettings",
      //     per_name: "comment:record:view",
      //     children: [
      //       {
      //         name: "list",
      //         per_name: "comment:record:list",
      //       },
      //     ],
      //   },
    ],
  },
];
