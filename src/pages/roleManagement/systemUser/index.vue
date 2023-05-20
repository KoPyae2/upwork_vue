<template>
  <div
    element-loading-background="rgba(122, 122, 122, 0.3)"
    v-loading="isLoading"
  >
    <div class="table">
      <el-button
        @click="addNew"
        class="app-button"
        style="margin-bottom: 25px"
        v-permission:role:systemuser:add
        ><font-awesome-icon icon="fa-solid fa-plus" style="margin-right: 5px" />
        {{ t("common.addTo") }}</el-button
      >
      <el-table
        :data="tableList"
        :row-style="{ height: '55px' }"
        :header-row-style="{ height: '55px' }"
        :border="true"
        v-permission:role:systemuser:list
        :max-height="825"
      >
        <el-table-column
          prop="Username"
          :label="t('systemUser.table.account')"
          align="center"
        />
        <el-table-column :label="t('systemUser.table.phone')" align="center">
          <template #default="scope">
            {{ scope.row.phone ? scope.row.phone : "--" }}
          </template>
        </el-table-column>
        <el-table-column
          prop="login_num"
          :label="t('systemUser.table.login')"
          align="center"
        />
        <el-table-column :label="t('systemUser.table.status')" align="center">
          <template #default="scope">
            <span :class="scope.row.status == 1 ? 'success' : 'danger'">
              {{
                scope.row.status == 1
                  ? t("systemUser.table.normal")
                  : t("systemUser.table.disabled")
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column :label="t('systemUser.table.state')" align="center">
          <template #default="scope">
            <el-switch
              :disabled="scope.row.Username == 'admin'"
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="0"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="changeStatus(scope.row)"
              v-permission:role:systemuser:edit
            />
          </template>
        </el-table-column>
        <el-table-column
          :label="t('systemUser.table.created_at')"
          align="center"
        >
          <template #default="scope">
            {{ originalDate(scope.row.create_at) }}
          </template>
        </el-table-column>
        <el-table-column
          :label="t('systemUser.table.login_time')"
          align="center"
        >
          <template #default="scope">
            {{ originalDate(scope.row.login_at) }}
          </template>
        </el-table-column>

        <el-table-column :label="t('common.operate')" align="center">
          <template #default="scope">
            <el-tooltip
              class="box-item"
              :content="t('common.edit')"
              placement="top"
              v-if="scope.row.Username !== 'admin'"
            >
              <el-button
                type="primary"
                style="margin-left: 10px; margin-bottom: 5px"
                circle
                @click="handleEdit(scope.row)"
                v-permission:role:systemuser:edit
              >
                <font-awesome-icon icon="fa-solid fa-file-pen" />
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
          :total="total"
          :small="device === 'mobile' ? true : false"
          v-permission:role:systemuser:list
        >
        </el-pagination>
      </div>
    </div>
  </div>
  <!-- 已禁用

使用中 -->
  <Dialog
    :show="showDialog"
    @closed="closeDialog"
    @created="getData"
    :title="dialog.dialogTitle"
    :data="dialog.dialogData"
  />
</template>

<script>
import { onMounted, reactive, toRefs, computed } from "vue";
import Dialog from "./dialog.vue";
import http from "@/http";
import { useStore } from "vuex";
import { ElMessageBox, ElMessage } from "element-plus";
import { originalDate } from "@/utils/timeFormat.js";
import { useI18n } from "vue-i18n";

export default {
  name: "SystemUser",
  components: {
    Dialog,
  },
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
      total: 0,
    });
    const { t } = useI18n();
    const getData = () => {
      state.isLoading = true;

      http.roleManagement.getSystemUserList(state.param).then((res) => {
        if (res.data.err_code == 0) {
          state.tableList = res.data.data.users;
          state.total = res.data.data.total;
          state.isLoading = false;
        }
      });
    };
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

    const deleteHandler = (id) => {
      ElMessageBox.confirm(t("common.wantToDelete"), t("common.warning"), {
        confirmButtonText: t("common.sure"),
        cancelButtonText: t("common.close"),
        type: "warning",
        draggable: true,
        closeOnClickModal: false,
      })
        .then(() => {
          http.roleManagement.deleteSystemUser({ id: id }).then((res) => {
            if (res.data.err_code == 0) {
              ElMessage.success(t(`error.${res.data.err_code}`));
              getData();
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

    const onSizeChange = (val) => {
      state.param.page_size = val;
      getData();
    };
    const onCurrentChange = (val) => {
      state.param.page = val;
      getData();
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

          http.roleManagement.changeStatusSystemUser(param).then((res) => {
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
      addNew,
      handleEdit,
      closeDialog,
      originalDate,
      search,
      onSizeChange,
      onCurrentChange,
      changeStatus,
      deleteHandler,
      getData,
      windowRect: computed(() => store.state.app.windowRect),
      device: computed(() => store.state.app.device),
      t,
    };
  },
};
</script>

<style lang="scss" scoped>
.danger {
  color: #f56c6c;
}

.success {
  color: #67c23a;
}
</style>
