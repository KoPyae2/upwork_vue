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
        :label="t(`advertises.advertise_logo`)"
        prop="position"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input
          v-model="form.position"
          placeholder=""
          :disabled="dialogTitle != t(`common.addTo`)"
          maxlength="40"
          show-word-limit
        />
      </el-form-item>

      <el-tabs
        v-model="activeTab"
        class="tabs"
        type="card"
        v-if="form.type_name.length > 0"
      >
        <el-tab-pane
          v-for="(lan, index) in languages"
          :key="lan.id"
          :label="lan.name"
          :name="lan.short_name"
        >
          <template #label>
            <span class="custom-tabs-label">
              <!-- style="color: red" -->
              <span
                :class="
                  tabRequired == false && form.type_name[index].content == ''
                    ? 'required-field'
                    : ''
                "
                >{{ lan.name }}</span
              >
            </span>
          </template>
          <el-form-item
            :label="t(`advertises.ad_slot_name`)"
            :prop="`type_name[${index}].content`"
            :rules="[
              { required: true, message: t('error.required'), trigger: 'blur' },
            ]"
          >
            <el-input
              v-model="form.type_name[index].content"
              placeholder=""
              maxlength="40"
              show-word-limit
            />
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
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
import { onMounted, reactive, toRefs, ref} from "vue";
import http from "@/http";
import { ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";

export default {
  name: "AddAdSlot",
  props: ["show", "title", "data"],
  emits: ["closed", "created"],
  setup(props, context) {
    const store = useStore();
    const state = reactive({
      dialogTitle: "",
      form: {
        status: 1,
        type_name: [],
      },
      doubleClick: false,
      languages: store.state.app.languages,
      activeTab: store.state.app.languages[0].short_name,
      activeRequired: 0,
      tabRequired: true,
    });

    const formRef = ref();

    const closeDialog = (formRef) => {
      formRef.resetFields();
      state.form = {
        type_name: [],
      };
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
            http.systemManagement.creatADSlot(state.form).then((res) => {
              if (res.data.err_code == 0) {
                state.doubleClick = false;

                closeDialog(formRef);
                state.form = {
                  type_name: [],
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
            http.systemManagement.updateAdSlot(state.form).then((res) => {
              if (res.data.err_code == 0) {
                state.doubleClick = false;
                closeDialog(formRef);
                state.form = {
                  type_name: [],
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
          let contentLangList = state.form.type_name.filter((item) => {
            return item.content == "";
          });
          if (contentLangList && contentLangList.length) {
            state.activeTab = contentLangList[0].lang;
          }
        }
      });
    };

    const openLanNameForm = (data) => {
      data.map((lan) => {
        return state.form.type_name.push({
          lang: lan.short_name,
          content: "",
        });
      });
    };

    const editLanNameForm = (data) => {
      data.map((lan) => {
        return state.form.type_name.push({
          lang: lan.lang,
          content: lan.content,
        });
      });
    };
    const openDialog = () => {
      state.dialogTitle = props.title;
      state.form.type_id = props.data.type_id;
      state.form.position = props.data.position;
      state.form.status = props.data.status;
      if (
        props.data.type_name !== undefined &&
        props.data.type_name.length > 0
      ) {
        editLanNameForm(props.data.type_name);
      } else {
        openLanNameForm(state.languages);
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
      openDialog,
      formRef,
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
