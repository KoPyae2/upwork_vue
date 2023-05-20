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
        v-permission:payment:method:add
        ><font-awesome-icon icon="fa-solid fa-plus" style="margin-right: 5px" />
        {{ t("common.addTo") }}</el-button
      >

      <el-table
        :data="tableList.tableData.list.data"
        :row-style="{ height: '55px' }"
        :header-row-style="{ height: '55px' }"
        :border="true"
        v-permission:payment:method:list
        :max-height="825"
      >
        <el-table-column prop="id" label="ID" align="center" />

        <el-table-column :label="t('paymentMethod.table.icon')" align="center">
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
                <img src="/default-no.png" width="50" height="50" alt="" />
              </photo-consumer>
            </photo-provider>
          </template>
        </el-table-column>
        <el-table-column :label="t('paymentMethod.table.name')" align="center">
          <template #default="scope">
            {{ findName(scope.row.payname) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="paytype"
          :label="t('paymentMethod.table.id')"
          align="center"
        />

        <el-table-column
          :label="t('paymentMethod.table.default')"
          align="center"
        >
          <template #default="scope">
            <span :class="scope.row.paydefault == 1 ? 'success' : 'danger'">
              {{ scope.row.paydefault == 1 ? t("common.yes") : t("common.no") }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="pay_status"
          :label="t('paymentMethod.table.state')"
          align="center"
        >
          <template #default="scope">
            <span :class="scope.row.paystatus ? 'success' : 'danger'">
              {{
                scope.row.paystatus
                  ? t("paymentMethod.on")
                  : t("paymentMethod.off")
              }}
            </span>
          </template>
        </el-table-column>

        <el-table-column
          :label="t('common.operate')"
          align="center"
          width="200px"
          fixed="right"
        >
          <template #default="scope">
            <el-tooltip
              class="box-item"
              :content="t('paymentMethod.config')"
              placement="top"
            >
              <el-button
                type="success"
                size="small"
                style="margin-bottom: 5px"
                v-permission:payment:method:edit
                @click="getConfig(scope.row.paytype)"
              >
                {{ t("paymentMethod.config") }}
              </el-button>
            </el-tooltip>

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
                v-permission:payment:method:edit
              >
                <font-awesome-icon icon="fa-solid fa-file-pen" />
              </el-button>
            </el-tooltip>

            <el-tooltip
              class="box-item"
              :content="t('paymentMethod.disable')"
              placement="top"
              v-if="scope.row.paystatus == 1"
            >
              <el-button
                type="danger"
                style="margin-bottom: 5px"
                circle
                @click="deleteHandler(scope.row.id, t('common.wantToDisable'))"
                v-permission:payment:method:remove
              >
                <font-awesome-icon icon="fa-solid fa-ban" />
              </el-button>
            </el-tooltip>

            <el-tooltip
              class="box-item"
              :content="t('paymentMethod.enable')"
              placement="top"
              v-else
            >
              <el-button
                type="success"
                style="margin-bottom: 5px"
                circle
                @click="deleteHandler(scope.row.id, t('common.wantToPublish'))"
                v-permission:payment:method:remove
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
          v-permission:payment:method:list
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

  <el-dialog
    :close-on-click-modal="false"
    v-model="showConfigDialog"
    @close="closeConfigDialog"
    draggable
    :title="t('common.addTo')"
    width="100%"
  >
    <el-button
      @click="addNewConfig"
      class="app-button"
      style="margin-bottom: 25px"
      ><font-awesome-icon icon="fa-solid fa-plus" style="margin-right: 5px" />
      {{ t("common.addTo") }}</el-button
    >
    <el-table
      :data="configData"
      :row-style="{ height: '55px' }"
      :header-row-style="{ height: '55px' }"
      :border="true"
      v-permission:payment:method:list
      :max-height="825"
    >
      <el-table-column prop="id" label="ID" align="center" />
      <el-table-column
        prop="mchid"
        :label="t('paymentMethod.table.merchant_id')"
        align="center"
        width="150px"
      />
      <el-table-column :label="t('paymentMethod.table.secret')" align="center">
        <template #default="scope">
          {{ scope.row.mchserect ? scope.row.mchserect : "--" }}
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        :label="t('paymentMethod.table.n_name')"
        align="center"
      >
        <template #default="scope">
          {{ findName(scope.row.name) }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="模式" align="center">
        <template #default="scope">
          <el-switch
            v-model="scope.row.mode"
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeConfigStatus(scope.row)"
          />
        </template>
      </el-table-column> -->
      <el-table-column
        prop="code"
        :label="t('paymentMethod.table.code')"
        align="center"
      />
      <el-table-column
        prop="psort"
        :label="t('paymentMethod.table.sort')"
        align="center"
      />
      <el-table-column
        prop="pweight"
        :label="t('paymentMethod.table.weight')"
        align="center"
      />
      <el-table-column
        prop="price_config"
        :label="t('paymentMethod.table.config_price')"
        align="center"
        width="150px"
      />
      <!-- <el-table-column
        prop="gateway_id"
        :label="t('paymentMethod.table.gate_no')"
        align="center"
      /> -->
      <el-table-column
        :label="t('paymentMethod.table.gate_name')"
        align="center"
        width="200px"
      >
        <template #default="scope">
          {{ findName(scope.row.gateway_name) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="gateway_url"
        :label="t('paymentMethod.table.gate_url')"
        align="center"
        width="200px"
      />

      <el-table-column
        prop="callback_url"
        :label="t('paymentMethod.table.callback')"
        align="center"
        width="200px"
      />
      <el-table-column
        prop="notify_url"
        :label="t('paymentMethod.table.noti_url')"
        align="center"
        width="200px"
      />

      <el-table-column
        :label="t('common.operate')"
        align="center"
        width="200px"
        fixed="right"
      >
        <template #default="scope">
          <el-tooltip
            class="box-item"
            :content="t('paymentMethod.config')"
            placement="top"
          >
            <el-button
              type="primary"
              size="small"
              style="margin-bottom: 5px"
              @click="configEdit(scope.row)"
            >
              {{ t("paymentMethod.config") }}
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <div class="table-pager">
      <el-pagination
        @size-change="onConfigSizeChange"
        @current-change="onConfigCurrentChange"
        :page-size="configParam.page_size"
        :page-sizes="pageList"
        :current-page="configParam.page"
        :layout="`total,prev,pager,next,jumper,${
          device === 'mobile' ? '' : 'sizes'
        }`"
        :total="configTotal"
        :small="device === 'mobile' ? true : false"
        v-permission:payment:method:list
      >
      </el-pagination>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeConfigDialog">
          {{ t("common.close") }}</el-button
        >
      </span>
    </template>

    <ConfigDialog
      :show="showChildDialog"
      @closed="closeChildDialog"
      @created="getConfigData"
      :title="dialog.dialogTitle"
      :data="dialog.dialogData"
      :paytype="configParam.paytype"
    />
  </el-dialog>
</template>

<script>
import { onMounted, reactive, toRefs, computed } from "vue";
import http from "@/http";
import { useStore } from "vuex";
import useTableData from "@/hooks/useTableData.js";
import { ElMessageBox, ElMessage } from "element-plus";
import { dateFormat } from "@/utils/timeFormat.js";
import Dialog from "./dialog.vue";
import ConfigDialog from "./configDialog.vue";
import { useI18n } from "vue-i18n";

export default {
  name: "PaymentMethod",
  components: {
    Dialog,
    ConfigDialog,
  },
  setup() {
    const state = reactive({
      isLoading: true,
      showDialog: false,
      showConfigDialog: false,
      showChildDialog: false,
      pageList: [10, 20, 60, 80, 100],
      param: {
        page: 1,
        page_size: 10,
        paytype: "",
      },
      configParam: {
        page: 1,
        page_size: 10,
      },
      dialog: {
        dialogTitle: "",
        dialogData: {},
      },
      configData: [],
      configTotal: 0,
    });
    const { t } = useI18n();
    const tableList = useTableData(http.paymentManagement.getPaymentMethod);
    const store = useStore();

    const handleEdit = (row) => {
      state.dialog.dialogTitle = t("common.edit");
      state.dialog.dialogData = JSON.parse(JSON.stringify(row));
      state.showDialog = true;
    };

    const configEdit = (row) => {
      state.dialog.dialogTitle = t("common.edit");
      state.dialog.dialogData = JSON.parse(JSON.stringify(row));
      state.showChildDialog = true;
    };

    const addNew = () => {
      state.dialog.dialogTitle = t("common.addTo");
      state.dialog.dialogData = {};
      state.showDialog = true;
    };

    const closeDialog = () => {
      state.showDialog = false;
    };

    const closeChildDialog = () => {
      state.showChildDialog = false;
    };

    const closeConfigDialog = () => {
      state.showConfigDialog = false;
    };

    const onSizeChange = (val) => {
      state.param.page_size = val;
      tableList.setParams(state.param);
    };
    const onCurrentChange = (val) => {
      state.param.page = val;
      tableList.setParams(state.param);
    };

    const onConfigSizeChange = (val) => {
      state.configParam.page_size = val;
      getConfigData();
    };
    const onConfigCurrentChange = (val) => {
      state.configParam.page = val;
      getConfigData();
    };

    const search = () => {
      state.param.page_size = 10;
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
          http.paymentManagement.deletePaymentMethod({ id: id }).then((res) => {
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

    const changeConfigStatus = (row) => {
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
            paytype: row.paytype,
          };

          http.paymentManagement
            .updatePaymentChannelStatus(param)
            .then((res) => {
              if (res.data.err_code == 0) {
                ElMessage.success(t(`error.${res.data.err_code}`));
                getConfigData();
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

    const addNewConfig = () => {
      state.dialog.dialogTitle = t("common.addTo");
      state.dialog.dialogData = {};
      state.showChildDialog = true;
    };

    const getConfig = (type) => {
      state.configParam.paytype = type;
      state.configParam.page = 1;
      state.configParam.page_size = 10;
      http.paymentManagement
        .getPaymentChannel(state.configParam)
        .then((res) => {
          if (res.data.err_code == 0) {
            state.showConfigDialog = true;
            state.configData = res.data.data.data;
            state.configTotal = res.data.data.total;
          }
        });
    };

    const getConfigData = () => {
      http.paymentManagement
        .getPaymentChannel(state.configParam)
        .then((res) => {
          if (res.data.err_code == 0) {
            state.showConfigDialog = true;
            state.configData = res.data.data.data;
            state.configTotal = res.data.data.total;
          }
        });
    };

    const findName = (data) => {
      const index = data.findIndex((x) => x.lang == store.state.user.lang);

      if (index !== -1) {
        return data[index].content;
      } else {
        return "--";
      }
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
      onConfigSizeChange,
      onConfigCurrentChange,
      dateFormat,
      deleteHandler,
      getConfig,

      closeConfigDialog,
      addNewConfig,
      changeConfigStatus,
      closeChildDialog,
      getConfigData,
      configEdit,
      windowRect: computed(() => store.state.app.windowRect),
      device: computed(() => store.state.app.device),
      t,
      findName,
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
