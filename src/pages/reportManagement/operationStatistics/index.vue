<template>
  <div
    element-loading-background="rgba(122, 122, 122, 0.3)"
    v-loading="isLoading"
  >
    <div class="form" v-permission:report:operationStatistics:list>
      <div class="form-content">
        <el-form label-position="top" label-width="300px">
          <el-form-item
            :label="t(`report.specified_date`)"
            style="min-width: 230px"
          >
            <el-date-picker
              v-model="filterForm.dateValue"
              value-format="YYYY-MM-DD"
              unlink-panels
              :placeholder="t(`report.specified_date_select`)"
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
            v-permission:report:operationStatistics:list
            :max-height="825"
          >
            <el-table-column label="ID" align="center" prop="ID">
            </el-table-column>
            <el-table-column
              :label="t(`report.user_id`)"
              align="center"
              prop="UserID"
            >
            </el-table-column>
            <el-table-column
              prop="Username"
              :label="t(`common.userName`)"
              align="center"
            />
            <el-table-column
              prop="Desc"
              :label="t(`report.desc`)"
              align="center"
            />
            <el-table-column
              prop="Phone"
              :label="t(`report.phone`)"
              align="center"
            />
            <el-table-column
              prop="Mail"
              :label="t(`report.mail`)"
              align="center"
            />
            <el-table-column :label="t(`report.status`)" align="center">
              <template #default="scope">
                <span v-if="scope.row.status == 1" style="color: #67c23a">{{
                  t(`report.normal`)
                }}</span>
                <span v-else style="color: #f56c6c">{{
                  t(`report.disabled`)
                }}</span>
              </template>
            </el-table-column>

            <el-table-column
              prop="log_date"
              :label="t(`report.date`)"
              align="center"
            >
              <template #default="scope">
                {{ DateOnly(scope.row.CreateAt) }}
              </template>
            </el-table-column>
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
  name: "AgentReport",
  components: {},
  setup() {
    const state = reactive({
      showDialog: false,
      filterForm: {
        dateValue: `${DateOnly(Date.now())}`,
      },
      pageList: [10, 20, 60, 80, 100],
      param: {
        search_date: `${DateOnly(Date.now())}`,
      },
      tableList: [],
      isLoading: false,
    });
    const { t } = useI18n();
    const store = useStore();
    const getData = () => {
      state.isLoading = true;
      http.reportManagement.getOperationStatistics(state.param).then((res) => {
        if (res.data.err_code == 0) {
          state.isLoading = false;
          state.tableList = res.data.data.operation_statistics;
        } else {
          state.isLoading = false;
        }
      });
    };

    const filter = () => {
      if (state.filterForm.dateValue && state.filterForm.dateValue.length) {
        state.param.search_date = `${state.filterForm.dateValue}`;
        //   state.param.end_date = `${state.filterForm.dateValue[1]} 23:59:59`;
      }
    };

    const search = () => {
      filter();
      getData();
    };

    const reset = () => {
      state.filterForm = {
        dateValue: `${DateOnly(Date.now())}`,
      };
      search();
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
