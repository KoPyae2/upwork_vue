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
        v-permission:longvideo:tag:add
        ><font-awesome-icon icon="fa-solid fa-plus" style="margin-right: 5px" />
        {{ t("common.addTo") }}</el-button
      >

      <el-table
        :data="tableList"
        :row-style="{ height: '55px' }"
        :header-row-style="{ height: '55px' }"
        :border="true"
        v-permission:longvideo:tag:list
        :max-height="825"
      >
        <el-table-column prop="type_id" label="ID" align="center" />
        <el-table-column
          prop="is_sort"
          :label="t('noteLongVideo.toSort')"
          align="center"
        />
        <el-table-column
          prop="type_name"
          :label="t('noteLongVideo.categoryName')"
          align="center"
        >
          <template #default="scope">
            {{ findName(scope.row.type_name) }}
          </template>
        </el-table-column>

        <el-table-column :label="t('noteLongVideo.icon')" align="center">
          <template #default="scope">
            <photo-provider v-if="scope.row.icon">
              <photo-consumer
                :intro="scope.row.icon"
                :key="scope.row.icon"
                :src="scope.row.icon"
              >
                <img
                  :src="scope.row.icon"
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
          prop="vod_count"
          :label="t('noteLongVideo.numOfVideos')"
          align="center"
        />
        <el-table-column :label="t('noteLongVideo.status')" align="center">
          <template #default="scope">
            <span :class="scope.row.status == 1 ? 'success' : 'danger'">{{
              scope.row.status == 1 ? t("common.normal") : t("common.disabled")
            }}</span>
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
              :content="t('common.edit')"
              placement="top"
            >
              <el-button
                type="primary"
                style="margin-left: 10px; margin-bottom: 5px"
                circle
                @click="handleEdit(scope.row)"
                v-permission:longvideo:tag:edit
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
                @click="changeStatus(scope.row)"
                v-permission:longvideo:tag:edit
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
                @click="changeStatus(scope.row)"
                v-permission:longvideo:tag:edit
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
          v-permission:longvideo:tag:list
        >
        </el-pagination>
      </div>
    </div>
  </div>

  <Dialog
    :show="showDialog"
    @closed="closeDialog"
    @created="search"
    @updated="getData"
    :title="dialog.dialogTitle"
    :data="dialog.dialogData"
  />
</template>

<script>
import { onMounted, reactive, toRefs, computed } from "vue";
import Dialog from "./dialog.vue";
import http from "@/http";
import { useStore } from "vuex";
import { dateFormat } from "@/utils/timeFormat.js";
import { ElMessageBox, ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";

export default {
  name: "VodType",
  components: {
    Dialog,
  },
  setup() {
    const { t } = useI18n();
    const state = reactive({
      isLoading: true,
      showDialog: false,
      filterForm: {},
      pageList: [10, 20, 60, 80, 100],
      param: {
        page: 1,
        page_size: 10,
        status: 5,
      },
      dialog: {
        dialogTitle: "",
        dialogData: {},
      },
      tableList: [],
      total: 0,
    });

    const getData = () => {
      state.isLoading = true;
      http.businessManagement.getNoteLongVideoType(state.param).then((res) => {
        if (res.data.err_code == 0) {
          state.isLoading = false;
          state.total = res.data.data.total;
          state.tableList = res.data.data.video_type;
        }
      });
    };
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

    const filter = () => {
      state.param = {
        page: 1,
        status: 5,
      };
      if (state.filterForm.name) {
        state.param.name = state.filterForm.name;
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
            type_id: row.type_id,
            status: row.status == 1 ? 0 : 1,

            type_name: row.type_name,
            is_sort: row.is_sort,
            vod_count: row.vod_count,
            is_recommend: 1,
            recommend_grid: row.recommend_grid,
          };

          http.businessManagement.updateNoteLongVideoType(param).then((res) => {
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
        if (
          data[index].content == null ||
          data[index].content == "" ||
          data[index].content == undefined
        ) {
          return "--";
        }
        return data[index].content;
      } else {
        return "--";
      }
    };

    onMounted(() => {
      getData();
    });

    return {
      t,
      ...toRefs(state),
      addNew,
      handleEdit,
      closeDialog,
      dateFormat,
      getData,
      search,
      onSizeChange,
      onCurrentChange,
      changeStatus,
      findName,
      windowRect: computed(() => store.state.app.windowRect),
      device: computed(() => store.state.app.device),
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
