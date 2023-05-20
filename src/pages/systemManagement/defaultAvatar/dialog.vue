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
    <el-form label-width="150px" ref="formRef" :model="form">
      <el-form-item
        :label="t('defaultAvatar.dialog.avatar')"
        prop="avatar"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input
          v-model="form.avatar"
          placeholder="Image link"
          style="margin-bottom: 20px"
          maxlength="120"
          show-word-limit
        />
        <div style="display: none">
          <photo-provider v-if="form.avatar">
            <photo-consumer
              :intro="form.avatar"
              :key="form.avatar"
              :src="form.avatar"
              id="carousel-image"
            >
              <img
                :src="form.avatar"
                class="view-box"
                style="
                  height: 148px;
                  width: 150px;
                  cursor: zoom-in;
                  border-radius: 5px;
                  margin-right: 5px;
                "
              />
            </photo-consumer>
          </photo-provider>
        </div>
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

      <el-form-item :label="t('defaultAvatar.dialog.state')">
        <el-radio-group v-model.number="form.status">
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
import { getToken } from "@/utils/cookie";
import { useI18n } from "vue-i18n";

export default {
  name: "Dialog",
  props: ["show", "title", "data"],
  emits: ["closed", "created"],
  setup(props, context) {
    const state = reactive({
      dialogTitle: "",
      form: {
        status: 1,
      },
      fileList: [],
      doubleClick: false,
    });
    const { t } = useI18n();
    const formRef = ref();

    const auth = {
      Authorization: getToken(),
    };

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
            http.systemManagement
              .createDefaultAvatar(state.form)
              .then((res) => {
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
                  state.doubleClick = false;

                  ElMessage.error(t(`error.${res.data.err_code}`));
                }
              });
          } else {
            state.doubleClick = true;
            http.systemManagement
              .updateDefaultAvatar(state.form)
              .then((res) => {
                if (res.data.err_code == 0) {
                  state.dialogTitle = false;
                  state.doubleClick = false;
                  closeDialog(formRef);
                  state.form = {
                    status: 1,
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

    const handleImageRemove = (uploadFile, uploadFiles) => {
      state.form.avatar = "";
    };

    const handlePictureCardPreview = () => {
      document.getElementById("carousel-image").click();
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
            state.form.avatar = res.data.data.file;
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
      state.form.status = props.data.status ?? state.form.status;
      state.form.avatar = props.data.avatar;

      if (props.data.avatar) {
        state.fileList.push({
          url: props.data.avatar,
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
