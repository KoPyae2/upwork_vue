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
        v-if="
          form.dislike_title &&
          form.dislike_title.length > 0 &&
          form.category_name &&
          form.category_name.length > 0
        "
        v-model="activeTab"
        class="tabs"
        type="card"
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
                  form.dislike_title[index].content == '' &&
                  form.category_name[index].content == ''
                    ? 'required-field'
                    : ''
                "
                >{{ lan.name }}</span
              >
            </span>
          </template>
          <el-form-item
            :label="t('feedback.dislike_title')"
            :prop="`dislike_title[${index}].content`"
            :rules="[
              { required: true, message: t('error.required'), trigger: 'blur' },
            ]"
          >
            <el-input
              v-model="form.dislike_title[index].content"
              placeholder=""
              maxlength="80"
              show-word-limit
            />
          </el-form-item>

          <el-form-item
            :label="t('noteLongVideo.categoryName')"
            :prop="`category_name[${index}].content`"
            :rules="[
              { required: true, message: t('error.required'), trigger: 'blur' },
            ]"
          >
            <el-input
              v-model="form.category_name[index].content"
              placeholder=""
              maxlength="80"
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
  name: "AddChildDialog",
  props: ["show", "title", "data", "isAdd"],
  emits: ["closed", "created", "edited"],
  setup(props, context) {
    const store = useStore();
    const state = reactive({
      dialogTitle: "",
      form: {
        dislike_title: [],
        category_name: [],
      },
      fileList: [],
      doubleClick: false,
      languages: store.state.app.languages,
      activeTab: store.state.app.languages[0].short_name,
      activeRequired: 0,
      tabRequired: true,
    });
    const { t } = useI18n();
    const formRef = ref();

    const closeDialog = (formRef) => {
      state.fileList = [];

      state.form = {
        dislike_title: [],
        category_name: [],
      };
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
            http.feedbackManagement
              .createDislikeReason(state.form)
              .then((res) => {
                if (res.data.err_code == 0) {
                  state.doubleClick = false;
                  closeDialog(formRef);
                  state.form = {};
                  ElMessage.success(t(`error.${res.data.err_code}`));
                  formRef.resetFields();
                  state.form = {
                    dislike_title: [],
                    category_name: [],
                  };
                  context.emit("created");
                } else {
                  state.doubleClick = false;

                  ElMessage.error(t(`error.${res.data.err_code}`));
                }
              });
          } else {
            state.doubleClick = true;
            http.feedbackManagement
              .updateDislikeReason(state.form)
              .then((res) => {
                if (res.data.err_code == 0) {
                  state.doubleClick = false;
                  closeDialog(formRef);
                  state.form = {};
                  ElMessage.success(t(`error.${res.data.err_code}`));

                  formRef.resetFields();
                  state.form = {
                    dislike_title: [],
                    category_name: [],
                  };
                  context.emit("edited");
                } else {
                  state.doubleClick = false;

                  ElMessage.error(t(`error.${res.data.err_code}`));
                }
              });
          }
        } else {
          let contentLangList = state.form.dislike_title.filter((item) => {
            return item.content == "";
          });
          if (contentLangList && contentLangList.length) {
            state.activeTab = contentLangList[0].lang;
          }
          let contentLangList2 = state.form.category_name.filter((item) => {
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
        return state.form.dislike_title.push({
          lang: lan.short_name,
          content: "",
        });
      });
    };

    const openCategorNameForm = (data) => {
      data.map((lan) => {
        return state.form.category_name.push({
          lang: lan.short_name,
          content: "",
        });
      });
    };

    const editLanForm = (data) => {
      if (data == null || data.length == 0) {
        openLanForm(state.languages);
      } else {
        if (data.length == state.languages.length) {
          state.form.dislike_title = data;
          let lans = state.languages.sort((a, b) => {
            return (
              state.form.dislike_title.findIndex(
                (p) => p.lang === a.short_name
              ) -
              state.form.dislike_title.findIndex((p) => p.lang === b.short_name)
            );
          });

          state.languages = lans;
        } else {
          state.languages.map((item, index) => {
            console.log(index);
            if (data[index]) {
              state.form.dislike_title.push(data[index]);
            } else {
              state.form.dislike_title.push({
                lang: item.short_name,
                content: "",
              });
            }
            return;
          });
        }
      }
    };

    const editCategorNameForm = (data) => {
      if (data == null || data.length == 0) {
        openCategorNameForm(state.languages);
      } else {
        if (data.length == state.languages.length) {
          state.form.category_name = data;
        } else {
          state.languages.map((item, index) => {
            console.log(index);
            if (data[index]) {
              state.form.category_name.push(data[index]);
            } else {
              state.form.category_name.push({
                lang: item.short_name,
                content: "",
              });
            }
            return;
          });
        }
      }
    };

    const openDialog = () => {
      state.dialogTitle = props.title;

      console.log(props.isAdd);

      if (props.isAdd) {
        state.form.parent_id = props.data.id;
      } else {
        state.form.parent_id = props.data.parent_id;
        state.form.dislike_id = props.data.dislike_id;
      }

      if (!props.isAdd) {
        editLanForm(props.data.dislike_title);
        editCategorNameForm(props.data.category_name);
      } else {
        openLanForm(state.languages);
        openCategorNameForm(state.languages);
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
