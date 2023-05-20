import { createStore } from "vuex";
import app from "@/store/modules/app.js";
import tagsView from "@/store/modules/tags-view.js";
import user from "@/store/modules/user.js";
import permissions from "@/store/modules/permissions.js";
import theme from "@/store/modules/theme.js";

export default createStore({
  modules: {
    app,
    tagsView,
    user,
    permissions,
    theme,
  },
  devtools: true,
});
