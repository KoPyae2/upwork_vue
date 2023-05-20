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
        :label="t('common.short_name')"
        prop="short_name"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input
          v-model="form.short_name"
          placeholder=""
          maxlength="40"
          show-word-limit
        />
      </el-form-item>

      <el-form-item
        :label="t('common.name')"
        prop="name"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input
          v-model="form.name"
          placeholder=""
          maxlength="40"
          show-word-limit
        />
      </el-form-item>
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
import { onMounted, reactive, toRefs, ref} from "vue";
import http from "@/http";
import { ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";

export default {
  name: "Dialog",
  props: ["show", "title", "data"],
  emits: ["closed", "created", "edited"],
  setup(props, context) {
    const state = reactive({
      dialogTitle: "",
      form: {},
      fileList: [],
      doubleClick: false,
    });
    const { t } = useI18n();
    const formRef = ref();

    const closeDialog = (formRef) => {
      state.fileList = [];

      formRef.resetFields();
      context.emit("closed");
    };

    const submitDialog = (formRef) => {
      formRef.validate((valid) => {
        if (valid) {
          if (state.dialogTitle == t("common.addTo")) {
            state.doubleClick = true;
            http.systemManagement
              .createSystemLanguage(state.form)
              .then((res) => {
                if (res.data.err_code == 0) {
                  state.doubleClick = false;
                  closeDialog(formRef);
                  state.form = {};
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
            http.systemManagement
              .updateSystemLanguage(state.form)
              .then((res) => {
                if (res.data.err_code == 0) {
                  state.doubleClick = false;
                  closeDialog(formRef);
                  state.form = {};
                  ElMessage.success(t(`error.${res.data.err_code}`));

                  formRef.resetFields();
                  context.emit("edited");
                } else {
                  state.doubleClick = false;

                  ElMessage.error(t(`error.${res.data.err_code}`));
                }
              });
          }
        }
      });
    };

    const openDialog = () => {
      state.dialogTitle = props.title;

      state.form.id = props.data.id;
      state.form.short_name = props.data.short_name;
      state.form.name = props.data.name;
      state.form.status = props.data.status;
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
