<template>
  <el-config-provider :locale="locale">
    <AdminLayout
      ref="adminLayout"
      v-if="$route.meta.layout && $route.meta.layout == 'admin'"
    >
      <router-view class="router-view" v-slot="{ Component }">
        <keep-alive v-if="pageKeepAlive == 1">
          <component :is="Component" />
        </keep-alive>
        <component :is="Component" v-else />
      </router-view>
    </AdminLayout>

    <router-view class="router-view" v-else></router-view>
  </el-config-provider>
</template>

<script>
import { useStore } from "vuex";
import { defineComponent, computed, watch, onMounted, ref } from "vue";
import useWindowSize from "@/hooks/useWindowSize";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import en from "element-plus/dist/locale/en.mjs";
export default defineComponent({
  name: "App",
  setup() {
    const store = useStore();
    const locale = ref();
    // const refreshToken = () => {
    //   store.dispatch("user/refreshToken");
    // };

    const { clientWidth, clientHeight } = useWindowSize();
    clientWidth.value <= 750 && store.commit("app/SET_DEVICE", "mobile");
    clientWidth.value > 750 && store.commit("app/SET_DEVICE", "desktop");
    watch([clientWidth, clientHeight], (newVal) => {
      newVal[0] <= 750 && store.commit("app/SET_DEVICE", "mobile");
      newVal[0] > 750 && store.commit("app/SET_DEVICE", "desktop");
      store.commit("app/SET_WINDOW_RECT", {
        clientWidth: newVal[0],
        clientHeight: newVal[1],
      });
    });
    watch(
      () => store.state.user.lang,
      (newVal, oldVal) => {
        if (newVal == "en") {
          locale.value = en;
        } else {
          locale.value = zhCn;
        }
      }
    );

    onMounted(() => {
      // setInterval(refreshToken, 180000); //automatic update access token in 3minutes if don't have action

      localStorage.setItem("pageIndicator", "标签切换"); //for breadcrumb
      store.state.app.pageIndicator = "标签切换";

      let bodyElement = document.body;

      bodyElement.classList.add("app-background");

      let htmlElement = document.documentElement;

      let theme = localStorage.getItem("theme");

      if (theme === "dark") {
        htmlElement.setAttribute("theme", "dark");
        htmlElement.setAttribute("class", "dark");
      } else {
        htmlElement.setAttribute("theme", "light");
        htmlElement.setAttribute("class", "light");
      }

      if (store.state.user.lang == "en") {
        locale.value = en;
      } else {
        locale.value = zhCn;
      }
    });
    return {
      pageKeepAlive: computed(() => store.state.app.pageKeepAlive),
      onMounted,
      locale,
    };
  },
});
</script>
<style>
@import url("https://fonts.googleapis.com/css2?family=Quicksand:wght@500;600;700&display=swap");

body {
  font-family: "Quicksand", sans-serif !important;
}
</style>
