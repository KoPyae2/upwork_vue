<template>
  <el-dialog
    :modelValue="show"
    @update:modelValue="show = $event"
    @close="closeDialog(formRef)"
    draggable
    :title="dialogTitle"
    :close-on-click-modal="false"
  >
    <el-form label-width="100px" ref="formRef" :model="form">
      <el-form-item
        label="所属银行"
        prop="bank_name"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input
          v-model="form.bank_name"
          placeholder=""
          maxlength="40"
          show-word-limit
        />
      </el-form-item>

      <el-form-item
        label="所属支行"
        prop="bank_branch"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input
          v-model="form.bank_branch"
          placeholder=""
          maxlength="40"
          show-word-limit
        />
      </el-form-item>

      <el-form-item
        label="银行卡号"
        prop="bank_account"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input v-model="form.bank_account" placeholder="" />
      </el-form-item>

      <el-form-item
        label="开户名"
        prop="real_name"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input
          v-model="form.real_name"
          placeholder=""
          maxlength="40"
          show-word-limit
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog(formRef)">关闭</el-button>
        <el-button
          class="app-button"
          @click="submitDialog(formRef)"
          :disabled="doubleClick"
          >确定</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { onMounted, reactive, toRefs, ref, onUpdated } from "vue";
import http from "@/http";
import { ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";

export default {
  name: "Dialog",
  props: ["show", "title", "data"],
  emits: ["closed", "created"],
  setup(props, context) {
    const { t } = useI18n();
    const state = reactive({
      dialogTitle: "",
      form: {
        id: "",
        bank_name: "",
        bank_branch: "",
        bank_account: "",
        real_name: "",
        doubleClick: false,
      },
    });

    const formRef = ref();

    const closeDialog = (formRef) => {
      formRef.resetFields();

      context.emit("closed");
    };

    const submitDialog = (formRef) => {
      formRef.validate((valid) => {
        if (valid) {
          if (state.dialogTitle == t("common.addTo")) {
          } else {
            state.doubleClick = true;
            http.moneyManagement
              .updateUserBankList(state.form.id, state.form)
              .then((res) => {
                if (res.data.err_code == 200) {
                  state.doubleClick = false;
                  closeDialog(formRef);
                  state.form = {
                    id: "",
                    bank_name: "",
                    bank_branch: "",
                    bank_account: "",
                    real_name: "",
                  };
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

    onMounted(() => {});

    onUpdated(() => {
      state.dialogTitle = props.title;
      if (props.data.hasOwnProperty("id")) {
        state.form.id = props.data.id;
        state.form.bank_name = props.data.bank_name;
        state.form.bank_branch = props.data.bank_branch;
        state.form.bank_account = props.data.bank_account;
        state.form.real_name = props.data.real_name;
      } else {
        state.form = {
          id: "",
          bank_name: "",
          bank_branch: "",
          bank_account: "",
          real_name: "",
        };
      }
    });

    return {
      ...toRefs(state),
      closeDialog,
      submitDialog,
      formRef,
    };
  },
};
</script>

<style lang="scss" scoped>
:deep(.el-select .el-input__inner) {
  height: 42px !important;
}
</style>
