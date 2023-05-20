<template>
  <div
    element-loading-background="rgba(122, 122, 122, 0.3)"
    v-loading="isLoading"
  >
    <el-tabs v-model="activeTab" class="tabs" type="card">
      <el-tab-pane
        v-for="(lan, index) in languages"
        :key="lan.id"
        :label="lan.name"
        :name="lan.short_name"
        v-if="form.ban_keywords.length > 0"
      >
        <el-card class="box-card" v-permission:system:hotkey:list>
          <div>
            <el-input
              v-model="form.ban_keywords[index].content"
              placeholder=""
              style="margin-bottom: 20px"
            />
            <span style="color: #909399; margin-left: 10px">{{
              t("hotKeyword.app_desc")
            }}</span>
          </div>
        </el-card>
      </el-tab-pane>
    </el-tabs>

    <el-button
      class="app-button"
      @click="submitHandler(formRef)"
      v-permission:system:hotkey:edit
      >{{ t("hotKeyword.save") }}</el-button
    >
    <!-- <el-button plain @click="cancelHandler">取消修改</el-button> -->
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
      filterForm: {},
      pageList: [10, 20, 60, 80, 100],
      param: {
        page: 1,
        page_size: 10,
      },
      form: {
        ban_keywords: [],
      },
      tableList: {},
      isLoading: false,
      languages: store.state.app.languages,
      activeTab: store.state.app.languages[0].short_name,
    });
    const { t } = useI18n();

    const editLanForm = (data) => {
      if (data.length == state.languages.length) {
        state.form.ban_keywords = data;
        let lans = state.languages.sort((a, b) => {
          return (
            state.form.ban_keywords.findIndex((p) => p.lang === a.short_name) -
            state.form.ban_keywords.findIndex((p) => p.lang === b.short_name)
          );
        });

        state.languages = lans;
      } else {
        state.languages.map((item, index) => {
          if (data[index]) {
            state.form.ban_keywords.push(data[index]);
          } else {
            state.form.ban_keywords.push({
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
      http.systemManagement.getHotKeywords(state.param).then((res) => {
        if (res.data.err_code == 0) {
          state.isLoading = false;
          editLanForm(res.data.data);
          state.tableList = res.data.data;
        } else {
          state.isLoading = false;
        }
      });
      const default_lan = state.languages.findIndex((lan) => {
        return lan.status == 1;
      });
      if (default_lan !== -1) {
        state.activeTab = store.state.app.languages[default_lan].short_name;
        // state.activeRequired = default_lan;
      }
    };

    // const cancelHandler = () => {
    //   state.form.value = state.tableList.value;
    // };

    const submitHandler = () => {
      http.systemManagement.updateHotKeywords(state.form).then((res) => {
        if (res.data.err_code == 0) {
          ElMessage.success(t(`error.${res.data.err_code}`));
          getData();
        } else {
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
