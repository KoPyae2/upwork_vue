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
      <!-- <el-form-item
       :label="t('game.name')"
        prop="name"
        :rules="[{ required: true, message: t('error.required'), trigger: 'blur' }]"
      >
        <el-input
          v-model="form.name"
          placeholder=""
          maxlength="40"
          show-word-limit
        />
      </el-form-item> -->

      <el-form-item
        :label="t('game.link')"
        prop="link_url"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
          {
            message: t('error.url'),
            trigger: 'blur',
            pattern:
              /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)/,
          },
        ]"
      >
        <el-input
          v-model="form.link_url"
          placeholder=""
          maxlength="120"
          show-word-limit
        />
      </el-form-item>

      <el-tabs
        v-model="activeTab"
        class="tabs"
        type="card"
        v-if="form.image_url.length > 0"
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
                  tabRequired == false && form.image_url[index].content == ''
                    ? 'required-field'
                    : ''
                "
                >{{ lan.name }}</span
              >
            </span>
          </template>
          <!-- <el-form-item :label="t('notice.dialog.title')" prop="title[0].content" :rules="[
            { required: true, message: t('error.required'), trigger: 'blur' },
          ]" v-if="index == 0">
            <el-input v-model="form.title[index].content" placeholder="" maxlength="40" show-word-limit />
          </el-form-item> -->

          <el-form-item
            :label="t('game.picture')"
            :prop="`image_url[${index}].content`"
            :rules="[
              { required: true, message: t('error.required'), trigger: 'blur' },
            ]"
          >
            <div>
              <div style="display: none">
                <photo-provider v-if="form.image_url[index].content">
                  <photo-consumer
                    :intro="form.image_url[index].content"
                    :key="form.image_url[index].content"
                    :src="form.image_url[index].content"
                    id="carousel-image"
                  >
                    <img
                      :src="form.image_url[index].content"
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
              <el-input
                v-model="form.image_url[index].content"
                placeholder="Image link"
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
                :file-list="fileList[index].content"
                :limit="2"
                :http-request="handleHttp"
                accept="image/*"
              >
                <el-icon>+</el-icon>
              </el-upload>
            </div>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>

      <!-- <el-form-item
        :label="t('game.remark')"
        prop="remark"
        :rules="[{ required: true, message: t('error.required'), trigger: 'blur' }]"
      >
        <el-input
          v-model="form.remark"
          placeholder=""
          type="textarea"
          rows="3"
          maxlength="200"
          show-word-limit
        />
      </el-form-item> -->
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
import { useStore } from "vuex";

export default {
  name: "Dialog",
  props: ["show", "title", "data"],
  emits: ["closed", "created"],
  setup(props, context) {
    const store = useStore();
    const { t } = useI18n();
    const state = reactive({
      dialogTitle: "",
      form: {
        image_url: [],
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
        image_url: [],
      };
      state.activeTab = store.state.app.languages[0].short_name;

      formRef.resetFields();
      context.emit("closed");
      state.tabRequired = true;
    };

    const submitDialog = (formRef) => {
      formRef.validate((valid) => {
        state.tabRequired = valid;
        state.form.type = 1;
        if (valid) {
          if (state.dialogTitle == t("common.addTo")) {
            state.doubleClick = true;

            http.gameManagement.createDiscoveryList(state.form).then((res) => {
              if (res.data.err_code == 0) {
                state.doubleClick = false;
                closeDialog(formRef);
                state.form = {
                  image_url: [],
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
            http.gameManagement.updateDiscoveryList(state.form).then((res) => {
              if (res.data.err_code == 0) {
                state.doubleClick = false;
                closeDialog(formRef);
                state.form = {
                  image_url: [],
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
          let contentLangList = state.form.image_url.filter((item) => {
            return item.content == "";
          });
          if (contentLangList && contentLangList.length) {
            state.activeTab = contentLangList[0].lang;
          }
        }
      });
    };

    const handleImageRemove = (uploadFile, uploadFiles) => {
      let tabIndex = state.form.image_url.findIndex((img) => {
        return img.lang == state.activeTab;
      });
      state.form.image_url[tabIndex].content = "";
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
            let tabIndex = state.form.image_url.findIndex((img) => {
              return img.lang == state.activeTab;
            });
            state.form.image_url[tabIndex].content = res.data.data.file;
          }
        });
    };

    const handleAvatarSuccess = (response, file, fileList) => {
      if (fileList.length > 1) {
        fileList.shift();
      }
    };

    const openLanForm = (data) => {
      data.map((lan) => {
        state.form.image_url.push({
          lang: lan.short_name,
          content: "",
        });
        state.fileList.push({
          lang: lan.short_name,
          content: [],
        });
        return;
      });
    };

    const editLanForm = (data) => {
      if (data.length == state.languages.length) {
        state.form.image_url = data;
        let lans = state.languages.sort((a, b) => {
          return (
            state.form.image_url.findIndex((p) => p.lang === a.short_name) -
            state.form.image_url.findIndex((p) => p.lang === b.short_name)
          );
        });

        data.map((lan, index) => {
          state.fileList.push({
            lang: lan.lang,
            content: [],
          });
          state.fileList[index].content.push({
            url: lan.content,
          });
        });

        state.languages = lans;
      }
    };

    const openDialog = () => {
      state.dialogTitle = props.title;

      state.form.id = props.data.id;
      state.form.name = props.data.name;
      state.form.link_url = props.data.link_url;
      // state.form.image_url = props.data.image_url;
      state.form.remark = props.data.remark;

      if (
        props.data.image_url !== undefined &&
        props.data.image_url.length > 0
      ) {
        editLanForm(props.data.image_url);
      } else {
        openLanForm(state.languages);
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
