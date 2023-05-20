<template>
  <el-dialog
    :close-on-click-modal="false"
    :modelValue="show"
    @update:modelValue="show = $event"
    @close="closeDialog(formRef)"
    @open="openDialog"
    draggable
    :title="dialogTitle"
  >
    <el-form label-width="200px" ref="formRef" :model="form">
      <el-form-item
        :label="t(`advertises.ad_placement`)"
        prop="position"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-select
          :multiple="false"
          placeholder=""
          style="width: 100%"
          v-model="form.position"
          default-first-option
        >
          <el-option
            v-for="item in adSlotList"
            :key="item.type_id"
            :value="item.position"
            :label="findName(item.type_name)"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        :label="t(`advertises.advertisement_type`)"
        prop="advert_type"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-select
          :multiple="false"
          placeholder=""
          style="width: 100%"
          v-model="form.advert_type"
          default-first-option
        >
          <el-option
            v-for="item in typeList"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="t(`advertises.advertising_range`)">
        <el-radio-group v-model="form.client">
          <el-radio :label="0">{{ t(`common.all`) }}</el-radio>
          <el-radio :label="1">{{ t(`advertises.android`) }}</el-radio>
          <el-radio :label="2">IOS</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-tabs
        v-model="activeTab"
        class="tabs"
        type="card"
        v-if="form.advert_title.length > 0"
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
                  tabRequired == false && form.advert_title[index].content == ''
                    ? 'required-field'
                    : ''
                "
                >{{ lan.name }}</span
              >
            </span>
          </template>
          <el-form-item
            :label="t(`advertises.ad_title`)"
            :rules="[
              { required: true, message: t('error.required'), trigger: 'blur' },
            ]"
            :prop="`advert_title[${index}].content`"
          >
            <el-input
              v-model="form.advert_title[index].content"
              placeholder=""
              maxlength="40"
              show-word-limit
            />
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
      <!-- <el-form-item :label="t(`advertises.ad_title`)" prop="advert_title" :rules="[
        { required: true, message: t('error.required'), trigger: 'blur' },
      ]">
        <el-input v-model="form.advert_title" placeholder="" maxlength="40" show-word-limit />
      </el-form-item> -->

      <el-form-item
        :label="t(`advertises.ad_link`)"
        prop="url"
        v-if="
          form.advert_type !== 1 &&
          form.advert_type !== 3 &&
          form.advert_type !== 4 &&
          form.advert_type !== 5 &&
          form.advert_type !== 6
        "
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
          v-model="form.url"
          placeholder=""
          maxlength="120"
          show-word-limit
        />
      </el-form-item>

      <el-form-item
        :label="t(`advertises.module_id`)"
        prop="moduleID"
        v-if="form.advert_type == 4"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input
          v-model="form.moduleID"
          :placeholder="t('advertises.module_id_placeholder')"
          maxlength="40"
          show-word-limit
        />
      </el-form-item>

      <el-form-item
        v-if="form.advert_type == 6"
        :label="t(`advertises.resource_type`)"
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
        >
          <el-option
            v-for="item in resourceList"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="t(`advertises.ad_picture`)">
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

        <el-input
          v-model="form.image_path"
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
      <el-form-item
        :label="t(`advertises.tosort`)"
        prop="serial_no"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input
          v-model.number="form.serial_no"
          placeholder=""
          maxlength="20"
          show-word-limit
          type="number"
          min="0"
          onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode == 46"
          @copy.prevent
          @paste.prevent
        />
      </el-form-item>
      <div class="date-con">
        <el-form-item
          :label="t(`advertises.effective_time`)"
          prop="start_time"
          :rules="[
            { required: true, message: t('error.required'), trigger: 'blur' },
          ]"
        >
          <el-date-picker
            v-model="form.start_time"
            type="datetime"
            :placeholder="t('advertises.selectEffectiveTime')"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>

        <el-form-item
          :label="t(`advertises.expiration_time`)"
          prop="end_time"
          :rules="[
            { required: true, message: t('error.required'), trigger: 'blur' },
          ]"
        >
          <el-date-picker
            v-model="form.end_time"
            type="datetime"
            :placeholder="t('advertises.selectExpirationTime')"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
      </div>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog(formRef)">{{
          t(`common.close`)
        }}</el-button>
        <el-button
          class="app-button"
          @click="submitDialog(formRef)"
          :disabled="doubleClick"
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
import moment from "moment";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";
export default {
  name: "Dialog",
  props: ["show", "title", "data", "adSlotList"],
  emits: ["closed", "created"],
  setup(props, context) {
    const { t } = useI18n();
    const store = useStore();
    const state = reactive({
      dialogTitle: "",
      form: {
        image_path: "",
        params: [],
        advert_title: [],
      },
      fileList: [],
      languages: store.state.app.languages,
      activeTab: store.state.app.languages[0].short_name,
      adSlotList: [],
      typeList: [
        {
          value: 1,
          label: t(`advertises.pureImage`),
        },
        {
          value: 2,
          label: t("advertises.graphLink"),
        },
        {
          value: 3,
          label: t("advertises.graphic"),
        },
        {
          value: 4,
          label: t("advertises.moduleJump"),
        },
        {
          value: 5,
          label: t("advertises.videoAds"),
        },
        {
          value: 6,
          label: t("advertises.resource"),
        },
      ],
      resourceList: [
        // {
        //   value: 0,
        //   label: "选择类型",
        // },
        {
          value: 1,
          label: t("advertises.common"),
        },
        {
          value: 2,
          label: t("advertises.video"),
        },
        {
          value: 3,
          label: t("advertises.audio"),
        },
      ],
      doubleClick: false,
      activeRequired: 0,
      tabRequired: true,
    });

    const formRef = ref();

    const closeDialog = (formRef) => {
      state.fileList = [];
      state.form = {
        image_path: "",
        params: [],
        advert_title: [],
      };
      formRef.resetFields();
      context.emit("closed");
      state.tabRequired = true;
    };

    const submitDialog = (formRef) => {
      formRef.validate((valid) => {
        state.tabRequired = valid;
        if (valid) {
          if (
            moment(state.form.start_time).valueOf() >
            moment(state.form.end_time).valueOf()
          ) {
            ElMessage.error(t("advertises.timeError"));
            return;
          } else {
            if (state.form.advert_type == 4) {
              state.form.url = "";
              state.form.type = null;
            } else if (state.form.advert_type == 6) {
              state.form.params = [];
            } else {
              state.form.moduleID = "";
              state.form.type = null;
            }
            state.form.params = [
              { url: state.form.url, model: state.form.moduleID },
            ];
            state.form.moduleID = "";
            state.form.serial_no = parseInt(state.form.serial_no);
            state.form.status = state.form.status;
            if (state.dialogTitle == t(`advertises.add_new_ad`)) {
              state.doubleClick = true;
              state.form.client = parseInt(state.form.client);
              http.systemManagement.creatAD(state.form).then((res) => {
                if (res.data.err_code == 0) {
                  state.doubleClick = false;
                  closeDialog(formRef);
                  state.form = {
                    image_path: "",
                    params: [],
                    advert_title: [],
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
              state.form.client = parseInt(state.form.client);
              http.systemManagement.updateAd(state.form).then((res) => {
                if (res.data.err_code == 0) {
                  state.doubleClick = false;
                  closeDialog(formRef);
                  state.form = {
                    image_path: "",
                    params: [],
                    advert_title: [],
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
        } else {
          let contentLangList = state.form.advert_title.filter((item) => {
            return item.content == "";
          });
          if (contentLangList && contentLangList.length) {
            state.activeTab = contentLangList[0].lang;
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

    const findName = (data) => {
      const index = data.findIndex((x) => x.lang == store.state.user.lang);

      if (index !== -1) {
        return data[index].content;
      } else {
        return "--";
      }
    };

    const openLanTitleForm = (data) => {
      data.map((lan) => {
        return state.form.advert_title.push({
          lang: lan.short_name,
          content: "",
        });
      });
    };

    const editLanTitleForm = (data) => {
      data.map((lan) => {
        return state.form.advert_title.push({
          lang: lan.lang,
          content: lan.content,
        });
      });
    };
    const openDialog = () => {
      state.dialogTitle = props.title;
      state.adSlotList = props.adSlotList;
      state.form.advert_id = props.data.advert_id;
      console.log(props.data.advert_type);
      if (props.data.advert_type !== 0) {
        state.form.advert_type = props.data.advert_type;
      }

      state.form.client = props.data.client
        ? props.data.client.toString()
        : "0";
      // state.form.advert_title = props.data.advert_title;
      state.form.params = props.data.params;
      state.form.image_path = props.data.image_path;
      state.form.status = props.data.status ? props.data.status : 0;
      state.form.client = props.data.client;
      state.form.serial_no = props.data.serial_no;
      state.form.position = props.data.position;
      state.form.start_time = props.data.start_time + " 00:00:00";
      state.form.end_time = props.data.end_time + " 23:59:59";
      state.form.type = props.data.type !== 0 ? props.data.type : "";
      if (props.data.image_path) {
        state.fileList.push({
          url: props.data.image_path,
        });
      }
      if (state.form.params) {
        state.form.url = state.form.params[0]["url"];
        state.form.moduleID = state.form.params[0]["model"];
      }
      if (
        props.data.advert_title !== undefined &&
        props.data.advert_title.length > 0
      ) {
        editLanTitleForm(props.data.advert_title);
      } else {
        openLanTitleForm(state.languages);
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
      handleImageRemove,
      handlePictureCardPreview,
      handleHttp,
      handleAvatarSuccess,
      openDialog,
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

.date-con {
  display: flex;
  flex-wrap: wrap;
}
</style>
