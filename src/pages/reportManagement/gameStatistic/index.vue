<template>
  <div
    element-loading-background="rgba(122, 122, 122, 0.3)"
    v-loading="isLoading"
  >
    <div class="form" v-permission:report:game:list>
      <div class="form-content">
        <el-form label-position="top" label-width="300px">
          <el-form-item label="游戏名称">
            <el-input placeholder="游戏名称" v-model="filterForm.game_name" />
          </el-form-item>
          <el-form-item
            label="日期:"
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

    <div class="table">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-table
            :data="tableList"
            :row-style="{ height: '55px' }"
            :header-row-style="{ height: '55px' }"
            :border="true"
            v-permission:report:game:list
            :max-height="825"
          >
            <el-table-column label="日期" align="center">
              <template #default="scope">
                <span>{{ originalDate(scope.row.draw_date) }}</span>
              </template>
            </el-table-column>

            <el-table-column prop="game_name" label="游戏名称" align="center" />
            <el-table-column
              prop="game_per_day"
              label="总期数"
              align="center"
            />
            <el-table-column label="总投注" align="center">
              <template #default="scope">
                <span>{{ scope.row.total_bet }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="total_cancel"
              label="总取消"
              align="center"
            />
            <el-table-column label="总派奖" align="center">
              <template #default="scope">
                <span>{{ scope.row.total_win }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="total_loss" label="未中奖" align="center" />
            <el-table-column prop="profit_loss" label="总盈亏" align="center" />
            <el-table-column
              prop="total_player"
              label="玩家数量"
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
              v-permission:report:game:list
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
  name: "GameReport",
  components: {},
  setup() {
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
      total: 0,
    });

    const store = useStore();

    const getData = () => {
      state.isLoading = true;
      http.reportManagement.getGameReport(state.param).then((res) => {
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
      if (state.filterForm.game_name) {
        state.param.game_name = state.filterForm.game_name;
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
