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
    <el-form label-width="200px" ref="formRef" :model="form">
      <el-form-item
        :label="$t(`user.resource_title`)"
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
      <el-form-item
        :label="$t(`user.resource_topic`)"
        prop="topic_id"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-select
          :multiple="false"
          :placeholder="
            $t(`user.please_select`) + '' + $t(`user.resource_topic`)
          "
          style="width: 100%"
          v-model="form.topic_id"
          default-first-option
        >
          <el-option
            v-for="item in topicList"
            :key="item.topic_id"
            :value="item.topic_id"
            :label="findName(item.topic_name)"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        :label="$t(`user.resource_content`)"
        prop="note_content"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input
          v-model="form.note_content"
          placeholder=""
          type="textarea"
          :rows="3"
          maxlength="200"
          show-word-limit
        />
      </el-form-item>
      <el-form-item :label="$t(`user.resource_cover`)">
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
      <el-form-item :label="$t(`user.resource_cover`)">
        <div>
          <div style="display: none">
            <photo-provider v-if="form.note_vod_image_2">
              <photo-consumer
                :intro="form.note_vod_image_2"
                :key="form.note_vod_image_2"
                :src="form.note_vod_image_2"
                id="carousel-image"
              >
                <img
                  :src="form.note_vod_image_2"
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
            v-model="form.note_vod_image_2"
            placeholder="Image link"
            style="margin-bottom: 20px"
            maxlength="120"
            show-word-limit
          />
          <el-upload
            list-type="picture-card"
            :multiple="false"
            :on-remove="handleVerticalImageRemove"
            :on-preview="handleVerticalPictureCardPreview"
            :on-success="handleVerticalAvatarSuccess"
            :file-list="fileVerticalList"
            :limit="2"
            :http-request="handleVerticalHttp"
            accept="image/*"
          >
            <el-icon>+</el-icon>
          </el-upload>
        </div>
      </el-form-item>
      <el-form-item
        :label="$t(`user.resource_vid`)"
        prop="note_media_url"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input
          v-model="form.note_media_url"
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
          资源视频
          accept="video/*"
        >
          <el-button size="small" type="primary"
            >+ {{ t("user.clickToUpload") }}</el-button
          >
          <!-- <el-icon>+</el-icon> -->
        </el-upload>
      </el-form-item>

      <el-form-item :label="$t(`user.province_name`)">
        <el-select
          :multiple="false"
          :placeholder="$t(`user.please_select`) + $t(`user.province_name`)"
          style="width: 100%"
          v-model="province"
          default-first-option
          @change="changeProvince"
        >
          <el-option
            v-for="item in provinceList"
            :key="item.province_code"
            :value="item.province_code"
            :label="findName(item.province_name)"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="$t(`user.city_name`)">
        <el-select
          :multiple="false"
          :placeholder="$t(`user.please_select`) + $t(`user.city_name`)"
          style="width: 100%"
          v-model="city"
          :disabled="disabled"
          @change="changeCity"
        >
          <el-option
            v-for="item in cityLists"
            :key="item.city_code"
            :value="item.city_code"
            :label="findName(item.city_name)"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="$t(`user.add_reading_volume`)">
        <el-input
          v-model.number="form.fake_read_count"
          placeholder=""
          maxlength="9"
          show-word-limit
        />
      </el-form-item>

      <el-form-item :label="$t(`user.add_likes`)">
        <el-input
          v-model.number="form.fake_like_count"
          placeholder=""
          maxlength="9"
          show-word-limit
        />
      </el-form-item>

      <el-form-item
        :label="$t(`user.release_time`)"
        style="width: auto"
        prop="created_at"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-date-picker
          v-model="form.created_at"
          type="datetime"
          placeholder=""
          format="YYYY/MM/DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>

      <el-form-item :label="$t(`user.fan_group_resource`)">
        <el-radio-group v-model.number="form.group_id">
          <el-radio :label="0">{{ t("common.no") }}</el-radio>
          <el-radio :label="1">{{ t("common.yes") }}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog(formRef)">{{
          t(`common.close`)
        }}</el-button>
        <el-button
          class="app-button"
          @click="submitDialog(formRef)"
          :disabled="stillUploaded || doubleClick"
          >{{ t(`common.sure`) }}</el-button
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
import { useStore } from "vuex";

export default {
  name: "longVideoDialog",
  props: ["show", "title", "data"],
  emits: ["closed", "created"],
  setup(props, context) {
    const route = useRoute();
    const store = useStore();

    const state = reactive({
      dialogTitle: "",
      form: {
        group_id: 0,
        note_type: 4,
        user_id: route.params.id,
      },

      fileList: [],
      videoList: [],
      fileVerticalList: [],
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
    const { t } = useI18n();
    const closeDialog = (formRef) => {
      state.fileVerticalList = [];

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
          if (state.dialogTitle == t("common.addTo")) {
            state.doubleClick = true;
            http.businessManagement.createNoteList(state.form).then((res) => {
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
        return city.city_code == state.city;
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

    // ----------------------------------------------------vertical upload

    const handleVerticalImageRemove = (uploadFile, uploadFiles) => {
      state.form.note_vod_image_2 = "";
    };

    const handleVerticalPictureCardPreview = () => {
      document.getElementById("carousel-image").click();
    };

    const handleVerticalHttp = (fileList) => {
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
            state.form.note_vod_image_2 = res.data.data.file;
          }
          5;
        });
    };

    const handleVerticalAvatarSuccess = (response, file, fileList) => {
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

    const findName = (data) => {
      const index = data.findIndex((x) => x.lang == store.state.user.lang);

      if (index !== -1) {
        return data[index].content;
      } else {
        return "--";
      }
    };

    const openDialog = () => {
      state.dialogTitle = props.title;

      state.form.note_id = props.data.note_id;
      state.form.note_title = props.data.note_title;
      state.form.topic_id = props.data.topic_id;
      state.form.note_content = props.data.note_content;

      state.form.position_at = props.data.position_at;
      state.form.note_cover = props.data.note_cover;
      state.form.note_thumbnail = props.data.note_thumbnail;
      state.form.note_media_url = props.data.note_media_url;
      state.form.note_vod_image_2 = props.data.note_vod_image_2;

      state.form.fake_read_count = props.data.fake_read_count;
      state.form.fake_like_count = props.data.fake_like_count;
      state.form.status = props.data.status;

      state.form.group_id = props.data.group_id ?? state.form.group_id;
      state.form.note_type = 4;
      state.form.user_id = props.data.user_id
        ? props.data.user_id
        : route.params.id;
      state.form.created_at = props.data.created_at;

      if (props.data.position_at) {
        const [lat, lng] = state.form.position_at.split(",");
        const list = state.allCity.filter(function (city) {
          return city.lat == lat && city.lng == lng;
        });

        if (list.length > 0) {
          state.city = findName(list[0].city_name);

          const province = state.provinceList.filter(function (province) {
            return province.province_code == list[0].province_code;
          });
          state.province = province[0].province_code;
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

      if (props.data.note_media_url) {
        state.videoList.push({
          name: props.data.note_media_url,
          url: props.data.note_media_url,
        });
      }
    };

    onMounted(() => {
      http.businessManagement
        .getNoteLongVideoTopic({ status: 1 })
        .then((res) => {
          if (res.data.err_code == 0) {
            state.topicList = res.data.data.video_topics;
          }
        });
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
      handleVerticalImageRemove,
      handleVerticalPictureCardPreview,
      handleVerticalHttp,
      handleVerticalAvatarSuccess,
      videoRemove,
      openDialog,
      videoHttp,
      videoSuccess,
      t,
      findName,
    };
  },
};
</script>

<style lang="scss" scoped>
:deep(.el-select .el-input__inner) {
  height: 42px !important;
}
</style>
