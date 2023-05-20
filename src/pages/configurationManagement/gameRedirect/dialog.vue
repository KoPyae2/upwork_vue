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
    <el-form label-width="100px" ref="formRef" :model="form" :rules="rules">
      <el-form-item label="姓名">
        <el-input disabled v-model="form.name" placeholder="" />
      </el-form-item>
      <el-form-item label="Url" prop="value">
        <el-input v-model="form.value" placeholder="" />
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
import { onMounted, reactive, toRefs, ref } from "vue";
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
      form: {},
      fileList: [],
      doubleClick: false,
    });

    const formRef = ref();

    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("必填!"));
      } else if (
        !/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)/.test(
          value
        )
      ) {
        callback(new Error("请输入正确格式的网址 : https://example.com"));
      } else {
        callback();
      }
    };

    const rules = reactive({
      rules: {
        value: [{ validator: validatePass, trigger: "blur" }],
      },
    });

    const closeDialog = (formRef) => {
      state.fileList = [];

      formRef.resetFields();
      context.emit("closed");
    };

    const submitDialog = (formRef) => {
      formRef.validate((valid) => {
        if (valid) {
          if (state.dialogTitle == "修改") {
            state.doubleClick = true;
            http.systemManagement.saveGameRedirect(state.form).then((res) => {
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
      state.form.name = props.data.name;
      state.form.value = props.data.value;
    };

    onMounted(() => {});

    return {
      ...toRefs(state),
      ...toRefs(rules),
      closeDialog,
      submitDialog,
      formRef,
      openDialog,
    };
  },
};
</script>

<style lang="scss" scoped>
:deep(.el-select .el-input__inner) {
  height: 42px !important;
}
</style>
