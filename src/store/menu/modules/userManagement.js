import { checkPermissions } from "@/utils/permissions";

export const userManagement = [
  {
    id: "1",
    name: "user_management",
    icon: "fa-solid fa-users",
    url: "/userManagement",
    type: "group",
    permission: checkPermissions("user:management:view"),
    per_name: "user:management:view",
    children: [
      {
        id: "1-1",
        name: "auth_user",
        icon: "",
        type: "page",
        permission: checkPermissions("user:auth:view"),
        url: "/userManagement/authUser",
        per_name: "user:auth:view",
        children: [
          {
            name: "list",
            per_name: "user:auth:list",
          },
          {
            name: "create",
            per_name: "user:auth:add",
          },
          {
            name: "edit",
            per_name: "user:auth:edit",
          },
          {
            name: "notes",
            per_name: "user:auth:note",
          },
        ],
      },
      {
        id: "1-2",
        name: "normal_user",
        icon: "",
        type: "page",
        permission: checkPermissions("user:normal:view"),
        url: "/userManagement/normalUser",
        per_name: "user:normal:view",
        children: [
          {
            name: "list",
            per_name: "user:normal:list",
          },
          {
            name: "create",
            per_name: "user:normal:add",
          },
          {
            name: "edit",
            per_name: "user:normal:edit",
          },
          {
            name: "notes",
            per_name: "user:normal:note",
          },
        ],
      },
      {
        id: "1-3",
        name: "test_user",
        icon: "",
        type: "page",
        permission: checkPermissions("user:test:view"),
        url: "/userManagement/testUser",
        per_name: "user:test:view",
        children: [
          {
            name: "list",
            per_name: "user:test:list",
          },
          {
            name: "create",
            per_name: "user:test:add",
          },
          {
            name: "edit",
            per_name: "user:test:edit",
          },
          {
            name: "notes",
            per_name: "user:test:note",
          },
        ],
      },
      {
        id: "1-4",
        name: "user_level",
        icon: "",
        type: "page",
        permission: checkPermissions("user:level:view"),
        url: "/userManagement/userLevel",
        per_name: "user:level:view",
        children: [
          {
            name: "list",
            per_name: "user:level:list",
          },
          {
            name: "create",
            per_name: "user:level:add",
          },
          {
            name: "edit",
            per_name: "user:level:edit",
          },
        ],
      },
    ],
  },
];
