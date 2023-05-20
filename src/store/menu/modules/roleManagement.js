import { checkPermissions } from "@/utils/permissions";

export const roleManagement = [
  {
    id: "12",
    name: "role_management",
    icon: "fa-solid fa-shield-halved",
    url: "/roleManagement",
    type: "group",
    permission: checkPermissions("role:management:view"),
    per_name: "role:management:view",
    children: [
      {
        id: "12-1",
        name: "role_permission",
        type: "page",
        permission: checkPermissions("role:role:view"),
        url: "/roleManagement/role",
        per_name: "role:role:view",
        children: [
          {
            name: "list",
            per_name: "role:role:list",
          },
          {
            name: "create",
            per_name: "role:role:add",
          },
          {
            name: "edit",
            per_name: "role:role:edit",
          },
          {
            name: "delete",
            per_name: "role:role:remove",
          },
        ],
      },
      {
        id: "12-2",
        name: "system_user",
        type: "page",
        permission: checkPermissions("role:systemuser:view"),
        url: "/roleManagement/systemUser",
        per_name: "role:systemuser:view",
        children: [
          {
            name: "list",
            per_name: "role:systemuser:list",
          },
          {
            name: "create",
            per_name: "role:systemuser:add",
          },
          {
            name: "edit",
            per_name: "role:systemuser:edit",
          },
        ],
      },
    ],
  },
];
