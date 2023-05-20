<template>
  <div
    v-loading="isLoading"
    element-loading-background="rgba(122, 122, 122, 0.3)"
  >
    <!-- <div class="form" v-permission:dislike:reason:list>
      <div class="form-content">
        <el-form label-position="top" label-width="300px">
          <el-form-item :label="t('banKeyword.filter.sensitive')">
            <el-input
              :placeholder="t('banKeyword.filter.sensitive_placeholder')"
              v-model="filterForm.content"
            />
          </el-form-item>

          here is system language

          <div style="margin-top: 34px" class="buttonBox">
            <el-button class="app-button" @click="search()">
              <font-awesome-icon
                icon="fa-solid fa-magnifying-glass"
                style="margin-right: 5px"
              />{{ t("common.search") }}</el-button
            >
            <el-button type="warning" @click="reset()">
              <font-awesome-icon
                icon="fa-solid fa-arrows-rotate"
                style="margin-right: 5px"
              />{{ t("common.reset") }}</el-button
            >
          </div>
        </el-form>
      </div>
    </div> -->

    <div class="table">
      <el-button
        @click="addNew"
        class="app-button"
        style="margin-bottom: 25px"
        v-permission:dislike:reason:add
        ><font-awesome-icon icon="fa-solid fa-plus" style="margin-right: 5px" />
        {{ t("common.addTo") }}</el-button
      >

      <el-table
        :data="tableList"
        :row-style="{ height: '55px' }"
        :header-row-style="{ height: '55px' }"
        :border="true"
        :max-height="825"
        row-key="id"
        v-permission:dislike:reason:list
      >
        <el-table-column prop="id" label="ID" align="center" />

        <el-table-column :label="t('feedback.icon')" align="center">
          <template #default="scope">
            {{ scope.row.icon ? scope.row.icon : "--" }}
          </template>
        </el-table-column>

        <el-table-column :label="t('feedback.content')" align="center">
          <template #default="scope">
            {{ findName(scope.row.content ?? []) }}
          </template>
        </el-table-column>

        <el-table-column :label="t('feedback.dislike_title')" align="center">
          <template #default="scope">
            {{ findName(scope.row.dislike_title ?? []) }}
          </template>
        </el-table-column>

        <el-table-column
          :label="t('noteLongVideo.categoryName')"
          align="center"
        >
          <template #default="scope">
            {{ findName(scope.row.category_name ?? []) }}
          </template>
        </el-table-column>

        <el-table-column
          :label="t('common.operate')"
          align="center"
          fixed="right"
        >
          <template #default="scope">
            <el-tooltip
              class="box-item"
              :content="t('common.addTo')"
              placement="top"
              v-if="scope.row.id"
            >
              <el-button
                type="primary"
                style="margin-left: 10px; margin-bottom: 5px"
                circle
                @click="handleAddChild(scope.row)"
                v-permission:dislike:reason:add
              >
                <font-awesome-icon icon="fa-solid fa-plus" />
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
                v-permission:dislike:reason:edit
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
                @click="deleteHandler(scope.row)"
                v-permission:dislike:reason:remove
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
          v-permission:longvideo:topic:list
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
  <AddChildDialog
    :show="showAddChildDialog"
    @closed="closeChildDialog"
    @created="search"
    @edited="search"
    :title="childDialog.dialogTitle"
    :data="childDialog.dialogData"
    :isAdd="childDialog.isAdd"
  />
</template>

<script>
import { onMounted, reactive, toRefs, computed } from "vue";
import Dialog from "./dialog.vue";
import AddChildDialog from "./childDialog.vue";
import http from "@/http";
import { useStore } from "vuex";
import { ElMessageBox, ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";

export default {
  name: "Banner",
  components: {
    Dialog,
    AddChildDialog,
  },
  setup() {
    const { t } = useI18n();

    const state = reactive({
      isLoading: false,
      showDialog: false,
      showAddChildDialog: false,
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
      childDialog: {
        dialogTitle: "",
        dialogData: {},
        isAdd: false,
      },
      tableList: [],
      total: 0,
    });

    const store = useStore();
    const getData = () => {
      state.isLoading = true;
      http.feedbackManagement.getDislikeItem(state.param).then((res) => {
        if (res.data.err_code == 0) {
          state.total = res.data.data.total;
          state.tableList = res.data.data.list;
          state.isLoading = false;
        }
      });
    };

    const addNew = () => {
      state.dialog.dialogTitle = t("common.addTo");
      state.dialog.dialogData = {};
      state.showDialog = true;
    };

    const handleEdit = (row) => {
      if (row.id) {
        state.dialog.dialogTitle = t("common.edit");
        state.dialog.dialogData = JSON.parse(JSON.stringify(row));
        state.showDialog = true;
      } else {
        handleEditChild(row);
      }
    };

    const deleteHandler = (row) => {
      if (row.id) {
        console.log(" here have row . id");
        ElMessageBox.confirm(t("common.wantToDelete"), t("common.warning"), {
          confirmButtonText: t("common.sure"),
          cancelButtonText: t("common.close"),
          type: "warning",
          draggable: true,
          closeOnClickModal: false,
        })
          .then(() => {
            http.feedbackManagement
              .deleteDislikeItem({ id: row.id })
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
      }
      //t("common.wantToDelete")
      else {
        ElMessageBox.confirm(
          "Sure want to delete reason",
          t("common.warning"),
          {
            confirmButtonText: t("common.sure"),
            cancelButtonText: t("common.close"),
            type: "warning",
            draggable: true,
            closeOnClickModal: false,
          }
        )
          .then(() => {
            http.feedbackManagement
              .deleteDislikeReason({ dislike_id: row.dislike_id })
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
      }
    };

    const closeDialog = () => {
      state.showDialog = false;
    };

    const handleAddChild = (row) => {
      state.childDialog.dialogTitle = t("common.addTo");
      state.childDialog.dialogData = row;
      state.showAddChildDialog = true;
      state.childDialog.isAdd = true;
    };

    const handleEditChild = (row) => {
      state.childDialog.dialogTitle = t("common.edit");
      state.childDialog.dialogData = row;
      state.showAddChildDialog = true;
      state.childDialog.isAdd = false;
    };

    const closeChildDialog = () => {
      state.showAddChildDialog = false;
    };

    const filter = () => {
      state.param.page = 1;
      if (state.filterForm.content) {
        state.param.content = state.filterForm.content;
      } else {
        state.param.content = undefined;
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

    onMounted(() => {
      getData();
    });

    return {
      ...toRefs(state),
      addNew,
      handleEdit,
      deleteHandler,
      closeDialog,
      search,
      getData,
      onSizeChange,
      onCurrentChange,
      reset,
      windowRect: computed(() => store.state.app.windowRect),
      device: computed(() => store.state.app.device),
      t,
      findName,
      handleAddChild,
      handleEditChild,
      closeChildDialog,
    };
  },
};
</script>

<style lang="scss" scoped></style>
