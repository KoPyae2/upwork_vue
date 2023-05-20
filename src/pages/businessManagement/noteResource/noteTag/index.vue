<template>
  <div
    element-loading-background="rgba(122, 122, 122, 0.3)"
    v-loading="tableList.tableData.isLoading"
  >
    <div class="card">
      <div class="form" v-permission:resource:tag:list>
        <div class="form-title">{{ t("noteResource.popularTags") }}</div>
        <div class="form-content">
          <template v-for="item in hotList" :key="item">
            <el-button
              class="hover-button"
              type="primary"
              style="margin-left: 25px; margin-bottom: 15px; position: relative"
            >
              <span>{{ findName(item.name) }}</span>

              <font-awesome-icon
                icon="fa-solid fa-circle-xmark"
                class="icon-x"
                @click="removeHot(item)"
              />
            </el-button>
          </template>
        </div>
      </div>
    </div>
    <div class="table">
      <el-button
        @click="addNew"
        class="app-button"
        style="margin-bottom: 25px"
        v-permission:resource:tag:add
        ><font-awesome-icon icon="fa-solid fa-plus" style="margin-right: 5px" />
        {{ t("noteResource.addTo") }}</el-button
      >

      <el-button
        @click="addNewType"
        class="app-button"
        style="margin-bottom: 25px"
        v-permission:resource:tag:add
        ><font-awesome-icon icon="fa-solid fa-plus" style="margin-right: 5px" />
        {{ t("noteResource.addLabelType") }}</el-button
      >
      <el-table
        :data="tableList.tableData.list.tag_list"
        :row-style="{ height: '55px' }"
        :header-row-style="{ height: '55px' }"
        :border="true"
        v-permission:resource:tag:list
        :max-height="825"
      >
        <el-table-column
          prop="type_id"
          :label="t('noteResource.labelTypeID')"
          align="center"
        />
        <el-table-column :label="t('noteResource.labelType')" align="center">
          <template #default="scope">
            <span class="primary" @click="handleTypeEdit(scope.row)">{{
              findName(scope.row.type_name)
            }}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="sort"
          :label="t('noteResource.toSort')"
          align="center"
        />

        <el-table-column :label="t('noteResource.label')" align="center">
          <template #default="scope">
            {{ findName(scope.row.name) }}
          </template>
        </el-table-column>
        <el-table-column :label="t('noteResource.isPopular')" align="center">
          <template #default="scope">
            <span :class="checkHot(scope.row.is_hot)">{{
              scope.row.is_hot == 1 ? t("common.yes") : t("common.no")
            }}</span>
          </template>
        </el-table-column>

        <el-table-column
          :label="t('common.operate')"
          align="center"
          fixed="right"
        >
          <template #default="scope">
            <el-button
              size="small"
              type="success"
              style="margin-left: 10px; margin-bottom: 5px"
              @click="handlePopular(scope.row)"
              v-if="scope.row.is_hot == 0"
              v-permission:resource:tag:edit
            >
              {{ t("noteResource.popular") }}
            </el-button>

            <el-button
              size="small"
              type="danger"
              style="margin-left: 10px; margin-bottom: 5px"
              @click="handlePopular(scope.row)"
              v-else
              v-permission:resource:tag:edit
            >
              {{ t("noteResource.unpopular") }}
            </el-button>
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
                v-permission:resource:tag:edit
              >
                <font-awesome-icon icon="fa-solid fa-file-pen" />
              </el-button>
            </el-tooltip>

            <el-tooltip
              class="box-item"
              :content="t('common.disabled')"
              placement="top"
              v-if="scope.row.status == 1"
            >
              <el-button
                type="danger"
                circle
                style="margin-bottom: 5px"
                @click="disableHandler(scope.row)"
                v-permission:resource:tag:edit
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
                circle
                style="margin-bottom: 5px"
                @click="disableHandler(scope.row)"
                v-permission:resource:tag:edit
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
          v-permission:resource:tag:list
        >
        </el-pagination>
      </div>
    </div>
  </div>

  <Dialog
    :show="showDialog"
    @closed="closeDialog"
    @created="search"
    @edited="edited"
    :title="dialog.dialogTitle"
    :data="dialog.dialogData"
    :tags="noteTagList"
  />

  <TypeDialog
    :show="showTypeDialog"
    @closed="closeTypeDialog"
    @created="search"
    :title="dialog.dialogTitle"
    :data="dialog.dialogData"
    :tags="noteTagList"
  />
</template>

<script>
import { onMounted, reactive, toRefs, computed } from "vue";
import Dialog from "./dialog.vue";
import TypeDialog from "./typeDialog.vue";
import http from "@/http";
import { useStore } from "vuex";
import useTableData from "@/hooks/useTableData.js";
import { ElMessageBox, ElMessage } from "element-plus";
import { dateFormat } from "@/utils/timeFormat.js";
import { useI18n } from "vue-i18n";

export default {
  name: "NoteTag",
  components: {
    Dialog,
    TypeDialog,
  },
  setup() {
    const { t } = useI18n();
    const state = reactive({
      isLoading: true,
      showDialog: false,
      showTypeDialog: false,
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
      noteTagList: [],
      hotList: [],
    });

    const tableList = useTableData(http.businessManagement.getNoteTagList);
    const store = useStore();

    const addNew = () => {
      state.dialog.dialogTitle = t("common.addTo");
      state.dialog.dialogData = {};
      state.showDialog = true;
    };

    const addNewType = () => {
      state.dialog.dialogTitle = t("common.addTo");
      state.dialog.dialogData = {};
      state.showTypeDialog = true;
    };

    const handleEdit = (row) => {
      state.dialog.dialogTitle = t("common.edit");
      state.dialog.dialogData = JSON.parse(JSON.stringify(row));
      state.showDialog = true;
    };

    const handleTypeEdit = (row) => {
      state.dialog.dialogTitle = t("common.edit");
      state.dialog.dialogData = JSON.parse(JSON.stringify(row));
      state.showTypeDialog = true;
    };

    const closeDialog = () => {
      state.showDialog = false;
    };

    const closeTypeDialog = () => {
      state.showTypeDialog = false;
    };

    const filter = () => {
      state.param = {
        page: 1,
      };
      if (state.filterForm.name) {
        state.param.name = state.filterForm.name;
      }
    };

    const onSizeChange = (val) => {
      state.param.page_size = val;
      tableList.setParams(state.param);
    };
    const onCurrentChange = (val) => {
      state.param.page = val;
      tableList.setParams(state.param);
    };

    const search = () => {
      filter();
      state.param.page_size = 10;
      tableList.setParams(state.param);
    };

    const edited = () => {
      tableList.setParams(state.param);
    };

    const checkHot = (hot) => {
      if (hot == 1) {
        return "success";
      } else {
        return "danger";
      }
    };

    const findHotList = () => {
      http.businessManagement.getNoteTagList({ is_hot: 1 }).then((res) => {
        if (res.data.err_code == 0) {
          state.hotList = res.data.data.tag_list;
        }
      });
    };

    const handlePopular = (row) => {
      let param = {
        id: row.id,
        is_hot: row.is_hot == 1 ? 0 : 1,
        name: row.name,
        resource_icon: row.resource_icon,
        resource_url: row.resource_url,
        sort: row.sort,
        status: row.status,
        type_id: row.type_id,
      };

      ElMessageBox.confirm(t("common.wantToChange"), t("common.warning"), {
        confirmButtonText: t("common.sure"),
        cancelButtonText: t("common.close"),
        type: "warning",
        draggable: true,
        closeOnClickModal: false,
      })
        .then(() => {
          http.businessManagement.updateNoteTagList(param).then((res) => {
            if (res.data.err_code == 0) {
              tableList.setParams(state.param);
              findHotList();
              ElMessage.success(t(`error.${res.data.err_code}`));
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

    const disableHandler = (row) => {
      let param = {
        id: row.id,
        status: row.status == 1 ? 0 : 1,
        is_hot: row.is_hot,
        name: row.name,
        resource_icon: row.resource_icon,
        resource_url: row.resource_url,
        sort: row.sort,
        type_id: row.type_id,
      };

      ElMessageBox.confirm(t("common.wantToChange"), t("common.warning"), {
        confirmButtonText: t("common.sure"),
        cancelButtonText: t("common.close"),
        type: "warning",
        draggable: true,
        closeOnClickModal: false,
      })
        .then(() => {
          http.businessManagement.updateNoteTagList(param).then((res) => {
            if (res.data.err_code == 0) {
              tableList.setParams(state.param);
              ElMessage.success(t(`error.${res.data.err_code}`));
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

    const removeHot = (item) => {
      ElMessageBox.confirm(t("noteResource.removeHot"), t("common.warning"), {
        confirmButtonText: t("common.sure"),
        cancelButtonText: t("common.close"),
        type: "warning",
        draggable: true,
        closeOnClickModal: false,
      })
        .then(() => {
          let param = {
            id: item.id,
            is_hot: 0,
            name: item.name,
            resource_icon: item.resource_icon,
            resource_url: item.resource_url,
            sort: item.sort,
            status: item.status,
            type_id: item.type_id,
          };

          http.businessManagement.updateNoteTagList(param).then((res) => {
            if (res.data.err_code == 0) {
              tableList.setParams(state.param);
              ElMessage.success(t(`error.${res.data.err_code}`));
              findHotList();
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

    const findById = (data) => {
      const tag = state.noteTagList.filter((d) => d.type_id == data);

      if (tag.length > 0) {
        const index = tag[0].type_name.findIndex(
          (x) => x.lang == store.state.user.lang
        );

        if (index !== -1) {
          return tag[0].type_name[index].content;
        } else {
          return "--";
        }
      } else {
        return "--";
      }
    };

    onMounted(() => {
      http.businessManagement.getNoteTagType().then((res) => {
        if (res.data.err_code == 0) {
          state.noteTagList = res.data.data.tag_list;
        }
      });

      findHotList();
    });

    return {
      t,
      ...toRefs(state),
      handleEdit,
      handleTypeEdit,
      closeDialog,
      closeTypeDialog,
      tableList,
      search,
      edited,
      onCurrentChange,
      onSizeChange,
      dateFormat,
      addNew,
      addNewType,
      checkHot,
      handlePopular,
      disableHandler,
      removeHot,
      windowRect: computed(() => store.state.app.windowRect),
      device: computed(() => store.state.app.device),
      findName,
      findById,
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

.primary {
  color: #409eff;
  cursor: pointer;
}

.form-content {
  box-shadow: none !important;
  border: 2px solid #000;
}
.card {
  padding: 25px;
  background: $cardBg;
  border-radius: 15px;
  margin-bottom: 20px;
  .form-title {
    color: $header_text;
  }
}
.icon-x {
  position: absolute;
  color: #f56c6c;
  background: #fff;
  border-radius: 50%;
  top: -10px;
  right: -10px;
  cursor: pointer;
  font-size: 16px;
}
.icon-x {
  display: none;
}
.hover-button:hover .icon-x {
  display: block !important;
}
</style>
