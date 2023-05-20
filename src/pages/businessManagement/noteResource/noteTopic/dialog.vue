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
        v-if="form.name.length > 0"
      >
        <el-tab-pane
          v-for="(lan, index) in languages"
          :key="lan.id"
          :label="lan.name"
          :name="lan.short_name"
        >
          <template #label>
            <span class="custom-tabs-label">
              <!-- style="color: red" -->
              <span
                :class="
                  tabRequired == false &&
                  form.name[index].content == '' &&
                  form.content[index].content == ''
                    ? 'required-field'
                    : ''
                "
                >{{ lan.name }}</span
              >
            </span>
          </template>
          <el-form-item
            :label="t('noteResource.topic')"
            :prop="`name[${index}].content`"
            :rules="[
              { required: true, message: t('error.required'), trigger: 'blur' },
            ]"
          >
            <el-input
              v-model="form.name[index].content"
              placeholder=""
              maxlength="40"
              show-word-limit
            />
          </el-form-item>

          <el-form-item
            :label="t('noteResource.topicDescription')"
            :prop="`content[${index}].content`"
            :rules="[
              { required: true, message: t('error.required'), trigger: 'blur' },
            ]"
          >
            <el-input
              v-model="form.content[index].content"
              placeholder=""
              type="textarea"
              rows="3"
              maxlength="200"
              show-word-limit
            />
          </el-form-item>
        </el-tab-pane>
      </el-tabs>

      <el-form-item :label="t('noteResource.cover')">
        <el-input
          v-model="form.resource_icon"
          placeholder="Image link"
          style="margin-bottom: 20px"
          maxlength="120"
          show-word-limit
        />
        <div style="display: none">
          <div v-if="form.resource_icon">
            <photo-provider>
              <photo-consumer
                :intro="form.resource_icon"
                :key="form.resource_icon"
                :src="form.resource_icon"
                id="carousel-image"
              >
                <img
                  :src="form.resource_icon"
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

      <el-form-item :label="t('noteResource.toSort')">
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
import { onMounted, reactive, toRefs, ref } from "vue";
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
        name: [],
        content: [],
      },
      noteTagList: [],
      fileList: [],
      visionState: false,
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
        name: [],
        content: [],
      };
      formRef.resetFields();
      state.form.resource_icon = "";
      context.emit("closed");
      state.tabRequired = true;
    };

    const submitDialog = (formRef) => {
      formRef.validate((valid) => {
        state.tabRequired = valid;
        if (valid) {
          if (state.dialogTitle == t("common.addTo")) {
            state.doubleClick = true;
            http.businessManagement
              .createNoteTopicList(state.form)
              .then((res) => {
                if (res.data.err_code == 0) {
                  state.doubleClick = false;
                  closeDialog(formRef);
                  state.form = {
                    name: [],
                    content: [],
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
              .updateNoteTopicList(state.form)
              .then((res) => {
                if (res.data.err_code == 0) {
                  state.doubleClick = false;
                  closeDialog(formRef);
                  state.form = {
                    name: [],
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
          let contentLangList = state.form.name.filter((item) => {
            return item.content == "";
          });
          if (contentLangList && contentLangList.length) {
            state.activeTab = contentLangList[0].lang;
          }
          let contentLangList2 = state.form.content.filter((item) => {
            return item.content == "";
          });
          if (contentLangList2 && contentLangList2.length) {
            state.activeTab = contentLangList2[0].lang;
          }
        }
      });
    };

    const handleImageRemove = (uploadFile, uploadFiles) => {
      state.form.icon_url = "";
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
            state.form.resource_icon = res.data.data.file;
          }
        });
    };

    const handleAvatarSuccess = (response, file, fileList) => {
      if (fileList.length > 1) {
        fileList.shift();
      }
    };

    const openLanNameForm = (data) => {
      data.map((lan) => {
        return state.form.name.push({
          lang: lan.short_name,
          content: "",
        });
      });
    };

    const editLanNameForm = (data) => {
      data.map((lan) => {
        return state.form.name.push({
          lang: lan.lang,
          content: lan.content,
        });
      });
    };
    const openLanContentForm = (data) => {
      data.map((lan) => {
        return state.form.content.push({
          lang: lan.short_name,
          content: "",
        });
      });
    };

    const editLanContentForm = (data) => {
      data.map((lan) => {
        return state.form.content.push({
          lang: lan.lang,
          content: lan.content,
        });
      });
    };
    onMounted(() => {
      http.businessManagement.getNoteTagType().then((res) => {
        if (res.data.err_code == 0) {
          state.noteTagList = res.data.data.tag_list;
        }
      });
    });

    const openDialog = () => {
      state.dialogTitle = props.title;

      if (props.data.hasOwnProperty("type_id")) {
        state.form.id = props.data.topic_id;
        state.form.type_id = props.data.type_id;
        // state.form.name = props.data.topic_name;
        state.form.is_hot = props.data.is_hot;
        state.form.resource_icon = props.data.resource_icon;
        state.form.resource_url = props.data.resource_url;
        state.form.sort = props.data.sort;
        state.form.status = props.data.status;
        // state.form.content = props.data.content;

        if (props.data.resource_icon) {
          state.fileList.push({
            url: props.data.resource_icon,
          });
        }
      } else {
        state.form.type_id = props.data.id;
        state.form.sort = 0;
        state.form.status = 1;
      }
      if (
        props.data.topic_name !== undefined &&
        props.data.topic_name.length > 0
      ) {
        editLanNameForm(props.data.topic_name);
      } else {
        openLanNameForm(state.languages);
      }

      if (props.data.content !== undefined && props.data.content.length > 0) {
        editLanContentForm(props.data.content);
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
