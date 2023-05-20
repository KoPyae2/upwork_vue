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
      <!-- <el-form-item
        label="返现金"
        prop="cash_back"
        :rules="[{ required: true, message: t('error.required'), trigger: 'blur' }]"
      >
        <el-input v-model.number="form.cash_back" placeholder="" />
      </el-form-item> -->

      <!-- <el-form-item
        label="可绑定银行卡数量"
        prop="max_user_bank"
        onkeypress="return event.charCode >= 48 && event.charCode <= 57"
        @copy.prevent
        @paste.prevent
        :rules="[{ required: true, message: t('error.required'), trigger: 'blur' }]                                   "
      >
        <el-input v-model.number="form.max_user_bank" placeholder="" />
      </el-form-item> -->

      <!-- <el-form-item
        label="积分兑换"
        prop="coin_exchange"
        :rules="[{ required: true, message: t('error.required'), trigger: 'blur' }]"
      >
        <el-input
          v-model.number="form.coin_exchange"
          placeholder=""
          type="number"
        />
      </el-form-item> -->

      <el-row>
        <el-col :span="12">
          <el-form-item
            :label="t('money.withdrawalAmount')"
            prop="range_withdraw_amount.min_amount"
            :rules="[
              { required: true, message: t('error.required'), trigger: 'blur' },
            ]"
          >
            <el-input
              v-model.number="form.range_withdraw_amount.min_amount"
              placeholder=""
              maxlength="10"
              show-word-limit
              @copy.prevent
              @paste.prevent
              onkeypress="return event.charCode >= 48 && event.charCode <= 57"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            prop="range_withdraw_amount.max_amount"
            :rules="[
              { required: true, message: t('error.required'), trigger: 'blur' },
            ]"
          >
            <el-input
              v-model.number="form.range_withdraw_amount.max_amount"
              placeholder=""
              maxlength="10"
              show-word-limit
              @copy.prevent
              @paste.prevent
              onkeypress="return event.charCode >= 48 && event.charCode <= 57"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item
        :label="t('money.fee')"
        prop="withdraw_fee"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input
          v-model.number="form.withdraw_fee"
          placeholder=""
          type="number"
          @input="checkInput"
          onkeypress="return event.charCode >= 48 && event.charCode <= 57"
        />
      </el-form-item>

      <el-row>
        <el-col :span="12">
          <el-form-item :label="t('money.withdrawalTime')">
            <Datepicker
              v-model="date.from"
              timePicker
              style="margin-right: 20px"
              enableSeconds
              :dark="theme == 'dark' ? true : false"
              :select-text="t('common.sure')"
              :cancel-text="t('common.close')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item>
            <Datepicker
              v-model="date.to"
              timePicker
              style="margin-right: 20px"
              enableSeconds
              :dark="theme == 'dark' ? true : false"
              :select-text="t('common.sure')"
              :cancel-text="t('common.close')"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- <el-form-item
        label="提现时间"
        prop="range_withdraw_time.from"
        :rules="[{ required: true, message: t('error.required'), trigger: 'blur' }]"
      >
        <el-row :gutter="20">
          <el-col :lg="12" :md="12" :xs="24">
            <Datepicker v-model="date.from" timePicker style="margin-right: 20px" enableSeconds
              :dark="theme == 'dark' ? true : false" select-text="确定" cancel-text="取消" />
          </el-col>
          <el-col :lg="12" :md="12" :xs="24">
            <Datepicker v-model="date.to" timePicker enableSeconds :dark="theme == 'dark' ? true : false"
              select-text="确定" cancel-text="取消" />
          </el-col>
        </el-row>
      </el-form-item> -->

      <!-- <el-form-item label="检查密码">
        <el-radio-group v-model.number="form.check_password">
          <el-radio :label="1">是的</el-radio>
          <el-radio :label="0">不</el-radio>
        </el-radio-group>
      </el-form-item> -->
      <!-- <el-form-item label="硬币兑换">
        <el-radio-group v-model.number="form.coin_exchange">
          <el-radio :label="1">是的</el-radio>
          <el-radio :label="0">不</el-radio>
        </el-radio-group>
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
import { onMounted, reactive, toRefs, ref, computed } from "vue";
import http from "@/http";
import { ElMessage } from "element-plus";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";

export default {
  name: "Dialog",
  props: ["show", "title", "data"],
  emits: ["closed", "created"],
  setup(props, context) {
    const { t } = useI18n();
    const state = reactive({
      dialogTitle: "",
      form: {
        range_withdraw_time: {
          from: "",
          to: "",
        },
        range_withdraw_amount: {
          min_amount: "",
          max_amount: "",
        },
      },
      date: {
        from: {
          hours: "",
          minutes: "",
          seconds: "",
        },
        to: {
          hours: "",
          minutes: "",
          seconds: "",
        },
      },

      visionState: false,
      doubleClick: false,
    });
    const store = useStore();
    const formRef = ref();

    const closeDialog = (formRef) => {
      state.visionState = false;

      formRef.resetFields();
      context.emit("closed");
    };

    const addZero = (num) => {
      return String(num).padStart(2, "0");
    };
    const submitDialog = (formRef) => {
      formRef.validate((valid) => {
        if (valid) {
          if (state.dialogTitle == t("common.addTo")) {
          } else {
            if (
              parseInt(
                String(state.date.from.hours).padStart(2, "0") +
                  "" +
                  String(state.date.from.minutes).padStart(2, "0") +
                  "" +
                  String(state.date.from.seconds).padStart(2, "0")
              ) >
              parseInt(
                String(state.date.to.hours).padStart(2, "0") +
                  "" +
                  String(state.date.to.minutes).padStart(2, "0") +
                  "" +
                  String(state.date.to.seconds).padStart(2, "0")
              )
            ) {
              ElMessage.error(t("money.timeError"));
              return;
            }

            let from_hour = addZero(state.date.from.hours);
            let from_minutes = addZero(state.date.from.minutes);
            let from_seconds = addZero(state.date.from.seconds);

            let to_hour = addZero(state.date.to.hours);
            let to_minutes = addZero(state.date.to.minutes);
            let to_seconds = addZero(state.date.to.seconds);

            state.form.range_withdraw_time.from =
              from_hour + ":" + from_minutes + ":" + from_seconds;

            state.form.range_withdraw_time.to =
              to_hour + ":" + to_minutes + ":" + to_seconds;

            state.doubleClick = true;

            http.moneyManagement
              .updateWithdrawConfig(state.form)
              .then((res) => {
                if (res.data.err_code == 0) {
                  state.doubleClick = false;
                  closeDialog(formRef);
                  state.form = {
                    range_withdraw_time: {
                      from: "",
                      to: "",
                    },
                    range_withdraw_amount: {
                      min_amount: "",
                      max_amount: "",
                    },
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

    const checkInput = (val) => {
      if (val) {
        if (val >= 0 && val <= 100) {
          state.form.withdraw_fee = parseFloat(val);
        } else {
          state.form.withdraw_fee = parseInt(val.slice(0, -1));
        }
      }
    };

    const openDialog = () => {
      state.dialogTitle = props.title;
      state.form.cash_back = props.data.cash_back;
      state.form.check_password = props.data.check_password;
      state.form.coin_exchange = props.data.coin_exchange;
      state.form.max_user_bank = props.data.max_user_bank;
      state.form.withdraw_fee = props.data.withdraw_fee;

      const [from_hour, from_min, from_sec] =
        props.data.range_withdraw_time.from.split(":");

      const [to_hour, to_min, to_sec] =
        props.data.range_withdraw_time.to.split(":");

      state.date.from.hours = from_hour;
      state.date.from.minutes = from_min;
      state.date.from.seconds = from_sec;

      state.date.to.hours = to_hour;
      state.date.to.minutes = to_min;
      state.date.to.seconds = to_sec;

      state.form.range_withdraw_amount.min_amount =
        props.data.range_withdraw_amount.min_amount;

      state.form.range_withdraw_amount.max_amount =
        props.data.range_withdraw_amount.max_amount;
    };

    onMounted(() => {});

    return {
      t,
      ...toRefs(state),
      closeDialog,
      submitDialog,
      formRef,
      openDialog,
      checkInput,
      theme: computed(() => store.state.theme.mode),
    };
  },
};
</script>

<style lang="scss" scoped>
:deep(.el-select .el-input__inner) {
  height: 42px !important;
}
</style>
