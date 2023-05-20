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
      <el-tabs
        v-model="activeTab"
        class="tabs"
        type="card"
        v-if="form.type_name.length > 0"
      >
        <el-tab-pane
          v-for="(lan, index) in languages"
          :key="lan.id"
          :name="lan.short_name"
        >
          <template #label>
            <span class="custom-tabs-label">
              <!-- style="color: red" -->
              <span
                :class="
                  tabRequired == false && form.type_name[index].content == ''
                    ? 'required-field'
                    : ''
                "
                >{{ lan.name }}</span
              >
            </span>
          </template>
          <el-form-item
            :label="t('noteResource.topicType')"
            :prop="`type_name[${index}].content`"
            :rules="[
              { required: true, message: t('error.required'), trigger: 'blur' },
            ]"
          >
            <el-input
              v-model="form.type_name[index].content"
              placeholder=""
              maxlength="40"
              show-word-limit
            />
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
      <!-- <el-form-item
        :label="t('noteResource.topicType')"
        prop="type_name"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input
          v-model="form.type_name"
          placeholder=""
          maxlength="40"
          show-word-limit
        />
      </el-form-item> -->

      <el-form-item
        :label="t('noteResource.cover')"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input
          v-model="form.type_icon"
          placeholder="Image Link"
          style="margin-bottom: 20px"
          maxlength="120"
          show-word-limit
        />
      </el-form-item>

      <el-form-item
        prop="type_icon"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <div>
          <div style="display: none">
            <photo-provider v-if="form.type_icon">
              <photo-consumer
                :intro="form.type_icon"
                :key="form.type_icon"
                :src="form.type_icon"
                id="carousel-image"
              >
                <img
                  :src="form.type_icon"
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
        :label="t('noteResource.toSort')"
        prop="sort"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input
          v-model.number="form.sort"
          placeholder=""
          type="number"
          @input="form.sort = Math.abs(form.sort)"
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
import { reactive, toRefs, ref } from "vue";
import http from "@/http";
import { ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";
export default {
  name: "Dialog",
  props: ["show", "title", "data"],
  emits: ["closed", "created", "edited"],
  setup(props, context) {
    const { t } = useI18n();
    const store = useStore();
    const state = reactive({
      dialogTitle: "",
      form: {
        type_name: [],
      },
      fileList: [],
      doubleClick: false,
      languages: store.state.app.languages,
      activeTab: store.state.app.languages[0].short_name,
      activeRequired: 0,
      tabRequired: true,
    });

    const formRef = ref();

    const closeDialog = (formRef) => {
      state.fileList = [];
      state.form = {
        type_name: [],
      };
      formRef.resetFields();
      context.emit("closed");
      state.tabRequired = true;
    };

    const submitDialog = (formRef) => {
      formRef.validate((valid) => {
        state.tabRequired = valid;
        if (valid) {
          if (isNaN(parseInt(state.form.sort))) {
            ElMessage.error(t("noteResource.enterInteger"));
            return;
          }
          if (state.dialogTitle == t("common.addTo")) {
            state.doubleClick = true;
            http.businessManagement
              .createNoteTopicType(state.form)
              .then((res) => {
                if (res.data.err_code == 0) {
                  state.doubleClick = false;
                  closeDialog(formRef);
                  state.form = {
                    type_name: [],
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
            http.businessManagement
              .updateNoteTopicType(state.form)
              .then((res) => {
                if (res.data.err_code == 0) {
                  state.doubleClick = false;
                  closeDialog(formRef);
                  state.form = {
                    type_name: [],
                  };
                  ElMessage.success(t(`error.${res.data.err_code}`));

                  formRef.resetFields();
                  context.emit("edited");
                } else {
                  state.doubleClick = false;

                  ElMessage.error(t(`error.${res.data.err_code}`));
                }
              });
          }
        } else {
          let contentLangList = state.form.type_name.filter((item) => {
            return item.content == "";
          });
          if (contentLangList && contentLangList.length) {
            state.activeTab = contentLangList[0].lang;
          }
        }
      });
    };

    const handleImageRemove = (uploadFile, uploadFiles) => {
      state.form.type_icon = "";
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
            state.form.type_icon = res.data.data.file;
          }
        });
    };

    const handleAvatarSuccess = (response, file, fileList) => {
      if (fileList.length > 1) {
        fileList.shift();
      }
    };

    const openLanContentForm = (data) => {
      data.map((lan) => {
        return state.form.type_name.push({
          lang: lan.short_name,
          content: "",
        });
      });
    };

    const editLanContentForm = (data) => {
      data.map((lan) => {
        return state.form.type_name.push({
          lang: lan.lang,
          content: lan.content,
        });
      });
    };
    const openDialog = () => {
      state.dialogTitle = props.title;
      state.form.type_id = props.data.id;
      state.form.status = 1;
      state.form.sort = props.data.sort ?? 0;
      state.form.type_icon = props.data.resource_icon;

      if (props.data.resource_icon) {
        state.fileList.push({
          url: props.data.resource_icon,
        });
      }
      if (props.data.name !== undefined && props.data.name.length > 0) {
        editLanContentForm(props.data.name);
      } else {
        openLanContentForm(state.languages);
      }

      const default_lan = state.languages.findIndex((lan) => {
        return lan.status == 1;
      });
      if (default_lan !== -1) {
        state.activeTab = store.state.app.languages[default_lan].short_name;
        state.activeRequired = default_lan;
      }
    };

    return {
      t,
      ...toRefs(state),
      closeDialog,
      submitDialog,
      formRef,
      openDialog,
      handleImageRemove,
      handlePictureCardPreview,
      handleHttp,
      handleAvatarSuccess,
    };
  },
};
</script>

<style lang="scss" scoped>
:deep(.el-select .el-input__inner) {
  height: 42px !important;
}
</style>
