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
        v-permission:config:notice:add
        ><font-awesome-icon icon="fa-solid fa-plus" style="margin-right: 5px" />
        {{ t("common.addTo") }}</el-button
      >

      <el-table
        :data="tableList.tableData.list.notices"
        :row-style="{ height: '55px' }"
        :header-row-style="{ height: '55px' }"
        :border="true"
        v-permission:config:notice:list
        :max-height="825"
      >
        <el-table-column
          prop="notice_id"
          :label="t('notice.table.id')"
          align="center"
          width="150"
        />

        <el-table-column
          :label="t('notice.table.client')"
          align="center"
          width="150"
        >
          <template #default="scope">
            {{ checkClient(scope.row.notice_type) }}
          </template>
        </el-table-column>
        <!-- <el-table-column label="打开频率" align="center">
          <template #default="scope">
            {{ checkFrequency(scope.row.frequency) }}
          </template>
        </el-table-column> -->

        <el-table-column
          :label="t('notice.table.picture')"
          align="center"
          width="150"
        >
          <template #default="scope">
            <photo-provider v-if="scope.row.image_path">
              <photo-consumer
                :intro="scope.row.image_path"
                :key="scope.row.image_path"
                :src="scope.row.image_path"
              >
                <img
                  :src="scope.row.image_path"
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

        <el-table-column
          :label="t('notice.table.title')"
          align="center"
          width="200"
        >
          <template #default="scope">
            {{ findName(scope.row.title) }}
          </template>
        </el-table-column>

        <el-table-column
          :label="t('notice.table.content')"
          align="center"
          width="400"
        >
          <template #default="scope">
            {{ findName(scope.row.content) }}
          </template>
        </el-table-column>

        <el-table-column
          prop="type_str"
          :label="t('notice.table.link')"
          align="center"
          width="300"
        />

        <el-table-column
          :label="t('notice.table.state')"
          align="center"
          width="100"
        >
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="0"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="changeStatus(scope.row)"
              v-permission:config:notice:edit
            />
          </template>
        </el-table-column>

        <el-table-column
          :label="t('common.operate')"
          align="center"
          width="120"
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
                v-permission:config:notice:edit
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
                style="margin-bottom: 5px"
                circle
                @click="deleteHandler(scope.row.notice_id)"
                v-permission:config:notice:remove
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
          v-permission:config:notice:list
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
import { useI18n } from "vue-i18n";

export default {
  name: "Notice",
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
    const tableList = useTableData(http.systemManagement.getNoticeList);
    const store = useStore();

    const addNew = () => {
      state.dialog.dialogTitle = t("common.addTo");
      state.dialog.dialogData = {};
      state.dialog.dialogData.notice_type = 0;
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
            notice_id: row.notice_id,
          };

          http.systemManagement.updateNoticeStatus(param).then((res) => {
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
          http.systemManagement
            .deleteNoticeList({ notice_id: id })
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

    const checkClient = (notice_type) => {
      if (notice_type == 0) {
        return t("notice.dialog.all");
      } else if (notice_type == 2) {
        return t("notice.dialog.ios");
      } else if (notice_type == 1) {
        return t("notice.dialog.android");
      } else if (notice_type == 3) {
        return "H5";
      } else {
        return "--";
      }
    };

    const checkFrequency = (frequency) => {
      if (frequency == 0) {
        return "一次";
      } else if (frequency == 1) {
        return "每天";
      } else {
        return "每次";
      }
    };

    const search = () => {
      state.param.page_size = 10;
      tableList.setParams(state.param);
    };

    const checkLanguageTitle = (contents, language) => {
      if (contents.length) {
        switch (language) {
          case "zh":
            return contents[0].title;
            break;
          case "hk":
            return contents[1].title;
            break;
          case "en":
            return contents[2].title;
            break;
          case "vi":
            return contents[3].title;
            break;
          case "id":
            return contents[4].title;
            break;
          default:
            break;
        }
      } else {
        return "";
      }
    };

    const checkLanguageContent = (contents, language) => {
      if (contents.length) {
        switch (language) {
          case "zh":
            return contents[0].content;
            break;
          case "hk":
            return contents[1].content;
            break;
          case "en":
            return contents[2].content;
            break;
          case "vi":
            return contents[3].content;
            break;
          case "id":
            return contents[4].content;
            break;
          default:
            break;
        }
      } else {
        return "";
      }
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
      deleteHandler,
      changeStatus,
      checkClient,
      checkFrequency,
      checkLanguageTitle,
      checkLanguageContent,
      windowRect: computed(() => store.state.app.windowRect),
      device: computed(() => store.state.app.device),
      t,
      store,
      findName,
    };
  },
};
</script>

<style lang="scss" scoped>
.publish {
  color: #67c23a;
}

.unpublish {
  color: #f56c6c;
}
</style>
