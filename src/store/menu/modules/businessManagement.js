import { checkPermissions } from "@/utils/permissions";

export const businessManagement = [
  {
    id: "3",
    name: "business_management",
    icon: "fa-regular fa-folder-open",
    url: "/businessmanagement",
    type: "group",
    permission: checkPermissions("business:management:view"),
    per_name: "business:management:view",
    children: [
      {
        id: "3-1",
        name: "image_video",
        icon: "fa-solid fa-photo-film",
        type: "group",
        permission: checkPermissions("resource:view"),
        per_name: "resource:view",
        url: "/businessmanagement",
        children: [
          {
            id: "3-1-1",
            name: "image_resource",
            icon: "",
            type: "page",
            permission: checkPermissions("resource:image:view"),
            url: "/businessmanagement/noteImage",
            per_name: "resource:image:view",
            children: [
              {
                name: "list",
                per_name: "resource:image:list",
              },
              {
                name: "create",
                per_name: "resource:image:add",
              },
              {
                name: "edit",
                per_name: "resource:image:edit",
              },
              {
                name: "delete",
                per_name: "resource:image:remove",
              },
            ],
          },
          {
            id: "3-1-2",
            name: "video_resource",
            icon: "",
            type: "page",
            permission: checkPermissions("resource:video:view"),
            url: "/businessmanagement/noteVideo",
            per_name: "resource:video:view",
            children: [
              {
                name: "list",
                per_name: "resource:video:list",
              },
              {
                name: "create",
                per_name: "resource:video:add",
              },
              {
                name: "edit",
                per_name: "resource:video:edit",
              },
              {
                name: "delete",
                per_name: "resource:video:remove",
              },
            ],
          },
          // {
          //   id: "3-1-3",
          //   name: "音頻资源",
          //   icon: "",
          //   type: "page",
          //   permission: checkPermissions("resource:topic:view"),
          //   url: "/businessmanagement/noteAudio",
          //   per_name: "resource:audio:view",
          //   children: [
          //     {
          //       name: 'list',
          //       per_name: "resource:audio:list",
          //     },
          //     {
          //       name: "create",
          //       per_name: "resource:audio:add",
          //     },
          //     {
          //       name: "edit",
          //       per_name: "resource:audio:edit",
          //     },
          //     {
          //       name: "delete",
          //       per_name: "resource:audio:remove",
          //     },
          //   ],
          // },
          {
            id: "3-1-4",
            name: "topic_management",
            icon: "",
            type: "page",
            permission: checkPermissions("resource:topic:view"),
            url: "/businessmanagement/noteTopic",
            per_name: "resource:topic:view",
            children: [
              {
                name: "list",
                per_name: "resource:topic:list",
              },
              {
                name: "create",
                per_name: "resource:topic:add",
              },
              {
                name: "edit",
                per_name: "resource:topic:edit",
              },
              {
                name: "delete",
                per_name: "resource:topic:remove",
              },
            ],
          },
          {
            id: "3-1-5",
            name: "tag_management",
            icon: "",
            type: "page",
            permission: checkPermissions("resource:tag:view"),
            url: "/businessmanagement/noteTag",
            per_name: "resource:tag:view",
            children: [
              {
                name: "list",
                per_name: "resource:tag:list",
              },
              {
                name: "create",
                per_name: "resource:tag:add",
              },
              {
                name: "edit",
                per_name: "resource:tag:edit",
              },
            ],
          },
        ],
      },

      {
        id: "3-2",
        name: "long_video",
        icon: "fa-solid fa-film",
        type: "group",
        permission: checkPermissions("longvideo:view"),
        per_name: "longvideo:view",
        // url: "/businessmanagement/noteLongVideo",
        children: [
          {
            id: "3-2-1",
            name: "long_video",
            icon: "",
            type: "page",
            permission: checkPermissions("longvideo:resource:view"),
            url: "/businessmanagement/noteLongVideo",
            per_name: "longvideo:resource:view",
            children: [
              {
                name: "list",
                per_name: "longvideo:resource:list",
              },
              {
                name: "create",
                per_name: "longvideo:resource:add",
              },
              {
                name: "edit",
                per_name: "longvideo:resource:edit",
              },
              {
                name: "delete",
                per_name: "longvideo:resource:remove",
              },
            ],
          },
          {
            id: "3-2-2",
            name: "long_video_topic",
            icon: "",
            type: "page",
            permission: checkPermissions("longvideo:topic:view"),
            url: "/businessmanagement/noteLongVideoTopic",
            per_name: "longvideo:topic:view",
            children: [
              {
                name: "list",
                per_name: "longvideo:topic:list",
              },
              {
                name: "create",
                per_name: "longvideo:topic:add",
              },
              {
                name: "edit",
                per_name: "longvideo:topic:edit",
              },
            ],
          },
          {
            id: "3-2-3",
            name: "long_video_classification",
            icon: "",
            type: "page",
            permission: checkPermissions("longvideo:tag:view"),
            url: "/businessmanagement/noteLongVideoType",
            per_name: "longvideo:tag:view",
            children: [
              {
                name: "list",
                per_name: "longvideo:tag:list",
              },
              {
                name: "create",
                per_name: "longvideo:tag:add",
              },
              {
                name: "edit",
                per_name: "longvideo:tag:edit",
              },
            ],
          },
          {
            id: "3-2-4",
            name: "long_video_star",
            icon: "",
            type: "page",
            permission: checkPermissions("longvideo:star:view"),
            url: "/businessmanagement/noteLongVideoStar",
            per_name: "longvideo:star:view",
            children: [
              {
                name: "list",
                per_name: "longvideo:star:list",
              },
              {
                name: "create",
                per_name: "longvideo:star:add",
              },
              {
                name: "edit",
                per_name: "longvideo:star:edit",
              },
              {
                name: "delete",
                per_name: "longvideo:resource:remove",
              },
            ],
          },
        ],
      },
      {
        id: "3-3",
        name: "live_broadcast",
        icon: "fa-solid fa-video",
        type: "group",
        permission: checkPermissions("livevideo:view"),
        per_name: "livevideo:view",
        // url: "/businessmanagement/noteLongVideo",
        children: [
          {
            id: "3-3-1",
            name: "live_resources",
            icon: "",
            type: "page",
            permission: checkPermissions("livevideo:resource:view"),
            url: "/businessmanagement/noteLiveVideo",
            per_name: "livevideo:resource:view",
            children: [
              {
                name: "list",
                per_name: "livevideo:resource:list",
              },
              {
                name: "create",
                per_name: "livevideo:resource:add",
              },
              {
                name: "edit",
                per_name: "livevideo:resource:edit",
              },
              {
                name: "delete",
                per_name: "livevideo:resource:remove",
              },

              //comment
              {
                name: "comment_list",
                per_name: "livevideo:comment:list",
              },

              {
                name: "comment_delete",
                per_name: "livevideo:comment:remove",
              },
              //audience
              {
                name: "audience_list",
                per_name: "livevideo:audience:list",
              },
            ],
          },
        ],
      },
      {
        id: "3-4",
        name: "im_recommend",
        icon: "",
        type: "page",
        permission: checkPermissions("resource:imrecommend:view"),
        per_name: "resource:imrecommend:view",
        url: "/businessmanagement/imRecommend",
        children: [
          {
            name: "list",
            per_name: "resource:imrecommend:list",
          },
          {
            name: "create",
            per_name: "resource:imrecommend:add",
          },
          {
            name: "edit",
            per_name: "resource:imrecommend:edit",
          },
          {
            name: "delete",
            per_name: "resource:imrecommend:remove",
          },
        ],
      },
      // {
      //   id: "3-5",
      //   name: "運營管理",
      //   icon: "",
      //   type: "group",
      //   permission: true,
      //   per_name: "livevideo:view",
      //   // url: "/businessmanagement/noteLongVideo",
      //   children: [
      //     {
      //       id: "3-5-1",
      //       name: "版本管理",
      //       icon: "",
      //       type: "page",
      //       permission: true,
      //       url: "/businessManagement/version",
      //       per_name: "livevideo:resource:view",
      //       children: [],
      //     },
      //     {
      //       id: "3-5-2",
      //       name: "敏感词库",
      //       icon: "",
      //       type: "page",
      //       permission: true,
      //       url: "/businessManagement/sensitiveWords",
      //       per_name: "livevideo:resource:view",
      //       children: [],
      //     },
      //     {
      //       id: "3-5-3",
      //       name: "渠道管理",
      //       icon: "",
      //       type: "page",
      //       permission: true,
      //       url: "/businessManagement/channel",
      //       per_name: "livevideo:resource:view",
      //       children: [],
      //     },
      //   ],
      // },
    ],
  },
];
