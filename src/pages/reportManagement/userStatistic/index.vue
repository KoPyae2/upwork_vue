<template>
  <div v-loading="isLoading">
    <div class="form" v-permission:report:user:list>
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
              />{{ t(`common.search`) }}
            </el-button>
          </div>

          <div style="margin-top: 34px" class="buttonBox">
            <el-button type="warning" @click="refresh()">
              <font-awesome-icon
                icon="fa-solid fa-arrows-rotate"
                style="margin-right: 5px"
              />{{ t(`common.reset`) }}
            </el-button>
          </div>
        </el-form>
      </div>
    </div>

    <div class="table">
      <el-table
        :data="tableList"
        :row-style="{ height: '55px' }"
        :header-row-style="{ height: '55px' }"
        :border="true"
        v-permission:report:user:list
        :max-height="825"
      >
        <el-table-column :label="t(`report.date`)" align="center">
          <template #default="scope">
            <span>{{ DateOnly(scope.row.log_date) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="new" :label="t(`report.add`)" align="center" />
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
    </div>
  </div>
</template>

<script>
import { onMounted, reactive, toRefs, computed } from "vue";

import http from "@/http";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { DateOnly, dateFormat } from "@/utils/timeFormat.js";
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
        search_date: `${DateOnly(Date.now())} 00:00:00`,
      },
      dialog: {
        dialogTitle: "",
        dialogData: {},
      },
      bankList: [],
      tableList: [],
      isLoading: false,
    });
    const router = useRouter();
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

    const refresh = () => {
      state.param = {
        page: 1,
        page_size: 10,
        search_date: `${DateOnly(Date.now())} 00:00:00`,
      };
      state.filterForm = {
        search_date: `${DateOnly(Date.now())}`,
      };
      router.push("/reportManagement/userStatistic");
      getData();
    };

    onMounted(() => {
      getData();
    });

    return {
      ...toRefs(state),
      closeDialog,
      DateOnly,
      search,
      onSizeChange,
      onCurrentChange,
      dateFormat,
      refresh,
      router,
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
