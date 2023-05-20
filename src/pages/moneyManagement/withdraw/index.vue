<template>
  <div
    v-loading="isLoading"
    element-loading-background="rgba(122, 122, 122, 0.3)"
  >
    <div class="form" v-permission:money:withdraw:list>
      <div class="form-content">
        <el-form label-position="top" label-width="300px">
          <el-form-item label="ID">
            <el-input placeholder="请输入ID" v-model="filterForm.id" />
          </el-form-item>

          <el-form-item label="用户ID">
            <el-input placeholder="请输入用户ID" v-model="filterForm.user_id" />
          </el-form-item>

          <el-form-item label="审核状态">
            <el-select
              :multiple="false"
              placeholder="请选择审核状态"
              style="width: 100%"
              v-model="filterForm.trans_status"
              default-first-option
            >
              <el-option
                v-for="item in statusList"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="提现次数">
            <el-select
              :multiple="false"
              placeholder="提现次数"
              style="width: 100%"
              v-model="filterForm.withdraw_time"
              default-first-option
            >
              <el-option :value="1" label="一次以上" />
              <el-option :value="2" label="二次以上" />
              <el-option :value="3" label="三次以上" />
            </el-select>
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

          <div style="margin-top: 34px" class="buttonBox">
            <el-button type="warning" @click="refresh()">
              <font-awesome-icon
                icon="fa-solid fa-arrows-rotate"
                style="margin-right: 5px"
              />重置</el-button
            >
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
        v-permission:money:withdraw:list
        :max-height="825"
      >
        <el-table-column prop="id" label="Id" align="center" />
        <el-table-column
          prop="user_name"
          label="用户名"
          align="center"
          width="120px"
        />
        <el-table-column prop="user_id" label="用户ID" align="center" />
        <el-table-column
          prop="success_at"
          label="审核时间"
          align="center"
          width="130px"
        >
          <template #default="scope">
            {{
              scope.row.success_at !== 0 ? dateFormat(scope.row.success_at) : ""
            }}
          </template>
        </el-table-column>
        <el-table-column
          prop="trans_no"
          label="订单号"
          align="center"
          width="120px"
        />
        <el-table-column
          prop="to_bank_account_name"
          label="提款人姓名"
          align="center"
          width="100px"
        />
        <el-table-column
          prop="to_bank_account_number"
          label="银行卡号"
          align="center"
          width="120px"
        />
        <el-table-column
          prop="to_bank_name"
          label="银行名称"
          align="center"
          width="100px"
        />
        <el-table-column prop="trans_amount" label="提款金额" align="center" />
        <el-table-column prop="trans_fee" label="手续费" align="center" />
        <!-- <el-table-column
          prop="trans_fee_rate"
          label="转会费率"
          align="center"
        /> -->
        <el-table-column label="审核状态" align="center">
          <template #default="scope">
            <span :class="checkClass(scope.row.trans_status)">{{
              checkStatus(scope.row.trans_status)
            }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="withdraw_time" label="提款次数" align="center" />

        <el-table-column label="创建时间" align="center" width="135px">
          <template #default="scope">
            <span>{{ dateFormat(scope.row.created_at) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" width="200px">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              style="margin-left: 10px; margin-bottom: 5px"
              @click="handleApprove(scope.row)"
              v-if="scope.row.trans_status == 1"
              v-permission:money:withdraw:edit
            >
              改成同意
            </el-button>
            <el-button
              type="danger"
              size="small"
              style="margin-left: 10px; margin-bottom: 5px"
              @click="handleReject(scope.row)"
              v-if="scope.row.trans_status == 1"
              v-permission:money:withdraw:edit
            >
              改为拒绝
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
    </div>
  </div>
</template>

<script>
import { onMounted, reactive, toRefs, computed } from "vue";

import http from "@/http";
import { useStore } from "vuex";
import { dateFormat } from "@/utils/timeFormat.js";
import { ElMessageBox, ElMessage } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

export default {
  name: "WithDraw",
  components: {},
  setup() {
    const { t } = useI18n();
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
      statusList: [
        {
          value: 1,
          label: "待定",
        },
        {
          value: 2,
          label: "成功",
        },
        {
          value: 3,
          label: "拒绝",
        },
      ],
      tableList: [],
      isLoading: false,
      total: 0,
    });

    // const tableList = useTableData(http.moneyManagement.getWithdraw);
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    const getData = () => {
      state.isLoading = true;
      http.moneyManagement.getWithdraw(state.param).then((res) => {
        if (res.data.err_code == 0) {
          state.isLoading = false;
          state.tableList = res.data.data.users;
          state.total = res.data.data.total;
        } else {
          state.isLoading = false;
        }
      });
    };

    const handleEdit = (row) => {
      state.dialog.dialogTitle = "修改";
      state.dialog.dialogData = JSON.parse(JSON.stringify(row));
      state.showDialog = true;
    };

    const closeDialog = () => {
      state.showDialog = false;
    };

    const filter = () => {
      state.param = {
        page: 1,
      };
      if (state.filterForm.id) {
        state.param.id = state.filterForm.id;
      }
      if (state.filterForm.user_id) {
        state.param.user_id = state.filterForm.user_id;
      }
      if (state.filterForm.trans_status) {
        state.param.trans_status = state.filterForm.trans_status;
      }
      if (state.filterForm.withdraw_time) {
        state.param.withdraw_time = state.filterForm.withdraw_time;
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

    const deleteHandler = (id) => {
      ElMessageBox.confirm(t("common.wantToDelete"), t("common.warning"), {
        confirmButtonText: t("common.sure"),
        cancelButtonText: t("common.close"),
        type: "warning",
        draggable: true,
        closeOnClickModal: false,
      })
        .then(() => {
          http.moneyManagement.deleteUserBankList({ id: id }).then((res) => {
            if (res.data.err_code == 0) {
              ElMessage.success(t(`error.${res.data.err_code}`));
              search();
            } else {
              ElMessage.error(t(`error.${res.data.err_code}`));
            }
          });
        })
        .catch(() => {
          ElMessage({
            type: "info",
            message: t("common.close"),
          });
        });
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
      };
      state.filterForm = {};
      router.push("/moneyManagement/withdraw");
      getData();
    };

    const checkStatus = (status) => {
      if (status == 1) {
        return "待定";
      } else if (status == 2) {
        return "成功";
      } else {
        return "拒绝";
      }
    };

    const checkClass = (status) => {
      if (status == 1) {
        return "warning";
      } else if (status == 2) {
        return "success";
      } else {
        return "danger";
      }
    };

    const handleApprove = (row) => {
      let param = {
        id: row.id,
        user_id: row.user_id,
        trans_status: 2,
      };

      ElMessageBox.confirm("确认审核通过吗？", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        draggable: true,
        closeOnClickModal: false,
      })
        .then(() => {
          http.moneyManagement.updateWithdrawStatus(param).then((res) => {
            if (res.data.err_code == 0) {
              ElMessage.success(t(`error.${res.data.err_code}`));
              search();
            } else {
              ElMessage.error(t(`error.${res.data.err_code}`));
            }
          });
        })
        .catch(() => {
          ElMessage({
            type: "info",
            message: t("common.close"),
          });
        });
    };

    const handleReject = (row) => {
      let param = {
        id: row.id,
        user_id: row.user_id,
        trans_status: 3,
      };

      ElMessageBox.confirm("确定审核拒绝吗？", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        draggable: true,
        closeOnClickModal: false,
      })
        .then(() => {
          http.moneyManagement.updateWithdrawStatus(param).then((res) => {
            if (res.data.err_code == 0) {
              ElMessage.success(t(`error.${res.data.err_code}`));
              search();
            } else {
              ElMessage.error(t(`error.${res.data.err_code}`));
            }
          });
        })
        .catch(() => {
          ElMessage({
            type: "info",
            message: t("common.close"),
          });
        });
    };

    onMounted(() => {
      if (route.query.user_id) {
        state.param.user_id = route.query.user_id;
        state.filterForm.user_id = route.query.user_id;
      }
      getData();
    });

    return {
      ...toRefs(state),
      handleEdit,
      closeDialog,
      dateFormat,
      refresh,
      search,
      onSizeChange,
      onCurrentChange,
      deleteHandler,
      checkStatus,
      checkClass,
      handleApprove,
      handleReject,
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
