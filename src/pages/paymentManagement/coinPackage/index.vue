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
        v-permission:payment:coin:add
        ><font-awesome-icon icon="fa-solid fa-plus" style="margin-right: 5px" />
        {{ t("common.addTo") }}</el-button
      >

      <el-table
        :data="tableList"
        :row-style="{ height: '55px' }"
        :header-row-style="{ height: '55px' }"
        :border="true"
        v-permission:payment:coin:list
        :max-height="825"
      >
        <el-table-column prop="id" label="ID" align="center" />

        <el-table-column
          prop="vip_points_sort"
          :label="t('coinPackage.table.sort')"
          align="center"
        />

        <el-table-column
          :label="t('coinPackage.table.name')"
          align="center"
          :width="language == 'en' ? '200px' : '150px'"
        >
          <template #default="scope">
            {{ findName(scope.row.vip_points_type_name ?? []) }}
          </template>
        </el-table-column>

        <el-table-column
          :label="t('coinPackage.table.price')"
          align="center"
          :width="language == 'en' ? '250px' : '150px'"
        >
          <template #default="scope">
            {{ scope.row.vip_points_price }} /
            {{ scope.row.vip_points_price_raw }}
          </template>
        </el-table-column>

        <el-table-column
          prop="vip_points"
          :label="t('coinPackage.table.tea_coin')"
          align="center"
          :width="language == 'en' ? '200px' : '150px'"
        />
        <el-table-column
          :width="language == 'en' ? '150px' : '100px'"
          prop="vip_points_add"
          :label="t('coinPackage.table.gift')"
          align="center"
        />
        <el-table-column
          prop="gift"
          :width="language == 'en' ? '210px' : '150px'"
          :label="t('coinPackage.table.draw')"
          align="center"
        />

        <el-table-column
          prop="market_id"
          :width="language == 'en' ? '150px' : '150px'"
          :label="t('coinPackage.table.channel')"
          align="center"
        />

        <el-table-column :label="t('coinPackage.table.default')" align="center">
          <template #default="scope">
            <span :class="scope.row.is_default ? 'success' : 'danger'">
              {{ scope.row.is_default ? t("common.yes") : t("common.no") }}
            </span>
          </template>
        </el-table-column>

        <el-table-column
          prop="is_recommend"
          :label="t('coinPackage.table.recommend')"
          align="center"
          :width="language == 'en' ? '150px' : '150px'"
        >
          <template #default="scope">
            <span :class="scope.row.is_recommend ? 'success' : 'danger'">
              {{ scope.row.is_recommend ? t("common.yes") : t("common.no") }}
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
                v-permission:payment:coin:edit
              >
                <font-awesome-icon icon="fa-solid fa-file-pen" />
              </el-button>
            </el-tooltip>

            <el-tooltip
              class="box-item"
              :content="t('common.delete')"
              placement="top"
              v-if="scope.row.vip_points_type_status == 1"
            >
              <el-button
                type="danger"
                style="margin-bottom: 5px"
                circle
                @click="deleteHandler(scope.row.id, t('common.wantToDelete'))"
                v-permission:payment:coin:remove
              >
                <font-awesome-icon icon="fa-solid fa-trash" />
              </el-button>
            </el-tooltip>

            <el-tooltip
              class="box-item"
              :content="t('common.restore')"
              placement="top"
              v-else
            >
              <el-button
                type="warning"
                style="margin-bottom: 5px"
                circle
                @click="deleteHandler(scope.row.id, t('common.wantToRestore'))"
                v-permission:payment:coin:remove
              >
                <font-awesome-icon icon="fa-solid fa-trash-arrow-up" />
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
          v-permission:payment:coin:list
        >
        </el-pagination>
      </div>
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
import http from "@/http";
import { useStore } from "vuex";
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
    const store = useStore();
    const state = reactive({
      isLoading: true,
      showDialog: false,
      pageList: [10, 20, 60, 80, 100],
      param: {
        page: 1,
        page_size: 10,
        vip_points_type_status: 99,
      },
      dialog: {
        dialogTitle: "",
        dialogData: {},
      },
      total: 0,

      tableList: [],
    });
    const { t } = useI18n();
    const getData = () => {
      state.isLoading = true;

      http.paymentManagement
        .getCoinPackage(state.param)
        .then((res) => {
          if (res.data.err_code == 0) {
            state.isLoading = false;
            state.tableList = res.data.data.lists;
            state.total = res.data.data.total;
          }
        })
        .catch((err) => {
          state.isLoading = false;
        });
    };

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
      getData();
    };
    const onCurrentChange = (val) => {
      state.param.page = val;
      getData();
    };

    const search = () => {
      state.param.page_size = 10;
      getData();
    };

    const deleteHandler = (id, text) => {
      ElMessageBox.confirm(text, t("common.warning"), {
        confirmButtonText: t("common.sure"),
        cancelButtonText: t("common.close"),
        type: "warning",
        draggable: true,
      })
        .then(() => {
          http.paymentManagement.deleteCoinPackage({ id: id }).then((res) => {
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
        return data[index].content;
      } else {
        return "--";
      }
    };

    onMounted(() => {
      getData();
    });

    return {
      ...toRefs(state),
      addNew,
      handleEdit,
      closeDialog,
      getData,
      search,
      onSizeChange,
      onCurrentChange,
      dateFormat,
      deleteHandler,
      windowRect: computed(() => store.state.app.windowRect),
      device: computed(() => store.state.app.device),
      language: computed(() => store.state.user.lang),
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
