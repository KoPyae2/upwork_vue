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
        :label="$t(`user.account_username`)"
        prop="user_name"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input v-model="form.user_name" placeholder="" disabled />
      </el-form-item>

      <el-form-item :label="$t(`user.recharge_type`)">
        <el-radio-group
          v-model.number="form.order_type"
          @change="changeOrderType"
        >
          <el-radio
            v-for="item in typeList"
            :key="item.value"
            :label="item.value"
            >{{ item.label }}</el-radio
          >
        </el-radio-group>
      </el-form-item>

      <el-form-item
        :label="$t(`user.typeof_membership`)"
        v-if="form.order_type == 2"
      >
        <el-radio-group
          v-model.number="form.vp_type"
          style="align-items: flex-start; flex-direction: column"
        >
          <el-radio
            v-for="item in vipPackageList"
            :key="item.id"
            :label="item.vip_type"
          >
            {{ findName(item.vip_type_name) }} ***
            <span style="color: #f56c6c">¥{{ item.vip_price }}</span> ***
            {{ t("user.free") }} {{ item.vip_points_add }}
            {{ t("user.teaCoin") }}</el-radio
          >
        </el-radio-group>
      </el-form-item>

      <el-form-item :label="$t(`user.typeof_membership`)" v-else>
        <el-radio-group
          v-model.number="form.points_type"
          style="align-items: flex-start; flex-direction: column"
        >
          <el-radio
            v-for="item in coinPackageList"
            :key="item.id"
            :label="item.vip_points_type"
            >{{ findName(item.vip_points_type_name) }} ***
            <span style="color: #f56c6c">¥{{ item.vip_points_price }}</span> ***
            {{ t("user.free") }} {{ item.vip_points_add }}
            {{ t("user.teaCoin") }}</el-radio
          >
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog(formRef)">{{
          t(`common.close`)
        }}</el-button>
        <el-button
          class="app-button"
          @click="submitDialog(formRef)"
          :disabled="doubleClick || !(form.vp_type || form.points_type)"
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
  name: "AddRecharge",
  props: ["show", "title", "data"],
  emits: ["closed", "created"],
  setup(props, context) {
    const { t } = useI18n();
    const store = useStore();
    const state = reactive({
      dialogTitle: "",
      form: {
        user_id: "",
        order_type: 2,
        vp_type: null,
        points_type: null,
      },
      levelList: [],
      typeList: [
        {
          value: 2,
          label: t("user.vipOrder"),
        },
        {
          value: 1,
          label: t("user.coinOrder"),
        },
      ],
      vipPackageList: [],
      coinPackageList: [],
      doubleClick: false,
    });

    const formRef = ref();

    const closeDialog = (formRef) => {
      (state.form = {
        user_id: "",
        order_type: 2,
        vp_type: null,
        points_type: 1,
      }),
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
          http.userManagement.rechargeUser(state.form).then((res) => {
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
    const openDialog = () => {
      state.dialogTitle = props.title;

      state.form.user_name = props.data.user_name;
      state.form.user_id = props.data.user_id;

      state.form.vp_type = props.data.vip_type;

      http.paymentManagement
        .getVipPackage({ vip_type_status: 1 })
        .then((res) => {
          if (res.data.err_code == 0) {
            state.vipPackageList = res.data.data.lists;

            // state.form.vp_type = res.data.data.lists[0].vip_type;
          }
        });
      http.paymentManagement
        .getCoinPackage({ vip_points_type_status: 1 })
        .then((res) => {
          if (res.data.err_code == 0) {
            state.coinPackageList = res.data.data.lists;

            // state.form.points_type = res.data.data.lists[0].vip_points_type;
          }
        });
    };

    const changeOrderType = () => {
      state.form.vp_type = null;
      state.form.points_type = null;
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
      changeOrderType,
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

.danger {
  color: #f56c6c;
}
</style>
