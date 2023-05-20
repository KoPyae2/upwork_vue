import logo from "../../assets/images/logo.png";
import { getClientRect } from "@/others/utils";
import { sidebarItem } from "../menu/index";
import Cookies from "js-cookie";

const getCachePageIndicator = () => {
  let val = localStorage.getItem("pageIndicator");
  return val;
};
const getCacheMenuCollapse = () => {
  let val = localStorage.getItem("menuCollapse");
  return val;
};
const getCachePageKeepAlive = () => {
  let val = localStorage.getItem("getCachePageKeepAlive");
  return val;
};

export default {
  namespaced: true,
  state: () => ({
    appName: `${import.meta.env.VITE_APP_NAME}`,

    appLogo: logo,

    device: "desktop",

    pageIndicator: getCachePageIndicator() || "面包屑",

    menuCollapse: getCacheMenuCollapse() || 0,

    pageKeepAlive: getCachePageKeepAlive() || 0,

    windowRect: {
      clientHeight: getClientRect().clientHeight,
      clientWidth: getClientRect().clientWidth,
    },

    languages: JSON.parse(localStorage.getItem("languages")),

    sidePx: 250,
  }),

  getters: {
    userInfo() {
      let userInfo = Cookies.get("userInfo");
      return userInfo;
    },
    menu() {
      let menu = [...sidebarItem];
      localStorage.setItem("menu", JSON.stringify(menu));
      return menu;
    },
  },

  mutations: {
    SET_DEVICE(state, device) {
      state.device = device;
      if (device === "mobile") this.commit("app/TOGGLE_MENU_COLLAPSE", 1);
      if (device === "desktop")
        this.commit("app/TOGGLE_MENU_COLLAPSE", state.menuCollapse);
    },

    TOGGLE_MENU_COLLAPSE(state, collapse) {
      if (state.menuCollapse === collapse) return;
      state.menuCollapse = collapse;
      localStorage.setItem("menuCollapse", state.menuCollapse);
    },

    SET_MENU_TAG_SWITCHER(state, val = "面包屑") {
      state.pageIndicator = val;
      localStorage.setItem("pageIndicator", state.pageIndicator);
    },

    SET_PAGE_KEEP_ALIVE(state, val = 0) {
      state.pageKeepAlive = val;
      localStorage.setItem("pageKeepAlive", state.pageKeepAlive);
    },

    SET_WINDOW_RECT(state, val) {
      state.windowRect = {
        clientHeight: val.clientHeight || 0,
        clientWidth: val.clientWidth || 0,
      };
    },

    SET_LANGUAGES(state, data) {
      state.languages = data;
      localStorage.setItem("languages", JSON.stringify(data));
    },

    SET_SIDE_PX(state, e) {
      state.sidePx = e.pageX + 20;
      // if (px >= 250 && px <= 500) {
      //   state.dividerPosition = px;
      // }
    },
  },

  actions: {},
};
