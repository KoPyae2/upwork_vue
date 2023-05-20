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
      <el-row>
        <el-col :span="24">
          <el-form-item
            :label="$t(`user.carousel`)"
            prop="level_icon"
            :rules="[
              { required: true, message: t('error.required'), trigger: 'blur' },
            ]"
          >
            <el-input
              v-model="form.level_icon"
              placeholder="Image link"
              maxlength="120"
              show-word-limit
              style="margin-bottom: 20px"
            />
            <div style="display: none">
              <photo-provider v-if="form.level_icon">
                <photo-consumer
                  :intro="form.level_icon"
                  :key="form.level_icon"
                  :src="form.level_icon"
                  id="carousel-image"
                >
                  <img
                    :src="form.level_icon"
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
        </el-col>

        <el-col :span="24">
          <el-tabs
            v-model="activeTab"
            class="tabs"
            type="card"
            v-if="form.level_name.length > 0"
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
                      form.level_name[index].content == ''
                        ? 'required-field'
                        : ''
                    "
                    >{{ lan.name }}</span
                  >
                </span>
              </template>
              <el-form-item
                :label="$t(`user.grade`)"
                :prop="`level_name[${index}].content`"
                :rules="[
                  {
                    required: true,
                    message: t('error.required'),
                    trigger: 'blur',
                  },
                ]"
              >
                <el-input
                  v-model="form.level_name[index].content"
                  placeholder=""
                  maxlength="40"
                  show-word-limit
                />
              </el-form-item>
            </el-tab-pane>
          </el-tabs>
        </el-col>

        <el-col :span="12">
          <el-form-item
            :label="$t(`user.classID`)"
            prop="user_level"
            :rules="[
              { required: true, message: t('error.required'), trigger: 'blur' },
            ]"
          >
            <el-input
              v-model.number="form.user_level"
              placeholder=""
              type="number"
              min="0"
              onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode == 46"
              @copy.prevent
              @paste.prevent
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item
            :label="$t(`user.publish_resource`)"
            prop="release_note"
            :rules="[
              { required: true, message: t('error.required'), trigger: 'blur' },
            ]"
          >
            <el-input
              v-model.number="form.release_note"
              placeholder=""
              type="number"
              min="0"
              onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode == 46"
              @copy.prevent
              @paste.prevent
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            :label="$t(`user.get_like`)"
            prop="be_liked"
            :rules="[
              { required: true, message: t('error.required'), trigger: 'blur' },
            ]"
          >
            <el-input
              v-model.number="form.be_liked"
              placeholder=""
              type="number"
              min="0"
              onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode == 46"
              @copy.prevent
              @paste.prevent
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            :label="$t(`user.get_cmt`)"
            prop="be_comment"
            :rules="[
              { required: true, message: t('error.required'), trigger: 'blur' },
            ]"
          >
            <el-input
              v-model.number="form.be_comment"
              placeholder=""
              type="number"
              min="0"
              onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode == 46"
              @copy.prevent
              @paste.prevent
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            :label="$t(`user.follow_fan`)"
            prop="be_followed"
            :rules="[
              { required: true, message: t('error.required'), trigger: 'blur' },
            ]"
          >
            <el-input
              v-model.number="form.be_followed"
              placeholder=""
              type="number"
              min="0"
              onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode == 46"
              @copy.prevent
              @paste.prevent
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            :label="$t(`user.unlock_times`)"
            prop="be_unlocked"
            :rules="[
              { required: true, message: t('error.required'), trigger: 'blur' },
            ]"
          >
            <el-input
              v-model.number="form.be_unlocked"
              placeholder=""
              type="number"
              min="0"
              onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode == 46"
              @copy.prevent
              @paste.prevent
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            :label="$t(`user.focus_topic`)"
            prop="follow_topics"
            :rules="[
              { required: true, message: t('error.required'), trigger: 'blur' },
            ]"
          >
            <el-input
              v-model.number="form.follow_topics"
              placeholder=""
              type="number"
              min="0"
              onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode == 46"
              @copy.prevent
              @paste.prevent
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            :label="$t(`user.like_resource`)"
            prop="liked_number"
            :rules="[
              { required: true, message: t('error.required'), trigger: 'blur' },
            ]"
          >
            <el-input
              v-model.number="form.liked_number"
              placeholder=""
              type="number"
              min="0"
              onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode == 46"
              @copy.prevent
              @paste.prevent
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            :label="$t(`user.comment`)"
            prop="release_comment"
            :rules="[
              { required: true, message: t('error.required'), trigger: 'blur' },
            ]"
          >
            <el-input
              v-model.number="form.release_comment"
              placeholder=""
              type="number"
              min="0"
              onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode == 46"
              @copy.prevent
              @paste.prevent
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            :label="$t(`user.follow_user`)"
            prop="follow_users"
            :rules="[
              { required: true, message: t('error.required'), trigger: 'blur' },
            ]"
          >
            <el-input
              v-model.number="form.follow_users"
              placeholder=""
              type="number"
              min="0"
              onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode == 46"
              @copy.prevent
              @paste.prevent
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            :label="$t(`user.unlock_resource_times`)"
            prop="unlock_notes"
            :rules="[
              { required: true, message: t('error.required'), trigger: 'blur' },
            ]"
          >
            <el-input
              v-model.number="form.unlock_notes"
              placeholder=""
              type="number"
              min="0"
              onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode == 46"
              @copy.prevent
              @paste.prevent
            />
          </el-form-item>
        </el-col>
      </el-row>
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
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";

export default {
  name: "Dialog",
  props: ["show", "title", "data"],
  emits: ["closed", "created", "updated"],
  setup(props, context) {
    const store = useStore();
    const state = reactive({
      dialogTitle: "",
      form: {
        level_name: [],
      },
      fileList: [],
      backgroundList: [],
      profileList: [],
      doubleClick: false,
      languages: store.state.app.languages,
      activeTab: store.state.app.languages[0].short_name,
      activeRequired: 0,
      tabRequired: true,
    });

    const formRef = ref();

    const closeDialog = (formRef) => {
      state.fileList = [];
      state.backgroundList = [];
      state.profileList = [];

      state.form = {
        level_name: [],
      };
      state.activeTab = store.state.app.languages[0].short_name;

      formRef.resetFields();
      context.emit("closed");
      state.tabRequired = true;
    };
    const { t } = useI18n();
    const submitDialog = (formRef) => {
      formRef.validate((valid) => {
        state.tabRequired = valid;
        if (valid) {
          if (state.dialogTitle == t(`common.addTo`)) {
            state.doubleClick = true;
            http.userManagement.createUserLevel(state.form).then((res) => {
              if (res.data.err_code == 0) {
                state.doubleClick = false;
                closeDialog(formRef);
                state.form = {
                  level_name: [],
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
            http.userManagement.updateUserLevel(state.form).then((res) => {
              if (res.data.err_code == 0) {
                state.doubleClick = false;
                closeDialog(formRef);
                state.form = {
                  level_name: [],
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
          let contentLangList = state.form.level_name.filter((item) => {
            return item.content == "";
          });
          if (contentLangList && contentLangList.length) {
            state.activeTab = contentLangList[0].lang;
          }
        }
      });
    };

    const handleImageRemove = (uploadFile, uploadFiles) => {
      state.form.level_icon = "";
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
            state.form.level_icon = res.data.data.file;
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
        return state.form.level_name.push({
          lang: lan.short_name,
          content: "",
        });
      });
    };

    const editLanForm = (data) => {
      if (data.length == state.languages.length) {
        state.form.level_name = data;
        let lans = state.languages.sort((a, b) => {
          return (
            state.form.level_name.findIndex((p) => p.lang === a.short_name) -
            state.form.level_name.findIndex((p) => p.lang === b.short_name)
          );
        });

        state.languages = lans;
      } else {
        state.languages.map((item, index) => {
          if (data[index]) {
            state.form.level_name.push(data[index]);
          } else {
            state.form.level_name.push({
              lang: item.short_name,
              content: "",
            });
          }
          return;
        });
      }
    };

    const openDialog = async () => {
      state.dialogTitle = props.title;
      state.form.level_id = props.data.level_id;
      state.form.be_comment = props.data.be_comment;
      state.form.be_followed = props.data.be_followed;
      state.form.be_liked = props.data.be_liked;
      state.form.be_unlocked = props.data.be_unlocked;
      state.form.follow_topics = props.data.follow_topics;
      state.form.follow_users = props.data.follow_users;
      state.form.level_icon = props.data.level_icon;
      state.form.liked_number = props.data.liked_number;
      state.form.min_amount = props.data.min_amount;
      state.form.release_comment = props.data.release_comment;
      state.form.release_note = props.data.release_note;
      state.form.unlock_notes = props.data.unlock_notes;
      state.form.user_level = props.data.user_level;
      state.form.is_default = props.data.is_default ?? 0;

      if (props.data.level_icon) {
        state.fileList.push({
          url: props.data.level_icon,
        });
      }

      if (
        props.data.level_name !== undefined &&
        props.data.level_name.length > 0
      ) {
        editLanForm(props.data.level_name);
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

.danger {
  color: #f56c6c;
}
</style>
