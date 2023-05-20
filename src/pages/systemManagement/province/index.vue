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
        v-permission:system:province:add
        ><font-awesome-icon icon="fa-solid fa-plus" style="margin-right: 5px" />
        {{ t("common.addTo") }}</el-button
      >

      <el-table
        :data="tableList.tableData.list.data"
        :row-style="{ height: '55px' }"
        :header-row-style="{ height: '55px' }"
        :border="true"
        v-permission:system:province:list
        :max-height="825"
      >
        <el-table-column
          prop="province_id"
          :label="t('province.table.id')"
          align="center"
        />
        <el-table-column
          prop="province_code"
          :label="t('province.table.code')"
          align="center"
        />
        <el-table-column
          :label="t('province.table.name')"
          align="center"
          width="150px"
        >
          <template #default="scope">
            {{ findName(scope.row.province_name) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="short_name"
          :label="t('province.table.abbreviation')"
          align="center"
        >
          <template #default="scope">
            {{ findName(scope.row.short_name) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="lat"
          :label="t('province.table.lat')"
          align="center"
        />
        <el-table-column
          prop="lng"
          :label="t('province.table.lng')"
          align="center"
        />
        <el-table-column
          prop="sort"
          :label="t('province.table.sort')"
          align="center"
        />

        <el-table-column
          :label="t('province.table.created_at')"
          align="center"
          width="150px"
        >
          <template #default="scope">
            <span>{{ originalDate(scope.row.gmt_create) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="t('province.table.updated_at')"
          align="center"
          width="150px"
        >
          <template #default="scope">
            <span>{{ originalDate(scope.row.gmt_modified) }}</span>
          </template>
        </el-table-column>

        <el-table-column :label="t('common.operate')" align="center">
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
                v-permission:system:province:edit
              >
                <font-awesome-icon icon="fa-solid fa-file-pen" />
              </el-button>
            </el-tooltip>

            <el-tooltip
              class="box-item"
              :content="t('common.delete')"
              placement="top"
            >
              <el-button
                type="danger"
                circle
                style="margin-bottom: 5px"
                @click="deleteHandler(scope.row.province_id)"
                v-permission:system:province:remove
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
          v-permission:system:province:list
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
import { ElMessageBox, ElMessage } from "element-plus";
import { originalDate } from "@/utils/timeFormat.js";
import { useI18n } from "vue-i18n";

export default {
  name: "Province",
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
    const tableList = useTableData(http.systemManagement.getProvinceList);
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
          };

          http.systemManagement.updateBannerStatus(param).then((res) => {
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

    const deleteHandler = (id) => {
      ElMessageBox.confirm(t("common.wantToDelete"), t("common.warning"), {
        confirmButtonText: t("common.sure"),
        cancelButtonText: t("common.close"),
        type: "warning",
        draggable: true,
        closeOnClickModal: false,
      })
        .then(() => {
          http.systemManagement.deleteProvinceList({ id: id }).then((res) => {
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
      state.param.page_size = 10;
      tableList.setParams(state.param);
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
      changeStatus,
      originalDate,
      deleteHandler,
      windowRect: computed(() => store.state.app.windowRect),
      device: computed(() => store.state.app.device),
      t,
      findName,
    };
  },
};
</script>

<style lang="scss" scoped></style>
