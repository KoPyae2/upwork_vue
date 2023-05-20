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
      <el-form-item
        :label="t('province.dialog.code')"
        prop="code"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input
          v-model="form.code"
          placeholder=""
          maxlength="20"
          onkeypress="return event.charCode >= 48 && event.charCode <= 57"
          @copy.prevent
          @paste.prevent
        />
      </el-form-item>

      <el-tabs
        v-model="activeTab"
        class="tabs"
        type="card"
        v-if="form.name.length > 0"
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
                  form.name[index].content == '' &&
                  form.short_name[index].content == ''
                    ? 'required-field'
                    : ''
                "
                >{{ lan.name }}</span
              >
            </span>
          </template>
          <el-form-item
            :label="t('province.dialog.name')"
            :prop="`name[${index}].content`"
            :rules="[
              { required: true, message: t('error.required'), trigger: 'blur' },
            ]"
          >
            <el-input
              v-model="form.name[index].content"
              placeholder=""
              maxlength="40"
              show-word-limit
            />
          </el-form-item>

          <el-form-item
            :label="t('province.dialog.abbreviation')"
            :prop="`short_name[${index}].content`"
            :rules="[
              { required: true, message: t('error.required'), trigger: 'blur' },
            ]"
          >
            <el-input
              v-model="form.short_name[index].content"
              placeholder=""
              maxlength="40"
              show-word-limit
            />
          </el-form-item>
        </el-tab-pane>
      </el-tabs>

      <el-form-item
        :label="t('province.dialog.lat')"
        prop="lat"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input
          v-model="form.lat"
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
        :label="t('province.dialog.lng')"
        prop="lng"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input
          v-model="form.lng"
          placeholder=""
          type="number"
          maxlength="20"
          min="0"
          onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode == 46"
          @copy.prevent
          @paste.prevent
        />
      </el-form-item>

      <!-- <el-form-item
        label="Memo"
        prop="memo"
        :rules="[{ required: true, message: t('error.required'), trigger: 'blur' }]"
      >
        <el-input
          v-model="form.memo"
          placeholder=""
          type="textarea"
          :rows="5"
        />
      </el-form-item>
      <el-form-item
        label="Tenant Code"
        prop="tenant_code"
        :rules="[{ required: true, message: t('error.required'), trigger: 'blur' }]"
      >
        <el-input v-model="form.tenant_code" placeholder="" />
      </el-form-item> -->
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
        name: [],
        short_name: [],
      },
      doubleClick: false,
      languages: store.state.app.languages,
      activeTab: store.state.app.languages[0].short_name,
      activeRequired: 0,
      tabRequired: true,
    });
    const { t } = useI18n();
    const formRef = ref();

    const closeDialog = (formRef) => {
      formRef.resetFields();
      context.emit("closed");

      state.form = {
        name: [],
        short_name: [],
      };
      state.activeTab = store.state.app.languages[0].short_name;
      state.tabRequired = true;
    };

    const submitDialog = (formRef) => {
      formRef.validate((valid) => {
        state.tabRequired = valid;
        if (valid) {
          if (state.dialogTitle == t("common.addTo")) {
            state.doubleClick = true;

            http.systemManagement.createProvinceList(state.form).then((res) => {
              if (res.data.err_code == 0) {
                state.doubleClick = false;
                closeDialog(formRef);
                state.form = {
                  name: [],
                  short_name: [],
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
            http.systemManagement.updateProvinceList(state.form).then((res) => {
              if (res.data.err_code == 0) {
                state.doubleClick = false;
                closeDialog(formRef);
                state.form = {
                  name: [],
                  short_name: [],
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
          let contentLangList = state.form.name.filter((item) => {
            return item.content == "";
          });
          if (contentLangList && contentLangList.length) {
            state.activeTab = contentLangList[0].lang;
          }
          let contentLangList2 = state.form.short_name.filter((item) => {
            return item.content == "";
          });
          if (contentLangList2 && contentLangList2.length) {
            state.activeTab = contentLangList2[0].lang;
          }
        }
      });
    };

    const openLanNameForm = (data) => {
      data.map((lan) => {
        return state.form.name.push({
          lang: lan.short_name,
          content: "",
        });
      });
    };

    const editLanNameForm = (data) => {
      if (data.length == state.languages.length) {
        state.form.name = data;
      } else {
        state.languages.map((item, index) => {
          if (data[index]) {
            state.form.name.push(data[index]);
          } else {
            state.form.name.push({
              lang: item.short_name,
              content: "",
            });
          }
          return;
        });
      }
    };

    const openLanShortForm = (data) => {
      data.map((lan) => {
        return state.form.short_name.push({
          lang: lan.short_name,
          content: "",
        });
      });
    };

    const editLanShortForm = (data) => {
      if (data.length == state.languages.length) {
        state.form.short_name = data;
      } else {
        state.languages.map((item, index) => {
          if (data[index]) {
            state.form.short_name.push(data[index]);
          } else {
            state.form.short_name.push({
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

      state.form.id = props.data.province_id;
      state.form.code = props.data.province_code;
      state.form.lat = props.data.lat;
      state.form.lng = props.data.lng;
      // state.form.memo = props.data.memo;

      // state.form.tenant_code = props.data.tenant_code;

      if (
        props.data.province_name !== undefined &&
        props.data.province_name.length > 0
      ) {
        editLanNameForm(props.data.province_name);
      } else {
        openLanNameForm(state.languages);
      }

      if (
        props.data.short_name !== undefined &&
        props.data.short_name.length > 0
      ) {
        editLanShortForm(props.data.short_name);
      } else {
        openLanShortForm(state.languages);
      }

      const default_lan = state.languages.findIndex((lan) => {
        return lan.status == 1;
      });
      if (default_lan !== -1) {
        state.activeTab = store.state.app.languages[default_lan].short_name;
        state.activeRequired = default_lan;
      }
    };

    onMounted(() => {
      // http.systemManagement.getDefaultLocationList().then((res) => {
      //   if (res.data.err_code == 0) {
      //     state.provinceList = res.data.data.provinces;
      //     state.form.province_code = res.data.data.provinces[0];
      //   }
      // });
    });

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
