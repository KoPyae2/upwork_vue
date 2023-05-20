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
    <el-form label-width="180px" ref="formRef" :model="form">
      <el-form-item
        :label="$t(`user.account_flag`)"
        prop="is_authed"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-select
          :multiple="false"
          placeholder=""
          style="width: 100%"
          v-model="form.is_authed"
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
      <el-form-item
        :label="$t(`user.contact_info`)"
        prop="contact"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input
          v-model="form.contact"
          placeholder=""
          onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode == 46"
          @copy.prevent
          @paste.prevent
          type="number"
          min="0"
        />
      </el-form-item>

      <!-- <el-form-item
        :label="$t(`user.unlock_price`)"
        prop="contact_price"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <span style="color: #f56c6c">{{ t(`user.default_price`) }} : 20</span>
        <el-input
          v-model.number="form.contact_price"
          placeholder=""
          type="number"
          min="0"
          onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode == 46"
          @copy.prevent
          @paste.prevent
        />
      </el-form-item> -->
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
export default {
  name: "DetailDialog",
  props: ["show", "title", "data", "coin"],
  emits: ["closed", "created"],
  setup(props, context) {
    const { t } = useI18n();
    const state = reactive({
      dialogTitle: "",
      form: {
        contact: "",
      },
      typeList: [
        {
          value: 0,
          label: t("user.general_user"),
        },
        {
          value: 1,
          label: t(`user.certified_user`),
        },
        {
          value: 2,
          label: t(`user.platform_publisher`),
        },
        {
          value: 3,
          label: t(`user.original_publisher`),
        },
        {
          value: 20,
          label: t(`user.short_video_account`),
        },
        {
          value: 21,
          label: t(`user.long_video_account`),
        },
      ],

      doubleClick: false,
    });

    const formRef = ref();

    const closeDialog = (formRef) => {
      state.form = {};
      formRef.resetFields();
      context.emit("closed");
    };

    const submitDialog = (formRef) => {
      formRef.validate((valid) => {
        if (valid) {
          state.doubleClick = true;
          if (state.form.order_type == 2) {
            state.form.points_type = 1;
          } else {
            state.form.vp_type = 1;
          }
          http.userManagement.updateUserDetail(state.form).then((res) => {
            if (res.data.err_code == 0) {
              state.doubleClick = false;
              closeDialog(formRef);

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

    const openDialog = () => {
      state.dialogTitle = props.title;
      state.form.user_id = props.data.user_id;
      state.form.is_authed = props.data.is_authed;
      state.form.contact = props.data.contact;
      state.form.contact_price =
        props.data.contact_price == 0 ? props.coin : props.data.contact_price;
    };

    onMounted(() => {
      // http.moneyManagement.getBankList().then((res) => {
      //   if (res.data.err_code == 0) {
      //     state.bankList = res.data.data.data;
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
.danger {
  color: #f56c6c;
}
</style>
