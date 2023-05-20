<template>
  <el-dialog
    :modelValue="show"
    @update:modelValue="show = $event"
    @close="closeDialog(formRef)"
    @open="openDialog"
    draggable
    :title="dialogTitle"
    :close-on-click-modal="false"
    :data="dialogData"
  >
    <el-form label-width="150px" ref="formRef" :model="form">
      <el-form-item
        :label="t('defaultCity.dialog.province')"
        prop="province_code"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-select
          v-model="form.province_code"
          :placeholder="t('common.pleaseChoose')"
          @change="changeProvince"
        >
          <el-option
            v-for="item in provinceList"
            :key="item.province_code"
            :label="findName(item.province_name)"
            :value="item.province_code"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item
        :label="t('defaultCity.dialog.city')"
        prop="city_code"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-select
          v-model="form.city_code"
          :placeholder="t('common.pleaseChoose')"
          :disabled="disabled"
        >
          <el-option
            v-for="item in cityLists"
            :key="item.city_code"
            :label="findName(item.city_name)"
            :value="item.city_code"
          >
          </el-option>
        </el-select>
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
    const store = useStore();
    const state = reactive({
      dialogTitle: "",
      form: {
        city_code: "",
        province_code: "",
      },
      provinceList: [],
      allCity: [],
      cityLists: [],
      disabled: true,
      doubleClick: false,
      dialogData: {},
    });
    const { t } = useI18n();
    const formRef = ref();

    const closeDialog = (formRef) => {
      formRef.resetFields();
      context.emit("closed");
    };

    const submitDialog = (formRef) => {
      formRef.validate((valid) => {
        if (valid) {
          if (state.dialogTitle == t("common.addTo")) {
          } else {
            state.doubleClick = true;
            http.systemManagement
              .updateDefaultLocation(state.form)
              .then((res) => {
                if (res.data.err_code == 0) {
                  state.doubleClick = false;
                  closeDialog(formRef);
                  state.disabled = true;
                  state.form = {
                    city_code: "",
                    province_code: "",
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
      });
    };

    const changeProvince = () => {
      state.cityLists = [];
      state.disabled = false;
      const list = state.allCity.filter(function (city) {
        return city.province_code == state.form.province_code;
      });
      state.cityLists.push(...list);
    };

    const findName = (data) => {
      const index = data.findIndex((x) => x.lang == store.state.user.lang);

      if (index !== -1) {
        if (
          data[index].content == null ||
          data[index].content == "" ||
          data[index].content == undefined
        ) {
          return "--";
        }
        return data[index].content;
      } else {
        return "--";
      }
    };

    onMounted(() => {
      http.systemManagement.getDefaultLocationList().then((res) => {
        if (res.data.err_code == 0) {
          state.provinceList = res.data.data.provinces;
          state.allCity = res.data.data.cities;
        }
      });
    });

    const openDialog = () => {
      state.dialogData = props.data;
      state.dialogTitle = props.title;
      state.form.province_code = state.dialogData.province_code;
      state.form.city_code = state.dialogData.city_code;
    };

    return {
      ...toRefs(state),
      closeDialog,
      submitDialog,
      formRef,
      changeProvince,
      t,
      openDialog,
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
