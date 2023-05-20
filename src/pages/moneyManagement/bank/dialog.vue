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
    <el-form label-width="100px" ref="formRef" :model="form">
      <el-form-item
        label="支付别名 "
        prop="alias_name"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input
          v-model="form.alias_name"
          placeholder=""
          maxlength="40"
          show-word-limit
        />
      </el-form-item>
      <el-form-item
        label="支付名称"
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
      <el-form-item label="轮播图:">
        <el-input
          v-model="form.icon_url"
          placeholder=""
          style="margin-bottom: 20px"
          maxlength="120"
          show-word-limit
        />
        <el-upload
          list-type="picture-card"
          :multiple="false"
          :on-remove="handleImageRemove"
          :on-preview="handlePictureCardPreview"
          :on-success="handleAvatarSuccess"
          :file-list="fileList"
          :limit="2"
          :http-request="handleHttp"
          accept="image/*"
        >
          <el-icon>+</el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model.number="form.status">
          <el-radio :label="1">正常</el-radio>
          <el-radio :label="2">关闭</el-radio>
        </el-radio-group>
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
import { getToken } from "@/utils/cookie";
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
        status: 1,
      },
      fileList: [],
      visionState: false,
      doubleClick: false,
    });

    const formRef = ref();

    const auth = {
      Authorization: getToken(),
    };

    const closeDialog = (formRef) => {
      state.visionState = false;
      state.fileList = [];
      formRef.resetFields();
      context.emit("closed");
    };

    const submitDialog = (formRef) => {
      formRef.validate((valid) => {
        if (valid) {
          if (state.dialogTitle == t("common.addTo")) {
            state.doubleClick = true;
            http.moneyManagement.createBankList(state.form).then((res) => {
              if (res.data.err_code == 0) {
                state.doubleClick = false;
                closeDialog(formRef);
                state.form = {
                  status: 1,
                };
                ElMessage.success(t(`error.${res.data.err_code}`));

                formRef.resetFields();
                context.emit("created");
              } else {
                ElMessage.error(t(`error.${res.data.err_code}`));
              }
            });
          } else {
            state.doubleClick = true;
            http.moneyManagement.updateBankList(state.form).then((res) => {
              if (res.data.err_code == 0) {
                state.doubleClick = false;
                closeDialog(formRef);
                state.form = {
                  status: 1,
                };
                ElMessage.success(t(`error.${res.data.err_code}`));

                formRef.resetFields();
                context.emit("created");
              } else {
                ElMessage.error(t(`error.${res.data.err_code}`));
              }
            });
          }
        }
      });
    };

    const handleImageRemove = (uploadFile, uploadFiles) => {
      state.form.icon_url = "";
    };

    const handlePictureCardPreview = () => {
      // state.image_url = state.form.icon_url;
      state.visionState = true;
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
            state.form.icon_url = res.data.data.file;
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
      state.form.alias_name = props.data.alias_name;
      state.form.bank_name = props.data.bank_name;
      state.form.status = props.data.status ?? state.form.status;
      state.form.icon_url = props.data.icon_url;

      if (props.data.icon_url) {
        state.fileList.push({
          url: props.data.icon_url,
        });
      }
    };

    onMounted(() => {});

    return {
      ...toRefs(state),
      closeDialog,
      submitDialog,
      formRef,
      auth,
      handleImageRemove,
      handlePictureCardPreview,
      handleHttp,
      handleAvatarSuccess,
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
