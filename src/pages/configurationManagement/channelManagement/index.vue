<template>
  <div
    v-loading="isLoading"
    element-loading-background="rgba(122, 122, 122, 0.3)"
  >
    <div class="table">
      <div class="btn-con">
        <div class="left"></div>
        <div class="right">
          <el-button
            class="app-button"
            style="margin-bottom: 25px"
            @click="addPromotion"
            v-permission:config:channel:list
          >
            <font-awesome-icon
              icon="fa-solid fa-plus"
              style="margin-right: 5px"
            />
            {{ t("channel.add_promotion") }}
          </el-button>
          <el-button
            class="app-button"
            style="margin-bottom: 25px"
            v-permission:config:channel:add
            @click="addSystem"
          >
            <font-awesome-icon
              icon="fa-solid fa-plus"
              style="margin-right: 5px"
            />
            {{ t("channel.add_system") }}
          </el-button>
        </div>
      </div>

      <el-table
        :data="tableList"
        :row-style="{ height: '55px' }"
        :header-row-style="{ height: '55px' }"
        :border="true"
        v-permission:config:channel:list
        :max-height="825"
      >
        <el-table-column prop="id" label="ID" align="center" />
        <el-table-column :label="t('channel.table.type')" align="center">
          <template #default="scope">
            <span :class="scope.row.market_type == 0 ? 'danger' : 'success'">
              {{
                scope.row.market_type == 0
                  ? t("channel.system")
                  : t("channel.promotion")
              }}</span
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="market_id"
          :label="t('channel.table.market')"
          align="center"
        />
        <el-table-column
          prop="market_name"
          :label="t('channel.table.name')"
          align="center"
        />
        <el-table-column
          prop="spread_url"
          :label="t('channel.table.link')"
          align="center"
        />
        <el-table-column :label="t('channel.table.state')" align="center">
          <template #default="scope">
            <span :class="scope.row.market_status == 0 ? 'danger' : 'success'">
              {{
                scope.row.market_status == 0
                  ? t("common.close")
                  : t("common.normal")
              }}</span
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="creator"
          :label="t('channel.table.creator')"
          align="center"
        />
        <el-table-column
          :label="t('channel.table.created_at')"
          align="center"
          width="150px"
        >
          <template #default="scope">
            {{ originalDate(scope.row.created_at) }}
          </template>
        </el-table-column>

        <el-table-column
          :label="t('common.operate')"
          align="center"
          width="120px"
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
                @click="handleEditSystem(scope.row)"
                v-permission:config:channel:edit
                v-if="scope.row.market_type == 0"
              >
                <font-awesome-icon icon="fa-solid fa-file-pen" />
              </el-button>

              <el-button
                type="primary"
                style="margin-left: 10px; margin-bottom: 5px"
                circle
                @click="handleEditPromotion(scope.row)"
                v-permission:config:channel:edit
                v-else
              >
                <font-awesome-icon icon="fa-solid fa-file-pen" />
              </el-button>
            </el-tooltip>

            <el-tooltip
              class="box-item"
              :content="t('common.disabled')"
              placement="top"
              v-if="scope.row.market_status == 0"
            >
              <el-button
                type="danger"
                style="margin-bottom: 5px"
                circle
                @click="deleteHandler(scope.row.id, t('common.wantToDisable'))"
                v-permission:config:channel:remove
              >
                <font-awesome-icon icon="fa-solid fa-ban" />
              </el-button>
            </el-tooltip>

            <el-tooltip
              class="box-item"
              :content="t('common.enabled')"
              placement="top"
              v-else
            >
              <el-button
                type="success"
                style="margin-bottom: 5px"
                circle
                @click="deleteHandler(scope.row.id, t('common.wantToPublish'))"
                v-permission:config:channel:remove
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
          :total="total"
          :small="device === 'mobile' ? true : false"
          v-permission:config:channel:list
        >
        </el-pagination>
      </div>
    </div>
  </div>

  <SystemDialog
    :show="showSystemDialog"
    @closed="closeSystemDialog"
    @created="search"
    :title="dialog.dialogTitle"
    :data="dialog.dialogData"
  />

  <PromotionDialog
    :show="showPromotionDialog"
    @closed="closePromotionDialog"
    @created="search"
    :title="dialog.dialogTitle"
    :data="dialog.dialogData"
  />
</template>

<script>
import { onMounted, reactive, toRefs, computed } from "vue";
import SystemDialog from "./systemDialog.vue";
import PromotionDialog from "./promotionDialog.vue";
import http from "@/http";
import { useStore } from "vuex";
import { ElMessageBox, ElMessage } from "element-plus";
import { originalDate } from "@/utils/timeFormat.js";
import { useI18n } from "vue-i18n";

export default {
  name: "ChannelManagement",
  components: {
    SystemDialog,
    PromotionDialog,
  },
  setup() {
    const state = reactive({
      isLoading: true,
      showSystemDialog: false,
      showPromotionDialog: false,
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
    const store = useStore();

    const getData = () => {
      state.isLoading = false;
      http.systemManagement.getChannelManagement(state.param).then((res) => {
        if (res.data.err_code == 0) {
          state.isLoading = false;
          state.total = res.data.data.total;
          state.tableList = res.data.data.list;
        }
      });
    };

    const addSystem = () => {
      state.dialog.dialogTitle = t("channel.add_system");
      state.dialog.dialogData = {};
      state.showSystemDialog = true;
    };

    const addPromotion = () => {
      state.dialog.dialogTitle = t("channel.add_promotion");
      state.dialog.dialogData = {};
      state.showPromotionDialog = true;
    };

    const handleEditPromotion = (row) => {
      state.dialog.dialogTitle = t("common.edit");
      state.dialog.dialogData = JSON.parse(JSON.stringify(row));
      state.showPromotionDialog = true;
    };

    const handleEditSystem = (row) => {
      state.dialog.dialogTitle = t("common.edit");
      state.dialog.dialogData = JSON.parse(JSON.stringify(row));
      state.showSystemDialog = true;
    };
    const closeSystemDialog = () => {
      state.showSystemDialog = false;
    };

    const closePromotionDialog = () => {
      state.showPromotionDialog = false;
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
      state.showAdSlotLists = [];
      state.param.page_size = 10;

      getData();
    };

    onMounted(() => {
      getData();
    });
    const deleteHandler = (id, text) => {
      ElMessageBox.confirm(text, t("common.warning"), {
        confirmButtonText: t("common.sure"),
        cancelButtonText: t("common.close"),
        type: "warning",
        draggable: true,
        closeOnClickModal: false,
      })
        .then(() => {
          http.systemManagement
            .updateChannelManagementStatus({ id: id })
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
          ElMessage({
            type: "info",
            message: t("common.close"),
          });
        });
    };

    return {
      ...toRefs(state),
      addSystem,
      addPromotion,
      handleEditPromotion,
      handleEditSystem,
      closeSystemDialog,
      closePromotionDialog,
      search,
      onSizeChange,
      onCurrentChange,
      deleteHandler,
      originalDate,
      windowRect: computed(() => store.state.app.windowRect),
      device: computed(() => store.state.app.device),
      t,
    };
  },
};
</script>

<style lang="scss" scoped>
.btn-con {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.advertise-space {
  display: flex;
  border: 1px solid $elTableBorder;
  padding: 30px 10px 0px 10px;
  position: relative;
  margin-bottom: 10px;
  &::after {
    content: "广告位";
    position: absolute;
    top: -10px;
    left: 10px;
    background-color: $cardBg;
    color: var(--text_color);
    padding: 0 10px;
  }
}
.danger {
  color: #f56c6c;
}

.success {
  color: #67c23a;
}
.active-app-button {
  background-color: #ffb800;
  border: none;
  color: white;
}
</style>
