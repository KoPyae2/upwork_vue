<template>
  <div class="breadcrumb-list">
    <el-breadcrumb separator="/">
      <template v-for="item in breadcrumbs" :key="item.name">
        <el-breadcrumb-item
          v-if="item.hasOwnProperty('children')"
          style="cursor: pointer"
        >
          <el-dropdown>
            <span class="el-dropdown-link link">
              <font-awesome-icon :icon="item.icon" />
              {{ item.name }}
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="menu in item.children"
                  :key="menu.name"
                >
                  <font-awesome-icon
                    :icon="menu.icon"
                    style="margin-right: 10px; font-size: 5px"
                  />

                  <span @click="redirectTo(menu.url)">{{ menu.name }}</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-breadcrumb-item>

        <el-breadcrumb-item v-else>
          <span>{{ item.name }}</span>
        </el-breadcrumb-item>
      </template>
    </el-breadcrumb>
  </div>
</template>

<script>
import { reactive, toRefs, computed } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";

export default {
  name: "BreadCrumbMenu",
  components: {},
  setup() {
    const noteBreadCrumb = [
      {
        children: [
          {
            children: [
              {
                name: "图片资源",
                icon: "fa-solid fa-circle",
                url: "/businessmanagement/noteImage",
              },
              {
                name: "视频资源",
                icon: "fa-solid fa-circle",
                url: "/businessmanagement/noteVideo",
              },
              {
                name: "话题管理",
                icon: "fa-solid fa-circle",
                url: "/businessmanagement/noteTopic",
              },
              {
                name: "标签管理",
                icon: "fa-solid fa-circle",
                url: "/businessmanagement/noteTag",
              },
            ],
            name: "图片/视频  资源",
            icon: "fa-solid fa-photo-film",
            url: "/businessmanagement",
          },
          {
            children: [
              {
                name: "长视频",
                icon: "fa-solid fa-circle",
                url: "/businessmanagement/noteLongVideo",
              },
              {
                name: "长视频专题",
                icon: "fa-solid fa-circle",
                url: "/businessmanagement/noteLongVideoTopic",
              },
              {
                name: "长视频分类",
                icon: "fa-solid fa-circle",
                url: "/businessmanagement/noteLongVideoType",
              },
              {
                name: "长视频明星",
                icon: "fa-solid fa-circle",
                url: "/businessmanagement/noteLongVideoStar",
              },
            ],
            name: "长视频",
            icon: "fa-solid fa-film",
            url: "/businessmanagement",
          },
          {
            children: [
              {
                name: "直播资源",
                icon: "fa-solid fa-circle",
                url: "/businessmanagement/noteLiveVideo",
              },
            ],
            name: "现场直播",
            icon: "fa-solid fa-video",
            url: "/businessmanagement",
          },
          {
            name: "IM推荐资源",
            icon: "fa-solid fa-circle",
            url: "/businessmanagement",
          },
        ],
        name: "业务管理",
        icon: "fa-regular fa-folder-open",
        url: "/businessmanagement",
      },
    ];

    const route = useRoute();
    const router = useRouter();

    const getBreadcrumbMenuItem = (activeKey, menu) => {
      const breadcrumbMenu = [];
      if (activeKey === menu.url) {
        breadcrumbMenu.push(menu);
      }

      if (
        activeKey.includes(menu.url) &&
        menu.children &&
        menu.children.length
      ) {
        breadcrumbMenu.push(menu);
        breadcrumbMenu.push(
          ...menu.children
            .map((item) => getBreadcrumbMenuItem(activeKey, item))
            .flat(1)
        );
      }

      return breadcrumbMenu.slice(0, 2);
    };

    const getBreadcrumbMenu = (activeKey, menus) => {
      const breadcrumbMenu = [];

      menus.some((menu) => {
        const flag = activeKey.includes(menu.url);

        if (flag) {
          breadcrumbMenu.push(getBreadcrumbMenuItem(activeKey, menu));
        }
        return flag;
      });

      return breadcrumbMenu;
    };

    const getBreadcrumbByRouteKey = (activeKey, menus) => {
      console.log(activeKey);
      const breadcrumbMenu = getBreadcrumbMenu(activeKey, menus);

      const breadcrumb = breadcrumbMenu[0].map((item) => {
        return transformBreadcrumbMenuToBreadcrumb(item);
      });

      return breadcrumb;
    };

    const transformBreadcrumbMenuToBreadcrumb = (menu) => {
      const hasChildren =
        menu.children &&
        menu.children.length &&
        menu.children[0].hasOwnProperty("id");

      const breadcrumb = {
        url: menu.url,
        name: menu.name,
      };
      if (menu.icon) {
        breadcrumb.icon = menu.icon;
      } else {
        breadcrumb.icon = "fa-solid fa-circle";
      }
      if (hasChildren) {
        breadcrumb.children = menu.children?.map((item) =>
          transformBreadcrumbMenuToBreadcrumb(item)
        );
      }

      return breadcrumb;
    };

    const breadcrumbs = computed(() => {
      if (route.path.includes("/businessmanagement")) {
        return noteBreadCrumb;
      } else {
        return getBreadcrumbByRouteKey(
          route.path,
          JSON.parse(localStorage.getItem("menu"))
        );
      }
    });

    const redirectTo = (url) => {
      router.push({ path: url });
    };

    return {
      breadcrumbs,
      redirectTo,
      route,
    };
  },
};
</script>

<style lang="scss" scoped>
.breadcrumb-list {
  margin-left: 25px;
}
.link {
  color: $mainColor;
}
</style>
