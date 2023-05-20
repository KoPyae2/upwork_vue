<template>
  <div element-loading-background="rgba(122, 122, 122, 0.3)">
    <div
      class="form"
      v-permission:money:revenue:list
      style="margin: 30px 0 50px"
    >
      <div>
        <el-form label-position="top" label-width="300px">
          <el-form-item label="用户名、交易流水号" style="margin-left: 0">
            <el-input
              placeholder="输入用户名、交易流水号"
              v-model="filterForm.common_search"
            />
          </el-form-item>

          <el-form-item label="交易时间:" style="min-width: 300px">
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
        </el-form>
        <div class="buttonBox" style="margin-left: 0">
          <el-button class="app-button" @click="search()">
            <font-awesome-icon
              icon="fa-solid fa-magnifying-glass"
              style="margin-right: 5px"
            />搜索</el-button
          >

          <el-button type="warning" @click="reset()">
            <font-awesome-icon
              icon="fa-solid fa-arrows-rotate"
              style="margin-right: 5px"
            />重置</el-button
          >
        </div>
      </div>
    </div>

    <div>
      <el-row>
        <el-col :span="24">
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
              label="交易流水号"
              align="center"
              width="180px"
            />
            <el-table-column prop="sender_name" label="用户名" align="center" />
            <el-table-column prop="trans_type" label="类型" align="center" />
            <el-table-column
              prop="total_donate"
              label="交易金额"
              align="center"
            />

            <el-table-column
              prop="total_receive"
              label="用户所得茶币"
              align="center"
            />
            <el-table-column
              prop="user_id"
              label="交易手续费/费率"
              align="center"
            >
              <template #default="scope">
                {{ scope.row.trans_fee }} /
                {{ (scope.row.trans_fee_rate * 100).toFixed(2) }}%
              </template>
            </el-table-column>
            <el-table-column prop="sender_id" label="关联ID" align="center" />
            <el-table-column label="备注" align="center"> -- </el-table-column>
            <el-table-column label="状态" align="center">
              <template #default="scope">
                <span
                  :class="scope.row.trans_status == 1 ? 'success' : 'danger'"
                >
                  {{ scope.row.trans_status == 1 ? "成功" : "失败" }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="trans_date"
              label="交易时间"
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
              v-permission:money:revenue:list
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

export default {
  name: "RevenueTab",
  components: {},
  emits: ["loaded", "unloaded"],
  setup(props, context) {
    const state = reactive({
      isLoading: true,

      filterForm: {},
      pageList: [10, 20, 60, 80, 100],
      param: {
        page: 1,
        page_size: 10,
      },

      tableList: [],

      total: 0,
      activeTab: "",
    });

    const store = useStore();

    const getData = () => {
      context.emit("loaded");
      http.moneyManagement
        .getGoldCoinReport(state.param)
        .then((res) => {
          if (res.data.err_code == 0) {
            context.emit("unloaded");

            state.tableList = res.data.data.user_trans;
            state.total = res.data.data.total;
          }
        })
        .catch((err) => {
          context.emit("unloaded");
        });
    };

    const reset = () => {
      state.filterForm = {};
      search();
    };

    const filter = () => {
      state.param = {
        page: 1,
      };
      if (state.filterForm.common_search) {
        state.param.common_search = state.filterForm.common_search;
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

    onMounted(() => {
      getData();
    });

    return {
      ...toRefs(state),
      search,
      onSizeChange,
      onCurrentChange,
      reset,
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
