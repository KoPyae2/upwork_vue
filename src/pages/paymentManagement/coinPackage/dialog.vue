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
      <!-- <el-form-item
        :label="t('coinPackage.dialog.name')"
        prop="vip_points_type_name"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input
          v-model="form.vip_points_type_name"
          placeholder=""
          maxlength="80"
          show-word-limit
        />
      </el-form-item> -->

      <el-tabs
        v-if="form.vip_points_type_name && form.vip_points_type_name.length > 0"
        v-model="activeTab"
        class="tabs"
        type="card"
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
                  form.vip_points_type_name[index].content == ''
                    ? 'required-field'
                    : ''
                "
                >{{ lan.name }}</span
              >
            </span>
          </template>
          <el-form-item
            :label="t('coinPackage.dialog.name')"
            :rules="[
              {
                required: true,
                message: t('error.required'),
                trigger: 'blur',
              },
            ]"
            :prop="`vip_points_type_name[${index}].content`"
          >
            <el-input
              v-model="form.vip_points_type_name[index].content"
              placeholder=""
              maxlength="40"
              show-word-limit
            />
          </el-form-item>
        </el-tab-pane>
      </el-tabs>

      <el-form-item
        :label="t('coinPackage.dialog.quantity')"
        prop="vip_points"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input
          v-model.number="form.vip_points"
          placeholder=""
          type="number"
          min="0"
          onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode == 46"
          @copy.prevent
          @paste.prevent
        />
      </el-form-item>
      <el-form-item
        :label="t('coinPackage.dialog.price')"
        prop="vip_points_price"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input
          v-model.number="form.vip_points_price"
          placeholder=""
          type="number"
          min="0"
          onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode == 46"
          @copy.prevent
          @paste.prevent
        />
      </el-form-item>
      <el-form-item
        :label="t('coinPackage.dialog.original')"
        prop="vip_points_price_raw"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input
          v-model.number="form.vip_points_price_raw"
          placeholder=""
          type="number"
          min="0"
          onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode == 46"
          @copy.prevent
          @paste.prevent
        />
      </el-form-item>
      <el-form-item
        :label="t('coinPackage.dialog.gift')"
        prop="vip_points_add"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input
          v-model.number="form.vip_points_add"
          placeholder=""
          type="number"
          min="0"
          onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode == 46"
          @copy.prevent
          @paste.prevent
        />
      </el-form-item>
      <el-form-item :label="t('coinPackage.dialog.channel')">
        <el-input
          v-model="form.market_id"
          placeholder=""
          type="number"
          min="0"
          onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode == 46"
          @copy.prevent
          @paste.prevent
        />
      </el-form-item>

      <el-form-item :label="t('coinPackage.dialog.draw')">
        <el-input
          v-model.number="form.gift"
          placeholder=""
          type="number"
          min="0"
          onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode == 46"
          @copy.prevent
          @paste.prevent
        />
      </el-form-item>

      <el-form-item :label="t('coinPackage.dialog.sort')">
        <el-input
          v-model.number="form.vip_points_sort"
          placeholder=""
          type="number"
          min="0"
          onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode == 46"
          @copy.prevent
          @paste.prevent
        />
      </el-form-item>

      <el-form-item :label="t('coinPackage.dialog.default')">
        <el-radio-group v-model="form.is_default">
          <el-radio :label="1">{{ t("common.yes") }}</el-radio>
          <el-radio :label="0">{{ t("common.no") }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="t('coinPackage.dialog.recommend')">
        <el-radio-group v-model.number="form.is_recommend">
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
        vip_points_type_name: [],
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
      state.fileList = [];

      state.form = {
        vip_points_type_name: [],
      };

      formRef.resetFields();
      state.activeTab = store.state.app.languages[0].short_name;
      context.emit("closed");
      state.tabRequired = true;
    };

    const submitDialog = (formRef) => {
      formRef.validate((valid) => {
        state.tabRequired = valid;
        if (valid) {
          if (state.dialogTitle == t("common.addTo")) {
            state.doubleClick = true;

            state.form.vip_points_type = state.form.vip_points;
            http.paymentManagement.createCoinPackage(state.form).then((res) => {
              if (res.data.err_code == 0) {
                state.doubleClick = false;
                closeDialog(formRef);
                state.form = {};
                ElMessage.success(t(`error.${res.data.err_code}`));
                formRef.resetFields();
                context.emit("created");
                state.form = {
                  vip_points_type_name: [],
                };
              } else {
                state.doubleClick = false;

                ElMessage.error(t(`error.${res.data.err_code}`));
              }
            });
          } else {
            state.doubleClick = true;
            state.form.vip_points_type = state.form.vip_points;
            http.paymentManagement.updateCoinPackage(state.form).then((res) => {
              if (res.data.err_code == 0) {
                state.doubleClick = false;
                closeDialog(formRef);
                state.form = {};
                ElMessage.success(t(`error.${res.data.err_code}`));

                formRef.resetFields();
                state.form = {
                  vip_points_type_name: [],
                };
                context.emit("created");
              } else {
                state.doubleClick = false;

                ElMessage.error(t(`error.${res.data.err_code}`));
              }
            });
          }
        } else {
          let contentLangList = state.form.vip_points_type_name.filter(
            (item) => {
              return item.content == "";
            }
          );
          if (contentLangList && contentLangList.length) {
            state.activeTab = contentLangList[0].lang;
          }
        }
      });
    };

    const openLanForm = (data) => {
      console.log("Here is vip point in opern lan");
      data.map((lan) => {
        return state.form.vip_points_type_name.push({
          lang: lan.short_name,
          content: "",
        });
      });
    };

    const editLanForm = (data) => {
      if (data == null || data.length == 0) {
        openLanForm(state.languages);
      } else {
        if (data.length == state.languages.length) {
          state.form.vip_points_type_name = data;
          let lans = state.languages.sort((a, b) => {
            return (
              state.form.vip_points_type_name.findIndex(
                (p) => p.lang === a.short_name
              ) -
              state.form.vip_points_type_name.findIndex(
                (p) => p.lang === b.short_name
              )
            );
          });

          state.languages = lans;
        } else {
          state.languages.map((item, index) => {
            console.log(index);
            if (data[index]) {
              state.form.vip_points_type_name.push(data[index]);
            } else {
              state.form.vip_points_type_name.push({
                lang: item.short_name,
                content: "",
              });
            }
            return;
          });
        }
      }
    };

    const openDialog = () => {
      console.log(props.data.id);
      state.dialogTitle = props.title;

      state.form.id = props.data.id;
      state.form.vip_points = props.data.vip_points;
      state.form.vip_points_add = props.data.vip_points_add;
      state.form.vip_points_price = props.data.vip_points_price;
      state.form.vip_points_price_raw = props.data.vip_points_price_raw;
      state.form.vip_points_sort = props.data.vip_points_sort;
      // state.form.vip_points_type_name = props.data.vip_points_type_name;
      state.form.market_id = props.data.market_id;
      state.form.gift = props.data.gift;

      state.form.is_default = props.data.is_default ?? 0;
      state.form.is_recommend = props.data.is_recommend ?? 0;

      if (
        // props.data.vip_points_type_name !== undefined &&
        // props.data.vip_points_type_name.length > 0
        props.data.id
      ) {
        editLanForm(props.data.vip_points_type_name);
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
    };
  },
};
</script>

<style lang="scss" scoped>
:deep(.el-select .el-input__inner) {
  height: 42px !important;
}
</style>
