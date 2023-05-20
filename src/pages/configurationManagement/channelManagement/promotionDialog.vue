<template>
  <el-dialog
    :modelValue="show"
    @update:modelValue="show = $event"
    @close="closeDialog(formRef)"
    @open="openDialog"
    draggable
    :title="dialogTitle"
    :close-on-click-modal="false"
  >
    <el-form label-width="120px" ref="formRef" :model="form">
      <el-form-item
        :label="t('channel.dialog.name')"
        prop="market_name"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input
          v-model="form.market_name"
          placeholder=""
          maxlength="40"
          show-word-limit
        />
      </el-form-item>

      <el-form-item
        :label="t('channel.dialog.market')"
        prop="market_id"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input
          v-model="form.market_id"
          placeholder=""
          maxlength="120"
          show-word-limit
          min="0"
          @input="checkInput"
          @copy.prevent
          @paste.prevent
          onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode == 46"
        />
      </el-form-item>

      <el-form-item
        :label="t('channel.dialog.link')"
        prop="spread_url"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input
          v-model="form.spread_url"
          placeholder=""
          maxlength="120"
          show-word-limit
        />
      </el-form-item>

      <el-form-item :label="t('channel.dialog.state')">
        <el-radio-group v-model.number="form.market_status">
          <el-radio :label="1">{{ t("common.normal") }}</el-radio>
          <el-radio :label="0">{{ t("common.close") }}</el-radio>
        </el-radio-group>
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
import { onMounted, reactive, toRefs, ref } from "vue";
import http from "@/http";
import { ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";

export default {
  name: "Dialog",
  props: ["show", "title", "data"],
  emits: ["closed", "created"],
  setup(props, context) {
    const state = reactive({
      dialogTitle: "",
      form: {},
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
          if (state.dialogTitle == t("channel.add_promotion")) {
            state.doubleClick = true;
            http.systemManagement
              .createChannelManagement(state.form)
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
              .updateChannelManagement(state.form)
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
          }
        }
      });
    };

    const openDialog = () => {
      state.dialogTitle = props.title;
      state.form.id = props.data.id;
      state.form.market_type = 1;
      state.form.market_id = props.data.market_id;
      state.form.market_name = props.data.market_name;
      state.form.spread_url = props.data.spread_url;
      state.form.market_status = props.data.market_status ?? 1;
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
