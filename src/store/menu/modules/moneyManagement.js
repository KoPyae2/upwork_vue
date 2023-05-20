import { checkPermissions } from "@/utils/permissions";

export const moneyManagement = [
  {
    id: "5",
    name: "money_management",
    icon: "fa-solid fa-coins",
    url: "/moneyManagement",
    type: "group",
    permission: checkPermissions("money:management:view"),
    per_name: "money:management:view",
    children: [
      {
        id: "5-1",
        name: "withdraw_record",
        icon: "",
        type: "page",
        permission: checkPermissions("money:withdraw:view"),
        url: "/moneyManagement/moneyWithdraw",
        per_name: "money:withdraw:view",
        children: [
          {
            name: "list",
            per_name: "money:withdraw:list",
          },
          {
            name: "edit",
            per_name: "money:withdraw:edit",
          },
        ],
      },
      {
        id: "5-2",
        name: "revenue_record",
        icon: "",
        type: "page",
        permission: checkPermissions("money:revenue:view"),
        url: "/moneyManagement/revenueRecord",
        per_name: "money:revenue:view",
        children: [
          {
            name: "list",
            per_name: "money:revenue:list",
          },
        ],
      },
      {
        id: "5-3",
        name: "exchange_configuration",
        icon: "",
        type: "page",
        permission: checkPermissions("money:withdrawconfig:view"),
        url: "/moneyManagement/withdrawConfig",
        per_name: "money:withdrawconfig:view",
        children: [
          {
            name: "list",
            per_name: "money:withdrawconfig:list",
          },
        ],
      },
      // {
      //   id: "5-1",
      //   name: "支付列表",
      //   icon: "",
      //   type: "page",
      //   permission: checkPermissions("money:bank:view"),
      //   url: "/moneyManagement/bank",
      //   per_name: "money:bank:view",
      //   children: [
      //     {
      //       name: "list",
      //       per_name: "money:bank:list",
      //     },
      //     {
      //       name: "create",
      //       per_name: "money:bank:add",
      //     },
      //     {
      //       name: "edit",
      //       per_name: "money:bank:edit",
      //     },
      //     {
      //       name: "delete",
      //       per_name: "money:bank:remove",
      //     },
      //   ],
      // },
      // {
      //   id: "5-2",
      //   name: "用户银行",
      //   icon: "",
      //   type: "page",
      //   permission: checkPermissions("money:userbank:view"),
      //   url: "/moneyManagement/userBank",
      //   per_name: "money:userbank:view",
      //   children: [
      //     {
      //       name: "list",
      //       per_name: "money:userbank:list",
      //     },
      //     {
      //       name: "create",
      //       per_name: "money:userbank:add",
      //     },
      //     {
      //       name: "edit",
      //       per_name: "money:userbank:edit",
      //     },
      //     {
      //       name: "delete",
      //       per_name: "money:userbank:remove",
      //     },
      //   ],
      // },
      // {
      //   id: "5-3",
      //   name: "兑换列表",
      //   icon: "",
      //   type: "page",
      //   permission: checkPermissions("money:withdraw:view"),
      //   url: "/moneyManagement/withdraw",
      //   per_name: "money:withdraw:view",
      //   children: [
      //     {
      //       name: "list",
      //       per_name: "money:withdraw:list",
      //     },
      //     {
      //       name: "edit",
      //       per_name: "money:withdraw:edit",
      //     },
      //   ],
      // },
      // {
      //   id: "5-4",
      //   name: "充值列表",
      //   icon: "",
      //   type: "page",
      //   permission: checkPermissions("money:recharge:view"),
      //   url: "/moneyManagement/recharge",
      //   per_name: "money:recharge:view",
      //   children: [
      //     {
      //       name: "list",
      //       per_name: "money:recharge:list",
      //     },
      //   ],
      // },
      // {
      //   id: "5-5",
      //   name: "兑换配置",
      //   icon: "",
      //   type: "page",
      //   permission: checkPermissions("money:withdrawconfig:view"),
      //   url: "/moneyManagement/withdrawConfig",
      //   per_name: "money:withdrawconfig:view",
      //   children: [
      //     {
      //       name: "list",
      //       per_name: "money:withdrawconfig:list",
      //     },
      //     {
      //       name: "edit",
      //       per_name: "money:withdrawconfig:edit",
      //     },
      //   ],
      // },
    ],
  },
];
