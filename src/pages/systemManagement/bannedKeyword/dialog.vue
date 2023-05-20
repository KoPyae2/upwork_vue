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
        :label="t('banKeyword.dialog.sensitive')"
        prop="content"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input
          v-model="form.content"
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
            http.systemManagement.createIllegal(state.form).then((res) => {
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
            http.systemManagement.updateIllegal(state.form).then((res) => {
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

    const handleImageRemove = (uploadFile, uploadFiles) => {
      state.form.image = "";
    };

    const handleHttp = (fileList) => {
      const form = new FormData();
      form.append("file", fileList.file);

      http.systemManagement
        .appUpload(form, (progressEvent) => {
          fileList.onProgress({
            percent: parseInt(
              Math.round((progressEvent.loaded * 100) / progressEvent.total)
            ),
          });
        })
        .then((res) => {
          if (res.data.result == 1) {
            fileList.onSuccess();
            state.form.image = res.data.data.file;
          }
        });
    };

    const handleAvatarSuccess = (response, file, fileList) => {
      if (fileList.length > 1) {
        fileList.shift();
      }
    };

    const openDialog = () => {
      state.dialogTitle = props.title;

      state.form.id = props.data.id;
      state.form.content = props.data.content;

      if (props.data.type !== 0) {
        state.form.type = props.data.type;
      }
      if (props.data.image) {
        state.fileList.push({
          url: props.data.image,
        });
      }
    };

    onMounted(() => {});

    return {
      ...toRefs(state),
      closeDialog,
      submitDialog,
      formRef,
      handleImageRemove,
      handleHttp,
      handleAvatarSuccess,
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
