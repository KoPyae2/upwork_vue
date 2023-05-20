<template>
  <div
    v-loading="isLoading"
    element-loading-background="rgba(122, 122, 122, 0.3)"
  >
    <div class="table">
      <el-button @click="addNew" class="app-button" style="margin-bottom: 25px"
        ><font-awesome-icon icon="fa-solid fa-plus" style="margin-right: 5px" />
        {{ t("common.addTo") }}</el-button
      >
      <!-- v-permission:feedback:helpreason:add -->
      <el-table
        :data="tableList"
        :row-style="{ height: '55px' }"
        :header-row-style="{ height: '55px' }"
        :border="true"
        :max-height="825"
        v-permission:feedback:helpreason:list
      >
        <el-table-column prop="id" label="ID" align="center" />

        <el-table-column
          :label="t('common.title')"
          align="center"
          width="400px"
        >
          <template #default="scope">
            {{ findName(scope.row.title) }}
          </template>
        </el-table-column>

        <el-table-column
          :label="t('common.description')"
          align="center"
          width="400px"
        >
          <template #default="scope">
            {{ findName(scope.row.desc) }}
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
              >
                <font-awesome-icon icon="fa-solid fa-file-pen" />
              </el-button>
            </el-tooltip>
            <!-- v-permission:feedback:helpreason:edit -->

            <el-tooltip
              class="box-item"
              :content="t('common.delete')"
              placement="top"
            >
              <el-button
                type="danger"
                circle
                style="margin-bottom: 5px"
                @click="deleteHandler(scope.row.id)"
              >
                <font-awesome-icon icon="fa-solid fa-trash" />
              </el-button>
            </el-tooltip>
            <!-- v-permission:feedback:helpreason:remove -->
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
          v-permission:feedback:helpreason:list
        >
        </el-pagination>
      </div>
    </div>
  </div>

  <Dialog
    :show="showDialog"
    @closed="closeDialog"
    @created="search"
    @edited="getData"
    :title="dialog.dialogTitle"
    :data="dialog.dialogData"
  />
</template>

<script>
import { onMounted, reactive, toRefs, computed } from "vue";
import http from "@/http";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";
import Dialog from "./dialog.vue";
import { ElMessageBox, ElMessage } from "element-plus";
export default {
  name: "HelpReason",
  components: { Dialog },
  setup() {
    const state = reactive({
      isLoading: true,
      showDialog: false,
      dialog: {
        dialogTitle: "",
        dialogData: {},
      },
      filterForm: {},
      pageList: [10, 20, 60, 80, 100],
      param: {
        page: 1,
        page_size: 10,
      },
      tableList: [],
      total: 0,
    });

    const store = useStore();
    const { t } = useI18n();
    const getData = () => {
      state.isLoading = true;
      http.feedbackManagement.gethelpReason(state.param).then((res) => {
        if (res.data.err_code == 0) {
          state.isLoading = false;
          state.total = res.data.data.total;
          state.tableList = res.data.data.list;
        }
      });
    };

    const handleEdit = (row) => {
      state.dialog.dialogTitle = t(`common.edit`);
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

    const multipleCardPreview = (id) => {
      document.getElementById(id).click();
    };

    const filter = () => {
      state.param = {
        page: 1,
      };

      if (state.filterForm.content) {
        state.param.uid_or_content = state.filterForm.content;
      }

      if (state.filterForm.dateValue && state.filterForm.dateValue.length) {
        state.param.start_time = `${state.filterForm.dateValue[0]} 00:00:00`;
        state.param.end_time = `${state.filterForm.dateValue[1]} 23:59:59`;
      }
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
      filter();
      state.param.page_size = 10;
      getData();
    };

    const reset = () => {
      state.filterForm = {};
      search();
    };
    const findName = (data) => {
      const index = data.findIndex((x) => x.lang == store.state.user.lang);

      if (index !== -1) {
        return data[index].content;
      } else {
        return "--";
      }
    };
    const check_status = (val) => {
      switch (val) {
        case 1:
          return t("common.enabled");
        case 2:
          return t("common.disabled");

        default:
          return "--";
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
          http.feedbackManagement.deleteHelpReason({ id: id }).then((res) => {
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
    onMounted(() => {
      getData();
    });

    return {
      ...toRefs(state),
      closeDialog,
      search,
      onSizeChange,
      onCurrentChange,
      reset,
      multipleCardPreview,
      check_status,
      handleEdit,
      getData,
      windowRect: computed(() => store.state.app.windowRect),
      device: computed(() => store.state.app.device),
      t,
      addNew,
      findName,
      deleteHandler,
    };
  },
};
</script>

<style lang="scss" scoped>
.enabled {
  color: #67c23a;
}
.disabled {
  color: #f56c6c;
}
</style>
