<template>
  <div
    v-loading="isLoading"
    element-loading-background="rgba(122, 122, 122, 0.3)"
  >
    <div class="table">
      <el-button
        @click="addNew"
        class="app-button"
        style="margin-bottom: 25px"
        v-permission:feedback:reason:add
        ><font-awesome-icon icon="fa-solid fa-plus" style="margin-right: 5px" />
        {{ t("common.addTo") }}</el-button
      >
      <el-table
        :data="tableList"
        :row-style="{ height: '55px' }"
        :header-row-style="{ height: '55px' }"
        :border="true"
        :max-height="825"
        v-permission:feedback:reason:list
      >
        <el-table-column
          prop="reason_id"
          :label="t(`feedback.reason_id`)"
          align="center"
        />
        <el-table-column
          prop="reason_type"
          :label="t(`feedback.reason_type`)"
          align="center"
        >
          <template #default="scope">
            {{ check_type(scope.row.reason_type) }}
          </template>
        </el-table-column>
        <el-table-column
          :label="t(`feedback.content`)"
          align="center"
          width="400px"
        >
          <template #default="scope">
            {{ findName(scope.row.reason_title) }}
          </template>
        </el-table-column>
        <!-- <el-table-column
          :label="t(`feedback.status`)"
          align="center"
          width="400px"
        >
          <template #default="scope">
            <span :class="scope.row.status == 1 ? 'enabled' : 'disabled'">
              {{
                scope.row.status == 1
                  ? t("common.enabled")
                  : t("common.disabled")
              }}
            </span>
          </template>
        </el-table-column> -->

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
                v-permission:feedback:reason:edit
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
                @click="deleteHandler(scope.row.reason_id)"
                v-permission:feedback:reason:remove
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
          :total="total"
          :small="device === 'mobile' ? true : false"
          v-permission:feedback:reason:list
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
  name: "FeedbackReason",
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
      http.feedbackManagement.getFeedbackReason(state.param).then((res) => {
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
    const check_type = (val) => {
      switch (val) {
        case 1:
          return t("feedback.play_list");
        case 2:
          return t("feedback.note_list");
        case 3:
          return t("feedback.user_list");
        default:
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
          http.feedbackManagement
            .deleteFeedbackReason({ reason_id: id })
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
      check_type,
      deleteHandler,
    };
  },
};
</script>

<style lang="scss" scoped>
.carousel {
  position: relative;
}

#showCount {
  color: white;
  position: absolute;
  width: 55px;
  height: 55px;
  background: rgba(0, 0, 0, 0.5);
  z-index: 3;
  text-align: center;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
  cursor: pointer;
  border-radius: 5px;
}

.enabled {
  color: #67c23a;
}
.disabled {
  color: #f56c6c;
}
</style>
