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
        label="资源标题"
        prop="note_title"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input
          v-model="form.note_title"
          placeholder=""
          maxlength="40"
          show-word-limit
        />
      </el-form-item>
      <!-- <el-form-item
        label="资源话题"
        prop="topic_id"
        :rules="[{ required: true, message: t('error.required'), trigger: 'blur' }]"
      >
        <el-select
          :multiple="false"
          placeholder="请输入发布状态"
          style="width: 100%"
          v-model="form.topic_id"
          default-first-option
        >
          <el-option
            v-for="item in topicList"
            :key="item.id"
            :value="item.id"
            :label="item.name"
          />
        </el-select>
      </el-form-item> -->

      <el-form-item
        label="资源内容"
        prop="note_content"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input
          v-model="form.note_content"
          placeholder="Image link"
          type="textarea"
          :rows="3"
          maxlength="120"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="资源封面:">
        <el-input
          v-model="form.note_cover"
          placeholder="Image link"
          style="margin-bottom: 20px"
          maxlength="120"
          show-word-limit
        />
        <div style="display: inline-flex">
          <div v-if="form.note_cover" style="display: none">
            <photo-provider>
              <photo-consumer
                :intro="form.note_cover"
                :key="form.note_cover"
                :src="form.note_cover"
                id="carousel-image"
              >
                <img
                  :src="form.note_cover"
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
        label="资源视频:"
        prop="note_media_url"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input
          v-model="form.note_media_url"
          placeholder="Video link"
          maxlength="120"
          show-word-limit
          style="margin-bottom: 20px"
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
          <el-button size="small" type="primary">+ 点击上传</el-button>
          <!-- <el-icon>+</el-icon> -->
        </el-upload>
      </el-form-item>

      <el-form-item label="省名">
        <el-select
          :multiple="false"
          placeholder="请输入发布状态"
          style="width: 100%"
          v-model="province"
          default-first-option
          @change="changeProvince"
        >
          <el-option
            v-for="item in provinceList"
            :key="item.code"
            :value="item.code"
            :label="item.name"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="城市名">
        <el-select
          :multiple="false"
          placeholder="请输入发布状态"
          style="width: 100%"
          v-model="city"
          :disabled="disabled"
          @change="changeCity"
        >
          <el-option
            v-for="item in cityLists"
            :key="item.code"
            :value="item.code"
            :label="item.name"
          />
        </el-select>
      </el-form-item>

      <!-- <el-form-item label="粉丝团资源">
        <el-radio-group v-model.number="form.group_id">
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1">是</el-radio>
        </el-radio-group>
      </el-form-item> -->
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog(formRef)">关闭</el-button>
        <el-button
          class="app-button"
          @click="submitDialog(formRef)"
          :disabled="stillUploaded || doubleClick"
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
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";

export default {
  name: "liveVideoDialog",
  props: ["show", "title", "data"],
  emits: ["closed", "created"],
  setup(props, context) {
    const { t } = useI18n();
    const route = useRoute();
    const state = reactive({
      dialogTitle: "",
      form: {
        group_id: 0,
        note_type: 5,
        user_id: route.params.id,
      },

      fileList: [],
      videoList: [],
      // checkMultiple: false,

      province: "",
      city: "",
      topicList: [],
      provinceList: [],
      allCity: [],
      cityLists: [],
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
      state.videoList = [];
      // state.multipleList = [];

      state.disabled = true;
      formRef.resetFields();
      context.emit("closed");
    };

    const submitDialog = (formRef) => {
      formRef.validate((valid) => {
        if (valid) {
          if (state.dialogTitle == "添加") {
            state.doubleClick = true;
            state.form.user_id = state.form.user_id.toString();
            http.businessManagement.createNoteList(state.form).then((res) => {
              state.doubleClick = false;
              if (res.data.err_code == 0) {
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

            http.businessManagement.updateNoteList(state.form).then((res) => {
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

    const changeProvince = () => {
      state.disabled = false;
      state.cityLists = [];

      const list = state.allCity.filter(function (city) {
        return city.province_code == state.province;
      });
      state.cityLists.push(...list);
    };

    const changeCity = () => {
      const list = state.cityLists.filter(function (city) {
        return city.code == state.city;
      });
      const lat = list[0].lat;
      const lng = list[0].lng;
      state.form.position_at = lat + "," + lng;
    };

    // ----------------------------------------------------single upload

    const handleImageRemove = (uploadFile, uploadFiles) => {
      state.form.note_cover = "";
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
            state.form.note_cover = res.data.data.file;
            state.form.note_thumbnail = res.data.data.file;
          }
        });
    };

    const handleAvatarSuccess = (response, file, fileList) => {
      if (fileList.length > 1) {
        fileList.shift();
      }
    };

    //----------------------------------------------------video upload

    const videoRemove = (uploadFile, uploadFiles) => {
      state.form.note_media_url = "";
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
            state.form.note_media_url = res.data.data.file;
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

      state.form.note_id = props.data.note_id;
      state.form.note_title = props.data.note_title;
      state.form.topic_id = props.data.topic_id;
      state.form.note_content = props.data.note_content;
      state.form.note_title = props.data.note_title;
      state.form.position_at = props.data.position_at;
      state.form.note_cover = props.data.note_cover;
      state.form.note_thumbnail = props.data.note_thumbnail;
      state.form.note_media_url = props.data.note_media_url;
      state.form.group_id = props.data.group_id ?? state.form.group_id;
      state.form.note_type = 5;
      state.form.user_id = props.data.user_id.toString();

      if (props.data.position_at) {
        const [lat, lng] = state.form.position_at.split(",");

        const list = state.allCity.filter(function (city) {
          return city.lat == lat && city.lng == lng;
        });

        if (list.length) {
          state.city = list[0].name;

          const province = state.provinceList.filter(function (province) {
            return province.code == list[0].province_code;
          });
          state.province = province[0].code;
        } else {
          state.province = "";
          state.city = "";
        }
      }

      if (props.data.note_cover) {
        state.fileList.push({
          url: props.data.note_cover,
        });
      }

      state.videoList.push({
        name: props.data.note_media_url,
        url: props.data.note_media_url,
      });
    };

    onMounted(() => {
      //   http.businessManagement.getNoteTopicList().then((res) => {
      //     if (res.data.err_code == 0) {
      //       state.topicList = res.data.data.topic_list;
      //     }
      //   });
      http.systemManagement.getDefaultLocationList().then((res) => {
        if (res.data.err_code == 0) {
          state.provinceList = res.data.data.provinces;
          state.allCity = res.data.data.cities;
        }
      });
    });

    return {
      ...toRefs(state),
      closeDialog,
      submitDialog,
      formRef,
      auth,
      changeProvince,
      changeCity,
      handleImageRemove,
      handlePictureCardPreview,
      handleHttp,
      handleAvatarSuccess,
      videoRemove,
      openDialog,
      videoHttp,
      videoSuccess,
    };
  },
};
</script>

<style lang="scss" scoped>
:deep(.el-select .el-input__inner) {
  height: 42px !important;
}
</style>
