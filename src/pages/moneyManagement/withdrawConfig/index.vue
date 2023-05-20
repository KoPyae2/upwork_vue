<template>
  <div
    v-loading="isLoading"
    element-loading-background="rgba(122, 122, 122, 0.3)"
  >
    <div class="table">
      <el-table
        :data="tableList"
        :row-style="{ height: '55px' }"
        :header-row-style="{ height: '55px' }"
        :border="true"
        v-permission:money:withdrawconfig:list
        :max-height="825"
      >
        <!-- <el-table-column prop="cash_back" label="返现金" align="center" />
        <el-table-column label="检查密码" align="center">
          <template #default="scope">
            {{ scope.row.check_password == 1 ? "是的" : "不" }}
          </template>
        </el-table-column>
        <el-table-column label="硬币兑换" align="center">
          <template #default="scope">
            {{ scope.row.coin_exchange }}
          </template>
        </el-table-column>
        <el-table-column label="可绑定银行卡数量" align="center">
          <template #default="scope">
            {{ scope.row.max_user_bank }}
          </template>
        </el-table-column> -->
        <el-table-column :label="t('money.withdrawalAmount')" align="center">
          <template #default="scope">
            {{ scope.row.range_withdraw_amount.min_amount }} -
            {{ scope.row.range_withdraw_amount.max_amount }}
          </template>
        </el-table-column>
        <el-table-column :label="t('money.withdrawalTime')" align="center">
          <template #default="scope">
            {{ scope.row.range_withdraw_time.from }} -
            {{ scope.row.range_withdraw_time.to }}
          </template>
        </el-table-column>

        <el-table-column
          prop="withdraw_fee"
          :label="t('money.fee')"
          align="center"
        />

        <el-table-column :label="t('common.operate')" align="center">
          <template #default="scope">
            <el-tooltip
              class="box-item"
              :content="t('common.edit')"
              placement="top"
            >
              <el-button
                type="primary"
                style="margin-left: 10px; margin-bottom: 5px"
                circle
                @click="handleEdit(scope.row)"
                money:withdrawconfig:edit
              >
                <font-awesome-icon icon="fa-solid fa-file-pen" />
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>

  <Dialog
    :show="showDialog"
    @closed="closeDialog"
    @created="getData"
    :title="dialog.dialogTitle"
    :data="dialog.dialogData"
  />
</template>

<script>
import { onMounted, reactive, toRefs, computed } from "vue";
import Dialog from "./dialog.vue";
import http from "@/http";
import { useStore } from "vuex";
import { dateFormat } from "@/utils/timeFormat.js";
import { useI18n } from "vue-i18n";

export default {
  name: "WithdrawConfig",
  components: {
    Dialog,
  },
  setup() {
    const { t } = useI18n();
    const state = reactive({
      isLoading: true,
      showDialog: false,
      filterForm: {},
      pageList: [10, 20, 60, 80, 100],
      param: {
        page: 1,
        page_size: 10,
      },
      dialog: {
        dialogTitle: "",
        dialogData: {},
      },
      tableList: [],
      isLoading: false,
    });

    const store = useStore();

    const handleEdit = (row) => {
      state.dialog.dialogTitle = t("common.edit");
      state.dialog.dialogData = JSON.parse(JSON.stringify(row));
      state.showDialog = true;
    };

    const closeDialog = () => {
      state.showDialog = false;
    };

    const getData = () => {
      state.isLoading = true;
      http.moneyManagement.getWithdrawConfig(state.param).then((res) => {
        if (res.data.err_code == 0) {
          state.tableList[0] = res.data.data;
          state.isLoading = false;
        }
      });
    };

    const filter = () => {
      state.param = {
        page: 1,
      };
      if (state.filterForm.name) {
        state.param.name = state.filterForm.name;
      }
    };

    const onSizeChange = (val) => {
      state.param.page_size = val;
      getData();
    };
    const onCurrentChange = (val) => {
      state.param.page = val;
      getData();
    };

    const search = () => {
      filter();
      state.param.page_size = 10;
      getData();
    };

    onMounted(() => {
      getData();
    });

    return {
      t,
      ...toRefs(state),
      handleEdit,
      closeDialog,
      search,
      onSizeChange,
      onCurrentChange,
      dateFormat,
      getData,
      windowRect: computed(() => store.state.app.windowRect),
      device: computed(() => store.state.app.device),
    };
  },
};
</script>

<style lang="scss" scoped></style>
