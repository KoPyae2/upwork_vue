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
        v-if="form.star_name.length > 0"
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
                  tabRequired == false && form.star_name[index].content == ''
                    ? 'required-field'
                    : ''
                "
                >{{ lan.name }}</span
              >
            </span>
          </template>
          <el-form-item
            :label="t('noteLongVideo.categoryName')"
            :prop="`star_name[${index}].content`"
            :rules="[
              {
                required: true,
                message: t('error.required'),
                trigger: 'blur',
              },
            ]"
          >
            <el-input
              v-model="form.star_name[index].content"
              placeholder=""
              maxlength="40"
              show-word-limit
            />
          </el-form-item>
        </el-tab-pane>
      </el-tabs>

      <el-form-item
        :label="t('noteLongVideo.avatar')"
        prop="star_img"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <div>
          <div style="display: none">
            <photo-provider v-if="form.star_img">
              <photo-consumer
                :intro="form.star_img"
                :key="form.star_img"
                :src="form.star_img"
                id="carousel-image"
              >
                <img
                  :src="form.star_img"
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
            v-model="form.star_img"
            placeholder="Image Link"
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
        </div>
      </el-form-item>

      <el-form-item
        :label="t('noteLongVideo.toSort')"
        v-if="dialogTitle !== t('common.addTo')"
      >
        <el-input
          v-model.number="form.is_sort"
          placeholder=""
          min="0"
          type="number"
          onkeypress="return event.charCode >= 48 && event.charCode <= 57"
          @copy.prevent
          @paste.prevent
        />
      </el-form-item>

      <el-form-item
        :label="t('noteLongVideo.popularity')"
        v-if="dialogTitle !== t('common.addTo')"
      >
        <el-input
          v-model.number="form.hot_count"
          placeholder=""
          min="0"
          type="number"
          onkeypress="return event.charCode >= 48 && event.charCode <= 57"
          @copy.prevent
          @paste.prevent
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
import { useStore } from "vuex";

export default {
  name: "Dialog",
  props: ["show", "title", "data"],
  emits: ["closed", "created", "updated"],
  setup(props, context) {
    const store = useStore();
    const { t } = useI18n();
    const state = reactive({
      dialogTitle: "",
      form: {
        star_name: [],
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
      state.visionState = false;
      state.fileList = [];
      state.form = {
        star_name: [],
      };
      state.activeTab = store.state.app.languages[0].short_name;

      formRef.resetFields();
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
              .createNoteLongVideoStar(state.form)
              .then((res) => {
                if (res.data.err_code == 0) {
                  state.doubleClick = false;
                  closeDialog(formRef);
                  state.form = {
                    star_name: [],
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
              .updateNoteLongVideoStar(state.form)
              .then((res) => {
                if (res.data.err_code == 0) {
                  state.doubleClick = false;
                  closeDialog(formRef);
                  state.form = {
                    star_name: [],
                  };
                  ElMessage.success(t(`error.${res.data.err_code}`));

                  formRef.resetFields();
                  context.emit("updated");
                } else {
                  state.doubleClick = false;

                  ElMessage.error(t(`error.${res.data.err_code}`));
                }
              });
          }
        } else {
          let contentLangList = state.form.star_name.filter((item) => {
            return item.content == "";
          });
          if (contentLangList && contentLangList.length) {
            state.activeTab = contentLangList[0].lang;
          }
        }
      });
    };

    const handleImageRemove = (uploadFile, uploadFiles) => {
      state.form.star_img = "";
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
            state.form.star_img = res.data.data.file;
          }
        });
    };

    const handleAvatarSuccess = (response, file, fileList) => {
      if (fileList.length > 1) {
        fileList.shift();
      }
    };

    onMounted(() => {});

    const openLanForm = (data) => {
      data.map((lan) => {
        return state.form.star_name.push({
          lang: lan.short_name,
          content: "",
        });
      });
    };

    const editLanForm = (data) => {
      if (data.length == state.languages.length) {
        state.form.star_name = data;

        let lans = state.languages.sort((a, b) => {
          return (
            state.form.star_name.findIndex((p) => p.lang === a.short_name) -
            state.form.star_name.findIndex((p) => p.lang === b.short_name)
          );
        });

        state.languages = lans;
      } else {
        state.languages.map((item, index) => {
          if (data[index]) {
            state.form.star_name.push(data[index]);
          } else {
            state.form.star_name.push({
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

      state.form.star_id = props.data.star_id;
      state.form.star_img = props.data.star_img;
      state.form.is_sort = props.data.is_sort;
      state.form.hot_count = props.data.hot_count;

      if (props.data.star_img) {
        state.fileList.push({
          url: props.data.star_img,
        });
      }
      if (
        props.data.star_name !== undefined &&
        props.data.star_name.length !== []
      ) {
        editLanForm(props.data.star_name);
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
