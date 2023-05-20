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
        :label="t('noteResource.resourceTitle')"
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
        :label="t('noteResource.resourceTopic')"
        prop="topic_id"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-select
          :multiple="false"
          :placeholder="t('noteResource.selectTopic')"
          style="width: 100%"
          v-model="form.topic_id"
          default-first-option
        >
          <el-option
            v-for="item in topicList"
            :key="item.id"
            :value="item.id"
            :label="findName(item.name)"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        :label="t('noteResource.resourceContent')"
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

      <el-form-item :label="t('noteResource.resourceCover')">
        <div style="display: none">
          <photo-provider v-if="form.note_cover">
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
        <el-input
          v-model="form.note_cover"
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
      </el-form-item>
      <el-form-item :label="t('noteResource.resourceImage')">
        <div style="display: none">
          <photo-provider v-if="multipleList.length > 0">
            <photo-consumer
              v-for="img in multipleList"
              :intro="img.url"
              :key="img.url"
              :src="img.url"
              id="carousel-multi-image"
            >
              <img
                :src="img.url"
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
          :multiple="true"
          :on-remove="multipleRemove"
          :on-preview="multipleCardPreview"
          :on-success="multipleSuccess"
          :file-list="multipleList"
          :http-request="multipleHttp"
          accept="image/*"
        >
          <el-icon>+</el-icon>
        </el-upload>
      </el-form-item>

      <el-form-item :label="t('noteResource.provinceName')">
        <el-select
          :multiple="false"
          :placeholder="t('noteResource.selectProvinceName')"
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

      <el-form-item :label="t('noteResource.cityName')">
        <el-select
          :multiple="false"
          :placeholder="t('noteResource.selectCity')"
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

      <el-form-item :label="t('noteResource.manuallyAddReadingVolume')">
        <el-input
          v-model.number="form.fake_read_count"
          placeholder=""
          maxlength="9"
          show-word-limit
        />
      </el-form-item>

      <el-form-item :label="t('noteResource.manuallyAddLikes')">
        <el-input
          v-model.number="form.fake_like_count"
          placeholder=""
          maxlength="9"
          show-word-limit
        />
      </el-form-item>

      <el-form-item
        :label="t('noteResource.releaseTime')"
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

      <el-form-item :label="t('noteResource.fanGroupResource')">
        <el-radio-group v-model.number="form.group_id">
          <el-radio :label="0">{{ t("common.no") }}</el-radio>
          <el-radio :label="1">{{ t("common.yes") }}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog(formRef)">
          {{ t("common.close") }}</el-button
        >
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
    const { t } = useI18n();
    const state = reactive({
      dialogTitle: "",
      form: { note_type: 1 },
      fileList: [],
      multipleList: [],
      province: "",
      city: "",
      topicList: [],
      provinceList: [],
      allCity: [],
      cityLists: [],
      disabled: true,
      doubleClick: false,
    });
    const store = useStore();
    const formRef = ref();

    const closeDialog = (formRef) => {
      state.fileList = [];
      state.multipleList = [];
      state.disabled = true;
      formRef.resetFields();
      context.emit("closed");
    };
    const handlePictureCardPreview = () => {
      document.getElementById("carousel-image").click();
    };
    const submitDialog = (formRef) => {
      formRef.validate((valid) => {
        if (valid) {
          if (state.dialogTitle == t("common.addTo")) {
          } else {
            state.form.note_images = [];
            state.multipleList.map(function (tmp) {
              state.form.note_images.push(tmp.url);
            });
            state.doubleClick = true;
            if (state.form.fake_like_count == "") {
              state.form.fake_like_count = 0;
            }
            if (state.form.fake_read_count == "") {
              state.form.fake_read_count = 0;
            }

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

    //----------------------------------------------------multiple upload
    const multipleRemove = (uploadFile, uploadFiles) => {
      const list = state.multipleList.filter(function (image) {
        return image.name !== uploadFile.name;
      });
      state.multipleList = list;
    };

    const multipleCardPreview = (url) => {
      document.getElementById("carousel-multi-image").click();
    };
    const multipleHttp = (fileList) => {
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
            state.multipleList.push({
              name: fileList.file.name,
              url: res.data.data.file,
            });

            fileList.onSuccess();
          }
        });
    };
    const findName = (data) => {
      const index = data.findIndex((x) => x.lang == store.state.user.lang);

      if (index !== -1) {
        return data[index].content;
      } else {
        return "--";
      }
    };
    const multipleSuccess = (response, file, fileList) => {};

    const openDialog = () => {
      state.dialogTitle = props.title;
      state.form.note_id = props.data.note_id;
      state.form.note_title = props.data.note_title;
      state.form.topic_id = props.data.topic_id;
      state.form.note_content = props.data.note_content;

      state.form.group_id = props.data.group_id;
      state.form.position_at = props.data.position_at;
      state.form.note_cover = props.data.note_cover;
      state.form.note_thumbnail = props.data.note_thumbnail;
      state.form.fake_read_count = props.data.fake_read_count;
      state.form.fake_like_count = props.data.fake_like_count;
      state.form.status = props.data.status;

      // state.form.created_at = moment(props.data.created_at)
      //   .utcOffset(-90)
      //   .format("YYYY-MM-DD HH:mm:ss");

      state.form.created_at = props.data.created_at;

      state.form.note_type = 1;

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

      if (props.data.images && props.data.images.length) {
        props.data.images.forEach((element, index) => {
          state.multipleList.push({
            url: element,
            name: index,
          });
        });
      }
    };

    onMounted(() => {
      http.businessManagement.getNoteTopicTypeList().then((res) => {
        if (res.data.err_code == 0) {
          state.topicList = res.data.data;
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
      findName,
      t,
      ...toRefs(state),
      closeDialog,
      submitDialog,
      formRef,

      changeProvince,
      changeCity,
      handleImageRemove,
      handlePictureCardPreview,
      handleHttp,
      handleAvatarSuccess,
      multipleRemove,
      multipleCardPreview,
      multipleHttp,
      multipleSuccess,
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
