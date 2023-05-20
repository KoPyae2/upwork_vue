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
    <el-form label-width="150px" ref="formRef" :model="form">
      <el-tabs
        v-model="activeTab"
        class="tabs"
        type="card"
        v-if="form.payname.length > 0"
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
                  tabRequired == false && form.payname[index].content == ''
                    ? 'required-field'
                    : ''
                "
                >{{ lan.name }}</span
              >
            </span>
          </template>
          <el-form-item
            :label="t('paymentMethod.dialog.name')"
            :prop="`payname[${index}].content`"
            :rules="[
              { required: true, message: t('error.required'), trigger: 'blur' },
            ]"
          >
            <el-input
              v-model="form.payname[index].content"
              placeholder=""
              maxlength="40"
              show-word-limit
            />
          </el-form-item>
        </el-tab-pane>
      </el-tabs>

      <el-form-item
        :label="t('paymentMethod.dialog.icon')"
        prop="payicon"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input
          v-model="form.payicon"
          placeholder=""
          style="margin-bottom: 20px"
          maxlength="120"
          show-word-limit
        />
        <div style="display: none">
          <photo-provider v-if="form.payicon">
            <photo-consumer
              :intro="form.payicon"
              :key="form.payicon"
              :src="form.payicon"
              id="carousel-image"
            >
              <img
                :src="form.payicon"
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

      <el-form-item
        :label="t('paymentMethod.dialog.id')"
        prop="paytype"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input
          v-model="form.paytype"
          placeholder=""
          maxlength="40"
          show-word-limit
        />
      </el-form-item>

      <el-form-item
        :label="t('paymentMethod.dialog.background')"
        prop="paycolor"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input v-model="form.paycolor" placeholder="" />
      </el-form-item>

      <el-form-item
        :label="t('paymentMethod.dialog.default')"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-radio-group v-model="form.paydefault">
          <el-radio :label="1">{{ t("common.yes") }}</el-radio>
          <el-radio :label="0">{{ t("common.no") }}</el-radio>
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
    const store = useStore();
    const state = reactive({
      dialogTitle: "",
      form: {
        payname: [],
      },
      fileList: [],
      doubleClick: false,
      languages: store.state.app.languages,
      activeTab: store.state.app.languages[0].short_name,
      activeRequired: 0,
      tabRequired: true,
    });
    const { t } = useI18n();
    const formRef = ref();

    const closeDialog = (formRef) => {
      state.fileList = [];

      state.form = {
        payname: [],
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
          state.form.paytype = state.form.paytype.trim();

          if (state.dialogTitle == t("common.addTo")) {
            state.doubleClick = true;
            http.paymentManagement
              .createPaymentMethod(state.form)
              .then((res) => {
                if (res.data.err_code == 0) {
                  state.doubleClick = false;
                  closeDialog(formRef);
                  state.form = {
                    payname: [],
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
            http.paymentManagement
              .updatePaymentMethod(state.form)
              .then((res) => {
                if (res.data.err_code == 0) {
                  state.doubleClick = false;
                  closeDialog(formRef);
                  state.form = {
                    payname: [],
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
          let contentLangList = state.form.payname.filter((item) => {
            return item.content == "";
          });
          if (contentLangList && contentLangList.length) {
            state.activeTab = contentLangList[0].lang;
          }
        }
      });
    };

    const handleImageRemove = (uploadFile, uploadFiles) => {
      state.form.payicon = "";
    };

    const handlePictureCardPreview = () => {
      document.getElementById("carousel-image").click();
      // state.image_url = state.form.icon_url;
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
            state.form.payicon = res.data.data.file;
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
        return state.form.payname.push({
          lang: lan.short_name,
          content: "",
        });
      });
    };

    const editLanForm = (data) => {
      if (data.length == state.languages.length) {
        state.form.payname = data;
        let lans = state.languages.sort((a, b) => {
          return (
            state.form.payname.findIndex((p) => p.lang === a.short_name) -
            state.form.payname.findIndex((p) => p.lang === b.short_name)
          );
        });

        state.languages = lans;
      } else {
        state.languages.map((item, index) => {
          if (data[index]) {
            state.form.payname.push(data[index]);
          } else {
            state.form.payname.push({
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

      state.form.id = props.data.id;
      state.form.payicon = props.data.payicon;
      state.form.paycolor = props.data.paycolor;

      state.form.paytype = props.data.paytype;
      state.form.paystatus = props.data.paystatus;

      state.form.paydefault = props.data.paydefault == 1 ? 1 : 0;

      if (props.data.payicon) {
        state.fileList.push({
          url: props.data.payicon,
        });
      }

      if (props.data.payname !== undefined && props.data.payname.length > 0) {
        editLanForm(props.data.payname);
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
    };
  },
};
</script>

<style lang="scss" scoped>
:deep(.el-select .el-input__inner) {
  height: 42px !important;
}
</style>
