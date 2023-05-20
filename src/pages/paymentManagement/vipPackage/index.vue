<template>
  <div
    element-loading-background="rgba(122, 122, 122, 0.3)"
    v-loading="isLoading"
  >
    <div class="table" v-permission:payment:vip:list>
      <el-button
        @click="addNew"
        class="app-button"
        style="margin-bottom: 25px"
        v-permission:payment:vip:add
        ><font-awesome-icon icon="fa-solid fa-plus" style="margin-right: 5px" />
        {{ t("vipPackage.add_member") }}</el-button
      >

      <el-button
        @click="addVipNew"
        class="app-button"
        style="margin-bottom: 25px"
        v-permission:payment:vip:add
        ><font-awesome-icon icon="fa-solid fa-plus" style="margin-right: 5px" />
        {{ t("vipPackage.add_super") }}</el-button
      >

      <el-table
        :data="tableList"
        :row-style="{ height: '55px' }"
        :header-row-style="{ height: '55px' }"
        :border="true"
        v-permission:payment:vip:list
        :max-height="825"
      >
        <el-table-column prop="id" label="ID" align="center" />
        <el-table-column
          prop="vip_sort"
          :label="t('vipPackage.table.sort')"
          align="center"
        />
        <el-table-column
          :label="t('vipPackage.table.name')"
          align="center"
          :width="language == 'en' ? '200px' : '100px'"
        >
          <template #default="scope">
            {{ findName(scope.row.vip_type_name ?? []) }}
          </template>
        </el-table-column>

        <el-table-column
          :label="t('vipPackage.table.type')"
          align="center"
          :width="language == 'en' ? '250px' : '250px'"
        >
          <template #default="scope">
            {{ checkVipType(scope.row.vip_type) }}
          </template>
        </el-table-column>
        <el-table-column
          :label="t('vipPackage.table.super_member')"
          align="center"
          :width="language == 'en' ? '150px' : '100px'"
        >
          <template #default="scope">
            <span :class="scope.row.is_svip ? 'success' : 'danger'">
              {{ scope.row.is_svip ? t("common.yes") : t("common.no") }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="vip_price"
          :width="language == 'en' ? '150px' : '100px'"
          :label="t('vipPackage.table.price')"
          align="center"
        />
        <el-table-column
          :width="language == 'en' ? '150px' : '100px'"
          prop="vip_price_raw"
          :label="t('vipPackage.table.original')"
          align="center"
        />
        <el-table-column
          :width="language == 'en' ? '150px' : '100px'"
          prop="vip_points_add"
          :label="t('vipPackage.table.gift')"
          align="center"
        />
        <el-table-column
          prop="gift"
          :width="language == 'en' ? '210px' : '100px'"
          :label="t('vipPackage.table.draw')"
          align="center"
        />

        <el-table-column
          :width="language == 'en' ? '150px' : '100px'"
          prop="market_id"
          :label="t('vipPackage.table.channel')"
          align="center"
        />
        <el-table-column
          :label="t('vipPackage.table.default')"
          align="center"
          :width="language == 'en' ? '150px' : '100px'"
        >
          <template #default="scope">
            <span :class="scope.row.is_default ? 'success' : 'danger'">
              {{ scope.row.is_default ? t("common.yes") : t("common.no") }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="is_recommend"
          :label="t('vipPackage.table.recommend')"
          align="center"
          :width="language == 'en' ? '150px' : '100px'"
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
                v-if="scope.row.is_svip == 0"
                v-permission:payment:vip:edit
              >
                <font-awesome-icon icon="fa-solid fa-file-pen" />
              </el-button>
              <el-button
                type="primary"
                style="margin-left: 10px; margin-bottom: 5px"
                circle
                @click="handleVipEdit(scope.row)"
                v-permission:payment:vip:edit
                v-else
              >
                <font-awesome-icon icon="fa-solid fa-file-pen" />
              </el-button>
            </el-tooltip>

            <el-tooltip
              class="box-item"
              :content="t('common.delete')"
              placement="top"
              v-if="scope.row.vip_type_status == 1"
            >
              <el-button
                type="danger"
                style="margin-bottom: 5px"
                circle
                @click="deleteHandler(scope.row.id, t('common.delete'))"
                v-permission:payment:vip:remove
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
                @click="deleteHandler(scope.row.id, t('common.restore'))"
                v-permission:payment:vip:remove
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
          v-permission:payment:vip:list
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

  <VipDialog
    :show="showVipDialog"
    @closed="closeVipDialog"
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
import VipDialog from "./vipDialog.vue";
import { useI18n } from "vue-i18n";

export default {
  name: "VipPackage",
  components: {
    Dialog,
    VipDialog,
  },
  setup() {
    const { t } = useI18n();
    const state = reactive({
      isLoading: true,
      showDialog: false,
      showVipDialog: false,
      pageList: [10, 20, 60, 80, 100],
      param: {
        page: 1,
        page_size: 10,
        vip_type_status: 99,
      },
      dialog: {
        dialogTitle: "",
        dialogData: {},
      },
      total: 0,
      tableList: [],
      typeList: [
        {
          value: 7,
          label: t("vipPackage.dialog.weekly"),
        },
        {
          value: 30,
          label: t("vipPackage.dialog.monthly"),
        },
        {
          value: 90,
          label: t("vipPackage.dialog.seasonal"),
        },
        {
          value: 180,
          label: t("vipPackage.dialog.semiAnnual"),
        },
        {
          value: 365,
          label: t("vipPackage.dialog.annual"),
        },
        {
          value: 9999,
          label: t("vipPackage.dialog.permanent"),
        },
        {
          value: 8,
          label: t("vipPackage.dialog.weekly_super"),
        },
        {
          value: 31,
          label: t("vipPackage.dialog.monthly_super"),
        },
        {
          value: 91,
          label: t("vipPackage.dialog.seasonal_super"),
        },
        {
          value: 181,
          label: t("vipPackage.dialog.semiAnnual_super"),
        },
        {
          value: 371,
          label: t("vipPackage.dialog.annual_super"),
        },
        {
          value: 9991,
          label: t("vipPackage.dialog.permanent_super"),
        },
      ],
    });

    const getData = () => {
      state.isLoading = true;

      http.paymentManagement
        .getVipPackage(state.param)
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
    const store = useStore();
    const handleEdit = (row) => {
      state.dialog.dialogTitle = t("common.edit");
      state.dialog.dialogData = JSON.parse(JSON.stringify(row));
      state.showDialog = true;
      console.log("111");
    };

    const handleVipEdit = (row) => {
      state.dialog.dialogTitle = t("common.edit");
      state.dialog.dialogData = JSON.parse(JSON.stringify(row));
      state.showVipDialog = true;
      console.log("vip");
    };

    const addNew = () => {
      state.dialog.dialogTitle = t("common.addTo");
      state.dialog.dialogData = {};
      state.showDialog = true;
    };

    const addVipNew = () => {
      state.dialog.dialogTitle = t("common.addTo");
      state.dialog.dialogData = {};
      state.showVipDialog = true;
    };

    const closeDialog = () => {
      state.showDialog = false;
    };

    const closeVipDialog = () => {
      state.showVipDialog = false;
    };

    const onSizeChange = (val) => {
      state.param.page_size = val;
      getData();
    };
    const onCurrentChange = (val) => {
      state.param.page = val;
      getData();
    };

    const deleteHandler = (id, text) => {
      ElMessageBox.confirm(
        t("vipPackage.AreUSure", { val: text }),
        t("common.warning"),
        {
          confirmButtonText: t("common.sure"),
          cancelButtonText: t("common.close"),
          type: "warning",
          draggable: true,
        }
      )
        .then(() => {
          http.paymentManagement.deleteVipPackage({ id: id }).then((res) => {
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
    const checkVipType = (type_id) => {
      let res;
      state.typeList.forEach((id) => {
        if (id.value == type_id) {
          res = id.label;
        }
      });
      return res;
    };
    const search = () => {
      state.param.page_size = 10;
      getData();
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
      checkVipType,
      addNew,
      addVipNew,
      handleEdit,
      handleVipEdit,
      closeDialog,
      closeVipDialog,
      getData,
      search,
      onSizeChange,
      onCurrentChange,
      dateFormat,
      deleteHandler,
      windowRect: computed(() => store.state.app.windowRect),
      device: computed(() => store.state.app.device),
      language: computed(() => store.state.user.lang),
      findName,
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
