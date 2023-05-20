<template>
  <div class="container">
    <div class="side-container">
      <div class="logo-container">
        <h2>Dashboard</h2>
      </div>
      <div class="content-container">
        <img src="/logo.png" alt="Login" />
      </div>
    </div>
    <div class="login-container">
      <div class="login">
        <div class="login-header">
          <h3>TVCBOT</h3>
        </div>
        <div class="register-wrapper">
          <div style="border: 2px solid #000">
            <div class="login-body">
              <div class="login-title">
                <h3 class="title">{{ t("auth.register") }}</h3>
              </div>
              <el-form
                class="login-form"
                label-position="top"
                :model="loginForm"
                :rules="loginRules"
                ref="loginFromRef"
              >
                <h1 class="form-title">{{ t("auth.personal_info") }}</h1>
                <el-row :gutter="20">
                  <el-col :span="12" :lg="12" :md="24" :xs="24">
                    <el-form-item prop="email" :label="t('auth.email')">
                      <el-input
                        :placeholder="t('auth.enter_email')"
                        v-model="loginForm.email"
                        name="username"
                        type="text"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col
                    :span="12"
                    :lg="12"
                    :md="24"
                    :xs="24"
                    class="phone-form"
                  >
                    <el-form-item prop="phone" :label="t('auth.phone')">
                      <div style="display: flex">
                        <el-select v-model="value" class="phone-select">
                          <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                            :disabled="item.disabled"
                          />
                        </el-select>
                        <el-input
                          :placeholder="t('auth.enter_phone')"
                          name="username"
                          v-model="loginForm.phone"
                          type="text"
                          class="phone-number"
                        />
                      </div>
                    </el-form-item>
                  </el-col>
                </el-row>

                <h1 class="form-title">{{ t("auth.login_pass") }}</h1>
                <el-row :gutter="20">
                  <el-col :span="12" :lg="12" :md="24" :xs="24">
                    <el-form-item prop="password" :label="t('auth.password')">
                      <el-input
                        :placeholder="t('auth.password')"
                        v-model="loginForm.password"
                        name="password"
                        type="password"
                      >
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12" :lg="12" :md="24" :xs="24">
                    <el-form-item
                      prop="confirm_password"
                      :label="t('auth.confirm_pass')"
                    >
                      <el-input
                        :placeholder="t('auth.confirm_pass')"
                        v-model="loginForm.confirm_password"
                        name="confirm_password"
                        type="password"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-checkbox
                  :label="t('auth.agree')"
                  size="large"
                  class="term"
                />

                <el-button
                  class="login-button"
                  type="primary"
                  :loading="loading"
                  @click="handleRegister"
                >
                  {{ t("auth.register") }}
                </el-button>
              </el-form>
            </div>
            <div class="login-footer">
              <p>
                {{ t("auth.already_reg") }}
                <span @click="goPage('/login')" style="cursor: pointer">
                  {{ t("auth.signIn") }}</span
                >
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import http from "@/http";
import { setToken } from "@/utils/cookie";
import Cookies from "js-cookie";
import md5 from "js-md5";
import { Pagination, Navigation, Autoplay } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { useI18n } from "vue-i18n";
import { changeLang } from "@/locales/i18n";

const loginForm = ref({
  email: "",
  password: "",
  confirm_password: "",
});
const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const store = useStore();
const loading = ref(false);
const loginFromRef = ref(null);
const query = computed(() => route.query);
const modules = [Pagination, Navigation, Autoplay];
const state = reactive({
  language: store.state.user.lang == "en" ? "English" : "Chinese",
});

const loginRules = ref({
  username: [
    {
      required: true,
      trigger: "blur",
      message: "Required !",
    },
  ],
  password: [
    {
      required: true,
      trigger: "blur",
      message: "Required !",
    },
  ],
  confirm_password: [
    {
      required: true,
      trigger: "blur",
      message: "Required !",
    },
  ],
});

const TVCbotNews = ref([
  {
    date: "Mar 22, 2022",
    title: t("auth.new_title1"),
    desc: t("auth.new_desc1"),
  },
  {
    date: "Mar 19, 2022",
    title: t("auth.new_title2"),
    desc: t("auth.new_desc2"),
  },
]);

const handleRegister = () => {
  loginFromRef.value.validate((valid) => {
    if (!valid) return;
    if (loginForm.value.confirm_password !== loginForm.value.password) {
      ElMessage.error("The entered passwords are not same");

      return;
    }
    let param = {
      email: loginForm.value.email,
      password: md5(loginForm.value.password),
      c_password: md5(loginForm.value.confirm_password),
    };
    loading.value = true;
    http.user
      .register(param)
      .then((res) => {
        router.push(query.value.redirect || "/bot");
        setToken(res.data.token);
        ElMessage.success(res.message);
        loading.value = false;
        Cookies.set("timer_access", res.data.access_token, {
          expires: 2,
        });
        Cookies.set("userInfo", res.data.email);
      })
      .catch((err) => {
        ElMessage.error(err.response.data.message);
        loading.value = false;
      });
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
  } else {
    state.language = "Chinese";
    changeLang("zh");
  }
};
</script>
<style lang="scss" scoped>
@import "@/styles/auth.scss";
.register-wrapper {
  position: relative;
  .language_change {
    position: absolute;
    top: 20px;
    right: 10px;
  }
}
</style>
