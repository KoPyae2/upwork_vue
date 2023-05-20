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
      <el-form-item
        label="icon"
        prop="icon"
        :rules="[
          {
            required: true,
            message: t('error.required'),
            trigger: 'blur',
          },
        ]"
      >
        <el-input
          v-model="form.icon"
          placeholder=""
          maxlength="40"
          show-word-limit
        />
      </el-form-item>
    </el-form>

    <el-tabs
      v-if="form.content && form.content.length > 0"
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
                tabRequired == false && form.content[index].content == ''
                  ? 'required-field'
                  : ''
              "
              >{{ lan.name }}</span
            >
          </span>
        </template>
        <el-form-item :label="t('feedback.content')">
          <el-input
            v-model="form.content[index].content"
            placeholder=""
            maxlength="100"
            show-word-limit
          />
        </el-form-item>
      </el-tab-pane>
    </el-tabs>

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
        content: [],
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
      formRef.resetFields();
      state.form = {
        content: [],
      };
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
              .createDislikeItem(state.form)
              .then((res) => {
                if (res.data.err_code == 0) {
                  state.doubleClick = false;
                  closeDialog(formRef);
                  state.form = {};
                  ElMessage.success(t(`error.${res.data.err_code}`));
                  formRef.resetFields();
                  state.form = {
                    content: [],
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
              .updateDislikeItem(state.form)
              .then((res) => {
                if (res.data.err_code == 0) {
                  state.doubleClick = false;
                  closeDialog(formRef);
                  state.form = {};
                  ElMessage.success(t(`error.${res.data.err_code}`));

                  formRef.resetFields();
                  state.form = {
                    content: [],
                  };
                  context.emit("edited");
                } else {
                  state.doubleClick = false;

                  ElMessage.error(t(`error.${res.data.err_code}`));
                }
              });
          }
        } else {
          let contentLangList = state.form.content.filter((item) => {
            return item.content == "";
          });
          if (contentLangList && contentLangList.length) {
            state.activeTab = contentLangList[0].lang;
          }
        }
      });
    };

    const openLanForm = (data) => {
      data.map((lan) => {
        return state.form.content.push({
          lang: lan.short_name,
          content: "",
        });
      });
      console.log(state.form.content);
    };

    const editLanForm = (data) => {
      if (data == null || data.length == 0) {
        openLanForm(state.languages);
      } else {
        if (data.length == state.languages.length) {
          state.form.content = data;
          let lans = state.languages.sort((a, b) => {
            return (
              state.form.content.findIndex((p) => p.lang === a.short_name) -
              state.form.content.findIndex((p) => p.lang === b.short_name)
            );
          });

          state.languages = lans;
        } else {
          state.languages.map((item, index) => {
            console.log(index);
            if (data[index]) {
              state.form.content.push(data[index]);
            } else {
              state.form.content.push({
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

      state.form.id = props.data.id;
      state.form.icon = props.data.icon;

      if (props.data.id) {
        editLanForm(props.data.content);
      } else {
        openLanForm(state.languages);
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
