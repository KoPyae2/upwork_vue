<template>
  <header class="mobile-admin-header">
    <div class="header--left">
      <!-- <img
        src="/right-arrow.png"
        alt="right arrow"
        @click="onShowMobileMenu"
        class="fold-btn"
      /> -->
      <font-awesome-icon
        icon="fa-solid fa-bars"
        @click="onShowMobileMenu"
        class="fold-btn"
      />
    </div>
    <div class="header--right">
      <SearchMenu />

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
        <font-awesome-icon
          icon="fa-solid fa-arrows-rotate"
          @click="refreshScreen"
          class="refresh"
        />
      </span>

      <el-popover placement="bottom-end" :width="100" trigger="click">
        <template #reference>
          <div class="language-menu" v-if="language == 'English'">
            <img src="/us.png" alt="" />
            <!-- <span>{{ language }}</span> -->
          </div>

          <div class="language-menu" v-else>
            <img src="/china.png" alt="" />
            <!-- <span>{{ language }}</span> -->
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
        <!-- <el-popover
          placement="bottom"
          :width="300"
          trigger="hover"
          class="header-icon"
          style="padding: 0"
        >
          <template #reference>
            <el-badge
              :value="noticeList.length"
              :max="99"
              type="success"
              :hidden="noticeList.length === 0"
              style="margin-right: 20px"
            >
              <i class="el-icon-message-solid" style="font-size: 20px"></i>
            </el-badge>
          </template>
          <el-tabs>
            <el-tab-pane label="未读消息" name="0"></el-tab-pane>
          </el-tabs>
          <div class="notice-popover-panel" v-if="noticeList.length !== 0">
            <div v-for="item in noticeList" :key="item.id" class="notice-item">
              <i class="el-icon-message-solid message-icon"></i>
              <div class="notify-content">
                <h2>{{ item.content }}</h2>
                <p>{{ item.time }}</p>
              </div>
            </div>
          </div>
          <el-empty description="暂无消息" v-else></el-empty>
          <div class="panel-btn-group" v-if="noticeList.length !== 0">
            <el-button type="text" size="mini" @click="onClearNoticeClick"
              >清除消息</el-button
            >
          </div>
        </el-popover> -->
        <el-popover
          placement="bottom-end"
          :width="150"
          trigger="click"
          popper-class="info-popper"
        >
          <template #reference>
            <div class="avatar">
              <font-awesome-icon icon="fa-solid fa-user" class="user-icon" />
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

              <div style="padding: 10px">{{ userInfo || "--" }}</div>
              <!-- <el-tag size="mini" style="margin-top: 5px">{{
                userInfo.role || "--"
              }}</el-tag> -->
            </div>
            <div class="info-item">
              <el-button @click="showQr" style="color: #e6a23c" link>{{
                t("common.google_qr")
              }}</el-button>
            </div>
            <hr class="separator" />
            <div class="info-item">
              <el-button @click="onLogoutClick" style="color: red" link>
                <font-awesome-icon
                  icon="fa-solid fa-circle-exclamation"
                  style="margin-right: 10px"
                  class="fa-lg"
                />
                {{ t("common.logout") }}</el-button
              >
            </div>
          </div>
        </el-popover>

        <el-dialog v-model="qrDialog">
          <el-form>
            <el-form-item label="" align="center">
              <qrcode-vue :value="qr" :size="150" level="H" />
            </el-form-item>
          </el-form>
        </el-dialog>
      </section>
    </div>
    <MobileAppSideBar ref="mobileAppSideBar"></MobileAppSideBar>
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
import { useRouter } from "vue-router";
import http from "@/http";
import QrcodeVue from "qrcode.vue";
import { changeLang } from "@/locales/i18n";
import SearchMenu from "@/components/SearchMenu/index.vue";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "AdminHeader",
  components: {
    QrcodeVue,
    SearchMenu,
  },
  setup() {
    const router = useRouter();

    const store = useStore();
    const { t } = useI18n();
    let state = reactive({
      language: store.state.user.lang == "en" ? "English" : "Chinese",
    });

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

    const qr = ref("");
    const qrDialog = ref(false);

    const onClearNoticeClick = () => {
      noticeList.value.splice(0, noticeList.value.length);
    };
    const noticeTabActive = ref("0");
    const onNoticeTabChange = (tab) => {
      noticeTabActive.value = tab.paneName;
    };

    const onLogoutClick = () => {
      http.user.logout().then((res) => {
        if (res.data.err_code == 0) {
          store.commit("tagsView/delAllVisitedRoutes");
          store.dispatch("user/logout").then(() => {
            resetRouter();
            router.push({
              path: "/login",
            });
          });
        }
      });
    };

    const mobileAppSideBar = ref(null);
    const onShowMobileMenu = () => {
      mobileAppSideBar.value.show();
    };

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

    const refreshScreen = () => {
      router.go();
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

    onMounted(() => {
      // http.user.getPermissions().then((res) => {
      //   if (res.err_code == 0) {
      //     qr.value = `otpauth://totp/${res.data.username}?secret=${res.data.secret_key}`;
      //   }
      // });
    });

    return {
      ...toRefs(state),
      changeLan,
      noticeList,
      onClearNoticeClick,
      onLogoutClick,
      userInfo: computed(() => store.getters["app/userInfo"]),
      noticeTabActive,
      onNoticeTabChange,
      mobileAppSideBar,
      onShowMobileMenu,
      qr,
      qrDialog,
      showQr,
      refreshScreen,
      switchTheme,
      t,
      theme: computed(() => store.state.theme.mode),
    };
  },
});
</script>

<style lang="scss">
.mobile-admin-header {
  width: 100%;
  height: $appHeaderHeight;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  justify-content: space-between;
  position: relative;
  z-index: 999;
  transition: all 0.5s;
  background: $app_background;
  color: $header_text;
  font-weight: bold;
  //box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);

  .header--left {
    display: flex;
    align-items: center;
    flex-shrink: 0;

    .fold-btn {
      margin: 0 20px;
      color: $header_text;
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
      .username {
        margin-left: 5px;
        font-weight: normal;
        font-size: 13px;
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
  z-index: 99999999999;
  position: relative;
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
    padding: 15px 10px;
    box-sizing: border-box;

    // &:hover {
    //   background: #fff;
    // }
    .separator {
      border: 0.5px solid #ebe9e9;
      margin: 0px 10px;
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

.language-menu {
  margin-right: 20px;
  cursor: pointer;
}
.language-change {
  display: flex;
  align-items: center;
  // justify-content: center;

  img {
    width: 25px;
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
