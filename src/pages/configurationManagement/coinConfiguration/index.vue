<template>
  <div isLoading element-loading-background="rgba(122, 122, 122, 0.3)">
    <div class="table">
      <el-table
        :data="tableList"
        :row-style="{ height: '55px' }"
        :header-row-style="{ height: '55px' }"
        :border="true"
        v-permission:config:coin:list
        :max-height="825"
      >
        <el-table-column prop="ID" label="ID" align="center" />
        <el-table-column
          prop="Desc"
          :label="t('coinConfig.table.desc')"
          align="center"
        />
        <el-table-column
          prop="Amount"
          :label="t('coinConfig.table.coin')"
          align="center"
        />
        <el-table-column :label="t('coinConfig.table.state')" align="center">
          <template #default="scope">
            <el-switch
              v-model="scope.row.Status"
              :active-value="1"
              :inactive-value="0"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="changeStatus(scope.row)"
              v-permission:config:coin:edit
            />
          </template>
        </el-table-column>
        <el-table-column :label="t('coinConfig.table.default')" align="center">
          <template #default="scope">
            <span :class="scope.row.IsDefault == 1 ? 'success' : 'danger'">{{
              scope.row.IsDefault == 1 ? "Default" : "Normal"
            }}</span>
          </template>
        </el-table-column>

        <el-table-column :label="t('coinConfig.table.operate')" align="center">
          <template #default="scope">
            <el-tooltip
              class="box-item"
              :content="t('common.edit')"
              placement="top"
            >
              <el-button
                type="primary"
                style="margin-left: 10px; margin-bottom: 5px"
                circle
                @click="handleEdit(scope.row)"
                v-permission:config:coin:edit
              >
                <font-awesome-icon icon="fa-solid fa-file-pen" />
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>

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
import { useI18n } from "vue-i18n";

export default {
  name: "Coin",
  components: {
    Dialog,
  },
  setup() {
    const state = reactive({
      isLoading: false,
      showDialog: false,
      dialog: {
        dialogTitle: "",
        dialogData: {},
      },
      tableList: [],
    });
    const { t } = useI18n();
    const store = useStore();

    const handleEdit = (row) => {
      state.dialog.dialogTitle = t("common.edit");
      state.dialog.dialogData = JSON.parse(JSON.stringify(row));
      state.showDialog = true;
    };

    const closeDialog = () => {
      state.showDialog = false;
    };
    const getData = () => {
      state.isLoading = true;
      http.systemManagement.getCoinConfiguration().then((res) => {
        if (res.data.err_code == 0) {
          state.tableList[0] = res.data.data;
        }
      });
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
            id: row.ID,
          };

          http.systemManagement
            .updateCoinConfigurationStatus(param)
            .then((res) => {
              if (res.data.err_code == 0) {
                ElMessage.success(t(`error.${res.data.err_code}`));
                getData();
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
      getData();
    };

    onMounted(() => {
      getData();
    });

    return {
      ...toRefs(state),
      handleEdit,
      closeDialog,
      search,
      changeStatus,
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
