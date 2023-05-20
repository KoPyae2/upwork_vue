<template>
  <div
    v-loading="tableList.tableData.isLoading"
    element-loading-background="rgba(122, 122, 122, 0.3)"
  >
    <div class="form" v-permission:money:userbank:list>
      <div class="form-content">
        <el-form label-position="top" label-width="300px">
          <el-form-item label="用户名">
            <el-input
              placeholder="请输入用户名"
              v-model="filterForm.username"
            />
          </el-form-item>

          <el-form-item label="卡号">
            <el-input
              placeholder="请输入卡号"
              v-model="filterForm.card_number"
            />
          </el-form-item>

          <!-- <el-form-item label="Account Name">
            <el-input
              placeholder="Enter Account Name"
              v-model="filterForm.account_name"
            />
          </el-form-item> -->

          <el-form-item label="银行名称">
            <el-select
              :multiple="false"
              placeholder="请输入银行名称"
              style="width: 100%"
              v-model="filterForm.bank_type"
              default-first-option
            >
              <el-option
                v-for="item in bankList"
                :key="item"
                :value="item.id"
                :label="item.bank_name"
              />
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
        </el-form>
      </div>
    </div>

    <div class="table">
      <el-table
        :data="tableList.tableData.list.data"
        :row-style="{ height: '55px' }"
        :header-row-style="{ height: '55px' }"
        :border="true"
        v-permission:money:userbank:list
        :max-height="825"
      >
        <el-table-column prop="user_id" label="用户ID" align="center" />
        <el-table-column prop="user_name" label="用户名" align="center" />
        <el-table-column prop="real_name" label="开户名" align="center" />
        <el-table-column prop="bank_name" label="银行名称" align="center" />
        <el-table-column prop="bank_account" label="银行卡号" align="center" />

        <el-table-column label="创建时间" align="center">
          <template #default="scope">
            <span>{{ dateFormat(scope.row.created_at) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-tooltip class="box-item" content="编辑" placement="top">
              <el-button
                type="primary"
                style="margin-left: 10px; margin-bottom: 5px"
                circle
                @click="handleEdit(scope.row)"
                v-permission:money:userbank:edit
              >
                <font-awesome-icon icon="fa-solid fa-file-pen" />
              </el-button>
            </el-tooltip>

            <el-tooltip class="box-item" content="删除" placement="top">
              <el-button
                type="danger"
                circle
                style="margin-bottom: 5px"
                @click="deleteHandler(scope.row.id)"
                v-permission:money:userbank:remove
              >
                <font-awesome-icon icon="fa-solid fa-trash" />
              </el-button>
            </el-tooltip>
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
          :total="tableList.tableData.total"
          :small="device === 'mobile' ? true : false"
          v-permission:money:userbank:list
        >
        </el-pagination>
      </div>
    </div>
  </div>

  <Dialog
    :show="showDialog"
    @closed="closeDialog"
    @created="search"
    :title="dialog.dialogTitle"
    :data="dialog.dialogData"
  />
</template>

<script>
import { onMounted, reactive, toRefs, computed } from "vue";

import http from "@/http";
import { useStore } from "vuex";
import useTableData from "@/hooks/useTableData.js";
import { dateFormat } from "@/utils/timeFormat.js";
import { ElMessageBox, ElMessage } from "element-plus";
import Dialog from "./dialog.vue";
import { useI18n } from "vue-i18n";

export default {
  name: "UserBank",
  components: {
    Dialog,
  },
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
    });

    const tableList = useTableData(http.moneyManagement.getUserBankList);
    const store = useStore();

    const addNew = () => {
      state.dialog.dialogTitle = t("common.addTo");
      state.dialog.dialogData = {};
      state.showDialog = true;
    };

    const handleEdit = (row) => {
      state.dialog.dialogTitle = t("common.edit");
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
      if (state.filterForm.username) {
        state.param.username = state.filterForm.username;
      }
      if (state.filterForm.card_number) {
        state.param.card_number = state.filterForm.card_number;
      }
      if (state.filterForm.account_name) {
        state.param.account_name = state.filterForm.account_name;
      }
      if (state.filterForm.bank_type) {
        state.param.bank_type = state.filterForm.bank_type;
      }

      if (state.filterForm.dateValue && state.filterForm.dateValue.length) {
        state.param.start_date = `${state.filterForm.dateValue[0]} 00:00:00`;

        state.param.end_date = `${state.filterForm.dateValue[1]} 23:59:59`;
      }
    };

    const onSizeChange = (val) => {
      state.param.page_size = val;
      tableList.setParams(state.param);
    };
    const onCurrentChange = (val) => {
      state.param.page = val;
      tableList.setParams(state.param);
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
      tableList.setParams(state.param);
    };

    onMounted(() => {
      http.moneyManagement.getBankList().then((res) => {
        if (res.data.err_code == 0) {
          state.bankList = res.data.data.data;
        }
      });
    });

    return {
      ...toRefs(state),
      addNew,
      handleEdit,
      closeDialog,
      dateFormat,
      tableList,
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

<style lang="scss" scoped></style>
