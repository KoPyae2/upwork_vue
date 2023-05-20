import { checkPermissions } from "@/utils/permissions";

export const paymentManagement = [
  {
    id: "11",
    name: "payment_management",
    icon: "fa-regular fa-credit-card",
    url: "/paymentManagement",
    type: "group",
    permission: checkPermissions("payment:management:view"),
    per_name: "payment:management:view",
    children: [
      {
        id: "11-1",
        name: "default_payment_gateway",
        icon: "",
        type: "page",
        permission: checkPermissions("payment:gateway:view"),
        url: "/paymentManagement/defaultPaymentGateway",
        per_name: "payment:gateway:view",
        children: [
          {
            name: "list",
            per_name: "payment:gateway:list",
          },
          {
            name: "create",
            per_name: "payment:gateway:add",
          },
          {
            name: "edit",
            per_name: "payment:gateway:edit",
          },
          {
            name: "delete",
            per_name: "payment:gateway:remove",
          },
        ],
      },
      {
        id: "11-2",
        name: "payment_method",
        icon: "",
        type: "page",
        permission: checkPermissions("payment:method:view"),
        url: "/paymentManagement/paymentMethod",
        per_name: "payment:method:view",
        children: [
          {
            name: "list",
            per_name: "payment:method:list",
          },
          {
            name: "create",
            per_name: "payment:method:add",
          },
          {
            name: "edit",
            per_name: "payment:method:edit",
          },
          {
            name: "delete",
            per_name: "payment:method:remove",
          },
        ],
      },
      {
        id: "11-3",
        name: "vip_package",
        icon: "",
        type: "page",
        permission: checkPermissions("payment:vip:view"),
        url: "/paymentManagement/vipPackage",
        per_name: "payment:vip:view",
        children: [
          {
            name: "list",
            per_name: "payment:vip:list",
          },
          {
            name: "create",
            per_name: "payment:vip:add",
          },
          {
            name: "edit",
            per_name: "payment:vip:edit",
          },
          {
            name: "delete",
            per_name: "payment:vip:remove",
          },
        ],
      },
      {
        id: "11-4",
        name: "coin_package",
        icon: "",
        type: "page",
        permission: checkPermissions("payment:coin:view"),
        url: "/paymentManagement/coinPackage",
        per_name: "payment:coin:view",
        children: [
          {
            name: "list",
            per_name: "payment:coin:list",
          },
          {
            name: "create",
            per_name: "payment:coin:add",
          },
          {
            name: "edit",
            per_name: "payment:coin:edit",
          },
          {
            name: "delete",
            per_name: "payment:coin:remove",
          },
        ],
      },
    ],
  },
];
