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
    <el-form label-width="200px" ref="formRef" :model="form">
      <el-form-item
        :label="t(`user.certification_remarks`)"
        prop="user_remark"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input
          v-model="form.user_remark"
          placeholder=""
          type="textarea"
          rows="3"
          maxlength="200"
          show-word-limit
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog(formRef)">{{
          t(`common.close`)
        }}</el-button>
        <el-button
          class="app-button"
          @click="submitDialog(formRef)"
          :disabled="doubleClick"
          >{{ t(`common.sure`) }}</el-button
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
export default {
  name: "RemarkDialog",
  props: ["show", "title", "data"],
  emits: ["closed", "created"],
  setup(props, context) {
    const state = reactive({
      dialogTitle: "",
      form: {},

      doubleClick: false,
    });

    const formRef = ref();

    const closeDialog = (formRef) => {
      state.form = {};
      formRef.resetFields();
      context.emit("closed");
    };

    const submitDialog = (formRef) => {
      formRef.validate((valid) => {
        if (valid) {
          state.doubleClick = true;
          http.userManagement.updateUserRemark(state.form).then((res) => {
            if (res.data.err_code == 0) {
              state.doubleClick = false;
              closeDialog(formRef);

              ElMessage.success(t(`error.${res.data.err_code}`));

              formRef.resetFields();
              context.emit("created");
            } else {
              state.doubleClick = false;
              ElMessage.error(t(`error.${res.data.err_code}`));
            }
          });
        }
      });
    };
    const { t } = useI18n();
    const openDialog = () => {
      state.dialogTitle = props.title;
      state.form.user_id = props.data.user_id;
      state.form.user_remark = props.data.user_remark;
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

.danger {
  color: #f56c6c;
}
</style>
