<template>
  <div class="layout">
    <MobileAppHeader v-if="device == 'mobile'"></MobileAppHeader>

    <div class="layout-main">
      <aside>
        <AppSideBar
          :menu="sideMenu"
          :divider="dividerPosition"
          @started="startDragging"
          @stopped="endDragging"
        ></AppSideBar>
      </aside>
      <div class="app-main" @mouseup="endDragging">
        <AppHeader v-if="device == 'desktop'"></AppHeader>

        <div class="app-main-top" :class="{ 'is-upper': isScroll }">
          <AppBreadcrumb
            class="breadcrumb-container"
            v-if="pageSwither === '面包屑'"
          ></AppBreadcrumb>
          <AppTagsViewSwitcher
            v-if="pageSwither === '标签切换'"
          ></AppTagsViewSwitcher>
        </div>

        <main class="app-main-content" ref="main_content">
          <el-main>
            <layout />
          </el-main>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
import {
  defineComponent,
  computed,
  onMounted,
  inject,
  ref,
  toRefs,
  watch,
} from "vue";
import { useStore } from "vuex";
import { reactive } from "vue";
import { useRouter } from "vue-router";
import Layout from "./Layout.vue";

export default defineComponent({
  components: { Layout },
  name: "AdminLayout",

  setup() {
    const store = useStore();

    const state = reactive({
      isScroll: false,
      dividerPosition: localStorage.getItem("menuCollapse") == 1 ? 250 : 60,
    });

    const main_content = ref();

    watch(
      () => store.state.app.menuCollapse,
      (newValue, oldValue) => {
        if (newValue) {
          state.dividerPosition = 250;
        } else {
          state.dividerPosition = 60;
        }
      }
    );

    const router = useRouter();

    const scroll = () => {
      if (main_content.value.scrollTop > 20) {
        state.isScroll = true;
        state.isScroll = false;
      }
    };

    const removeListen = () => {
      document.removeEventListener("mousemove");
    };

    const handleDragging = (e) => {
      const px = e.pageX;
      if (px >= 250 && px <= 600) {
        state.dividerPosition = px;
      }
    };

    const startDragging = () => {
      document.addEventListener("mousemove", handleDragging);
    };
    const endDragging = () => {
      document.removeEventListener("mousemove", handleDragging);
    };

    onMounted(() => {
      main_content.value.addEventListener("scroll", scroll);
    });

    return {
      pageSwither: computed(() => store.state.app.pageIndicator),
      sideMenu: computed(() => store.getters["app/menu"]),
      device: computed(() => store.state.app.device),
      main_content,
      ...toRefs(state),
      removeListen,
      handleDragging,
      startDragging,
      endDragging,
    };
  },
});
</script>

<style lang="scss">
.layout {
  width: 100%;
  // height: 100%;

  .layout-main {
    display: flex;
    background: $app_background;

    aside {
      min-height: calc(100vh);
      @media screen and (max-width: 750px) {
        display: none;
      }
    }
  }
  .app-main {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    overflow: hidden;
    .app-main-top {
      display: flex;
      align-items: center;
      padding: 0 10px;
      flex-shrink: 0;
      height: $breadcrumbHeight;
      background: transparent;
      background-color: $app_background;
      position: sticky;
      z-index: 990;
    }
    .is-upper {
      box-shadow: 0 8px 5px -5px rgb(0 0 0 / 0.25);
    }
    .app-main-content {
      width: 100%;
      height: $adminContentHeight;
      overflow-y: auto;
      box-sizing: border-box;
      overflow-x: hidden;
    }
  }
}
.el-table .cell {
  overflow: unset !important;
}
</style>
