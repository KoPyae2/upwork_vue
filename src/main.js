import { createApp } from "vue";
import App from "./App.vue";
import ElementPlus from "element-plus";
import "element-plus/theme-chalk/index.css";
import "element-plus/theme-chalk/dark/css-vars.css";
import router from "@/router";
import "reset-css";
import store from "@/store";
import "./styles/element-variables.scss";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { checkPermissions } from "@/utils/permissions";
import VueFullscreen from "vue-fullscreen";
import i18n from "./locales/i18n";
import ElTableInfiniteScroll from "el-table-infinite-scroll";
import VueClipboard from "vue3-clipboard";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import vue3PhotoPreview from "vue3-photo-preview";
import "vue3-photo-preview/dist/index.css";
library.add(fas, fab, far);

NProgress.configure({ showSpinner: false, easing: "ease", speed: 500 });

const app = createApp(App);

//author by jack
app.directive("permission", {
  beforeMount: (el, binding) => {
    if (!checkPermissions(binding.arg)) {
      el.style.display = "none";
    }
  },
  // updated: (el, binding) => {
  //   console.log("v-permission",binding.value.permission)
  // },
});

if (import.meta.env.MODE === "development") {
  app.config.devtools = true;
}

app.config.errorHandler = (err, vm, info) => {
  console.error("Vue:", err, vm, info);
};

app.config.warnHandler = function (msg, vm, trace) {
  console.warn("Vue:", msg, vm, trace);
};
app.config.performance = true;

import AdminLayout from "@/layouts/AdminLayout.vue";
app.component("AdminLayout", AdminLayout);

import AppTagsViewSwitcher from "@/layouts/TagsViewSwitcher/index.vue";
app.component("AppTagsViewSwitcher", AppTagsViewSwitcher);

import AppSideBar from "@/layouts/AppSideBar/index.vue";
app.component("AppSideBar", AppSideBar);

import AppBreadcrumb from "@/layouts/Breadcrumb/index.vue";
app.component("AppBreadcrumb", AppBreadcrumb);

import AppHeader from "@/layouts/AppHeader/index.vue";
app.component("AppHeader", AppHeader);

import MobileAppHeader from "@/layouts/MobileAppHeader/index.vue";
app.component("MobileAppHeader", MobileAppHeader);

import MobileAppSideBar from "@/layouts/MobileAppSideBar/index.vue";
app.component("MobileAppSideBar", MobileAppSideBar);

app.component("font-awesome-icon", FontAwesomeIcon);

app.component("Datepicker", Datepicker);
app.use(ElementPlus);
app.use(VueFullscreen);
app.use(VueClipboard, {
  autoSetContainer: true,
  appendToBody: true,
});
app.use(i18n);
app.use(ElTableInfiniteScroll);
app.use(vue3PhotoPreview);
app.use(router);
app.use(store);
app.mount("#app");
