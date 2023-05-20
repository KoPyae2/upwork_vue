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
    <el-form label-width="180px" ref="formRef" :model="form">
      <el-form-item
        :label="t('systemUser.dialog.account')"
        prop="username"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input
          v-model="form.username"
          placeholder=""
          maxlength="40"
          show-word-limit
        />
      </el-form-item>

      <el-form-item
        :label="t('systemUser.dialog.password')"
        prop="password"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
        v-if="dialogTitle == t('common.addTo')"
      >
        <!-- pattern:
              /^(?=^.{8,}$)(?=.*\d)(?=.*[!@#$%^&*]+)(?![\n])(?=*[A_Z])(?=*[a-z])*$/, -->
        <el-input
          v-model="form.password"
          placeholder=""
          type="password"
          show-password
        />
      </el-form-item>

      <el-form-item :label="t('systemUser.dialog.password')" v-else>
        <el-input
          v-model="form.password"
          placeholder=""
          type="password"
          show-password
        />
      </el-form-item>

      <el-form-item :label="t('systemUser.dialog.phone')">
        <el-input
          v-model="form.phone"
          placeholder=""
          onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode == 46"
          @copy.prevent
          @paste.prevent
          type="number"
          min="0"
        />
      </el-form-item>

      <el-form-item
        :label="t('systemUser.dialog.mail')"
        prop="mail"
        :rules="[
          {
            type: 'email',
            message: t(`systemUser.dialog.enterValidEmail`),
            trigger: ['blur', 'change'],
          },
        ]"
      >
        <el-input
          v-model="form.mail"
          placeholder=""
          maxlength="50"
          show-word-limit
        />
      </el-form-item>

      <el-form-item :label="t('systemUser.dialog.role')">
        <el-radio-group v-model.number="form.authorize">
          <el-radio :label="item.ID" v-for="item in roleList" :key="item.ID">{{
            item.Title
          }}</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item :label="t('systemUser.dialog.desc')">
        <el-input
          v-model="form.desc"
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
          t("systemUser.dialog.close")
        }}</el-button>
        <el-button
          class="app-button"
          @click="submitDialog(formRef)"
          :disabled="doubleClick"
          >{{ t("systemUser.dialog.confirm") }}</el-button
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
      roleList: [],
      doubleClick: false,
    });

    const formRef = ref();
    const { t } = useI18n();
    const closeDialog = (formRef) => {
      formRef.resetFields();
      context.emit("closed");
    };

    const submitDialog = (formRef) => {
      formRef.validate((valid) => {
        if (valid) {
          if (state.dialogTitle == t("common.addTo")) {
            state.doubleClick = true;
            http.roleManagement.createSystemUser(state.form).then((res) => {
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
            http.roleManagement.updateSystemUser(state.form).then((res) => {
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

      state.form.username = props.data.Username;
      state.form.phone = props.data.phone;
      state.form.mail = props.data.mail;
      state.form.desc = props.data.desc;
      state.form.id = props.data.id;

      state.form.authorize = props.data.authorize;
    };

    onMounted(() => {
      http.roleManagement.getRoleList().then((res) => {
        if (res.data.err_code == 0) {
          state.roleList = res.data.data.roles;
        }
      });
    });

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
