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
        :label="t('feedback.reason_type')"
        prop="reason_type"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-select
          :multiple="false"
          placeholder=""
          style="width: 100%"
          v-model="form.reason_type"
        >
          <el-option :value="1" :label="t('feedback.play_list')" />
          <el-option :value="2" :label="t('feedback.note_list')" />
          <el-option :value="3" :label="t('feedback.user_list')" />
        </el-select>
      </el-form-item>

      <!-- <el-form-item
        :label="t('feedback.status')"
        prop="status"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-radio-group v-model.number="form.status">
          <el-radio :label="1">{{ t("common.enabled") }}</el-radio>
          <el-radio :label="2">{{ t("common.disabled") }}</el-radio>
        </el-radio-group>
      </el-form-item> -->

      <el-tabs
        v-model="activeTab"
        class="tabs"
        type="card"
        v-if="form.reason_title.length > 0"
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
                  tabRequired == false && form.reason_title[index].content == ''
                    ? 'required-field'
                    : ''
                "
                >{{ lan.name }}</span
              >
            </span>
          </template>
          <el-form-item
            :label="t('feedback.content')"
            :prop="`reason_title[${index}].content`"
            :rules="[
              {
                required: true,
                message: t('error.required'),
                trigger: 'blur',
              },
            ]"
          >
            <el-input
              v-model="form.reason_title[index].content"
              placeholder=""
              maxlength="100"
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
        reason_title: [],
      },

      doubleClick: false,
      languages: store.state.app.languages,
      activeTab: store.state.app.languages[0].short_name,
      activeRequired: 0,
      reason_type_list: [
        {
          value: 1,
          label: "playList",
        },
        {
          value: 2,
          label: "noteList",
        },
        {
          value: 3,
          label: "userList",
        },
      ],
      tabRequired: true,
    });
    const { t } = useI18n();
    const formRef = ref();

    const closeDialog = (formRef) => {
      state.form = {
        reason_title: [],
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
            http.feedbackManagement
              .createFeedbackReason(state.form)
              .then((res) => {
                if (res.data.err_code == 0) {
                  state.doubleClick = false;
                  closeDialog(formRef);
                  ElMessage.success(t(`error.${res.data.err_code}`));
                  formRef.resetFields();
                  state.form = {
                    reason_title: [],
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
              .updateFeedbackReason(state.form)
              .then((res) => {
                if (res.data.err_code == 0) {
                  state.doubleClick = false;
                  closeDialog(formRef);
                  ElMessage.success(t(`error.${res.data.err_code}`));

                  formRef.resetFields();
                  state.form = {
                    reason_title: [],
                  };
                  context.emit("edited");
                } else {
                  state.doubleClick = false;
                  ElMessage.error(t(`error.${res.data.err_code}`));
                }
              });
          }
        } else {
          let contentLangList = state.form.reason_title.filter((item) => {
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
        return state.form.reason_title.push({
          lang: lan.short_name,
          content: "",
        });
      });
    };

    const editLanForm = (data) => {
      if (data.length == state.languages.length) {
        state.form.reason_title = data;

        let lans = state.languages.sort((a, b) => {
          return (
            state.form.reason_title.findIndex((p) => p.lang === a.short_name) -
            state.form.reason_title.findIndex((p) => p.lang === b.short_name)
          );
        });

        state.languages = lans;
      } else {
        state.languages.map((item, index) => {
          if (data[index]) {
            state.form.reason_title.push(data[index]);
          } else {
            state.form.reason_title.push({
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
      // state.form.status = props.data.status;
      state.form.reason_id = props.data.reason_id;
      state.form.reason_type = props.data.reason_type;

      if (
        props.data.reason_title !== undefined &&
        props.data.reason_title.length !== []
      ) {
        editLanForm(props.data.reason_title);
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
