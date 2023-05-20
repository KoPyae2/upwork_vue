<template>
  <el-menu
    unique-opened
    mode="vertical"
    active-text-color="#fff"
    :collapse="sideMenuCollapse"
    :class="[!sideMenuCollapse ? 'admin-aside-menu' : 'admin-aside-menu-close']"
    collapse-transition
    :default-active="$route.path"
    @select="onMenuSelect"
    :style="{
      width: `${divider}px`,
    }"
    @mouseup="endDragging"
  >
    <span
      @mousedown="startDragging"
      class="divider"
      :style="{
        left: `${divider}px`,
      }"
      v-if="store.state.app.menuCollapse == 1"
    >
    </span>

    <li class="admin-title" v-if="!sideMenuCollapse" id="AppLogo">
      {{ t(`common.${appName}`) }}
    </li>

    <li class="admin-title-collapse" v-else>
      <span class="rectangle">
        <svg
          fill="none"
          viewBox="0 0 70 70"
          height="45px"
          width="45px"
          xmlns="http://www.w3.org/2000/svg"
          class="svg-rectangle"
        >
          <path
            xmlns="http://www.w3.org/2000/svg"
            d="M28 4.04145C32.3316 1.54059 37.6684 1.54059 42 4.04145L58.3109 13.4585C62.6425 15.9594 65.3109 20.5812 65.3109 25.5829V44.4171C65.3109 49.4188 62.6425 54.0406 58.3109 56.5415L42 65.9585C37.6684 68.4594 32.3316 68.4594 28 65.9585L11.6891 56.5415C7.3575 54.0406 4.68911  49.4188 4.68911 44.4171V25.5829C4.68911 20.5812 7.3575 15.9594 11.6891 13.4585L28 4.04145Z"
            fill="#D9F3FF"
          ></path>
        </svg>
        <p>N</p>
      </span>
    </li>

    <MenuItem :menuList="menu"> </MenuItem>
  </el-menu>
</template>

<script>
/**
 * 侧边菜单导航栏
 *
 */
import MenuItem from "./MenuItem.vue";
import {
  defineComponent,
  onMounted,
  reactive,
  toRefs,
  computed,
  onBeforeMount,
  watch,
} from "vue";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "AdminSideBar",
  props: {
    menu: {
      type: Array,
      default: () => [],
    },
    divider: {
      type: Number,
      default: () => 0,
    },
  },
  components: {
    MenuItem,
  },
  emits: ["started", "stopped", "menuSelect"],
  setup(props, context) {
    const { t } = useI18n();
    const store = useStore();
    const onMenuSelect = (index) => {
      context.emit("menuSelect", index);
    };
    let state = reactive({
      sideMenuCollapse: computed(() =>
        store.state.app.menuCollapse == 1 ? false : true
      ),
    });

    const startDragging = () => {
      context.emit("started");
    };
    const endDragging = () => {
      context.emit("stopped");
    };

    return {
      onMenuSelect,
      onMounted,
      ...toRefs(state),
      appName: computed(() => store.state.app.appName),
      startDragging,
      endDragging,
      store,
      t,
    };
  },
});
</script>

<style lang="scss">
.admin-title {
  font-weight: bold;
  font-size: 18px;
  vertical-align: middle;
  text-align: center;
  color: #00b2ff !important;
  padding: 18px;
  line-height: 1.3;
  width: auto;
}

#AppLogo {
  position: fixed;
  top: 0;
  background: $sidebarBgColor;
  z-index: 100;
  width: 185px;
}

.admin-title-collapse {
  height: 50px;
  padding-top: 10px;
  padding-left: 10px;

  .rectangle {
    height: 100%;
    position: relative;

    .svg-rectangle {
      position: absolute;
    }

    p {
      position: absolute;
      left: 15px;
      top: 15px;
      font-size: 18px;
      font-weight: bold;
    }
  }
}

.admin-aside-menu-close {
  height: 100%;
  background-color: $sidebarBgColor;
  font-size: 14px;
  width: 100%;
  overflow: auto;
  user-select: none;
  border: none;
  overflow-x: hidden;
  // padding-right: 18px;
  box-shadow: 0 0 80px 50px rgb(206 213 225 / 5%);
  //border-right: 2px solid #999;
  color: $mainColor;

  &:not(.el-menu--collapse) {
    width: $sideMenuWidth;
  }

  .el-sub-menu__title {
    color: $header_text !important;
  }

  .el-sub-menu__title:hover {
    color: $mainColor !important;
    background: $mainColor;
  }

  .el-sub-menu__title,
  .el-menu-item {
    text-align: center !important;
    transition: all 0.05s;
    color: $header_text !important;
    background-color: $sidbarItemBg;
    line-height: 50px;
    height: 50px;
    padding: 13px;
    color: $header_text;

    svg {
      color: $header_text !important;
      margin-right: 0 !important;
      font-size: 15px;
      text-align: center;
      padding-left: 3px;
    }

    span {
      display: block;
      color: $header_text !important;
      margin-left: 10px;
    }

    &:hover {
      color: $mainColor;
      background: $sidbarHoverBg !important;
      transition: background-color 0.2s;

      span {
        color: $mainColor !important;
      }

      svg {
        color: $header_text !important;
      }
    }

    &.is-active {
      font-weight: bold;
      background: $sidbarActiveBg !important;
      box-sizing: border-box;

      span {
        color: $header_text !important;
      }

      svg {
        color: $header_text !important;
      }
    }
  }

  .el-sub-menu {
    margin-left: 5px;
    //background: $sidbarHoverBg;
  }

  .el-submenu__title {
    span {
      margin-left: 8px;
    }
  }
}

.admin-aside-menu {
  padding-top: 50px;
  height: 100vh;
  background-color: $sidebarBgColor;
  font-size: 14px;
  display: block;
  width: 100%;
  overflow: auto;
  user-select: none;
  border: none;
  overflow-x: hidden;
  // overflow-y: scroll !important;
  color: $mainColor;
  box-shadow: 0 0 80px 50px rgb(206 213 225 / 5%);
  //border-right: 2px solid #999;

  // &:not(.el-menu--collapse) {
  //   width: $sideMenuWidth;
  // }

  .el-sub-menu__title {
    color: $header_text !important;
  }

  .el-sub-menu__title:hover {
    color: $mainColor !important;
  }

  .el-sub-menu__title,
  .el-menu-item {
    text-align: left !important;
    transition: all 0.05s;
    color: $header_text !important;
    background-color: $sidbarItemBg;
    line-height: 50px;
    height: 50px;

    svg {
      color: $header_text !important;
      margin-right: 0 !important;
      font-size: 15px;
    }

    span {
      color: $header_text !important;
      margin-left: 10px;
    }

    &:hover {
      background: $sidbarHoverBg !important;
      transition: background-color 0.2s;

      span {
        color: $mainColor !important;
      }

      svg {
        color: $mainColor !important;
      }
    }

    &.is-active {
      font-weight: bold;

      background: $sidbarActiveBg !important;
      box-sizing: border-box;

      span {
        color: $mainColor !important;
      }

      svg {
        color: $mainColor !important;
      }
    }
  }

  // .el-menu-item {
  //   //background: $sidbarHoverBg;

  // }

  .el-submenu__title {
    span {
      margin-left: 8px;
    }
  }
}

/**折叠*/
.el-menu--popup {
  .el-menu-item {
    text-align: left !important;
    transition: all 0.1s;
    // background-color: white;

    svg {
      // color: #1a1a1d !important;
      padding-right: 2px;
    }

    span {
      // color: #1a1a1d !important;
      margin-left: 10px;
    }

    &:hover,
    &.is-active {
      //   background: $sidebarBgColor !important;

      span {
        color: $mainColor !important;
      }

      svg {
        color: $mainColor !important;
      }
    }
  }
}

.divider {
  height: 100vh;
  width: 10px;
  background: var(--sidebar_bg);
  transform: translateX(-10px);
  position: absolute;
  top: 0;
  z-index: 1;
  cursor: ew-resize;
}
</style>
