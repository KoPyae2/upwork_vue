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
        :label="t('liveResource.title')"
        prop="title"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input
          v-model="form.title"
          placeholder=""
          maxlength="40"
          show-word-limit
        />
      </el-form-item>
      <el-form-item
        :label="t('liveResource.memberID')"
        prop="user_id"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input v-model.number="form.user_id" placeholder="" />
      </el-form-item>

      <el-form-item
        :label="t('liveResource.cover')"
        prop="img_url"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input
          v-model="form.img_url"
          placeholder="Image link"
          maxlength="120"
          show-word-limit
          style="margin-bottom: 20px"
        />

        <div style="display: inline-flex">
          <div style="display: none">
            <photo-provider v-if="form.img_url">
              <photo-consumer
                :intro="form.img_url"
                :key="form.img_url"
                :src="form.img_url"
                id="carousel-image"
              >
                <img
                  :src="form.img_url"
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
        </div>
      </el-form-item>

      <el-form-item
        :label="t('liveResource.thumbnail')"
        prop="thumbnail"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input
          v-model="form.thumbnail"
          placeholder="Image link"
          maxlength="120"
          show-word-limit
          style="margin-bottom: 20px"
        />

        <div style="display: inline-flex">
          <div style="display: none">
            <photo-provider v-if="form.thumbnail">
              <photo-consumer
                :intro="form.thumbnail"
                :key="form.thumbnail"
                :src="form.thumbnail"
                id="thumbnail-image"
              >
                <img
                  :src="form.thumbnail"
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
            :on-remove="handleThumbnailImageRemove"
            :on-preview="handleThumbnailPictureCardPreview"
            :on-success="handleThumbnailAvatarSuccess"
            :file-list="fileThumbnailList"
            :limit="2"
            :http-request="handleThumbnailHttp"
            accept="image/*"
          >
            <el-icon>+</el-icon>
          </el-upload>
        </div>
      </el-form-item>

      <el-form-item
        :label="t('liveResource.videoAddress')"
        prop="video_url"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input
          v-model="form.video_url"
          placeholder="Video link"
          style="margin-bottom: 20px"
          maxlength="120"
          show-word-limit
        />

        <el-upload
          list-type="text"
          :multiple="false"
          :on-remove="videoRemove"
          :on-success="videoSuccess"
          :file-list="videoList"
          :limit="2"
          :http-request="videoHttp"
          accept="video/*"
        >
          <el-button size="small" type="primary"
            >+ {{ t("liveResource.clickToUpload") }}</el-button
          >
        </el-upload>
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
          :disabled="stillUploaded || doubleClick"
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
  emits: ["closed", "created", "updated"],
  setup(props, context) {
    const { t } = useI18n();
    const state = reactive({
      dialogTitle: "",
      form: {
        title: "",
        user_id: "",
        type: 1,
        video_url: "",
        img_url: "",
        thumbnail: "",
      },
      fileList: [],
      fileThumbnailList: [],
      videoList: [],
      topicList: [],
      disabled: true,
      stillUploaded: false,
      doubleClick: false,
    });

    const formRef = ref();

    const auth = {
      Authorization: getToken(),
    };

    const closeDialog = (formRef) => {
      state.fileList = [];
      state.fileThumbnailList = [];
      state.videoList = [];
      state.disabled = true;
      formRef.resetFields();
      context.emit("closed");
    };

    const submitDialog = (formRef) => {
      formRef.validate((valid) => {
        if (valid) {
          if (state.dialogTitle == t("common.addTo")) {
            state.doubleClick = true;
            http.businessManagement
              .createLiveVideo(state.form)
              .then((res) => {
                if (res.data.err_code == 0) {
                  state.doubleClick = false;
                  closeDialog(formRef);
                  state.form = {
                    title: "",
                    user_id: "",
                    type: 1,
                    video_url: "",
                    img_url: "",
                    thumbnail: "",
                  };
                  ElMessage.success(t(`error.${res.data.err_code}`));

                  formRef.resetFields();
                  context.emit("created");
                } else {
                  ElMessage.error(t(`error.${res.data.err_code}`));
                  state.doubleClick = false;
                }
              })
              .catch((err) => {
                state.doubleClick = false;
              });
          } else {
            state.doubleClick = true;
            http.businessManagement
              .updateLiveVideo(state.form)
              .then((res) => {
                if (res.data.err_code == 0) {
                  state.doubleClick = false;
                  closeDialog(formRef);
                  state.form = {
                    title: "",
                    user_id: "",
                    type: 1,
                    video_url: "",
                    img_url: "",
                    thumbnail: "",
                  };
                  ElMessage.success(t(`error.${res.data.err_code}`));

                  formRef.resetFields();
                  context.emit("updated");
                } else {
                  state.doubleClick = false;
                  ElMessage.error(t(`error.${res.data.err_code}`));
                }
              })
              .catch((err) => {
                state.doubleClick = false;
              });
          }
        }
      });
    };

    // ----------------------------------------------------single upload

    const handleImageRemove = (uploadFile, uploadFiles) => {
      state.form.img_url = "";
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
            state.form.img_url = res.data.data.file;
          }
        });
    };

    const handleAvatarSuccess = (response, file, fileList) => {
      if (fileList.length > 1) {
        fileList.shift();
      }
    };

    /* Thumbnail */

    const handleThumbnailImageRemove = (uploadFile, uploadFiles) => {
      state.form.thumbnail = "";
    };

    const handleThumbnailPictureCardPreview = () => {
      document.getElementById("thumbnail-image").click();
    };

    const handleThumbnailHttp = (fileList) => {
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
            state.form.thumbnail = res.data.data.file;
          }
        });
    };

    const handleThumbnailAvatarSuccess = (response, file, fileList) => {
      if (fileList.length > 1) {
        fileList.shift();
      }
    };

    //----------------------------------------------------video upload

    const videoRemove = (uploadFile, uploadFiles) => {
      state.form.video_url = "";
    };

    const videoHttp = (fileList) => {
      fileList.onSuccess();
      const form = new FormData();
      form.append("file", fileList.file);
      state.stillUploaded = true;
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
            state.stillUploaded = false;
            fileList.onSuccess();
            state.form.video_url = res.data.data.file;
          } else {
            ElMessage.error(res.data.message);
            state.form.note_media_url = "";
            state.stillUploaded = false;
            state.doubleClick = false;
          }
        })
        .catch(() => {
          ElMessage.error("Upload Error!");
          state.form.note_media_url = "";
          state.stillUploaded = false;
          state.doubleClick = false;
        });
    };

    const videoSuccess = (response, file, fileList) => {
      if (fileList.length > 1) {
        fileList.shift();
      }
    };

    const openDialog = () => {
      state.dialogTitle = props.title;
      state.form.user_id = props.data.user_id;
      state.form.live_id = props.data.live_id;
      state.form.type = props.data.type;
      state.form.img_url = props.data.img_url;
      state.form.thumbnail = props.data.thumbnail;
      state.form.video_url = props.data.video_url;
      state.form.status = props.data.status;
      state.form.title = props.data.title;

      if (props.data.img_url) {
        state.fileList.push({
          url: props.data.img_url,
        });
      }

      if (props.data.thumbnail) {
        state.fileThumbnailList.push({
          url: props.data.thumbnail,
        });
      }

      if (props.data.video_url) {
        state.videoList.push({
          name: props.data.video_url,
          url: props.data.video_url,
        });
      }
    };

    onMounted(() => {});

    return {
      t,
      ...toRefs(state),
      closeDialog,
      submitDialog,
      formRef,
      auth,
      handleImageRemove,
      handlePictureCardPreview,
      handleHttp,
      handleAvatarSuccess,
      videoRemove,
      openDialog,
      videoHttp,
      videoSuccess,
      handleThumbnailImageRemove,
      handleThumbnailPictureCardPreview,
      handleThumbnailHttp,
      handleThumbnailAvatarSuccess,
    };
  },
};
</script>

<style lang="scss" scoped>
:deep(.el-select .el-input__inner) {
  height: 42px !important;
}
</style>
