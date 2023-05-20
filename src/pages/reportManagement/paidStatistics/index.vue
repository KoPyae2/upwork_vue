<template>
  <div
    element-loading-background="rgba(122, 122, 122, 0.3)"
    v-loading="isLoading"
  >
    <div class="form" v-permission:report:paidStatistics:list>
      <div class="form-content">
        <el-form label-position="top" label-width="300px">
          <el-form-item
            :label="t(`report.query_time`)"
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

    <div class="table">
      <el-row>
        <el-col :span="24">
          <el-table
            :data="tableList"
            :row-style="{ height: '55px' }"
            :header-row-style="{ height: '55px' }"
            :border="true"
            v-permission:report:paidStatistics:list
            :max-height="825"
          >
            <el-table-column
              prop="log_date"
              :label="t(`report.date`)"
              align="center"
            >
              <template #default="scope">
                {{ DateOnly(scope.row.log_date) }}
              </template>
            </el-table-column>

            <el-table-column
              :label="t(`report.pay_user`)"
              align="center"
              prop="purchase_count"
            >
            </el-table-column>
            <el-table-column
              prop="new_purchase_count"
              :label="t(`report.new_users`)"
              align="center"
            />
            <el-table-column
              prop="repurchase"
              :label="t(`report.repurchase_users`)"
              align="center"
            />
            <el-table-column
              prop="weeklyPurcharse"
              :label="t(`report.weekly_purchase`)"
              align="center"
            />
            <el-table-column
              prop="monthlyPurchase"
              :label="t(`report.monthly_purchase`)"
              align="center"
            />
            <!-- <el-table-column prop="AgentID" label="流失用户" align="center" /> -->
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
import { DateOnly } from "@/utils/timeFormat.js";
import { useI18n } from "vue-i18n";
export default {
  name: "PaidStatistics",
  components: {},
  setup() {
    const state = reactive({
      showDialog: false,
      filterForm: {
        dateValue: [`${DateOnly(Date.now())}`, `${DateOnly(Date.now())}`],
      },
      pageList: [10, 20, 60, 80, 100],
      param: {
        start_date: `${DateOnly(Date.now())}`,
        end_date: `${DateOnly(Date.now())}`,
      },
      tableList: [],
      isLoading: false,
    });

    const store = useStore();

    const getData = () => {
      state.isLoading = true;
      http.reportManagement.getPaidReport(state.param).then((res) => {
        if (res.data.err_code == 0) {
          state.isLoading = false;
          state.tableList = res.data.data.pay_statistic;
        } else {
          state.isLoading = false;
        }
      });
    };
    const { t } = useI18n();
    const filter = () => {
      if (state.filterForm.dateValue && state.filterForm.dateValue.length) {
        state.param.start_date = `${state.filterForm.dateValue[0]} 00:00:00`;
        state.param.end_date = `${state.filterForm.dateValue[1]} 23:59:59`;
      } else {
        state.param.start_date = `${DateOnly(Date.now())}`;
        state.param.end_date = `${DateOnly(Date.now())}`;
      }
    };

    const reset = () => {
      state.filterForm = {
        dateValue: [`${DateOnly(Date.now())}`, `${DateOnly(Date.now())}`],
      };
      search();
    };

    const search = () => {
      filter();
      getData();
    };

    onMounted(() => {
      getData();
    });

    return {
      ...toRefs(state),
      DateOnly,
      search,
      reset,
      windowRect: computed(() => store.state.app.windowRect),
      device: computed(() => store.state.app.device),
      t,
    };
  },
};
</script>

<style lang="scss" scoped></style>
