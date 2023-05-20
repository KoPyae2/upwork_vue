<template>
  <div
    element-loading-background="rgba(122, 122, 122, 0.3)"
    v-loading="tableList.tableData.isLoading"
  >
    <div class="table">
      <el-button
        @click="addNew"
        class="app-button"
        style="margin-bottom: 25px"
        v-permission:payment:gateway:add
        ><font-awesome-icon icon="fa-solid fa-plus" style="margin-right: 5px" />
        {{ t("common.addTo") }}</el-button
      >

      <el-table
        :data="tableList.tableData.list.data"
        :row-style="{ height: '55px' }"
        :header-row-style="{ height: '55px' }"
        :border="true"
        v-permission:payment:gateway:list
        :max-height="825"
      >
        <el-table-column prop="id" label="ID" align="center" />
        <el-table-column
          prop="payicon"
          :label="t('defaultPayment.table.icon')"
          align="center"
        >
          <template #default="scope">
            <photo-provider v-if="scope.row.payicon">
              <photo-consumer
                :intro="scope.row.payicon"
                :key="scope.row.payicon"
                :src="scope.row.payicon"
              >
                <img
                  :src="scope.row.payicon"
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
                <img
                  src="/default-no.png"
                  width="50"
                  height="50"
                  alt=""
                  style="height: 50px; cursor: zoom-in"
                />
              </photo-consumer>
            </photo-provider>
          </template>
        </el-table-column>
        <el-table-column
          prop="payname"
          :label="t('defaultPayment.table.name')"
          align="center"
        >
          <template #default="scope">
            {{ findName(scope.row.payname) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="paydefault"
          :label="t('defaultPayment.table.default')"
          align="center"
        >
          <template #default="scope">
            <span :class="scope.row.paydefault == 1 ? 'success' : 'danger'">
              {{ scope.row.paydefault == 1 ? t("common.yes") : t("common.no") }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="paystatus"
          :label="t('defaultPayment.table.state')"
          align="center"
        >
          <template #default="scope">
            <span :class="scope.row.paystatus ? 'success' : 'danger'">
              {{
                scope.row.paystatus
                  ? t("defaultPayment.on")
                  : t("defaultPayment.off")
              }}
            </span>
          </template>
        </el-table-column>

        <el-table-column
          :label="t('common.operate')"
          align="center"
          width="150px"
          fixed="right"
        >
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
                v-permission:payment:gateway:edit
              >
                <font-awesome-icon icon="fa-solid fa-file-pen" />
              </el-button>
            </el-tooltip>

            <el-tooltip
              class="box-item"
              :content="t('defaultPayment.disable')"
              placement="top"
              v-if="scope.row.paystatus == 1"
            >
              <el-button
                type="danger"
                style="margin-bottom: 5px"
                circle
                @click="deleteHandler(scope.row.id, t('common.wantToDisable'))"
                v-permission:payment:gateway:remove
              >
                <font-awesome-icon icon="fa-solid fa-ban" />
              </el-button>
            </el-tooltip>

            <el-tooltip
              class="box-item"
              :content="t('defaultPayment.enable')"
              placement="top"
              v-else
            >
              <el-button
                type="success"
                style="margin-bottom: 5px"
                circle
                @click="deleteHandler(scope.row.id, t('common.wantToPublish'))"
                v-permission:payment:gateway:remove
              >
                <font-awesome-icon icon="fa-solid fa-lock-open" />
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
          v-permission:payment:gateway:list
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
import { ElMessageBox, ElMessage } from "element-plus";
import { dateFormat } from "@/utils/timeFormat.js";
import Dialog from "./dialog.vue";
import { useI18n } from "vue-i18n";

export default {
  name: "UserLevel",
  components: {
    Dialog,
  },
  setup() {
    const state = reactive({
      isLoading: true,
      showDialog: false,
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
    const { t } = useI18n();
    const tableList = useTableData(http.paymentManagement.getPaymentGateway);
    const store = useStore();

    const handleEdit = (row) => {
      state.dialog.dialogTitle = t("common.edit");
      state.dialog.dialogData = JSON.parse(JSON.stringify(row));
      state.showDialog = true;
    };

    const addNew = () => {
      state.dialog.dialogTitle = t("common.addTo");
      state.dialog.dialogData = {};
      state.showDialog = true;
    };

    const closeDialog = () => {
      state.showDialog = false;
    };

    const onSizeChange = (val) => {
      state.param.page_size = val;
      tableList.setParams(state.param);
    };
    const onCurrentChange = (val) => {
      state.param.page = val;
      tableList.setParams(state.param);
    };

    const deleteHandler = (id, text) => {
      ElMessageBox.confirm(text, t("common.warning"), {
        confirmButtonText: t("common.sure"),
        cancelButtonText: t("common.close"),
        type: "warning",
        draggable: true,
      })
        .then(() => {
          http.paymentManagement
            .deletePaymentGateway({ id: id })
            .then((res) => {
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

    const findName = (data) => {
      const index = data.findIndex((x) => x.lang == store.state.user.lang);

      if (index !== -1) {
        if (
          data[index].content == null ||
          data[index].content == "" ||
          data[index].content == undefined
        ) {
          return "--";
        }
        return data[index].content;
      } else {
        return "--";
      }
    };

    const search = () => {
      state.param.page_size = 10;
      tableList.setParams(state.param);
    };

    onMounted(() => {});

    return {
      ...toRefs(state),
      addNew,
      handleEdit,
      closeDialog,
      tableList,
      search,
      onSizeChange,
      onCurrentChange,
      dateFormat,
      deleteHandler,
      findName,
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
