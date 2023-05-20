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
    <el-form label-width="150px" ref="formRef" :model="form" :rules="rules">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item :label="$t(`common.userName`)" prop="user_name">
            <el-input
              v-model="form.user_name"
              placeholder=""
              maxlength="40"
              show-word-limit
            />
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item
            :label="$t(`user.profile_picture`)"
            prop="user_head_img"
          >
            <el-input
              v-model="form.user_head_img"
              placeholder=""
              style="margin-bottom: 20px"
              maxlength="120"
              show-word-limit
            />
            <div style="display: none" v-if="form.user_head_img">
              <photo-provider>
                <photo-consumer
                  :intro="form.user_head_img"
                  :key="form.user_head_img"
                  :src="form.user_head_img"
                  id="carousel-image"
                >
                  <img
                    :src="form.user_head_img"
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

            <div class="upload-section">
              <div>
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
                  <div class="old-upload">
                    <font-awesome-icon icon="fa-solid fa-upload" class="icon" />
                    <span class="text">{{ t(`user.local_upload`) }}</span>
                  </div>
                </el-upload>
              </div>

              <div>
                <div class="custom" @click="openServerDialog">
                  <font-awesome-icon
                    icon="fa-solid fa-cloud-arrow-up"
                    class="icon"
                  />
                  <span class="text">{{ t(`user.server_upload`) }}</span>
                </div>
              </div>
            </div>
          </el-form-item>
        </el-col>

        <!-- <el-col :span="24">
          <el-form-item label="用戶等級">
            <el-select v-model="form.user_level" placeholder="请选择用戶等級">
              <el-option
                v-for="item in level"
                :key="item.level_id"
                :label="item.level_name"
                :value="item.level_id"
                :default-first-option="true"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col> -->
        <el-col :span="24">
          <el-form-item :label="$t(`common.gender`)">
            <el-radio-group v-model.number="form.user_sex">
              <el-radio :label="1">{{ t(`common.female`) }}</el-radio>
              <el-radio :label="2">{{ t(`common.male`) }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="$t(`user.date_of_birth`)" prop="user_birth">
            <el-date-picker
              :disabled-date="disableDate"
              v-model="form.user_birth"
              type="date"
              :placeholder="$t(`user.please_enter`) + $t(`user.date_of_birth`)"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="$t(`user.signature`)">
            <el-input
              v-model="form.user_signature"
              :placeholder="$t(`user.please_enter`) + $t(`user.signature`)"
              type="textarea"
              rows="3"
              maxlength="200"
              show-word-limit
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="$t(`user.login_pass`)" prop="password">
            <el-input
              v-model="form.password"
              placeholder="******"
              type="password"
              show-password
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
        >
          {{ t(`common.sure`) }}</el-button
        >
      </span>
    </template>

    <el-dialog
      :close-on-click-modal="false"
      v-model="showServer"
      @close="closeServerDialog"
      @open="openServerDialog"
      draggable
      title="头像列表"
      width="70%"
    >
      <div class="image-row">
        <span
          class="image-list"
          v-for="item in avatarList"
          :key="item.id"
          @click="submitServerDialog(item)"
        >
          <img :src="item.avatar" :alt="item.avatar" class="image" />
        </span>
      </div>

      <template #footer>
        <!-- <span class="dialog-footer">
          <el-button @click="closeServerDialog">关闭</el-button>
          <el-button
            class="app-button"
            @click="submitServerDialog"  
            :disabled="doubleServerClick"
            >确定</el-button
          >
        </span> -->
      </template>
    </el-dialog>
  </el-dialog>
</template>

<script>
import { onMounted, reactive, toRefs, ref, computed } from "vue";
import http from "@/http";
import { ElMessage } from "element-plus";
import { DateOnly } from "@/utils/timeFormat.js";
import { useI18n } from "vue-i18n";
export default {
  name: "EditDialog",
  props: ["show", "title", "data", "level"],
  emits: ["closed", "created"],
  setup(props, context) {
    const state = reactive({
      dialogTitle: "",
      form: {},
      levelList: [],
      typeList: [
        {
          value: 1,
          label: "会员",
        },
        {
          value: 2,
          label: "代理",
        },
        {
          value: 3,
          label: "test account",
        },
      ],
      fileList: [],
      doubleClick: false,
      showServer: false,
      avatarList: [],
    });

    const formRef = ref();

    const validatePass = (rule, value, callback) => {
      if (
        typeof value !== "undefined" &&
        !/(?=^.{8,}$)(?=.*\d)(?![.\n])(?=.*[A-Z a-z]).*$/.test(value)
      ) {
        callback(new Error(t("error.password")));
      } else {
        callback();
      }
    };

    const rules = reactive({
      rules: {
        user_name: [{ required: true, message: "必填！", trigger: "blur" }],
        user_head_img: [{ required: true, message: "必填！", trigger: "blur" }],
        user_birth: [{ required: true, message: "必填！", trigger: "blur" }],
        password: [{ validator: validatePass, trigger: "blur" }],
      },
    });

    const disableDate = (dates) => {
      return dates > new Date();
    };

    const closeDialog = (formRef) => {
      state.form = {};
      state.fileList = [];
      formRef.resetFields();
      context.emit("closed");
    };

    const closeServerDialog = (formRef) => {
      state.showServer = false;
    };

    const openServerDialog = (formRef) => {
      state.showServer = true;

      http.systemManagement.getDefaultAvatar().then((res) => {
        state.avatarList = res.data.data.list;
      });
    };

    const submitServerDialog = (item) => {
      state.showServer = false;
      state.fileList = [];

      state.fileList.push({
        url: item.avatar,
      });
      state.form.user_head_img = item.avatar;
    };

    const submitDialog = (formRef) => {
      formRef.validate((valid) => {
        if (valid) {
          state.doubleClick = true;

          // state.form.nick_name = state.form.user_name;
          state.form.user_birth = DateOnly(state.form.user_birth);
          state.form.user_level = state.form.user_level
            ? state.form.user_level
            : 0;

          http.userManagement.updateUser(state.form).then((res) => {
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
      });
    };
    const { t } = useI18n();
    const handleImageRemove = (uploadFile, uploadFiles) => {
      state.form.user_head_img = "";
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
            state.form.user_head_img = res.data.data.file;
          }
        });
    };

    const handleAvatarSuccess = (response, file, fileList) => {
      if (fileList.length > 1) {
        fileList.shift();
      }
    };

    const openDialog = () => {
      state.dialogTitle = props.title;

      state.form.user_id = props.data.user_id;

      state.form.user_name = props.data.user_name;
      state.form.user_head_img = props.data.user_head_img;
      state.form.user_sex = props.data.user_sex;
      state.form.user_birth = props.data.user_birth;
      state.form.user_signature = props.data.user_signature;
      state.form.user_level =
        props.data.user_level !== 0 ? props.data.user_level : "";
      state.form.user_type = props.data.user_type;

      if (props.data.user_head_img) {
        state.fileList.push({
          url: props.data.user_head_img,
        });
      }
    };

    onMounted(() => {
      // http.userManagement.getUserLevel().then((res) => {
      //   if (res.data.err_code == 0) {
      //     state.levelList = res.data.data.users;
      //   }
      // });
    });

    return {
      ...toRefs(state),
      ...toRefs(rules),
      closeDialog,
      submitDialog,
      formRef,
      t,
      handleImageRemove,
      handlePictureCardPreview,
      handleHttp,
      handleAvatarSuccess,
      openDialog,
      closeServerDialog,
      openServerDialog,
      submitServerDialog,
      disableDate,
      userType: computed(() => (props.data.user_type == 2 ? true : false)),
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

.upload-section {
  display: flex;
}

.custom {
  margin-left: 10px;
  border: 1px dashed #cdd0d6;
  background: #fafafa;
  width: 148px;
  height: 148px;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    border: 1px dashed #409eff;

    .icon,
    .text {
      color: #409eff;
    }
  }

  .icon {
    font-size: 35px;
    margin: 30px auto 0;
    width: 100%;
  }

  .text {
    text-align: center;
    display: block;
  }
}

.old-upload {
  width: 148px;
  height: 148px;
  border-radius: 6px;
  cursor: pointer;

  .icon {
    font-size: 35px;
    margin: 30px auto 0;
    width: 100%;
  }

  .text {
    text-align: center;
    display: block;
  }
}

.image-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.image-list {
  cursor: pointer;
  margin: 10px;
  padding: 5px;
  border: 1px solid white;

  .image {
    width: 100px;
  }

  &:hover {
    border: 1px dashed #cdd0d6;
    border-radius: 6px;
  }
}

:deep(.el-form-item__error) {
  line-height: 1.3;
  letter-spacing: 1.5px;
}
</style>
