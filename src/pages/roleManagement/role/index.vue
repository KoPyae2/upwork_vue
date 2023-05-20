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
        v-permission:role:role:add
        ><font-awesome-icon icon="fa-solid fa-plus" style="margin-right: 5px" />
        {{ t("common.addTo") }}</el-button
      >

      <el-table
        :data="tableList"
        :row-style="{ height: '55px' }"
        :header-row-style="{ height: '55px' }"
        :border="true"
        v-permission:role:role:list
        :max-height="825"
      >
        <el-table-column prop="ID" label="ID" align="center" />
        <el-table-column
          prop="Title"
          :label="t('role.table.role')"
          align="center"
        />

        <el-table-column :label="t('role.table.created_at')" align="center">
          <template #default="scope">
            {{ dateFormat(scope.row.CreateAt) }}
          </template>
        </el-table-column>

        <el-table-column :label="t('common.operate')" align="center">
          <template #default="scope">
            <!-- <el-tooltip content="编辑" placement="top" class="box-item"> -->
            <el-button
              type="primary"
              style="margin-left: 10px; margin-bottom: 5px"
              circle
              @click="handleEdit(scope.row)"
              v-permission:role:role:edit
              v-if="scope.row.Title !== 'admin'"
            >
              <font-awesome-icon icon="fa-solid fa-file-pen" />
            </el-button>
            <!-- </el-tooltip> -->
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
          v-permission:role:role:list
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
    @created="search"
    @updated="getData"
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
import { dateFormat } from "@/utils/timeFormat.js";
import { useI18n } from "vue-i18n";

export default {
  name: "Role",
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

      http.roleManagement.getRoleList(state.param).then((res) => {
        if (res.data.err_code == 0) {
          state.tableList = res.data.data.roles;
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
      dateFormat,
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
