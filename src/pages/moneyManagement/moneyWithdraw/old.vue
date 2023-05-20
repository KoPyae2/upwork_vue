<template>
  <div
    element-loading-background="rgba(122, 122, 122, 0.3)"
    v-loading="isLoading"
  >
    <div class="form" v-permission:money:withdraw:list>
      <div class="form-content">
        <el-form label-position="top" label-width="300px">
          <el-form-item label="用户ID">
            <el-input placeholder="请输入用户ID" v-model="filterForm.user_id" />
          </el-form-item>
          <el-form-item label="状态">
            <el-select
              :multiple="false"
              placeholder="全部"
              style="width: 100%"
              v-model="filterForm.trans_status"
              default-first-option
            >
              <el-option
                v-for="item in statusList"
                :key="item"
                :value="item.value"
                :label="item.label"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="注册时间:" style="min-width: 300px">
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
        <div class="buttonBox">
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

    <div class="table">
      <el-row>
        <el-col :span="24">
          <el-table
            :data="tableList"
            :row-style="{ height: '55px' }"
            :header-row-style="{ height: '55px' }"
            :border="true"
            :max-height="825"
            v-permission:money:withdraw:list
          >
            <el-table-column prop="id" label="ID" align="center" />
            <el-table-column label="状态" align="center">
              <template #default="scope">
                <span :class="checkClass(scope.row.trans_status)">
                  {{ checkType(scope.row.trans_status) }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="user_id" label="用户" align="center" />
            <el-table-column
              prop="trans_no"
              label="编号"
              align="center"
              width="180px"
            />

            <el-table-column prop="trans_amount" label="金额" align="center" />
            <el-table-column prop="user_id" label="手续费/费率" align="center">
              <template #default="scope">
                {{ scope.row.trans_fee }} /
                {{ (scope.row.trans_fee_rate * 100).toFixed(2) }}%
              </template>
            </el-table-column>
            <el-table-column
              prop="trans_type"
              label="提现类型"
              align="center"
            />
            <el-table-column
              label="提交时间"
              align="center"
              prop="created_at_str"
            />

            <el-table-column label="成功时间" align="center">
              <template #default="scope">
                {{
                  scope.row.success_at == 0 ? "--" : scope.row.success_at_str
                }}
              </template>
            </el-table-column>

            <el-table-column label="操作" align="center" width="250px">
              <template #default="scope">
                <el-button
                  type="success"
                  style="margin-left: 10px; margin-bottom: 5px"
                  size="small"
                  @click="updateStatus(2, scope.row)"
                  v-if="scope.row.trans_status == 1"
                  v-permission:money:withdraw:edit
                >
                  审核通过
                </el-button>

                <el-button
                  type="warning"
                  style="margin-left: 10px; margin-bottom: 5px"
                  size="small"
                  @click="updateStatus(3, scope.row)"
                  v-if="scope.row.trans_status == 2"
                  v-permission:money:withdraw:edit
                >
                  银行出款
                </el-button>

                <!-- <el-button
                  type="warning"
                  style="margin-left: 10px; margin-bottom: 5px"
                  size="small"
                  @click="updateStatus(11, scope.row)"
                  v-if="scope.row.trans_status == 2"
                  v-permission:money:withdraw:edit
                >
                  USDT出款
                </el-button> -->

                <el-button
                  type="danger"
                  style="margin-left: 10px; margin-bottom: 5px"
                  size="small"
                  @click="updateStatus(100, scope.row)"
                  v-if="scope.row.trans_status == 2"
                  v-permission:money:withdraw:edit
                >
                  取消體現
                </el-button>

                <el-button
                  type="success"
                  style="margin-left: 10px; margin-bottom: 5px"
                  size="small"
                  @click="updateStatus(8, scope.row)"
                  v-if="scope.row.trans_status == 3"
                  v-permission:money:withdraw:edit
                >
                  银行成功
                </el-button>

                <!-- <el-button
                  type="success"
                  style="margin-left: 10px; margin-bottom: 5px"
                  size="small"
                  @click="updateStatus(8, scope.row)"
                  v-if="scope.row.trans_status == 11"
                  v-permission:money:withdraw:edit
                >
                  USDT成功
                </el-button> -->

                <el-button
                  type="danger"
                  style="margin-left: 10px; margin-bottom: 5px"
                  size="small"
                  @click="updateStatus(10, scope.row)"
                  v-if="
                    scope.row.trans_status == 0 ||
                    scope.row.trans_status == 1 ||
                    scope.row.trans_status == 2 ||
                    scope.row.trans_status == 11 ||
                    scope.row.trans_status == 3
                  "
                  v-permission:money:withdraw:edit
                >
                  违规被拒
                </el-button>
              </template>
            </el-table-column>
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
              v-permission:money:withdraw:list
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
import { ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";

export default {
  name: "moneywithdraw",
  components: {},
  setup() {
    const { t } = useI18n();
    const state = reactive({
      isLoading: true,
      filterForm: {},
      pageList: [10, 20, 60, 80, 100],
      param: {
        page: 1,
        page_size: 10,
      },

      statusList: [
        {
          value: 1,
          label: "待审核",
        },
        {
          value: 2,
          label: "审核成功",
        },
        {
          value: 3,
          label: "银行处理中",
        },
        {
          value: 8,
          label: "提现成功",
        },
        {
          value: 9,
          label: "提现失败",
        },
        {
          value: 10,
          label: "违规被拒",
        },
        {
          value: 11,
          label: "USDT拦截",
        },
      ],
      tableList: [],
      isLoading: false,
      total: 0,
      activeTab: "",
    });

    const store = useStore();

    const getData = () => {
      state.isLoading = true;
      http.moneyManagement
        .getWithdrawList(state.param)
        .then((res) => {
          if (res.data.err_code == 0) {
            state.isLoading = false;
            state.tableList = res.data.data.users;
            state.total = res.data.data.total;
          }
        })
        .catch((err) => {
          state.isLoading = false;
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
      if (state.filterForm.user_id) {
        state.param.user_id = state.filterForm.user_id;
      }
      if (state.filterForm.trans_status) {
        state.param.trans_status = state.filterForm.trans_status;
      }

      if (state.filterForm.dateValue && state.filterForm.dateValue.length) {
        state.param.start_date = `${state.filterForm.dateValue[0]} 00:00:00`;
        state.param.end_date = `${state.filterForm.dateValue[1]} 23:59:59`;
      }
    };

    const updateStatus = (status, row) => {
      state.isLoading = true;
      let param = {
        user_id: row.user_id,
        trans_no: row.trans_no,
        trans_status: status,
      };
      http.moneyManagement
        .updateWithdrawList(param)
        .then((res) => {
          if (res.data.err_code == 0) {
            state.isLoading = false;
            getData();
            ElMessage.success(t(`error.${res.data.err_code}`));
          }
        })
        .catch((err) => {
          state.isLoading = false;
          ElMessage.error(t(`error.${res.data.err_code}`));
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

    const search = () => {
      filter();
      state.param.page_size = 10;
      getData();
    };

    const checkType = (val) => {
      switch (val) {
        case 1:
          return "待审核";
        case 2:
          return "已审核";
        case 3:
          return "银行处理";
        case 8:
          return "提现成功";
        case 9:
          return "提现失败";
        case 10:
          return "违规被拒";
        case 11:
          return "USDT拦截";
        case 100:
          return "Cancel";
        default:
          return "未知状态";
      }
    };

    const checkClass = (val) => {
      switch (val) {
        case 1:
          return "primary";
        case 2:
          return "warning";
        case 3:
          return "warning";
        case 8:
          return "success";
        case 9:
          return "danger";
        case 10:
          return "danger";
        case 11:
          return "danger";
        case 100:
          return "dark";
        default:
          return "danger";
      }
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
      checkType,
      checkClass,
      updateStatus,
      windowRect: computed(() => store.state.app.windowRect),
      device: computed(() => store.state.app.device),
    };
  },
};
</script>

<style lang="scss" scoped>
.primary {
  color: #409eff;
}
.warning {
  color: #e6a23c;
}
.success {
  color: #67c23a;
}
.danger {
  color: #f56c6c;
}
.dark {
  color: #303133;
}
</style>
