<template>
  <div
    v-loading="tableList.tableData.isLoading"
    element-loading-background="rgba(122, 122, 122, 0.3)"
  >
    <div class="form" v-permission:money:bank:list>
      <div class="form-content">
        <el-form label-position="top" label-width="300px">
          <el-form-item label="支付名称">
            <el-input placeholder="请输入支付名称" v-model="filterForm.name" />
          </el-form-item>

          <div style="margin-top: 34px" class="buttonBox">
            <el-button class="app-button" @click="search()">
              <font-awesome-icon
                icon="fa-solid fa-magnifying-glass"
                style="margin-right: 5px"
              />搜索</el-button
            >
          </div>
          <!-- <div style="margin-top: 34px" class="buttonBox">
          <el-button type="warning">
            <font-awesome-icon
              icon="fa-solid fa-arrows-rotate"
              style="margin-right: 5px"
            />搜索</el-button
          >
        </div> -->
        </el-form>
      </div>
    </div>

    <div class="table">
      <el-button
        @click="addNew"
        class="app-button"
        style="margin-bottom: 25px"
        v-permission:money:bank:add
        ><font-awesome-icon icon="fa-solid fa-plus" style="margin-right: 5px" />
        {{ t("common.addTo") }}</el-button
      >

      <el-table
        :data="tableList.tableData.list.data"
        :row-style="{ height: '55px' }"
        :header-row-style="{ height: '55px' }"
        :border="true"
        v-permission:money:bank:list
        :max-height="825"
      >
        <el-table-column prop="id" label="ID" align="center" />
        <el-table-column label="支付图标" align="center">
          <template #default="scope">
            <photo-provider v-if="scope.row.icon_url">
              <photo-consumer
                :intro="scope.row.icon_url"
                :key="scope.row.icon_url"
                :src="scope.row.icon_url"
              >
                <img
                  :src="scope.row.icon_url"
                  style="height: 50px; cursor: zoom-in"
                  alt=""
                />
              </photo-consumer>
            </photo-provider>
            <photo-provider v-else>
              <photo-consumer
                intro="/default-no.png"
                key="/default-no.png"
                src="/default-no.png"
              >
                <img src="/default-no.png" width="50" height="50" alt="" />
              </photo-consumer>
            </photo-provider>
          </template>
        </el-table-column>

        <el-table-column prop="alias_name" label="支付别名" align="center" />

        <el-table-column prop="bank_name" label="支付名称" align="center" />

        <el-table-column label="状态" align="center">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="2"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @click="changeStatus(scope.row)"
              v-permission:money:bank:edit
            />
          </template>
        </el-table-column>

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
                v-permission:money:bank:edit
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
                v-permission:money:bank:remove
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
          v-permission:money:bank:list
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
import Dialog from "./dialog.vue";
import http from "@/http";
import { useStore } from "vuex";
import useTableData from "@/hooks/useTableData.js";
import { dateFormat } from "@/utils/timeFormat.js";
import { ElMessageBox, ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";

export default {
  name: "Bank",
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
    });

    const tableList = useTableData(http.moneyManagement.getBankList);
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
      if (state.filterForm.name) {
        state.param.name = state.filterForm.name;
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

    const changeStatus = (row) => {
      ElMessageBox.confirm(t("common.wantToChange"), t("common.warning"), {
        confirmButtonText: t("common.sure"),
        cancelButtonText: t("common.close"),
        type: "warning",
        draggable: true,
        closeOnClickModal: false,
      })
        .then(() => {
          let param = {
            id: row.id,
            status: row.status,
          };

          http.moneyManagement.updateBankStatus(param).then((res) => {
            if (res.data.err_code == 0) {
              ElMessage.success(t(`error.${res.data.err_code}`));
              search();
            } else {
              ElMessage.error(t(`error.${res.data.err_code}`));
            }
          });
        })
        .catch(() => {
          search();
          ElMessage({
            type: "info",
            message: t("common.close"),
          });
        });
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
          http.moneyManagement.deleteBankList({ id: id }).then((res) => {
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

    onMounted(() => {});

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
      changeStatus,
      windowRect: computed(() => store.state.app.windowRect),
      device: computed(() => store.state.app.device),
    };
  },
};
</script>

<style lang="scss" scoped></style>
