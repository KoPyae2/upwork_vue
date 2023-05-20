import { checkPermissions } from "@/utils/permissions";

export const systemManagement = [
  {
    id: "10",
    name: "system_management",
    icon: "fa-solid fa-gear",
    url: "/systemManagement",
    type: "group",
    permission: checkPermissions("system:management:view"),
    per_name: "system:management:view",
    children: [
      {
        id: "10-1",
        name: "city",
        icon: "",
        type: "page",
        permission: checkPermissions("system:city:view"),
        url: "/systemManagement/city",
        per_name: "system:city:view",
        children: [
          {
            name: "list",
            per_name: "system:city:list",
          },
          {
            name: "create",
            per_name: "system:city:add",
          },
          {
            name: "edit",
            per_name: "system:city:edit",
          },
          {
            name: "delete",
            per_name: "system:city:remove",
          },
        ],
      },
      {
        id: "10-2",
        name: "province",
        icon: "",
        type: "page",
        permission: checkPermissions("system:province:view"),
        url: "/systemManagement/province",
        per_name: "system:province:view",
        children: [
          {
            name: "list",
            per_name: "system:province:list",
          },
          {
            name: "create",
            per_name: "system:province:add",
          },
          {
            name: "edit",
            per_name: "system:province:edit",
          },
          {
            name: "delete",
            per_name: "system:province:remove",
          },
        ],
      },
      // {
      //   id: "10-3",
      //   name: "default_city",
      //   icon: "",
      //   type: "page",
      //   permission: checkPermissions("system:defaultcity:view"),
      //   url: "/systemManagement/defaultCity",
      //   per_name: "system:defaultcity:view",
      //   children: [
      //     {
      //       name: "list",
      //       per_name: "system:defaultcity:list",
      //     },

      //     {
      //       name: "edit",
      //       per_name: "system:defaultcity:edit",
      //     },
      //   ],
      // },

      {
        id: "10-4",
        name: "default_avatar",
        icon: "",
        type: "page",
        permission: checkPermissions("system:defaultavatar:view"),
        url: "/systemManagement/defaultAvatar",
        per_name: "system:defaultavatar:view",
        children: [
          {
            name: "list",
            per_name: "system:defaultavatar:list",
          },
          {
            name: "create",
            per_name: "system:defaultavatar:add",
          },
          {
            name: "edit",
            per_name: "system:defaultavatar:edit",
          },
        ],
      },
      {
        id: "10-5",
        name: "hot_keywords",
        icon: "",
        type: "page",
        permission: checkPermissions("system:hotkey:view"),
        url: "/systemManagement/hotKeywords",
        per_name: "system:hotkey:view",
        children: [
          {
            name: "list",
            per_name: "system:hotkey:list",
          },

          {
            name: "edit",
            per_name: "system:hotkey:edit",
          },
        ],
      },
      {
        id: "10-6",
        name: "banned_keywords",
        icon: "",
        type: "page",
        permission: checkPermissions("system:bannedword:view"),
        url: "/systemManagement/bannedKeyword",
        per_name: "system:bannedword:view",
        children: [
          {
            name: "list",
            per_name: "system:bannedword:list",
          },
          {
            name: "create",
            per_name: "system:bannedword:add",
          },
          {
            name: "edit",
            per_name: "system:bannedword:edit",
          },
          {
            name: "delete",
            per_name: "system:bannedword:remove",
          },
        ],
      },

      {
        id: "10-7",
        name: "system_language",
        icon: "",
        type: "page",
        permission: checkPermissions("system:language:view"),
        url: "/systemManagement/systemLanguaes",
        per_name: "system:language:view",
        children: [
          {
            name: "list",
            per_name: "system:language:list",
          },
          {
            name: "create",
            per_name: "system:language:add",
          },
          {
            name: "edit",
            per_name: "system:language:edit",
          },
          {
            name: "delete",
            per_name: "system:language:remove",
          },
        ],
      },
      {
        id: "10-8",
        name: "localization",
        icon: "",
        type: "page",
        permission: checkPermissions("system:localization:view"),
        url: "/systemManagement/localization",
        per_name: "system:localization:view",
        children: [
          {
            name: "list",
            per_name: "system:localization:list",
          },
          {
            name: "create",
            per_name: "system:localization:add",
          },
          {
            name: "edit",
            per_name: "system:localization:edit",
          },
          {
            name: "delete",
            per_name: "system:localization:remove",
          },
        ],
      },
    ],
  },
];
