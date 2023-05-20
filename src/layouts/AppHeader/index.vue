<template>
  <header class="admin-header">
    <div class="header--left">
      <font-awesome-icon
        icon="fa-solid fa-bars"
        v-if="store.state.app.menuCollapse == 0"
        @click="expandToggle"
        class="hamburger-toggle"
      />

      <font-awesome-icon
        icon="fa-solid fa-bars"
        v-else
        @click="collapseToggle"
        class="hamburger-toggle"
      />

      <!-- <BreadcrumbMenu /> -->
    </div>

    <div class="header--right">
      <SearchMenu />

      <span class="rectangle" @click="refreshScreen">
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
        <font-awesome-icon icon="fa-solid fa-arrows-rotate" class="refresh" />
      </span>

      <span class="rectangle" @click="fullscreenToggle">
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
        <font-awesome-icon icon="fa-solid fa-expand" class="fullscreen" />
      </span>

      <el-popover placement="bottom-end" :width="100" trigger="click">
        <template #reference>
          <div class="language-menu" v-if="language == 'English'">
            <img src="/us.png" alt="" />
          </div>

          <div class="language-menu" v-else>
            <img src="/china.png" alt="" />
          </div>
        </template>
        <ul class="language-child">
          <li>
            <div class="language-change" @click="changeLan('en')">
              <img src="/us.png" alt="" />
              <span>{{ t("common.english") }}</span>
            </div>
          </li>
          <li>
            <div class="language-change" @click="changeLan('zh')">
              <img src="/china.png" alt="" />
              <span>{{ t("common.chinese") }}</span>
            </div>
          </li>
        </ul>
      </el-popover>

      <span class="rectangle" @click="switchTheme" v-if="theme == 'light'">
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
        <font-awesome-icon
          icon="fa-solid fa-sun"
          class="refresh"
          style="color: orange"
        />
      </span>

      <span class="rectangle" @click="switchTheme" v-else>
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
        <font-awesome-icon
          icon="fa-solid fa-moon"
          class="refresh"
          style="color: black"
        />
      </span>

      <section class="user-info-section">
        <el-popover
          placement="bottom-end"
          :width="250"
          trigger="hover"
          popper-class="info-popper"
        >
          <template #reference>
            <div class="avatar">
              <font-awesome-icon icon="fa-solid fa-user" class="user-icon" />
              <span class="username">{{ userInfo || "--" }}</span>

              <font-awesome-icon
                icon="fa-solid fa-caret-down"
                style="margin-left: 5px"
              />
            </div>
          </template>

          <div class="userInfo-popover-panel">
            <div class="panel-title" style="text-align: center">
              <el-avatar
                :size="40"
                src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
              />
              <div class="info">{{ userInfo || "--" }} <br /></div>
            </div>
            <div class="info-item">
              <el-button
                type=""
                size="default"
                @click="showQr"
                style="color: #e6a23c"
                link
                >{{ t("common.google_qr") }}</el-button
              >
            </div>
            <hr class="separator" />
            <div class="info-item">
              <el-button type="" @click="onLogoutClick" style="color: red" link>
                <font-awesome-icon
                  icon="fa-solid fa-circle-exclamation"
                  style="margin-right: 10px"
                  class="fa-lg"
                />
                {{ t("common.logout") }}
              </el-button>
            </div>
          </div>
        </el-popover>
      </section>
    </div>
    <el-dialog v-model="qrDialog">
      <el-form>
        <el-form-item label="">
          <qrcode-vue
            :value="qr"
            :size="450"
            level="H"
            style="display: block; margin: 0 auto"
          />
        </el-form-item>
      </el-form>
    </el-dialog>
  </header>
</template>

<script>
import { useStore } from "vuex";
import { resetRouter } from "@/router";
import { getType, traverseArrayTree } from "@/others/utils.js";
import {
  defineComponent,
  computed,
  ref,
  reactive,
  watch,
  onMounted,
  toRefs,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import http from "@/http";
import QrcodeVue from "qrcode.vue";
import { changeLang } from "@/locales/i18n";
import { useI18n } from "vue-i18n";
import SearchMenu from "@/components/SearchMenu/index.vue";
import BreadcrumbMenu from "@/components/BreadcrumbMenu/index.vue";

export default defineComponent({
  methods: {
    fullscreenToggle() {
      this.$fullscreen.toggle();
    },
  },
  name: "AdminHeader",
  components: {
    QrcodeVue,
    SearchMenu,
  },
  setup() {
    const store = useStore();
    const { t } = useI18n();
    const router = useRouter();
    const route = useRoute();

    let state = reactive({
      fullscreen: true,
      language:
        store.state.user.lang == "en"
          ? t("common.english")
          : t("common.chinese"),
    });

    const toggle = () => {
      state.fullscreen != state.fullscreen;
    };

    // let toggler = ref(false);
    const qr = ref("");
    const qrDialog = ref(false);

    const onMenuTagSwitcherChange = (val) => {
      store.commit("app/SET_MENU_TAG_SWITCHER", val);
    };

    const onToggleMenuCollapse = (val) => {
      store.commit("app/TOGGLE_MENU_COLLAPSE", val);
    };

    const onTogglePageKeepAlive = (val) => {
      store.commit("app/SET_PAGE_KEEP_ALIVE", val);
    };

    //通知信息
    const noticeList = ref([
      {
        id: 1,
        content: "这是一条短通知。",
        time: "2021-6-10",
      },
      {
        id: 2,
        content: "这是一条短通知。",
        time: "2021-6-10",
      },
      {
        id: 3,
        content:
          "这是一条长长长长长长长长长长长长长长长长长长长长长长长长通知。",
        time: "2021-6-10",
      },
      {
        id: 4,
        content:
          "这是一条长长长长长长长长长长长长长长长长长长长长长长长长通知。",
        time: "2021-6-10",
      },
      {
        id: 5,
        content:
          "这是一条长长长长长长长长长长长长长长长长长长长长长长长长通知。",
        time: "2021-6-10",
      },
    ]);
    const onClearNoticeClick = () => {
      noticeList.value.splice(0, noticeList.value.length);
    };
    const noticeTabActive = ref("0");
    const onNoticeTabChange = (tab) => {
      noticeTabActive.value = tab.paneName;
    };

    const onLogoutClick = () => {
      // http.user.logout().then((res) => {
      //   if (res.data.err_code == 0) {
      //     store.commit("tagsView/delAllVisitedRoutes");
      //     store.dispatch("user/logout").then(() => {
      //       resetRouter();
      //       router.push({
      //         path: "/login",
      //       });
      //     });
      //   }
      // });
          store.commit("tagsView/delAllVisitedRoutes");
          store.dispatch("user/logout").then(() => {
            resetRouter();
            router.push({
              path: "/login",
            });
          });
    };

    const keyword = ref("");
    const searchInstance = reactive({
      loading: false,
      result: [],
    });
    watch(keyword, (newVal) => {
      if (!newVal) searchInstance.result = [];
    });
    const searchVisible = ref(false);
    const onToggleSearch = () => {
      keyword.value = "";
      searchVisible.value = !searchVisible.value;
    };
    const onSearchSelect = (data) => {
      if (data.url) {
        router.push({
          path: data.url,
        });
      }
    };
    const search = (keyword) => {
      if (!keyword) {
        searchInstance.result = [];
        return;
      }

      searchInstance.loading = true;
      let menu = JSON.parse(localStorage.getItem("menu"));
      let result = [];
      let keywordReg = new RegExp(keyword, "i");
      traverseArrayTree(menu, "children", (node) => {
        if (node.type === "page" && keywordReg.test(node.name)) {
          result.push(node);
        }
      });
      searchInstance.result = result;
      searchInstance.loading = false;
    };

    function collapseToggle() {
      store.commit("app/TOGGLE_MENU_COLLAPSE", 0);
      localStorage.setItem("menuCollapse", 0);
    }

    function expandToggle() {
      store.commit("app/TOGGLE_MENU_COLLAPSE", 1);
      localStorage.setItem("menuCollapse", 1);
    }

    const showQr = () => {
      qrDialog.value = true;
    };

    const changeLan = (lan) => {
      if (lan == "en") {
        state.language = "English";
        changeLang("en");
        document.documentElement.setAttribute("lang", "en");
      } else {
        state.language = "Chinese";
        changeLang("zh");
        document.documentElement.setAttribute("lang", "zh");
      }
    };

    const mode = ref(false);

    watch(
      () => mode.value,
      (newValue, oldValue) => {
        let htmlElement = document.documentElement;

        if (mode.value) {
          store.dispatch("setMode", "dark");
          localStorage.setItem("theme", "dark");
          htmlElement.setAttribute("theme", "dark");
          htmlElement.setAttribute("class", "dark");
        } else {
          store.dispatch("setMode", "light");
          localStorage.setItem("theme", "light");
          htmlElement.setAttribute("theme", "light");
          htmlElement.setAttribute("class", "light");
        }
      }
    );

    const switchTheme = () => {
      if (mode.value) {
        mode.value = false;
      } else {
        mode.value = true;
      }
    };

    const refreshScreen = () => {
      router.go();
    };

    const getUserInfos = () => {
      http.user.getUserInfo().then((res) => {
        if (res.data.err_code == 0) {
          qr.value = `otpauth://totp/${res.data.data.authinfo.username}?secret=${res.data.data.authinfo.secret}`;

          // let defaultLan = res.data.data.available_lang.filter((lan) => {
          //   return lan.status == 1;
          // });

          // if (defaultLan.length > 0) {
          //   store.dispatch("user/setLang", defaultLan[0].short_name);
          // }

          store.commit("app/SET_LANGUAGES", res.data.data.available_lang);

          if (
            res.data.data.authinfo.permission ||
            res.data.data.authinfo.permission.length
          ) {
            let per = JSON.parse(res.data.data.authinfo.permission).concat(
              JSON.parse(res.data.data.authinfo.sub_permission)
            );
            localStorage.setItem("permissions", JSON.stringify(per));
          }
        }
      });
    };

    onMounted(() => {
      getUserInfos();

      let bodyElement = document.body;

      bodyElement.classList.add("app-background");

      let htmlElement = document.documentElement;

      let theme = localStorage.getItem("theme");

      if (theme === "dark") {
        htmlElement.setAttribute("theme", "dark");
        htmlElement.setAttribute("class", "dark");
        mode.value = true;
      } else {
        htmlElement.setAttribute("theme", "light");
        htmlElement.setAttribute("class", "light");
        mode.value = false;
      }
    });

    return {
      ...toRefs(state),
      toggle,
      noticeList,
      onClearNoticeClick,
      onLogoutClick,
      onMenuTagSwitcherChange,
      onToggleMenuCollapse,
      onTogglePageKeepAlive,

      appLogo: computed(() => store.state.app.appLogo),
      menuCollapse: computed(() => store.state.app.menuCollapse),
      pageIndicator: computed(() => store.state.app.pageIndicator),
      pageKeepAlive: computed(() => store.state.app.pageKeepAlive),
      userInfo: computed(() => store.getters["app/userInfo"]),
      getType,
      keyword,
      onSearchSelect,
      search,
      onToggleSearch,
      searchVisible,
      searchInstance,
      noticeTabActive,
      onNoticeTabChange,
      collapseToggle,
      expandToggle,
      qr,
      qrDialog,
      showQr,
      store,
      changeLan,
      refreshScreen,
      t,
      switchTheme,
      theme: computed(() => store.state.theme.mode),
    };
  },
});
</script>

<style lang="scss">
.admin-header {
  width: 100%;
  height: $appHeaderHeight;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  justify-content: space-between;
  position: relative;
  z-index: 999;
  transition: all 0.5s;
  background: var(--headerBg);
  color: $header_text;
  font-weight: bold;

  .header--left {
    color: $header_text;
    display: flex;
    align-items: center;
    flex-shrink: 0;

    .logo-container-open {
      width: 220px;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 23px 0px;
      flex-shrink: 0;
      background: white;

      .admin-logo {
        width: auto;
        height: 22px;
      }

      .admin-title {
        font-weight: bold;
        font-size: 18px;
        vertical-align: middle;
        color: #00b2ff;
        //margin-left: 10px;
      }
    }

    .logo-container-close {
      width: 220px;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0 10px 0 0;
      flex-shrink: 0;

      .admin-logo {
        width: auto;
        height: 22px;
      }

      .admin-title {
        font-weight: bold;
        font-size: 18px;
        vertical-align: middle;
        color: #00b2ff;
        //margin-left: 10px;
      }
    }
  }

  .header--right {
    display: flex;
    align-items: center;

    .icon-notice {
      margin-right: 30px;
    }

    .search-btn {
      cursor: pointer;
      margin-right: 10px;
      font-weight: bold;
      font-size: 20px;
      padding: 10px;
      box-sizing: border-box;

      &:hover {
        transition: background-color 0.5s;
        background: rgba(#000, 0.05);
        padding: 10px;
        box-sizing: border-box;
        border-radius: 100px;
        color: $primaryColor;
      }
    }

    .user-info-section {
      display: flex;
      align-items: center;
      margin-right: 20px;
      cursor: pointer;

      .user-icon {
        color: $header_text;
      }

      .username {
        margin-left: 5px;
        font-weight: normal;
        font-size: 16px;
        color: $header_text;
      }

      .user-info {
        margin-left: 10px;
        text-align: left;

        > p {
          margin-bottom: 4px;
          font-size: 14px;
        }

        .tags-section {
          display: flex;
          align-items: center;
        }
      }
    }
  }
}

.notice-popover-panel {
  height: 300px;
  overflow: auto;
  z-index: 99999999999;
  position: relative;

  .notice-item {
    padding: 10px;
    box-sizing: border-box;
    border-top: 1px solid rgba(0, 0, 0, 0.01);
    transition: all 0.5s;
    display: flex;

    &:hover {
      background: rgba(#000, 0.05);
    }

    .message-icon {
      color: $primaryColor;
      padding-top: 3px;
      flex-shrink: 0;
    }

    .notify-content {
      margin-left: 10px;

      > h2 {
        color: rgba(0, 0, 0, 0.6);
        white-space: pre-wrap;
      }

      > p {
        margin-top: 5px;
        font-size: 12px;
        color: rgba(8, 2, 2, 0.2);
      }
    }
  }
}

.userInfo-popover-panel {
  overflow: auto;
  z-index: 99999;
  color: $header_text;
  position: relative;
  border-radius: 10px;

  .info-item {
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    cursor: pointer;
    transition: all 0.5s;
    box-sizing: border-box;
    width: 100%;
    padding: 5px 0;

    &:hover {
      background: rgba(#000, 0.05);
    }
  }

  .panel-title {
    padding: 20px;
    box-sizing: border-box;
    display: flex;

    // &:hover {
    //   background: #fff;
    // }
    .info {
      // color: #1a1a1d;
      font-weight: 600;
      text-align: start;
      margin-top: 10px;
      margin-left: 20px;

      span {
        font-weight: normal;
        font-size: 13px;
      }
    }
  }

  .separator {
    border: 0.5px solid #ebe9e9;
    margin: 0px 10px;
  }
}

.setting-popover-panel {
  overflow: auto;
  color: $header_text;
  z-index: 99999999999;
  position: relative;

  .setting-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    box-sizing: border-box;

    > h2 {
      color: rgba(0, 0, 0, 0.6);
    }
  }
}

.info-popper {
  padding: 0 !important;
}

.avatar {
  display: flex;
  align-items: center;
  flex-shrink: 0;

  > img {
    width: 16px;
  }
}

.panel-btn-group {
  text-align: center;
  padding-top: 10px;
}

.header-icon {
  font-weight: bold !important;
  font-size: 22px;
  margin: 0 20px;

  > i {
    font-weight: bold !important;
  }
}

.el-tabs__nav-wrap::after {
  height: 0.5px;
}

.hamburger-toggle {
  cursor: pointer;
  color: $header_text;
  font-size: 18px;
  margin-left: 20px;
}

.el-button.is-link {
  padding: 7px 15px;

  i {
    font-size: 16px;
  }
}

.rectangle {
  cursor: pointer;
  position: relative;
  margin-right: 25px;

  .refresh {
    position: absolute;
    left: 15px;
    top: 15px;
    color: $mainColor;
  }

  .fullscreen {
    position: absolute;
    left: 16px;
    top: 15px;
    color: $mainColor;
  }
}

.language-menu {
  margin-right: 20px;
  cursor: pointer;
}

.language-change {
  display: flex;
  align-items: center;
  // justify-content: center;

  img {
    min-width: 32px;
    margin-right: 12px;
  }

  span {
    font-size: 13px;
    color: var(--text_color);
  }
}

.language-child {
  li {
    padding: 8px;
    cursor: pointer;
  }

  li:hover {
    background: var(--lang-background);
  }
}
</style>
