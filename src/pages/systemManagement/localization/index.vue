<template>
  <div
    element-loading-background="rgba(122, 122, 122, 0.3)"
    v-loading="isLoading"
  >
    <p style="color: #f56c6c; margin-bottom: 20px">
      {{ t("common.localization_notice") }}
    </p>
    <div style="margin-bottom: 20px; text-align: right">
      <el-button
        class="app-button"
        :disabled="doubleClick"
        @click="submitHandler(formRef)"
        v-permission:system:localization:edit
        >{{ t("common.sure") }}</el-button
      >
      <el-button
        class="app-button"
        :disabled="doubleClick"
        @click="reloadLocalization"
        v-permission:system:localization:edit
        >{{ t("common.reload") }}</el-button
      >
    </div>
    <el-tabs
      v-model="activeTab"
      class="tabs"
      type="card"
      v-if="data.length > 0"
    >
      <el-tab-pane
        v-for="(lan, index) in languages"
        :key="lan.id"
        :label="lan.name"
        :name="lan.short_name"
      >
        <el-card class="box-card" v-permission:system:localization:list>
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 30 }"
            placeholder="Please input"
            v-model="data[index].content"
          >
          </el-input>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { onMounted, reactive, toRefs, computed } from "vue";
import http from "@/http";
import { useStore } from "vuex";
import { dateFormat } from "@/utils/timeFormat.js";
import { ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";

export default {
  name: "HotKeywords",
  components: {},
  setup() {
    const store = useStore();
    const state = reactive({
      isLoading: true,
      showDialog: false,
      doubleClick: false,
      filterForm: {},
      param: {},
      form: {
        data: [],
      },
      data: {},
      isLoading: false,
      languages: store.state.app.languages,
      activeTab: store.state.app.languages[0].short_name,
    });
    const { t } = useI18n();

    const editLanForm = (data) => {
      if (data.length == state.languages.length) {
        state.form.data = data;
        let lans = state.languages.sort((a, b) => {
          return (
            state.form.data.findIndex((p) => p.lang === a.short_name) -
            state.form.data.findIndex((p) => p.lang === b.short_name)
          );
        });

        state.languages = lans;
      } else {
        state.languages.map((item, index) => {
          if (data[index]) {
            state.form.data.push(data[index]);
          } else {
            state.form.data.push({
              lang: item.short_name,
              content: "",
            });
          }
          return;
        });
      }
    };

    const getData = () => {
      state.isLoading = true;

      http.systemManagement.getLocalization(state.param).then((res) => {
        if (res.data.err_code == 0) {
          state.isLoading = false;
          editLanForm(res.data.data);
          state.data = res.data.data;
        } else {
          state.isLoading = false;
        }
      });
      const default_lan = state.languages.findIndex((lan) => {
        return lan.status == 1;
      });
      if (default_lan !== -1) {
        state.activeTab = store.state.app.languages[default_lan].short_name;
      }
    };

    const submitHandler = () => {
      state.doubleClick = true;
      http.systemManagement.updateLocalization(state.form).then((res) => {
        if (res.data.err_code == 0) {
          state.doubleClick = false;
          ElMessage.success(t(`error.${res.data.err_code}`));
          getData();
        } else {
          state.doubleClick = false;
          ElMessage.error(t(`error.${res.data.err_code}`));
        }
      });
    };
    const reloadLocalization = () => {
      state.doubleClick = true;
      http.systemManagement.reloadLocalization(state.form).then((res) => {
        if (res.data.err_code == 0) {
          state.doubleClick = false;
          ElMessage.success(t(`error.${res.data.err_code}`));
          getData();
        } else {
          state.doubleClick = false;
          ElMessage.error(t(`error.${res.data.err_code}`));
        }
      });
    };
    onMounted(() => {
      getData();
    });

    return {
      ...toRefs(state),
      dateFormat,
      submitHandler,
      windowRect: computed(() => store.state.app.windowRect),
      device: computed(() => store.state.app.device),
      t,
      reloadLocalization,
    };
  },
};
</script>

<style lang="scss" scoped>
.warning {
  color: #e6a23c;
}
.success {
  color: #67c23a;
}
.danger {
  color: #f56c6c;
}
.box-card {
  margin-bottom: 30px;
}
</style>
