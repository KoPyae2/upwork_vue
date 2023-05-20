<template>
  <div
    element-loading-background="rgba(122, 122, 122, 0.3)"
    v-loading="isLoading"
  >
    <div class="form" v-permission:report:daily:list>
      <div class="form-content">
        <el-form label-position="top" label-width="300px">
          <el-form-item
            label="日期:"
            style="margin-left: 30px; min-width: 230px"
          >
            <el-date-picker
              v-model="filterForm.search_date"
              value-format="YYYY-MM-DD"
              unlink-panels
              placeholder="请选择查查询时间"
            />
          </el-form-item>

          <div style="margin-top: 34px" class="buttonBox">
            <el-button class="app-button" @click="search()">
              <font-awesome-icon
                icon="fa-solid fa-magnifying-glass"
                style="margin-right: 5px"
              />搜索</el-button
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
            v-permission:report:daily:list
            :max-height="825"
          >
            <el-table-column label="日期" align="center" width="120px">
              <template #default="scope">
                <span>{{ originalDate(scope.row.DailyDate) }}</span>
              </template>
            </el-table-column>

            <el-table-column prop="TotalBal" label="余额" align="center" />

            <el-table-column prop="TotalProfit" label="总盈亏" align="center" />

            <el-table-column
              prop="TotalWithdraw"
              label="总提款"
              align="center"
            />

            <el-table-column
              prop="TotalRegister"
              label="注册人数"
              align="center"
            />

            <!-- <el-table-column
              prop="ActivityCost"
              label="活动成本"
              align="center"
            /> -->
            <el-table-column prop="TotalBet" label="总投注" align="center" />
            <!-- <el-table-column
              prop="TotalJackpot"
              label="总头奖"
              align="center"
            /> -->
            <!-- <el-table-column prop="TotalRebate" label="总回扣" align="center" /> -->

            <!-- <el-table-column
              prop="TotalLotteryPl"
              label="彩票盈亏"
              align="center"
            /> -->
            <el-table-column prop="TotalKgPl" label="彩票盈亏" align="center" />
            <!-- <el-table-column
              prop="TotalBulkPl"
              label="大宗盈亏"
              align="center"
            />
            <el-table-column prop="TotalDividend" label="总分" align="center" />
            <el-table-column prop="TotalWage" label="日工资" align="center" /> -->
            <el-table-column prop="TotalRecharge" label="充值" align="center" />
            <el-table-column
              prop="TotalRechargeCount"
              label="充值次数"
              align="center"
            />
            <!-- <el-table-column
              prop="TotalRechargeMember"
              label="充值号码"
              align="center"
            /> -->
            <!-- <el-table-column
              prop="TotalRechargeToday"
              label="今天充值"
              align="center"
            /> -->
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
              v-permission:report:daily:list
            >
            </el-pagination>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { onMounted, reactive, toRefs, computed } from "vue";
import http from "@/http";
import { useStore } from "vuex";
import { originalDate } from "@/utils/timeFormat.js";

export default {
  name: "DailyReport",
  components: {},
  setup() {
    const state = reactive({
      isLoading: true,
      showDialog: false,
      filterForm: {
        search_date: "",
      },
      pageList: [10, 20, 60, 80, 100],
      param: {
        page: 1,
        page_size: 10,
      },
      dialog: {
        dialogTitle: "",
        dialogData: {},
      },
      bankList: [],
      tableList: [],
      isLoading: false,
      total: 0,
    });

    const store = useStore();

    const getData = () => {
      state.isLoading = true;
      http.reportManagement.getDailyReport(state.param).then((res) => {
        if (res.data.err_code == 0) {
          state.isLoading = false;
          state.tableList = res.data.data.game_rpt;
          state.total = res.data.data.total;
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
        state.param.search_date = `${state.filterForm.search_date} 00:00:00`;
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
      ...toRefs(state),
      closeDialog,
      originalDate,
      search,
      onSizeChange,
      onCurrentChange,
      windowRect: computed(() => store.state.app.windowRect),
      device: computed(() => store.state.app.device),
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
