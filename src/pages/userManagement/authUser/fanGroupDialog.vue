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
    <el-form label-width="100px" ref="formRef" :model="form">
      <el-form-item
        :label="t('user.fan_group')"
        prop="funs_group_name"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input
          v-model="form.funs_group_name"
          placeholder=""
          maxlength="40"
          show-word-limit
        />
      </el-form-item>

      <el-form-item :label="t('user.status')">
        <el-radio-group v-model.number="form.status">
          <el-radio :label="1">{{ t("user.opened") }}</el-radio>
          <el-radio :label="0">{{ t("user.close") }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="t('user.remark')" prop="remark">
        <el-input
          v-model="form.remark"
          placeholder=""
          type="text"
          maxlength="100"
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
import { reactive, toRefs, ref } from "vue";
import http from "@/http";
import { ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";

export default {
  name: "AddDialog",
  props: ["show", "title", "data", "id"],
  emits: ["closed", "created"],
  setup(props, context) {
    const { t } = useI18n();
    const state = reactive({
      dialogTitle: "",
      form: {
        status: 1,
      },
      FanList: [],
      doubleClick: false,
    });

    const formRef = ref();

    const closeDialog = (formRef) => {
      formRef.resetFields();
      context.emit("closed");
    };

    const submitDialog = (formRef) => {
      formRef.validate((valid) => {
        if (valid) {
          state.doubleClick = true;
          http.userManagement.createFanGroup(state.form).then((res) => {
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
        }
      });
    };

    const openDialog = () => {
      state.dialogTitle = props.title;
      state.FanList = props.data;
      state.form.funs_group_id = props.id.toString();

      if (state.FanList.length > 0) {
        state.form.funs_group_name = state.FanList[0]["funs_group_name"];
        state.form.status = state.FanList[0]["status"];
        state.form.remark = state.FanList[0]["remark"];
      }
    };

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
