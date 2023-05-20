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
    <el-form
      label-width="100px"
      ref="formRef"
      :model="form"
      label-position="top"
    >
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item
            :label="$t(`user.number_draw`)"
            prop="count"
            :rules="[
              { required: true, message: t('error.required'), trigger: 'blur' },
            ]"
          >
            <el-input
              v-model.number="form.count"
              placeholder=""
              maxlength="11"
              show-word-limit
              onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode == 46"
              @copy.prevent
              @paste.prevent
              type="number"
              min="0"
              :autocomplete="false"
            />
          </el-form-item>
        </el-col>
      </el-row>
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
import { getToken } from "@/utils/cookie";
import { useI18n } from "vue-i18n";
export default {
  name: "ChanceDialog",
  props: ["show", "title", "data"],
  emits: ["closed", "created"],
  setup(props, context) {
    const state = reactive({
      dialogTitle: "",
      form: {},

      doubleClick: false,
    });

    const formRef = ref();

    const auth = {
      Authorization: getToken(),
    };

    const closeDialog = (formRef) => {
      formRef.resetFields();
      context.emit("closed");
    };

    const submitDialog = (formRef) => {
      formRef.validate((valid) => {
        if (valid) {
          state.doubleClick = true;
          http.userManagement.addSpinChance(state.form).then((res) => {
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

      state.form.user_id = props.data.user_id;
    };
    const { t } = useI18n();
    onMounted(() => {});

    return {
      ...toRefs(state),
      closeDialog,
      submitDialog,
      formRef,
      auth,
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
