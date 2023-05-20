<template>
  <div
    element-loading-background="rgba(122, 122, 122, 0.3)"
    v-loading="isLoading"
  >
    <div class="form" v-permission:report:agent:list>
      <div class="form-content">
        <el-form label-position="top" label-width="300px">
          <el-form-item label="代理人Id">
            <el-input
              placeholder="请输入代理人Id"
              v-model="filterForm.user_id"
            />
          </el-form-item>
          <el-form-item
            label="创建时间:"
            style="margin-left: 30px; min-width: 300px"
          >
            <el-date-picker
              v-model="filterForm.dateValue"
              type="daterange"
              value-format="YYYY-MM-DD"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
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

    <el-breadcrumb
      separator=">"
      style="margin-bottom: 20px"
      v-permission:report:agent:list
    >
      <el-breadcrumb-item
        v-if="breadcrumbList.length"
        @click="goBack"
        style="cursor: pointer"
        >Back</el-breadcrumb-item
      >
      <el-breadcrumb-item v-for="(item, index) in breadcrumbList" :key="item">
        <span class="primary" @click="clickBread(index, item.id)">
          {{ item.name }}
        </span>
      </el-breadcrumb-item>
    </el-breadcrumb>

    <div class="table">
      <el-row>
        <el-col :span="24">
          <el-table
            :data="tableList"
            :row-style="{ height: '55px' }"
            :header-row-style="{ height: '55px' }"
            :border="true"
            v-permission:report:agent:list
            :max-height="825"
          >
            <el-table-column prop="AgentID" label="代理人Id" align="center" />

            <el-table-column prop="AgentName" label="代理名称" align="center" />

            <el-table-column label="查看下级" align="center">
              <template #default="scope">
                <el-button
                  type="primary"
                  size="small"
                  @click="goLowLevel(scope.row.AgentID, scope.row.AgentName)"
                  v-if="scope.row.UserType == 2"
                  :disabled="scope.row.IsExist == 0"
                >
                  下级 ({{ scope.row.IsExist }})
                </el-button>
              </template>
            </el-table-column>

            <el-table-column label="类型" align="center">
              <template #default="scope">
                {{ scope.row.UserType == 2 ? "代理" : "会员" }}
              </template>
            </el-table-column>

            <el-table-column prop="TotalProfit" label="总盈亏" align="center" />

            <el-table-column
              prop="NumberFirstRecharge"
              label="首次充值"
              align="center"
            />

            <el-table-column
              prop="NumberOfBetting"
              label="投注人数"
              align="center"
            />

            <el-table-column
              prop="NumberOfRecharge"
              label="充值次数"
              align="center"
            />

            <el-table-column
              prop="NumberOfWithdraw"
              label="取款次数"
              align="center"
            />

            <el-table-column
              prop="TotalBetting"
              label="投注金额"
              align="center"
            />

            <el-table-column
              prop="TotalCurrentBalance"
              label="总余额"
              align="center"
            />

            <el-table-column prop="TotalProfit" label="存取差" align="center" />

            <el-table-column
              prop="TotalRecharge"
              label="总充值金额"
              align="center"
            />

            <el-table-column
              prop="TotalRechargeMember"
              label="充值会员"
              align="center"
            />

            <el-table-column
              prop="TotalWithdarw"
              label="总提款"
              align="center"
            />

            <el-table-column
              prop="TotalWithdrawMember"
              label="提款会员"
              align="center"
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
              v-permission:report:agent:list
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
  name: "AgentReport",
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
      breadcrumbList: [],
    });

    const store = useStore();

    const getData = () => {
      state.isLoading = true;
      http.reportManagement.getAgentReport(state.param).then((res) => {
        if (res.data.err_code == 0) {
          state.isLoading = false;
          state.tableList = res.data.data.agent_rpt;
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

      if (state.filterForm.user_id) {
        state.param.user_id = state.filterForm.user_id;
      }

      if (state.param.filter_id) {
        state.param.filter_id = state.param.filter_id;
      }

      if (state.breadcrumbList.length) {
        state.param.filter_id =
          state.breadcrumbList[state.breadcrumbList.length - 1].id;
      }

      if (state.filterForm.dateValue && state.filterForm.dateValue.length) {
        state.param.start_date = `${state.filterForm.dateValue[0]} 00:00:00`;
        state.param.end_date = `${state.filterForm.dateValue[1]} 23:59:59`;
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

    const goLowLevel = (id, name) => {
      state.breadcrumbList.push({
        id: id,
        name: name,
      });

      state.param.page = 1;
      state.param.page_size = 10;
      state.param.filter_id = id;
      getData();
      // search();
    };

    const goBack = () => {
      state.breadcrumbList = [];
      search();
    };

    const clickBread = (index, id) => {
      state.breadcrumbList = state.breadcrumbList.slice(0, index + 1);
      state.param.filter_id = id;

      state.param.page = 1;

      if (state.filterForm.user_id) {
        state.param.user_id = state.filterForm.user_id;
      }

      if (state.param.filter_id) {
        state.param.filter_id = state.param.filter_id;
      }

      if (state.filterForm.dateValue && state.filterForm.dateValue.length) {
        state.param.start_date = `${state.filterForm.dateValue[0]} 00:00:00`;
        state.param.end_date = `${state.filterForm.dateValue[1]} 23:59:59`;
      }
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
      goLowLevel,
      goBack,
      clickBread,
      windowRect: computed(() => store.state.app.windowRect),
      device: computed(() => store.state.app.device),
    };
  },
};
</script>

<style lang="scss" scoped>
.primary {
  color: #409eff;
  cursor: pointer;
}
</style>
