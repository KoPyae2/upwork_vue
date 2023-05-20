<template>
  <div
    element-loading-background="rgba(122, 122, 122, 0.3)"
    v-loading="tableList.tableData.isLoading"
  >
    <div class="form" v-permission:system:game:list>
      <div class="form-content">
        <el-form label-position="top" label-width="300px">
          <el-form-item label="游戏名称">
            <el-input
              placeholder="请输入游戏名称"
              v-model="filterForm.game_name"
            />
          </el-form-item>

          <el-form-item label="发布时间:" style="min-width: 300px">
            <el-date-picker
              v-model="filterForm.dateValue"
              type="daterange"
              value-format="YYYY-MM-DD"
              unlink-panels
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
            />
          </el-form-item>

          <el-form-item label="状态">
            <el-select
              :multiple="false"
              placeholder="请输入发布状态"
              style="width: 100%"
              v-model="filterForm.status"
              default-first-option
            >
              <el-option
                v-for="item in statusList"
                :key="item"
                :value="item.value"
                :label="item.label"
              />
            </el-select>
          </el-form-item>

          <div style="margin-top: 34px" class="buttonBox">
            <el-button class="app-button" @click="search()">
              <font-awesome-icon
                icon="fa-solid fa-magnifying-glass"
                style="margin-right: 5px"
              />重置</el-button
            >
          </div>
        </el-form>
      </div>
    </div>

    <div class="table">
      <el-button
        @click="addNew"
        class="app-button"
        style="margin-bottom: 25px"
        v-permission:system:game:add
        ><font-awesome-icon icon="fa-solid fa-plus" style="margin-right: 5px" />
        {{ t("common.addTo") }}</el-button
      >

      <el-table
        :data="tableList.tableData.list.data"
        :row-style="{ height: '55px' }"
        :header-row-style="{ height: '55px' }"
        :border="true"
        v-permission:system:game:list
        :max-height="825"
      >
        <el-table-column prop="id" label="用户ID" align="center" />

        <el-table-column prop="game_name" label="游戏名称" align="center" />

        <el-table-column label="游戏图标" align="center">
          <template #default="scope">
            <photo-provider v-if="scope.row.game_icon">
              <photo-consumer
                :intro="scope.row.game_icon"
                :key="scope.row.game_icon"
                :src="scope.row.game_icon"
              >
                <img
                  :src="scope.row.game_icon"
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

        <el-table-column prop="game_url" label="跳转地址" align="center" />
        <el-table-column prop="to_sort" label="排序" align="center" />
        <el-table-column prop="play_times" label="跳转次数" align="center" />
        <el-table-column label="发布时间" align="center" width="160px">
          <template #default="scope">
            <span v-if="scope.row.launch_time">{{
              scope.row.launch_time
            }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>

        <el-table-column label="状态" align="center">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="2"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @click="changeStatus(scope.row)"
              v-permission:system:game:edit
            />
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-tooltip
              class="box-item"
              content="编辑"
              placement="top"
              v-permission:system:game:edit
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
            <el-tooltip
              class="box-item"
              content="删除"
              placement="top"
              v-permission:system:game:remove
            >
              <el-button
                type="danger"
                style="margin-bottom: 5px"
                circle
                @click="deleteHandler(scope.row.id)"
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
          v-permission:system:game:list
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
  name: "Game",
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
      },
      dialog: {
        dialogTitle: "",
        dialogData: {},
      },
      tableHeight: 0,
      statusList: [
        {
          value: "1",
          label: "显示",
        },
        {
          value: "2",
          label: "隐藏",
        },
      ],
    });

    const tableList = useTableData(http.systemManagement.getGameList);
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
      if (state.filterForm.game_name) {
        state.param.game_name = state.filterForm.game_name;
      }

      if (state.filterForm.status) {
        state.param.status = state.filterForm.status;
      }

      if (state.filterForm.dateValue && state.filterForm.dateValue.length) {
        state.param.start_time = `${state.filterForm.dateValue[0]} 00:00:00`;

        state.param.end_time = `${state.filterForm.dateValue[1]} 23:59:59`;
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
            status: parseInt(row.status),
          };

          http.systemManagement.updateGameList(param).then((res) => {
            if (res.data.err_code == 0) {
              ElMessage.success(t(`error.${res.data.err_code}`));
              search();
            } else {
              ElMessage.error(t(`error.${res.data.err_code}`));
            }
          });
        })
        .catch(() => {
          search();
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
          http.systemManagement.deleteGameList({ id: id }).then((res) => {
            if (res.data.err_code == 0) {
              ElMessage.success(t(`error.${res.data.err_code}`));
              tableList.setParams(state.param);
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
      filter();
      state.param.page_size = 10;
      tableList.setParams(state.param);
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
      deleteHandler,
      originalDate,
      windowRect: computed(() => store.state.app.windowRect),
      device: computed(() => store.state.app.device),
    };
  },
};
</script>

<style lang="scss" scoped></style>
