import { checkPermissions } from "@/utils/permissions";

export const configurationManagement = [
  {
    id: "9",
    name: "operation_management",
    icon: "fa-solid fa-sliders",
    url: "/configurationManagement",
    type: "group",
    permission: checkPermissions("config:management:view"),
    per_name: "config:management:view",
    children: [
      {
        id: "9-1",
        name: "banner",
        icon: "",
        type: "page",
        permission: checkPermissions("config:banner:view"),
        url: "/configurationManagement/banner",
        per_name: "config:banner:view",
        children: [
          {
            name: "list",
            per_name: "config:banner:list",
          },
          {
            name: "create",
            per_name: "config:banner:add",
          },
          {
            name: "edit",
            per_name: "config:banner:edit",
          },
          {
            name: "delete",
            per_name: "config:banner:remove",
          },
        ],
      },
      {
        id: "9-2",
        name: "notice",
        icon: "",
        type: "page",
        permission: checkPermissions("config:notice:view"),
        url: "/configurationManagement/notice",
        per_name: "config:notice:view",
        children: [
          {
            name: "list",
            per_name: "config:notice:list",
          },
          {
            name: "create",
            per_name: "config:notice:add",
          },
          {
            name: "edit",
            per_name: "config:notice:edit",
          },
          {
            name: "delete",
            per_name: "config:notice:remove",
          },
        ],
      },
      {
        id: "9-3",
        name: "advertise",
        icon: "",
        type: "page",
        permission: checkPermissions("config:advertise:view"),
        url: "/configurationManagement/advertise",
        per_name: "config:advertise:view",
        children: [
          {
            name: "list",
            per_name: "config:advertise:list",
          },
          {
            name: "create",
            per_name: "config:advertise:add",
          },
          {
            name: "edit",
            per_name: "config:advertise:edit",
          },
          {
            name: "delete",
            per_name: "config:advertise:remove",
          },
        ],
      },
      // {
      //   id: "9-4",
      //   name: "channel_management",
      //   icon: "",
      //   type: "page",
      //   permission: checkPermissions("config:channel:view"),
      //   url: "/configurationManagement/channelManagement",
      //   per_name: "config:channel:view",
      //   children: [
      //     {
      //       name: "list",
      //       per_name: "config:channel:list",
      //     },
      //     {
      //       name: "create",
      //       per_name: "config:channel:add",
      //     },
      //     {
      //       name: "edit",
      //       per_name: "config:channel:edit",
      //     },
      //     {
      //       name: "delete",
      //       per_name: "config:channel:remove",
      //     },
      //   ],
      // },

      {
        id: "9-5",
        name: "version",
        icon: "",
        type: "page",
        permission: checkPermissions("config:version:view"),
        url: "/configurationManagement/versionManagement",
        per_name: "config:version:view",
        children: [
          {
            name: "list",
            per_name: "config:version:list",
          },
          {
            name: "create",
            per_name: "config:version:add",
          },
          {
            name: "edit",
            per_name: "config:version:edit",
          },
          {
            name: "delete",
            per_name: "config:version:remove",
          },
        ],
      },

      // {
      //   id: "9-6",
      //   name: "coin_configuration",
      //   icon: "",
      //   type: "page",
      //   permission: checkPermissions("config:coin:view"),
      //   url: "/configurationManagement/coinConfiguration",
      //   per_name: "config:coin:view",
      //   children: [
      //     {
      //       name: "list",
      //       per_name: "config:coin:list",
      //     },
      //     {
      //       name: "edit",
      //       per_name: "config:coin:edit",
      //     },
      //   ],
      // },

      // {
      //   id: "9-7",
      //   name: "重定向",
      //   icon: "",
      //   type: "page",
      //   permission: checkPermissions("config:gameredirect:view"),
      //   url: "/configurationManagement/gameRedirect",
      //   per_name: "config:gameredirect:view",
      //   children: [
      //     {
      //       name: "list",
      //       per_name: "config:gameredirect:list",
      //     },
      //     {
      //       name: "edit",
      //       per_name: "config:gameredirect:edit",
      //     },
      //   ],
      // },
    ],
  },
];
