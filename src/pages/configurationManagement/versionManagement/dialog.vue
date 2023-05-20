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
      <el-form-item
        :label="t('version.dialog.name')"
        prop="app_name"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input
          v-model="form.app_name"
          placeholder=""
          maxlength="80"
          show-word-limit
        />
      </el-form-item>
      <el-form-item
        :label="t('version.dialog.version_no')"
        prop="version"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input
          v-model="form.version"
          placeholder=""
          type="number"
          onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode == 46"
          @copy.prevent
          @paste.prevent
        />
      </el-form-item>
      <el-form-item :label="t('version.dialog.force')">
        <el-radio-group v-model.number="form.mode">
          <el-radio :label="1">{{ t("version.common") }}</el-radio>
          <el-radio :label="2">{{ t("version.force") }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="t('version.dialog.system')">
        <el-radio-group v-model.number="form.client">
          <el-radio :label="1">{{ t("version.andriod") }}</el-radio>
          <el-radio :label="2">{{ t("version.ios") }}</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- <el-form-item
        label="渠道ID"
        prop="channel_id"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input v-model="form.channel_id" placeholder="" />
      </el-form-item> -->

      <el-form-item
        :label="t('version.dialog.note')"
        prop="msg"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <!-- <el-input v-model="form.msg" placeholder="" /> -->
        <Editor
          v-model="form.msg"
          api-key="no-api-key"
          :init="{
            height: 400,
            plugins: [
              'advlist autolink lists style link image charmap print preview anchor colorpicker textcolor',
            ],
            toolbar: [
              'undo redo | h1 h2 h3 h4 h5 h6 | bold  italic | bullist numlist | alignleft aligncenter alignright |  outdent indent',
            ],
            menubar: false,
          }"
        />
      </el-form-item>

      <el-form-item
        :label="t('version.dialog.link')"
        prop="url"
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
        <el-input v-model="form.url" placeholder="" />
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
import Editor from "@tinymce/tinymce-vue";
export default {
  name: "Dialog",
  props: ["show", "title", "data"],
  emits: ["closed", "created"],
  components: {
    Editor,
  },
  setup(props, context) {
    const { t } = useI18n();
    const state = reactive({
      dialogTitle: "",
      form: {},
      fileList: [],
      doubleClick: false,
    });

    const formRef = ref();

    const closeDialog = (formRef) => {
      state.fileList = [];

      formRef.resetFields();
      context.emit("closed");
    };

    const submitDialog = (formRef) => {
      formRef.validate((valid) => {
        if (valid) {
          if (state.dialogTitle == t("common.addTo")) {
            state.doubleClick = true;
            state.form.status = 1;
            http.systemManagement.createVersion(state.form).then((res) => {
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
            http.systemManagement.updateVersion(state.form).then((res) => {
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

    const openDialog = () => {
      state.dialogTitle = props.title;
      state.form.version = props.data.version;
      state.form.pid = props.data.pid;
      state.form.version = props.data.version;
      state.form.client = props.data.client ?? 1;
      state.form.mode = props.data.mode ?? 1;
      state.form.url = props.data.url;
      state.form.channel_id = props.data.channel_id;
      state.form.msg = props.data.msg;
      state.form.status = props.data.status;
      state.form.app_name = props.data.app_name;
    };

    onMounted(() => {});

    return {
      ...toRefs(state),
      closeDialog,
      submitDialog,
      formRef,
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
