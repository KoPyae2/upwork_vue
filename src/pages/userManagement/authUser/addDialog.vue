<template>
  <el-dialog
    :close-on-click-modal="false"
    :modelValue="show"
    @update:modelValue="show = $event"
    @close="closeDialog(formRef)"
    @open="openDialog"
    draggable
    :title="dialogTitle"
    height="50%"
  >
    <el-form
      label-width="100px"
      ref="formRef"
      :model="form"
      label-position="top"
      :rules="rules"
    >
      <el-row :gutter="20" style="margin-bottom: 30px">
        <el-col :span="12">
          <el-form-item :label="$t(`user.user_phone`)" prop="user_phone">
            <el-input
              v-model="form.user_phone"
              placeholder=""
              :maxlength="11"
              show-word-limit
              onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode == 46"
              @copy.prevent
              @paste.prevent
            >
              <template #prepend>
                <span>+86</span>
              </template>
            </el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label="$t(`user.login_pass`)" prop="password">
            <el-input
              v-model="form.password"
              placeholder=""
              type="text"
              show-password
              @copy.prevent
              @paste.prevent
              readonly
              onfocus="this.removeAttribute('readonly');"
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
import { useI18n } from "vue-i18n";
import { getToken } from "@/utils/cookie";

export default {
  name: "AddDialog",
  props: ["show", "title", "data", "level"],
  emits: ["closed", "created"],
  setup(props, context) {
    const state = reactive({
      fieldTypes: {
        // add this for change input type
        password: "text",
      },
      dialogTitle: "",
      form: {
        user_phone: "",
        password: "",
      },
      levelList: [],
      typeList: [
        {
          value: 1,
          label: "认证发布者",
        },
        {
          value: 2,
          label: "平台发布者",
        },
        {
          value: 3,
          label: "原创发布者",
        },
        {
          value: 20,
          label: "短视频账号",
        },
        {
          value: 21,
          label: "长视频账号",
        },
      ],
      doubleClick: false,
      fieldTypes: {
        password: "text",
      },
    });

    const formRef = ref();
    const validatePhone = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(t("error.required")));
      } else {
        callback();
      }
    };

    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(t("error.required")));
      } else if (
        !/(?=^.{8,}$)(?=.*\d)(?![.\n])(?=.*[A-Z a-z]).*$/.test(value)
      ) {
        callback(new Error(t("error.password")));
      } else {
        callback();
      }
    };

    const rules = reactive({
      rules: {
        user_phone: [{ validator: validatePhone, trigger: "blur" }],
        password: [{ validator: validatePass, trigger: "blur" }],
      },
    });

    const auth = {
      Authorization: getToken(),
    };
    const { t } = useI18n();

    const closeDialog = (formRef) => {
      formRef.resetFields();
      context.emit("closed");
    };

    const submitDialog = (formRef) => {
      formRef.validate((valid) => {
        if (valid) {
          state.doubleClick = true;
          state.form.is_authed = 1;
          state.form.user_type = 0;
          state.form.user_level = 1;
          http.userManagement.createUser(state.form).then((res) => {
            if (res.data.err_code == 0) {
              state.doubleClick = false;
              closeDialog(formRef);
              state.form = {
                user_phone: "",
                password: "",
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
      });
    };

    const openDialog = () => {
      state.dialogTitle = props.title;
    };

    onMounted(() => {
      // http.userManagement.getUserLevel().then((res) => {
      //   if (res.data.err_code == 0) {
      //     state.levelList = res.data.data.users;
      //   }
      // });
    });

    return {
      ...toRefs(state),
      ...toRefs(rules),
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

:deep(.el-input-group__prepend) {
  box-shadow: none;
}

:deep(.el-form-item__error) {
  line-height: 1.3;
  letter-spacing: 1.5px;
}
</style>
