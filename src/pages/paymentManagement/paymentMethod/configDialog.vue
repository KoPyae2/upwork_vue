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
                  tabRequired == false && form.name[index].content == ''
                    ? 'required-field'
                    : ''
                "
                >{{ lan.name }}</span
              >
            </span>
          </template>
          <el-form-item
            :label="t('paymentMethod.dialog.n_name')"
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
        </el-tab-pane>
      </el-tabs>
      <el-form-item
        :label="t('paymentMethod.dialog.gate_no')"
        prop="gateway_id"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-select
          :multiple="false"
          placeholder=""
          style="width: 100%"
          v-model="form.gateway_id"
          default-first-option
        >
          <el-option
            v-for="item in gatewayList"
            :key="item.id"
            :value="item.id"
            :label="findName(item.payname)"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        :label="t('paymentMethod.dialog.code')"
        prop="code"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input
          v-model="form.code"
          placeholder=""
          maxlength="40"
          show-word-limit
          min="0"
          onkeypress="return event.charCode >= 48 && event.charCode <= 57"
          @copy.prevent
          @paste.prevent
          :disabled="dialogTitle != t('common.addTo')"
        />
      </el-form-item>
      <el-form-item
        :label="t('paymentMethod.dialog.merchant_id')"
        prop="mchid"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input
          v-model="form.mchid"
          placeholder=""
          maxlength="150"
          show-word-limit
          min="0"
          onkeypress="return event.charCode >= 48 && event.charCode <= 57"
          @copy.prevent
          @paste.prevent
          :disabled="dialogTitle != t('common.addTo')"
        />
      </el-form-item>

      <el-form-item
        :label="t('paymentMethod.dialog.merchant_key')"
        prop="mchkey"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input
          v-model="form.mchkey"
          placeholder=""
          maxlength="150"
          show-word-limit
          :disabled="dialogTitle != t('common.addTo')"
        />
      </el-form-item>

      <el-form-item
        :label="t('paymentMethod.dialog.secret')"
        prop="mchserect"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input
          v-model="form.mchserect"
          placeholder=""
          maxlength="150"
          show-word-limit
          :disabled="dialogTitle != t('common.addTo')"
        />
      </el-form-item>

      <el-form-item
        :label="t('paymentMethod.dialog.gate_url')"
        prop="gateway_url"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input
          v-model="form.gateway_url"
          placeholder=""
          maxlength="150"
          show-word-limit
          :disabled="dialogTitle != t('common.addTo')"
        />
      </el-form-item>

      <el-form-item
        :label="t('paymentMethod.dialog.callback')"
        prop="callback_url"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input
          v-model="form.callback_url"
          placeholder=""
          maxlength="150"
          show-word-limit
          :disabled="dialogTitle != t('common.addTo')"
        />
      </el-form-item>

      <el-form-item
        :label="t('paymentMethod.dialog.noti_url')"
        prop="notify_url"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input
          v-model="form.notify_url"
          placeholder=""
          maxlength="150"
          :disabled="dialogTitle != t('common.addTo')"
          show-word-limit
        />
      </el-form-item>

      <el-form-item
        :label="t('paymentMethod.dialog.sort')"
        prop="psort"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input
          v-model.number="form.psort"
          placeholder=""
          maxlength="40"
          show-word-limit
          min="0"
          onkeypress="return event.charCode >= 48 && event.charCode <= 57"
          @copy.prevent
          @paste.prevent
        />
      </el-form-item>

      <el-form-item
        :label="t('paymentMethod.dialog.weight')"
        prop="pweight"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input
          v-model.number="form.pweight"
          placeholder=""
          maxlength="40"
          show-word-limit
          min="0"
          onkeypress="return event.charCode >= 48 && event.charCode <= 57"
          @copy.prevent
          @paste.prevent
        />
      </el-form-item>
      <el-form-item
        :label="t('paymentMethod.dialog.config_price')"
        prop="price_config"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input
          v-model="form.price_config"
          placeholder=""
          min="0"
          onkeypress="return event.charCode >= 48 && event.charCode <= 57"
          @copy.prevent
          @paste.prevent
        />
      </el-form-item>

      <!-- <el-form-item
        label="网关编号"
        prop="gateway_id"
        :rules="[{ required: true, message: t('error.required'), trigger: 'blur' }]"
      >
        <el-input
          v-model.number="form.gateway_id"
          placeholder=""
          maxlength="40"
          show-word-limit
          min="0"
          onkeypress="return event.charCode >= 48 && event.charCode <= 57"
          @copy.prevent
          @paste.prevent
          :disabled="dialogTitle != '添加'"
        />
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
  name: "ConfigDialog",
  props: ["show", "title", "data", "paytype"],
  emits: ["closed", "created"],
  setup(props, context) {
    const store = useStore();
    const state = reactive({
      dialogTitle: "",
      form: {
        name: [],
      },
      fileList: [],
      doubleClick: false,
      gatewayList: [],
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
        name: [],
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
          state.form.price_rate = "0.3";
          state.form.is_raw = 1;
          state.form.return_url = state.form.callback_url;

          if (state.dialogTitle == t("common.addTo")) {
            state.doubleClick = true;

            http.paymentManagement
              .createPaymentChannel(state.form)
              .then((res) => {
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
            http.paymentManagement
              .updatePaymentChannel(state.form)
              .then((res) => {
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
        } else {
          let contentLangList = state.form.name.filter((item) => {
            return item.content == "";
          });
          if (contentLangList && contentLangList.length) {
            state.activeTab = contentLangList[0].lang;
          }
        }
      });
    };

    const openLanForm = (data) => {
      data.map((lan) => {
        return state.form.name.push({
          lang: lan.short_name,
          content: "",
        });
      });
    };

    const editLanForm = (data) => {
      if (data.length == state.languages.length) {
        state.form.name = data;
        let lans = state.languages.sort((a, b) => {
          return (
            state.form.name.findIndex((p) => p.lang === a.short_name) -
            state.form.name.findIndex((p) => p.lang === b.short_name)
          );
        });

        state.languages = lans;
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

      state.form.id = props.data.id;
      state.form.paytype = props.paytype;

      state.form.mchid = props.data.mchid;
      state.form.mchkey = props.data.mchkey;
      state.form.mchserect = props.data.mchserect;

      state.form.mode = props.data.mode;
      state.form.code = props.data.code;
      state.form.product_id = props.data.product_id;
      state.form.gateway_url = props.data.gateway_url;
      state.form.callback_url = props.data.callback_url;
      state.form.return_url = props.data.return_url;
      state.form.notify_url = props.data.notify_url;
      state.form.psort = props.data.psort;
      state.form.pweight = props.data.pweight;
      state.form.price_config = props.data.price_config;
      state.form.price_rate = props.data.price_rate;
      state.form.is_raw = props.data.is_raw;

      http.paymentManagement.getPaymentGateway().then((res) => {
        if (res.data.err_code == 0) {
          state.gatewayList = res.data.data.data;
          state.form.gateway_id = props.data.gateway_id;
        }
      });

      if (props.data.name !== undefined && props.data.name.length > 0) {
        editLanForm(props.data.name);
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
</style>
