<template>
  <div
    element-loading-background="rgba(122, 122, 122, 0.3)"
    v-loading="isLoading"
  >
    <div class="form" v-permission:report:business:list>
      <div class="form-content">
        <el-form label-position="top" label-width="300px">
          <el-form-item
            :label="t(`report.query_time`)"
            style="min-width: 230px"
          >
            <el-date-picker
              v-model="filterForm.search_date"
              value-format="YYYY-MM-DD"
              unlink-panels
              :placeholder="t(`report.query_time_select`)"
            />
          </el-form-item>

          <div style="margin-top: 34px" class="buttonBox">
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

    <!-- business -->

    <div class="table">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-table
            :data="user_source_tableList"
            :row-style="{ height: '40px' }"
            :header-row-style="{ height: '55px' }"
            :border="true"
            :max-height="825"
          >
            <el-table-column
              prop="reg_client"
              :label="t(`report.user_source`)"
              align="center"
            />
            <el-table-column
              prop="new_user"
              :label="t(`report.new_user`)"
              align="center"
            />
            <el-table-column
              prop="active_user"
              :label="t(`report.active_user`)"
              align="center"
            />
            <el-table-column
              prop="total_user"
              :label="t(`report.total_users`)"
              align="center"
            />
          </el-table>
        </el-col>
      </el-row>

      <el-row :gutter="20" style="margin-top: 30px">
        <el-col>
          <el-table
            :data="business_tableList"
            :row-style="{ height: '50px' }"
            :header-row-style="{ height: '50px' }"
            :border="true"
            v-permission:report:business:list
          >
            <el-table-column
              prop="order_type"
              :label="t(`report.order_type`)"
              align="center"
              width="120px"
            />
            <el-table-column
              prop="order_amount"
              :label="t(`report.order_amt`)"
              align="center"
              width="120px"
            />
            <el-table-column
              prop="user_total_num"
              :label="t(`report.totaluser_orderd`)"
              align="center"
            />

            <el-table-column
              prop="user_success_num"
              :label="t(`report.totaluser_success_order`)"
              align="center"
            />

            <el-table-column
              prop="new_user_num"
              :label="t(`report.total_newuser_success_order`)"
              align="center"
            />
            <el-table-column
              prop="total_type_count"
              :label="t(`report.quantity_order`)"
              align="center"
            />
            <el-table-column
              prop="success_type_count"
              :label="t(`report.num_success_order`)"
              align="center"
            />
            <el-table-column
              :label="t(`report.order_success_rate`)"
              align="center"
            >
              <template #default="scope">
                {{ (scope.row.SuccessRate.toFixed(2) * 100) / 100 }}%
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>

      <el-row style="margin-top: 30px">
        <el-col>
          <el-table
            :data="tableList"
            :row-style="{ height: '50px' }"
            :header-row-style="{ height: '50px' }"
            :border="true"
            v-permission:report:business:list
          >
            <el-table-column
              :label="t(`report.date`)"
              align="center"
              width="210px"
            >
              <template #default="scope">
                <span>{{ scope.row.log_date }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="new"
              :label="t(`report.add`)"
              align="center"
            />
            <el-table-column
              prop="active_day"
              :label="t(`report.daily_active`)"
              align="center"
            />
            <el-table-column
              prop="next_day"
              :label="t(`report.next_day`)"
              align="center"
            />
            <el-table-column
              prop="three_day"
              :label="t(`report.three_day`)"
              align="center"
            />
            <el-table-column
              prop="seven_day"
              :label="t(`report.seven_day`)"
              align="center"
            />
            <el-table-column
              prop="thirty_day"
              :label="t(`report.thirty_day`)"
              align="center"
            />
          </el-table>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { onMounted, reactive, toRefs, computed } from "vue";
import http from "@/http";
import { useStore } from "vuex";
import { originalDate, dateFormat, DateOnly } from "@/utils/timeFormat.js";
import { useI18n } from "vue-i18n";
export default {
  name: "UserReport",
  components: {},
  setup() {
    const state = reactive({
      isLoading: true,
      showDialog: false,
      filterForm: {
        search_date: `${DateOnly(Date.now())}`,
      },
      pageList: [10, 20, 60, 80, 100],
      param: {
        page: 1,
        page_size: 10,
        search_date: `${DateOnly(Date.now())}`,
      },
      dialog: {
        dialogTitle: "",
        dialogData: {},
      },
      bankList: [],
      tableList: [],
      isLoading: false,
      business_tableList: [],
      user_source_tableList: [],
    });

    const store = useStore();
    const { t } = useI18n();
    const getData = () => {
      state.isLoading = true;
      http.reportManagement.getUserReport(state.param).then((res) => {
        if (res.data.err_code == 0) {
          state.isLoading = false;
          state.tableList[0] = res.data.data.user_statistics;
        } else {
          state.isLoading = false;
        }
      });
      getBusinessData();
    };

    const getBusinessData = () => {
      state.isLoading = true;
      http.reportManagement.getBusinessReport(state.param).then((res) => {
        if (res.data.err_code == 0) {
          state.isLoading = false;

          let total_order = {
            order_type: t(`report.totalOrder`),
            order_amount: 0,
            user_total_num: res.data.data.total_order.user_total_num,
            user_success_num: res.data.data.total_order.user_success_num,
            new_user_num: res.data.data.total_order.new_user_num,
            total_type_count: res.data.data.total_order.total_type_count,
            success_type_count: res.data.data.total_order.success_type_count,
            SuccessRate: res.data.data.total_order.SuccessRate,
          };
          let vip_data = {
            order_type: t(`report.vipOrder`),
            order_amount: 0,
            user_total_num: res.data.data.vip_order.user_total_num,
            user_success_num: res.data.data.vip_order.user_success_num,
            new_user_num: res.data.data.vip_order.new_user_num,
            total_type_count: res.data.data.vip_order.total_type_count,
            success_type_count: res.data.data.vip_order.success_type_count,
            SuccessRate: res.data.data.vip_order.SuccessRate,
          };

          let coin_order_data = {
            order_type: t(`report.buyTeacoins`),
            order_amount: 0,
            user_total_num: res.data.data.coin_order.user_total_num,
            user_success_num: res.data.data.coin_order.user_success_num,
            new_user_num: res.data.data.coin_order.new_user_num,
            total_type_count: res.data.data.coin_order.total_type_count,
            success_type_count: res.data.data.coin_order.success_type_amount,
            SuccessRate: res.data.data.coin_order.SuccessRate,
          };
          let s_vip_data = {
            order_type: t(`report.superVip`),
            order_amount: 0,
            user_total_num: res.data.data.svip_order.user_total_num,
            user_success_num: res.data.data.svip_order.user_success_num,
            new_user_num: res.data.data.svip_order.new_user_num,
            total_type_count: res.data.data.svip_order.total_type_count,
            success_type_count: res.data.data.svip_order.success_type_amount,
            SuccessRate: res.data.data.svip_order.SuccessRate,
          };

          state.business_tableList[0] = total_order;
          state.business_tableList[1] = vip_data;
          state.business_tableList[2] = coin_order_data;
          state.business_tableList[3] = s_vip_data;
          state.user_source_tableList = res.data.data.user_source;
        } else {
          state.isLoading = false;
        }
      });
    };
    const closeDialog = () => {
      state.showDialog = false;
    };

    const filter = () => {
      state.param = {
        page: 1,
      };

      if (state.filterForm.search_date) {
        state.param.search_date = `${state.filterForm.search_date}`;
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

    const reset = () => {
      state.filterForm = {
        search_date: `${originalDate(Date.now())}`,
      };
      search();
    };

    onMounted(() => {
      getData();
    });

    return {
      ...toRefs(state),
      closeDialog,
      originalDate,
      search,
      onSizeChange,
      onCurrentChange,
      dateFormat,
      DateOnly,
      getBusinessData,
      reset,
      windowRect: computed(() => store.state.app.windowRect),
      device: computed(() => store.state.app.device),
      t,
    };
  },
};
</script>

<style lang="scss" scoped>
.warning {
  color: #e6a23c;
}

.success {
  color: #67c23a;
}

.danger {
  color: #f56c6c;
}
</style>
