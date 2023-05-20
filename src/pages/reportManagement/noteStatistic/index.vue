<template>
  <div
    element-loading-background="rgba(122, 122, 122, 0.3)"
    v-loading="isLoading"
  >
    <div class="form" v-permission:report:note:list>
      <div class="form-content">
        <el-form label-position="top" label-width="300px">
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

    <div class="table">
      <el-row :gutter="20">
        <el-col :span="16">
          <el-table
            :data="tableList"
            :row-style="{ height: '55px' }"
            :header-row-style="{ height: '55px' }"
            :border="true"
            :max-height="825"
            v-permission:report:note:list
          >
            <el-table-column label="日期" align="center">
              <template #default="scope">
                <span>{{ originalDate(scope.row.date) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="paying" label="付费用户量" align="center" />

            <el-table-column prop="new_users" label="新用户量" align="center" />

            <el-table-column
              prop="repurchase_users"
              label="复购用户"
              align="center"
            />

            <el-table-column
              prop="seven_days"
              label="回流用户/7日"
              align="center"
            />

            <el-table-column
              prop="thirty_days"
              label="回流用户/30日"
              align="center"
            />
            <el-table-column
              prop="lost_users"
              label="流失用户"
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
              v-permission:report:note:list
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
  name: "NoteReport",
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
      bankList: [],
      tableList: [],
      isLoading: false,
      total: 0,
    });

    const store = useStore();

    const getData = () => {
      state.isLoading = true;
      http.reportManagement.getNoteReport(state.param).then((res) => {
        if (res.data.err_code == 0) {
          state.isLoading = false;
          state.tableList = res.data.data.pay_statistics;
          state.total = res.data.data.totals;
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
