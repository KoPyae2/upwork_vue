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
    <el-form label-width="120px" ref="formRef" :model="form">
      <el-form-item :label="t('notice.dialog.client')">
        <el-radio-group v-model="form.lang">
          <el-radio label="">{{ t("notice.dialog.all") }}</el-radio>
          <el-radio
            :label="item.short_name"
            v-for="item in languages"
            :key="item.id"
            >{{ item.name }}</el-radio
          >
        </el-radio-group>
      </el-form-item>
      <el-form-item
        :label="t('banner.dialog.title')"
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
        :label="t('banner.dialog.sort')"
        prop="sort"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input
          v-model.number="form.sort"
          placeholder=""
          type="number"
          maxlength="20"
          min="0"
          onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode == 46"
          @copy.prevent
          @paste.prevent
        />
      </el-form-item>
      <el-form-item
        :label="t('banner.dialog.link')"
        prop="link"
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
          v-model="form.link"
          placeholder=""
          maxlength="120"
          show-word-limit
        />
      </el-form-item>
      <el-form-item
        :label="t('banner.dialog.type')"
        prop="type"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-select
          :multiple="false"
          placeholder=""
          style="width: 100%"
          v-model="form.type"
          default-first-option
          @change="changeType"
        >
          <el-option
            v-for="item in typeList"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        v-if="form.type == 2"
        :label="t('banner.dialog.class')"
        prop="vod_type"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-select
          :multiple="false"
          placeholder=""
          style="width: 100%"
          v-model="form.vod_type"
          default-first-option
        >
          <el-option
            v-for="item in tableList"
            :key="item.type_id"
            :value="item.type_id"
            :label="findName(item.type_name)"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        :label="t('banner.dialog.picture')"
        prop="image"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <div>
          <div style="display: none">
            <photo-provider v-if="form.image">
              <photo-consumer
                :intro="form.image"
                :key="form.image"
                :src="form.image"
                id="carousel-image"
              >
                <img
                  :src="form.image"
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
            v-model="form.image"
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
            :file-list="fileList"
            :limit="2"
            :http-request="handleHttp"
            accept="image/*"
          >
            <el-icon>+</el-icon>
          </el-upload>
        </div>
      </el-form-item>
      <el-form-item :label="t('banner.dialog.state')">
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
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";

export default {
  name: "Dialog",
  props: ["show", "title", "data"],
  emits: ["closed", "created"],
  setup(props, context) {
    const { t } = useI18n();
    const store = useStore();
    const state = reactive({
      dialogTitle: "",
      form: {},
      fileList: [],
      param: {
        status: 5,
      },
      typeList: [
        {
          value: 1,
          label: t("banner.filter.home_page_ad"),
        },
        {
          value: 2,
          label: t("banner.filter.television_ad"),
        },
        // {
        //   value: 3,
        //   label: "Game",
        // },
        // {
        //   value: 4,
        //   label: "Image",
        // },
        {
          value: 5,
          label: t("banner.filter.popular_ad"),
        },
        // {
        //   value: 6,
        //   label: "Gift",
        // },
      ],
      doubleClick: false,
      tableList: [],
      languages: store.state.app.languages,
    });

    const formRef = ref();

    const closeDialog = (formRef) => {
      state.fileList = [];
      state.form = {};

      formRef.resetFields();
      context.emit("closed");
    };

    const getVodType = () => {
      state.isLoading = true;
      http.businessManagement.getNoteLongVideoType(state.param).then((res) => {
        if (res.data.err_code == 0) {
          state.isLoading = false;
          state.tableList = res.data.data.video_type;
          state.tableList.unshift({
            type_id: 777,
            type_name: [
              {
                lang: "en",
                content: "Recommend",
              },
              {
                lang: "zh",
                content: "推薦",
              },
            ],
          });
          state.tableList.push({
            type_id: 888,
            type_name: [
              {
                lang: "en",
                content: "Leaderboard",
              },
              {
                lang: "zh",
                content: "排行榜",
              },
            ],
          });
        }
      });
    };

    const submitDialog = (formRef) => {
      formRef.validate((valid) => {
        if (valid) {
          if (state.form.type !== 2) {
            state.form.vod_type = 0;
          }
          if (state.dialogTitle == t("common.addTo")) {
            state.doubleClick = true;
            http.systemManagement.createBannerList(state.form).then((res) => {
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
            http.systemManagement.updateBannerList(state.form).then((res) => {
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
          }
        }
      });
    };

    const handleImageRemove = (uploadFile, uploadFiles) => {
      state.form.image = "";
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
            state.form.image = res.data.data.file;
          }
        });
    };

    const handleAvatarSuccess = (response, file, fileList) => {
      if (fileList.length > 1) {
        fileList.shift();
      }
    };

    const findName = (data) => {
      const index = data.findIndex((x) => x.lang == store.state.user.lang);

      if (index !== -1) {
        return data[index].content;
      } else {
        return "--";
      }
    };

    const changeType = (val) => {
      if (val !== 2) {
        state.form.vod_type = "";
      }
    };

    const openDialog = () => {
      state.dialogTitle = props.title;
      state.form.id = props.data.id;
      state.form.title = props.data.title;
      state.form.link = props.data.link;
      state.form.image = props.data.image;
      state.form.status = props.data.status ?? 1;
      state.form.client = props.data.client;
      state.form.sort = props.data.sort;
      state.form.lang = props.data.lang;
      state.form.vod_type = props.data.vod_type == 0 ? "" : props.data.vod_type;
      if (props.data.type !== 0) {
        state.form.type = props.data.type;
      }
      if (props.data.image) {
        state.fileList.push({
          url: props.data.image,
        });
      }
    };

    onMounted(() => {
      getVodType();
    });

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
      getVodType,
      t,
      findName,
      changeType,
    };
  },
};
</script>

<style lang="scss" scoped>
:deep(.el-select .el-input__inner) {
  height: 42px !important;
}
</style>
