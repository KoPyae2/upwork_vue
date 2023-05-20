<template>
  <el-dialog
    :close-on-click-modal="false"
    :modelValue="show"
    @update:modelValue="show = $event"
    @close="closeDialog(formRef)"
    @open="openDialog"
    draggable
    :title="dialogTitle"
  >
    <el-form label-width="150px" ref="formRef" :model="form">
      <el-tabs
        v-model="activeTab"
        class="tabs"
        type="card"
        v-if="form.title.length > 0 || form.desc.length > 0"
      >
        <el-tab-pane
          v-for="(lan, index) in languages"
          :key="lan.id"
          :name="lan.short_name"
        >
          <template #label>
            <span class="custom-tabs-label">
              <!-- style="color: red" -->
              <span
                :class="
                  tabRequired == false &&
                  form.title[index].content == '' &&
                  form.desc[index].content == ''
                    ? 'required-field'
                    : ''
                "
                >{{ lan.name }}</span
              >
            </span>
          </template>
          <el-form-item
            :label="t('common.title')"
            :prop="`title[${index}].content`"
            :rules="[
              {
                required: true,
                message: t('error.required'),
                trigger: 'blur',
              },
            ]"
          >
            <el-input
              v-model="form.title[index].content"
              placeholder=""
              maxlength="100"
              show-word-limit
            />
          </el-form-item>

          <el-form-item
            :label="t('common.description')"
            :prop="`desc[${index}].content`"
            :rules="[
              {
                required: true,
                message: t('error.required'),
                trigger: 'blur',
              },
            ]"
          >
            <el-input
              v-model="form.desc[index].content"
              placeholder=""
              type="textarea"
              rows="3"
              maxlength="200"
              show-word-limit
            />
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog(formRef)">{{
          t("common.close")
        }}</el-button>
        <el-button
          class="app-button"
          @click="submitDialog(formRef)"
          :disabled="doubleClick"
          >{{ t("common.sure") }}</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { onMounted, reactive, toRefs, ref } from "vue";
import http from "@/http";
import { ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";
export default {
  name: "Dialog",
  props: ["show", "title", "data"],
  emits: ["closed", "created", "edited"],
  setup(props, context) {
    const store = useStore();
    const state = reactive({
      dialogTitle: "",
      form: {
        title: [],
        desc: [],
      },
      doubleClick: false,
      languages: store.state.app.languages,
      activeTab: store.state.app.languages[0].short_name,
      activeRequired: 0,
      tabRequired: true,
    });
    const { t } = useI18n();
    const formRef = ref();

    const closeDialog = (formRef) => {
      state.form = {
        title: [],
        desc: [],
      };

      state.activeTab = store.state.app.languages[0].short_name;
      formRef.resetFields();
      context.emit("closed");
      state.tabRequired = true;
    };

    const submitDialog = (formRef) => {
      formRef.validate((valid) => {
        state.tabRequired = valid;
        if (valid) {
          if (state.dialogTitle == t("common.addTo")) {
            state.doubleClick = true;
            http.feedbackManagement.createHelpReason(state.form).then((res) => {
              if (res.data.err_code == 0) {
                state.doubleClick = false;
                closeDialog(formRef);
                state.form = {
                  title: [],
                  desc: [],
                };
                ElMessage.success(t(`error.${res.data.err_code}`));
                formRef.resetFields();
                context.emit("created");
              } else {
                state.doubleClick = false;

                ElMessage.error(t(`error.${res.data.err_code}`));
              }
            });
          } else {
            state.doubleClick = true;
            http.feedbackManagement.updateHelpReason(state.form).then((res) => {
              if (res.data.err_code == 0) {
                state.doubleClick = false;
                closeDialog(formRef);
                state.form = {
                  desc: [],
                  title: [],
                };
                ElMessage.success(t(`error.${res.data.err_code}`));

                formRef.resetFields();
                context.emit("edited");
              } else {
                state.doubleClick = false;

                ElMessage.error(t(`error.${res.data.err_code}`));
              }
            });
          }
        } else {
          let contentLangList = state.form.title.filter((item) => {
            return item.content == "";
          });
          if (contentLangList && contentLangList.length) {
            state.activeTab = contentLangList[0].lang;
          }
          let contentLangList2 = state.form.desc.filter((item) => {
            return item.content == "";
          });
          if (contentLangList2 && contentLangList2.length) {
            state.activeTab = contentLangList2[0].lang;
          }
        }
      });
    };

    const openLanForm = (data) => {
      data.map((lan) => {
        return state.form.title.push({
          lang: lan.short_name,
          content: "",
        });
      });
    };

    const editLanForm = (data) => {
      if (data.length == state.languages.length) {
        state.form.title = data;
        let lans = state.languages.sort((a, b) => {
          return (
            state.form.title.findIndex((p) => p.lang === a.short_name) -
            state.form.title.findIndex((p) => p.lang === b.short_name)
          );
        });

        state.languages = lans;
      } else {
        state.languages.map((item, index) => {
          if (data[index]) {
            state.form.title.push(data[index]);
          } else {
            state.form.title.push({
              lang: item.short_name,
              content: "",
            });
          }
          return;
        });
      }
    };

    const openDescForm = (data) => {
      data.map((lan) => {
        return state.form.desc.push({
          lang: lan.short_name,
          content: "",
        });
      });
    };

    const editDescForm = (data) => {
      if (data.length == state.languages.length) {
        state.form.desc = data;
        let lans = state.languages.sort((a, b) => {
          return (
            state.form.desc.findIndex((p) => p.lang === a.short_name) -
            state.form.desc.findIndex((p) => p.lang === b.short_name)
          );
        });

        state.languages = lans;
      } else {
        state.languages.map((item, index) => {
          if (data[index]) {
            state.form.desc.push(data[index]);
          } else {
            state.form.desc.push({
              lang: item.short_name,
              content: "",
            });
          }
          return;
        });
      }
    };

    const openDialog = () => {
      state.dialogTitle = props.title;
      state.form.id = props.data.id;

      if (props.data.title !== undefined && props.data.title.length !== []) {
        editLanForm(props.data.title);
      } else {
        openLanForm(state.languages);
      }

      if (props.data.desc !== undefined && props.data.desc.length !== []) {
        editDescForm(props.data.desc);
      } else {
        openDescForm(state.languages);
      }

      const default_lan = state.languages.findIndex((lan) => {
        return lan.status == 1;
      });
      if (default_lan !== -1) {
        state.activeTab = store.state.app.languages[default_lan].short_name;
        state.activeRequired = default_lan;
      }
    };

    onMounted(() => {});

    return {
      ...toRefs(state),
      closeDialog,
      submitDialog,
      formRef,
      openDialog,
      t,
    };
  },
};
</script>

<style lang="scss" scoped>
:deep(.el-select .el-input__inner) {
  height: 42px !important;
}
</style>
