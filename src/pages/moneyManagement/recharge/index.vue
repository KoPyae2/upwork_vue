<template>
  <div
    v-loading="isLoading"
    element-loading-background="rgba(122, 122, 122, 0.3)"
  >
    <div class="form" v-permission:money:recharge:list>
      <div class="form-content">
        <el-form label-position="top" label-width="300px">
          <el-form-item label="ID">
            <el-input placeholder="请输入ID" v-model="filterForm.id" />
          </el-form-item>

          <el-form-item label="用户ID/用户名">
            <el-input
              placeholder="请输入用户ID/用户名"
              v-model="filterForm.username"
            />
          </el-form-item>

          <el-form-item label="银行名称">
            <el-select
              :multiple="false"
              placeholder="银行名称"
              style="width: 100%"
              v-model="filterForm.bank_id"
              default-first-option
            >
              <el-option
                v-for="item in bankList"
                :key="item.id"
                :value="item.id"
                :label="item.bank_name"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="充值次数">
            <el-select
              :multiple="false"
              placeholder="充值次数"
              style="width: 100%"
              v-model="filterForm.recharge_time"
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
              />{{ t("common.search") }}</el-button
            >
          </div>
        </el-form>
      </div>
    </div>

    <div class="table">
      <!-- <el-button @click="addNew" class="app-button" style="margin-bottom: 25px"
        ><font-awesome-icon icon="fa-solid fa-plus" style="margin-right: 5px" />
        添加</el-button
      > -->

      <el-table
        :data="tableList"
        :row-style="{ height: '55px' }"
        :header-row-style="{ height: '55px' }"
        :border="true"
        v-permission:money:recharge:list
        :max-height="825"
      >
        <el-table-column prop="id" label="ID" align="center" />
        <el-table-column prop="user_name" label="用户名" align="center" />
        <el-table-column prop="amount" label="金额" align="center" />
        <el-table-column prop="bank_name" label="银行名称" align="center" />
        <el-table-column
          prop="bet_multiplier"
          label="兑换比例"
          align="center"
        />

        <el-table-column
          prop="gift_ratio"
          label="赠送比例 (%)"
          align="center"
        />
        <el-table-column prop="recharge" label="充值" align="center" />
        <el-table-column prop="recharge_time" label="充值次数" align="center" />

        <!-- <el-table-column prop="remark" label="评论" align="center" /> -->
        <el-table-column prop="trans_no" label="订单号" align="center" />

        <el-table-column label="创建时间" align="center" width="150px">
          <template #default="scope">
            <span>{{ dateFormat(scope.row.trans_time) }}</span>
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
          v-permission:money:recharge:list
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
  name: "Recharge",
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
      bankList: [],
      tableList: [],
      isLoading: false,
      total: 0,
    });

    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const getData = () => {
      state.isLoading = true;
      http.moneyManagement.getRechargeList(state.param).then((res) => {
        if (res.data.err_code == 0) {
          state.isLoading = false;
          state.tableList = res.data.data.recharge_list;
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
      if (state.filterForm.username) {
        state.param.username = state.filterForm.username;
      }
      if (state.filterForm.bank_id) {
        state.param.bank_id = state.filterForm.bank_id;
      }
      if (state.filterForm.recharge_time) {
        state.param.recharge_time = state.filterForm.recharge_time;
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

    onMounted(() => {
      if (route.query.user_id) {
        state.param.user_id = route.query.user_id;
        state.filterForm.user_id = route.query.user_id;
      }
      getData();
      http.moneyManagement.getBankList().then((res) => {
        if (res.data.err_code == 0) {
          state.bankList = res.data.data.data;
        }
      });
    });

    return {
      ...toRefs(state),
      handleEdit,
      closeDialog,
      dateFormat,
      search,
      onSizeChange,
      onCurrentChange,
      deleteHandler,
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
