import { checkPermissions } from "@/utils/permissions";

export const reportManagement = [
  {
    id: "7",
    name: "report_management",
    icon: "fa-solid fa-chart-line",
    url: "/reportManagement",
    type: "group",
    permission: checkPermissions("report:management:view"),
    per_name: "report:management:view",
    children: [
      {
        id: "7-1",
        name: "user_report",
        icon: "",
        type: "page",
        permission: checkPermissions("report:user:view"),
        url: "/reportManagement/userStatistic",
        per_name: "report:user:view",
        children: [
          {
            name: "list",
            per_name: "report:user:list",
          },
        ],
      },
      {
        id: "7-2",
        name: "business_report",
        icon: "",
        type: "page",
        permission: checkPermissions("report:business:view"),
        url: "/reportManagement/businessStatistic",
        per_name: "report:business:view",
        children: [
          {
            name: "list",
            per_name: "report:business:list",
          },
        ],
      },
      // {
      //   id: "7-2",
      //   name: "业务统计",
      //   icon: "",
      //   type: "page",
      //   permission: true,
      //   url: "/reportManagement/businessStatistic",
      //   per_name: "report:business:view",
      //   children: [
      //     {
      //       name: "list",
      //       per_name: "report:business:list",
      //     },
      //   ],
      // },
      // {
      //   id: "7-3",
      //   name: "付费统计",
      //   icon: "",
      //   type: "page",
      //   permission: true,
      //   url: "/reportManagement/noteStatistic",
      //   per_name: "report:note:view",
      //   children: [
      //     {
      //       name: "list",
      //       per_name: "report:note:list",
      //     },
      //   ],
      // },
      // {
      //   id: "7-4",
      //   name: "游戏统计",
      //   icon: "",
      //   type: "page",
      //   permission: checkPermissions("report:game:view"),
      //   url: "/reportManagement/gameStatistic",
      //   per_name: "report:game:view",
      //   children: [
      //     {
      //       name: "list",
      //       per_name: "report:game:list",
      //     },
      //   ],
      // },
      // {
      //   id: "7-5",
      //   name: "日常统计",
      //   icon: "",
      //   type: "page",
      //   permission: checkPermissions("report:daily:view"),
      //   url: "/reportManagement/dailyStatistic",
      //   per_name: "report:daily:view",
      //   children: [
      //     {
      //       name: "list",
      //       per_name: "report:daily:list",
      //     },
      //   ],
      // },
      // {
      //   id: "7-6",
      //   name: "代理统计",
      //   icon: "",
      //   type: "page",
      //   permission: checkPermissions("report:agent:view"),
      //   url: "/reportManagement/agentStatistic",
      //   per_name: "report:agent:view",
      //   children: [
      //     {
      //       name: "list",
      //       per_name: "report:agent:list",
      //     },
      //   ],
      // },
      // {
      //   id: "7-7",
      //   name: "operation_report",
      //   icon: "",
      //   type: "page",
      //   permission: checkPermissions("report:operationStatistics:view"),
      //   url: "/reportManagement/operationStatistics",
      //   per_name: "report:operationStatistics:view",
      //   children: [
      //     {
      //       name: "list",
      //       per_name: "report:operationStatistics:list",
      //     },
      //   ],
      // },
      {
        id: "7-8",
        name: "paid_report",
        icon: "",
        type: "page",
        permission: checkPermissions("report:paidStatistics:view"),
        url: "/reportManagement/paidStatistics",
        per_name: "report:paidStatistics:view",
        children: [
          {
            name: "list",
            per_name: "report:paidStatistics:list",
          },
        ],
      },
      {
        id: "7-9",
        name: "audit_report",
        icon: "",
        type: "page",
        permission: checkPermissions("report:audit:view"),
        url: "/reportManagement/auditTrail",
        per_name: "report:audit:view",
        children: [
          {
            name: "list",
            per_name: "report:audit:list",
          },
        ],
      },
    ],
  },
];
