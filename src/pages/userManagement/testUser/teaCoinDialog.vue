<template>
  <el-dialog
    :close-on-click-modal="false"
    :modelValue="show"
    @update:modelValue="show = $event"
    @close="closeDialog(formRef)"
    @open="openDialog"
    draggable
    :title="dialogTitle"
    width="70%"
  >
    <div v-loading="isLoading">
      <div class="form">
        <div>
          <el-form label-position="top" label-width="300px">
            <el-form-item
              :label="$t(`common.userName`) + ' , ' + $t(`user.serial_number`)"
            >
              <el-input
                :placeholder="
                  $t(`user.please_enter`) +
                  $t(`common.userName`) +
                  ' , ' +
                  $t(`user.serial_number`)
                "
                v-model="filterForm.common_search"
              />
            </el-form-item>

            <el-form-item
              :label="$t(`user.transaction_hour`)"
              style="min-width: 300px"
            >
              <el-date-picker
                v-model="filterForm.dateValue"
                type="daterange"
                value-format="YYYY-MM-DD"
                unlink-panels
                :range-separator="t(`common.to`)"
                :start-placeholder="t(`common.startDate`)"
                :end-placeholder="t(`common.endDate`)"
              />
            </el-form-item>
            <div class="buttonBox">
              <el-button class="app-button" @click="search()">
                <font-awesome-icon
                  icon="fa-solid fa-magnifying-glass"
                  style="margin-right: 5px"
                />{{ t(`common.search`) }}</el-button
              >

              <el-button type="warning" @click="reset()">
                <font-awesome-icon
                  icon="fa-solid fa-arrows-rotate"
                  style="margin-right: 5px"
                />{{ t(`common.reset`) }}</el-button
              >
            </div>
          </el-form>
        </div>
      </div>
      <el-table
        :data="tableList"
        :row-style="{ height: '55px' }"
        :header-row-style="{ height: '55px' }"
        :border="true"
        :max-height="825"
        v-permission:money:revenue:list
      >
        <el-table-column
          prop="trans_no"
          :label="$t(`user.serial_number`)"
          align="center"
          width="180px"
        />
        <el-table-column
          prop="user_name"
          :label="$t(`common.userName`)"
          align="center"
        />
        <el-table-column
          prop="trans_type"
          :label="$t(`user.typeof`)"
          align="center"
        />
        <el-table-column
          prop="trans_amount"
          :label="$t(`user.transaction_amount`)"
          align="center"
        />

        <el-table-column
          prop="earn_by"
          :label="$t(`user.earn_by_user`)"
          align="center"
        />
        <el-table-column
          prop="user_id"
          :label="$t(`user.transaction_fee_rate`)"
          align="center"
        >
          <template #default="scope">
            {{ scope.row.trans_fee }} / {{ scope.row.trans_fee_rate }}%
          </template>
        </el-table-column>
        <el-table-column
          prop="trans_user_id"
          :label="$t(`user.association_id`)"
          align="center"
        />
        <el-table-column :label="$t(`user.remark`)" align="center">
          --
        </el-table-column>
        <el-table-column :label="$t(`user.status`)" align="center">
          <template #default="scope">
            <span :class="scope.row.trans_status == 1 ? 'success' : 'danger'">
              {{
                scope.row.trans_status == 1
                  ? t("user.success")
                  : t("user.danger")
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="created_at"
          :label="$t(`user.transaction_hour`)"
          align="center"
          width="155px"
        />
      </el-table>
      <div class="table-pager">
        <el-pagination
          @size-change="onSizeChange"
          @current-change="onCurrentChange"
          :page-size="param.page_size"
          :page-sizes="pageList"
          :current-page="param.page"
          :layout="`total,prev,pager,next,jumper,${
            device === 'mobile' ? '' : 'sizes'
          }`"
          :total="total"
          :small="device === 'mobile' ? true : false"
        >
        </el-pagination>
      </div>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog(formRef)">{{
          t(`common.close`)
        }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { onMounted, reactive, toRefs, computed } from "vue";
import http from "@/http";

import { useStore } from "vuex";

import { useI18n } from "vue-i18n";
export default {
  name: "TeaCoinDialog",
  props: ["show", "title", "data"],
  emits: ["closed", "created"],
  setup(props, context) {
    const state = reactive({
      dialogTitle: "",
      form: {},
      doubleClick: false,
      tableList: [],
      isLoading: false,
      filterForm: {},
      total: 0,
      param: {
        page: 1,
        page_size: 10,
        common_search: computed(() => props.data.user_id),
      },
      pageList: [10, 20, 60, 80, 100],
    });

    const store = useStore();

    const { t } = useI18n();
    const closeDialog = () => {
      state.tableList = [];
      context.emit("closed");
    };

    const filter = () => {
      state.param = {
        page: 1,
      };
      if (state.filterForm.common_search) {
        state.param.common_search = state.filterForm.common_search;
      } else {
        state.param.common_search = props.data.user_id;
      }

      if (state.filterForm.dateValue && state.filterForm.dateValue.length) {
        state.param.start_date = `${state.filterForm.dateValue[0]} 00:00:00`;
        state.param.end_date = `${state.filterForm.dateValue[1]} 23:59:59`;
      }
    };

    const reset = () => {
      state.filterForm = {
        user_status: "",
        is_authed: 99,
      };
      search();
    };

    const search = () => {
      filter();

      state.param.page_size = 10;
      getData();
    };

    const getData = () => {
      state.isLoading = true;

      http.moneyManagement
        .getTeaCoinReport(state.param)
        .then((res) => {
          if (res.data.err_code == 0) {
            state.isLoading = false;

            state.tableList = res.data.data.tea_coin_usage;
            state.total = res.data.data.total;
          }
        })
        .catch((err) => {
          state.isLoading = false;
        });
    };

    const onSizeChange = (val) => {
      state.param.page_size = val;
      getData();
    };
    const onCurrentChange = (val) => {
      state.param.page = val;
      getData();
    };

    const openDialog = () => {
      state.dialogTitle = props.title;

      getData();
    };

    onMounted(() => {});

    return {
      ...toRefs(state),
      closeDialog,
      onSizeChange,
      onCurrentChange,
      openDialog,
      reset,
      search,
      windowRect: computed(() => store.state.app.windowRect),
      device: computed(() => store.state.app.device),
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

.success {
  color: #67c23a;
}
</style>
