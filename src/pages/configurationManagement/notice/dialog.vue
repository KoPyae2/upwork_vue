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
      <el-form-item :label="t('notice.dialog.client')">
        <el-radio-group v-model.number="form.notice_type">
          <el-radio :label="0">{{ t("notice.dialog.all") }}</el-radio>
          <el-radio :label="2">{{ t("notice.dialog.ios") }}</el-radio>
          <el-radio :label="1">{{ t("notice.dialog.android") }}</el-radio>
          <!-- <el-radio :label="3">H5</el-radio> -->
        </el-radio-group>
      </el-form-item>
      <!-- <el-form-item label="打开频率">
        <el-radio-group v-model.number="form.frequency">
          <el-radio :label="0">一次</el-radio>
          <el-radio :label="1">每天</el-radio>
          <el-radio :label="2">每次</el-radio>
        </el-radio-group>
      </el-form-item> -->

      <el-form-item :label="t('notice.dialog.picture')">
        <el-input
          v-model="form.image_path"
          placeholder="Image link"
          style="margin-bottom: 20px"
          maxlength="120"
          show-word-limit
        />
        <div style="display: none">
          <photo-provider v-if="form.image_path">
            <photo-consumer
              :intro="form.image_path"
              :key="form.image_path"
              :src="form.image_path"
              id="carousel-image"
            >
              <img
                :src="form.image_path"
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

      <el-tabs
        v-model="activeTab"
        class="tabs"
        type="card"
        v-if="form.title.length > 0"
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
                  tabRequired == false &&
                  form.title[index].content == '' &&
                  form.content[index].content == ''
                    ? 'required-field'
                    : ''
                "
                >{{ lan.name }}</span
              >
            </span>
          </template>
          <el-form-item
            :label="t('notice.dialog.title')"
            :prop="`title[${index}].content`"
            :rules="[
              { required: true, message: t('error.required'), trigger: 'blur' },
            ]"
          >
            <el-input
              v-model="form.title[index].content"
              placeholder=""
              maxlength="40"
              show-word-limit
            />
          </el-form-item>

          <el-form-item
            :label="t('notice.dialog.content')"
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

      <el-form-item
        :label="t('notice.dialog.link')"
        prop="type_str"
        :rules="[
          {
            message: t('error.url'),
            trigger: 'blur',
            pattern:
              /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)/,
          },
        ]"
      >
        <el-input
          v-model="form.type_str"
          placeholder=""
          maxlength="120"
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
import { onMounted, reactive, toRefs, ref } from "vue";
import http from "@/http";
import { ElMessage } from "element-plus";
import Editor from "@tinymce/tinymce-vue";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";

export default {
  name: "Dialog",
  props: ["show", "title", "data"],
  emits: ["closed", "created"],
  components: {
    editor: Editor,
  },
  setup(props, context) {
    const store = useStore();
    const state = reactive({
      dialogTitle: "",
      form: {
        title: [],
        content: [],
      },
      fileList: [],
      doubleClick: false,
      languages: store.state.app.languages,
      activeTab: store.state.app.languages[0].short_name,
      activeRequired: 0,
      tabRequired: true,
    });
    const { t } = useI18n();
    const editor = ref(null);
    const formRef = ref();

    const closeDialog = (formRef) => {
      state.fileList = [];
      state.form = {
        title: [],
        content: [],
      };
      formRef.resetFields();
      context.emit("closed");
      state.tabRequired = true;
    };
    const submitDialog = (formRef) => {
      formRef.validate((valid) => {
        state.tabRequired = valid;
        // state.languages.map((lan, index) => {
        //   formRef.validateField(`title[${index}].content`, (valid) => {
        //     if (!valid) {
        //       state.tabRequired = true;
        //     }
        //   });

        //   formRef.validateField(`content[${index}].content`, (valid) => {
        //     if (!valid) {
        //       state.tabRequired = true;
        //     }
        //   });
        // });

        if (valid) {
          if (state.dialogTitle == t("common.addTo")) {
            state.doubleClick = true;
            http.systemManagement.createNoticeList(state.form).then((res) => {
              if (res.data.err_code == 0) {
                state.doubleClick = false;
                closeDialog(formRef);
                state.form = {
                  title: [],
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

            http.systemManagement.updateNoticeList(state.form).then((res) => {
              state.doubleClick = false;
              if (res.data.err_code == 0) {
                closeDialog(formRef);
                state.form = {
                  title: [],
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
          }
        } else {
          let contentLangList = state.form.title.filter((item) => {
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
      state.form.image_path = "";
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
            state.form.image_path = res.data.data.file;
          }
        });
    };

    const handleAvatarSuccess = (response, file, fileList) => {
      if (fileList.length > 1) {
        fileList.shift();
      }
    };

    const openLanTitleForm = (data) => {
      data.map((lan) => {
        return state.form.title.push({
          lang: lan.short_name,
          content: "",
        });
      });
    };

    const editLanTitleForm = (data) => {
      if (data.length == state.languages.length) {
        state.form.title = data;
      } else {
        state.languages.map((item, index) => {
          if (data[index]) {
            state.form.title.push(data[index]);
          } else {
            state.form.title.push({
              lang: item.short_name,
              content: "",
            });
          }
          return;
        });
      }
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
      if (data.length == state.languages.length) {
        state.form.content = data;
      } else {
        state.languages.map((item, index) => {
          if (data[index]) {
            state.form.content.push(data[index]);
          } else {
            state.form.content.push({
              lang: item.short_name,
              content: "",
            });
          }
          return;
        });
      }
    };

    const openDialog = () => {
      state.dialogTitle = props.title;

      state.form.notice_id = props.data.notice_id;
      state.form.notice_type = props.data.notice_type ?? 0;
      // state.form.frequency = props.data.frequency ?? 0;
      state.form.image_path = props.data.image_path;
      state.form.type_str = props.data.type_str;

      if (props.data.image_path) {
        state.fileList.push({
          url: props.data.image_path,
        });
      }

      if (props.data.title !== undefined && props.data.title.length > 0) {
        editLanTitleForm(props.data.title);
      } else {
        openLanTitleForm(state.languages);
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

    onMounted(() => {});

    return {
      ...toRefs(state),
      closeDialog,
      submitDialog,
      formRef,
      editor,
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

:deep(.el-tabs--card > .el-tabs__header) {
  margin-left: 25px;
  margin-bottom: 25px;
}
</style>
