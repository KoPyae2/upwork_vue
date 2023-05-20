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
        label="游戏名称"
        prop="game_name"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input
          v-model="form.game_name"
          placeholder=""
          maxlength="40"
          show-word-limit
        />
      </el-form-item>

      <el-form-item label="游戏图标:" prop="game_icon">
        <el-input
          v-model="form.game_icon"
          placeholder="Image link"
          style="margin-bottom: 20px"
          maxlength="120"
          show-word-limit
        />
        <div style="display: none">
          <photo-provider v-if="form.game_icon">
            <photo-consumer
              :intro="form.game_icon"
              :key="form.game_icon"
              :src="form.game_icon"
              id="carousel-image"
            >
              <img
                :src="form.game_icon"
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
          :limit="1"
          :http-request="handleHttp"
          accept="image/*"
        >
          <el-icon>+</el-icon>
        </el-upload>
      </el-form-item>

      <el-form-item
        label="跳转地址"
        prop="game_url"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input v-model="form.game_url" placeholder="" />
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
import { onMounted, reactive, toRefs, ref} from "vue";
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

    const closeDialog = (formRef) => {
      state.fileList = [];
      formRef.resetFields();
      context.emit("closed");
    };

    const submitDialog = (formRef) => {
      formRef.validate((valid) => {
        if (valid) {
          if (state.dialogTitle == t("common.addTo")) {
            // console.log(state.form);
            state.doubleClick = true;
            http.systemManagement.createGameList(state.form).then((res) => {
              if (res.data.err_code == 0) {
                state.doubleClick = false;
                closeDialog(formRef);
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
            http.systemManagement.updateGameList(state.form).then((res) => {
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
          }
        }
      });
    };

    const handleImageRemove = (uploadFile, uploadFiles) => {
      state.form.game_icon = "";
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
            state.form.game_icon = res.data.data.file;
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
      state.form.game_name = props.data.game_name;
      state.form.game_icon = props.data.game_icon;
      state.form.game_url = props.data.game_url;
      state.form.status = parseInt(props.data.status ?? 1);

      if (props.data.type !== 0) {
        state.form.type = props.data.type;
      }
      if (props.data.game_icon) {
        state.fileList.push({
          url: props.data.game_icon,
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
