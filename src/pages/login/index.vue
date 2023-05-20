<template>
  <el-popover placement="bottom-end" :width="100" trigger="click">
    <template #reference>
      <div class="language-menu" v-if="state.language == 'English'">
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
  <span class="rectangle" @click="switchTheme" v-if="state.theme == 'light'">
    <svg fill="none" viewBox="0 0 70 70" height="45px" width="45px" xmlns="http://www.w3.org/2000/svg"
      class="svg-rectangle">
      <path xmlns="http://www.w3.org/2000/svg"
        d="M28 4.04145C32.3316 1.54059 37.6684 1.54059 42 4.04145L58.3109 13.4585C62.6425 15.9594 65.3109 20.5812 65.3109 25.5829V44.4171C65.3109 49.4188 62.6425 54.0406 58.3109 56.5415L42 65.9585C37.6684 68.4594 32.3316 68.4594 28 65.9585L11.6891 56.5415C7.3575 54.0406 4.68911  49.4188 4.68911 44.4171V25.5829C4.68911 20.5812 7.3575 15.9594 11.6891 13.4585L28 4.04145Z"
        fill="#D9F3FF"></path>
    </svg>
    <font-awesome-icon icon="fa-solid fa-sun" class="refresh" style="color: orange" />
  </span>

  <span class="rectangle" @click="switchTheme" v-else>
    <svg fill="none" viewBox="0 0 70 70" height="45px" width="45px" xmlns="http://www.w3.org/2000/svg"
      class="svg-rectangle">
      <path xmlns="http://www.w3.org/2000/svg"
        d="M28 4.04145C32.3316 1.54059 37.6684 1.54059 42 4.04145L58.3109 13.4585C62.6425 15.9594 65.3109 20.5812 65.3109 25.5829V44.4171C65.3109 49.4188 62.6425 54.0406 58.3109 56.5415L42 65.9585C37.6684 68.4594 32.3316 68.4594 28 65.9585L11.6891 56.5415C7.3575 54.0406 4.68911  49.4188 4.68911 44.4171V25.5829C4.68911 20.5812 7.3575 15.9594 11.6891 13.4585L28 4.04145Z"
        fill="#D9F3FF"></path>
    </svg>
    <font-awesome-icon icon="fa-solid fa-moon" class="refresh" style="color: black" />
  </span>
  <div class="container">
    <div class="side-container">
      <div class="title-container">
        <div class="logo">
          <img src="/logo.png" />
        </div>
        <div class="title">
          <h1>{{ t("auth.welcome") }} {{ t(`common.${appName}`) }}</h1>
          <!-- <p>
            Discover Simply Amazing Admin Dashboard With The Stunning Design
            System
          </p> -->
        </div>
      </div>
      <div class="image">
        <img src="../../assets/images/symbol.png" />
      </div>
    </div>
    <div class="login-container">
      <svg class="background" height="100%" width="60%" version="1.1" id="home-anim" xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" style="enable-background: new 0 0 1820 1080"
        xml:space="preserve">
        <g id="home">
          <defs>
            <rect id="masque" y="0.4" width="1820" height="1080" />
          </defs>
          <clipPath id="cache">
            <use xlink:href="#masque" style="overflow: visible" />
          </clipPath>
          <g id="light-blue">
            <line x1="630.8" y1="894.3" x2="476.3" y2="1048.8" />
            <line x1="858.2" y1="823.9" x2="1012.7" y2="669.4" />
            <line x1="1066.9" y1="458.2" x2="912.4" y2="612.7" />
            <line x1="1294.3" y1="387.8" x2="1448.8" y2="233.3" />
            <line x1="1503" y1="22.1" x2="1348.5" y2="176.6" />
            <line x1="895.6" y1="1166.6" x2="1050.1" y2="1012.1" />
            <line x1="1104.3" y1="800.9" x2="949.8" y2="955.4" />
            <line x1="1331.7" y1="730.5" x2="1486.2" y2="576" />
            <line x1="1540.4" y1="364.8" x2="1385.9" y2="519.3" />
            <line x1="1767.8" y1="294.4" x2="1922.3" y2="139.9" />
            <line x1="1976.5" y1="-71.3" x2="1822" y2="83.2" />
            <line x1="1369.1" y1="1073.2" x2="1523.6" y2="918.7" />
            <line x1="1577.8" y1="707.5" x2="1423.3" y2="862" />
            <line x1="1805.2" y1="637.1" x2="1959.7" y2="482.6" />
            <line x1="1624" y1="1041.4" x2="1469.4" y2="1195.9" />
            <line x1="-134.7" y1="674.9" x2="19.8" y2="520.4" />
            <line x1="74" y1="309.2" x2="-80.5" y2="463.7" />
            <line x1="301.4" y1="238.8" x2="455.9" y2="84.3" />
            <line x1="510.1" y1="-126.9" x2="355.6" y2="27.6" />
            <line x1="-88.6" y1="1008.9" x2="65.9" y2="854.4" />
            <line x1="120.1" y1="643.1" x2="-34.4" y2="797.7" />
            <line x1="347.5" y1="572.8" x2="502" y2="418.3" />
            <line x1="556.2" y1="207.1" x2="401.7" y2="361.6" />
            <line x1="783.6" y1="136.7" x2="938.1" y2="-17.8" />
            <line x1="157.6" y1="985.8" x2="3" y2="1140.3" />
            <line x1="384.9" y1="915.5" x2="539.4" y2="760.9" />
            <line x1="593.6" y1="549.7" x2="439.1" y2="704.3" />
            <line x1="821" y1="479.4" x2="975.5" y2="324.9" />
            <line x1="1029.7" y1="113.6" x2="875.2" y2="268.2" />
            <line x1="1257.1" y1="43.3" x2="1411.6" y2="-111.2" />
          </g>
          <g id="red">
            <line x1="794.4" y1="883.4" x2="639.8" y2="1037.9" />
            <line x1="694.6" y1="834.8" x2="849.2" y2="680.3" />
            <line x1="1230.4" y1="447.3" x2="1075.9" y2="601.8" />
            <line x1="1130.7" y1="398.7" x2="1285.2" y2="244.2" />
            <line x1="1666.5" y1="11.2" x2="1512" y2="165.7" />
            <line x1="732" y1="1177.5" x2="886.6" y2="1023" />
            <line x1="1267.9" y1="790" x2="1113.3" y2="944.5" />
            <line x1="1168.1" y1="741.4" x2="1322.7" y2="586.9" />
            <line x1="1703.9" y1="353.9" x2="1549.4" y2="508.4" />
            <line x1="1604.2" y1="305.3" x2="1758.7" y2="150.8" />
            <line x1="1205.5" y1="1084.1" x2="1360.1" y2="929.6" />
            <line x1="1741.4" y1="696.5" x2="1586.8" y2="851.1" />
            <line x1="1641.6" y1="648" x2="1796.2" y2="493.5" />
            <line x1="1787.5" y1="1030.5" x2="1633" y2="1185" />
            <line x1="1687.8" y1="981.9" x2="1842.3" y2="827.4" />
            <line x1="200.1" y1="-44.4" x2="45.6" y2="110.1" />
            <line x1="237.5" y1="298.3" x2="83" y2="452.8" />
            <line x1="137.8" y1="249.7" x2="292.3" y2="95.2" />
            <line x1="673.6" y1="-137.8" x2="519.1" y2="16.7" />
            <line x1="283.7" y1="632.2" x2="129.2" y2="786.8" />
            <line x1="184" y1="583.7" x2="338.5" y2="429.2" />
            <line x1="719.8" y1="196.2" x2="565.2" y2="350.7" />
            <line x1="620" y1="147.6" x2="774.6" y2="-6.9" />
            <line x1="321.1" y1="974.9" x2="166.6" y2="1129.4" />
            <line x1="221.4" y1="926.4" x2="375.9" y2="771.8" />
            <line x1="757.2" y1="538.8" x2="602.7" y2="693.4" />
            <line x1="657.5" y1="490.3" x2="812" y2="335.8" />
            <line x1="1193.3" y1="102.7" x2="1038.7" y2="257.3" />
            <line x1="1093.5" y1="54.2" x2="1248.1" y2="-100.3" />
          </g>
          <g id="blue">
            <line x1="225.8" y1="1151" x2="534.9" y2="841.9" />
            <line x1="827.1" y1="1003.3" x2="518" y2="1312.3" />
            <line x1="661.9" y1="714.9" x2="971" y2="405.9" />
            <line x1="1263.1" y1="567.2" x2="954.1" y2="876.3" />
            <line x1="1098" y1="278.8" x2="1407.1" y2="-30.2" />
            <line x1="1699.2" y1="131.1" x2="1390.2" y2="440.2" />
            <line x1="699.3" y1="1057.6" x2="1008.4" y2="748.5" />
            <line x1="1300.6" y1="909.9" x2="991.5" y2="1218.9" />
            <line x1="1135.4" y1="621.5" x2="1444.5" y2="312.4" />
            <line x1="1736.6" y1="473.8" x2="1427.6" y2="782.8" />
            <line x1="1571.5" y1="185.4" x2="1880.6" y2="-123.6" />
            <line x1="1172.8" y1="964.2" x2="1481.9" y2="655.1" />
            <line x1="1774.1" y1="816.5" x2="1465" y2="1125.5" />
            <line x1="1608.9" y1="528.1" x2="1918" y2="219" />
            <line x1="1219" y1="1298.1" x2="1528" y2="989.1" />
            <line x1="1655.1" y1="862" x2="1964.1" y2="553" />
            <line x1="232.8" y1="75.5" x2="-76.2" y2="384.6" />
            <line x1="270.2" y1="418.2" x2="-38.8" y2="727.3" />
            <line x1="105.1" y1="129.8" x2="414.2" y2="-179.2" />
            <line x1="706.3" y1="-17.9" x2="397.3" y2="291.2" />
            <line x1="-284.8" y1="899.9" x2="24.2" y2="590.8" />
            <line x1="316.4" y1="752.2" x2="7.3" y2="1061.2" />
            <line x1="151.3" y1="463.8" x2="460.3" y2="154.7" />
            <line x1="752.5" y1="316.1" x2="443.4" y2="625.1" />
            <line x1="587.3" y1="27.7" x2="896.4" y2="-281.4" />
            <line x1="1188.6" y1="-120" x2="879.5" y2="189" />
            <line x1="-247.4" y1="1242.5" x2="61.6" y2="933.5" />
            <line x1="188.7" y1="806.4" x2="497.7" y2="497.4" />
            <line x1="789.9" y1="658.8" x2="480.8" y2="967.8" />
            <line x1="624.8" y1="370.4" x2="933.8" y2="61.3" />
            <line x1="1226" y1="222.7" x2="916.9" y2="531.7" />
            <line x1="1662.1" y1="-213.4" x2="1353" y2="95.6" />
          </g>
        </g>
      </svg>
      <div class="login">
        <div class="login-header">
          <h3>{{ t(`common.${appName}`) }}</h3>
        </div>
        <div class="login-wrapper">
          <div class="login-body">
            <div class="login-title">
              <h3 class="title">{{ t("auth.login") }}</h3>
            </div>
            <el-form class="login-form" label-position="top" :model="form" ref="loginFromRef">
              <el-form-item prop="username" :label="t('common.userName')" :rules="[
                  {
                    required: true,
                    message: t('error.required'),
                    trigger: 'blur',
                  },
                ]">
                <el-input :placeholder="t('auth.username_placeholder')" v-model="form.username" type="text" />
              </el-form-item>

              <el-form-item prop="password" :label="t('auth.password')" :rules="[
                  {
                    required: true,
                    message: t('error.required'),
                    trigger: 'blur',
                  },
                ]">
                <el-input :placeholder="t('auth.password_placeholder')" v-model="form.password" type="password"
                  show-password></el-input>
              </el-form-item>

              <el-form-item :label="t('auth.google_code')">
                <el-input :placeholder="t('auth.google_code_placeholder')" v-model="form.otp" />
              </el-form-item>

              <el-button class="login-button" type="primary" style="width: 100%" :loading="loading" @click="handleLogin">
                {{ t("auth.login") }}
              </el-button>
            </el-form>
          </div>
        </div>
      </div>
    </div>

    <el-dialog v-model="qrDialog" :title="t('auth.dialog_title')" :before-close="closeDialog" width="30%">
      <el-form>
        <el-form-item label="" align="center">
          <div style="display: block; text-align: center; width: 100%">
            <qrcode-vue :value="qr" :size="200" level="H" />
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="submitGoogleForm">{{
            t("auth.confirm")
          }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted, watch } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import http from "@/http";
import { setToken } from "@/utils/cookie";
import Cookies from "js-cookie";
import { changeLang } from "@/locales/i18n";
import { useI18n } from "vue-i18n";

const form = ref({
  username: "test",
  password: "blahblah",
  otp: "78678968",
});
const { t } = useI18n();
const keyword = ref("");
const searchInstance = reactive({
  loading: false,
  result: [],
});
watch(keyword, (newVal) => {
  if (!newVal) searchInstance.result = [];
});
const qr = ref("");
const qrDialog = ref(false);

const loading = ref(false);
const loginFromRef = ref(null);
const store = useStore();
const router = useRouter();
const route = useRoute();
const query = computed(() => route.query);

const state = reactive({
  language: store.state.user.lang == "en" ? "English" : "Chinese",
  googleForm: {
    username: "",
    secret: "",
  },
  theme: computed(() => store.state.theme.mode),
});

const validatePassword = () => {
  return (rule, value, callback) => {
    if (value.length < 6) {
      callback(new Error("Password length should have more than 5"));
    } else {
      callback();
    }
  };
};

const closeDialog = () => {
  qrDialog.value = false;
  state.googleForm = {};
};

const appName = computed(() => store.state.app.appName);

const handleLogin = () => {
  loginFromRef.value.validate((valid) => {
    if (!valid) return;

    loading.value = true;
    store.commit("app/TOGGLE_MENU_COLLAPSE", 1);
        localStorage.setItem("menuCollapse", 1);

        router.push(query.value.redirect || "/home");

    // http.user
    //   .login(form.value)
    //   .then((res) => {
    //     // if (res.data.err_code == 0) {
    //     //   if (res.data.data.token) {
    //     //     qr.value = `otpauth://totp/${res.data.data.username}?secret=${res.data.data.token}&issuer=`;
    //     //     qrDialog.value = true;
    //     //     state.googleForm.username = res.data.data.username;
    //     //     state.googleForm.secret = res.data.data.token;
    //     //   } else {
    //     //     setToken(res.data.data.access_token);
    //     //     Cookies.set("timer_access", res.data.data.access_token, {
    //     //       expires: 2,
    //     //     });
    //     //     ElMessage.success(t(`error.${res.data.err_code}`));
    //     //     loading.value = false;
    //     //     Cookies.set("userInfo", res.data.data.username, {
    //     //       expires: 2,
    //     //     });
    //     //     store.dispatch("permissions/setPermissions");
    //     //     router.push(query.value.redirect || "/home");
    //     //   }

    //     //   store.commit("app/TOGGLE_MENU_COLLAPSE", 1);
    //     //   localStorage.setItem("menuCollapse", 1);

    //     //   router.push(query.value.redirect || "/home");
    //     // } else {
    //     //   ElMessage.error(t(`error.${res.data.err_code}`));
    //     //   loading.value = false;
    //     // }

        
    //   })
    //   .catch((err) => {
    //     loading.value = false;
    //   });
  });
};

const submitGoogleForm = () => {
  http.user
    .bindOtp(state.googleForm)
    .then((res) => {
      if (res.data.err_code == 0) {
        setToken(res.data.data.access_token);
        Cookies.set("timer_access", res.data.data.access_token, {
          expires: 2,
        });
        ElMessage.success(t(`error.${res.data.err_code}`));
        loading.value = false;
        Cookies.set("userInfo", res.data.data.username);
        store.dispatch("permissions/setPermissions");
        router.push(query.value.redirect || "/home");
      } else {
        state.googleForm = {
          username: "",
          secret: "",
        };
        ElMessage.error(res.err_msg);
      }
    })
    .catch((err) => {
      state.googleForm = {
        username: "",
        secret: "",
      };
      ElMessage.error(err.err_msg);
    });
};

const goPage = (val) => {
  setTimeout(() => {
    router.push(val);
  }, 300);
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

onMounted(() => {
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
</script>
<style lang="scss" scoped>
@import "@/styles/auth.scss";
</style>
