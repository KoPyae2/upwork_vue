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
        v-permission:user:level:add
        ><font-awesome-icon icon="fa-solid fa-plus" style="margin-right: 5px" />
        添加</el-button
      >

      <el-table
        :data="tableList.tableData.list.users"
        :row-style="{ height: '55px' }"
        :header-row-style="{ height: '55px' }"
        :border="true"
        v-permission:user:level:list
        :max-height="825"
      >
        <el-table-column prop="level_id" label="等级 ID" align="center" />
        <el-table-column prop="level_name" label="特权名称" align="center" />
        <el-table-column label="等级图标" align="center">
          <template #default="scope">
            <photo-provider v-if="scope.row.level_icon">
              <photo-consumer
                :intro="scope.row.level_icon"
                :key="scope.row.level_icon"
                :src="scope.row.level_icon"
              >
                <img
                  :src="scope.row.level_icon"
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

        <el-table-column label="背景图片" align="center">
          <template #default="scope">
            <photo-provider v-if="scope.row.background_img">
              <photo-consumer
                :intro="scope.row.background_img"
                :key="scope.row.background_img"
                :src="scope.row.background_img"
              >
                <img
                  :src="scope.row.background_img"
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

        <el-table-column label="展示图" align="center">
          <template #default="scope">
            <photo-provider v-if="scope.row.show_icon">
              <photo-consumer
                :intro="scope.row.show_icon"
                :key="scope.row.show_icon"
                :src="scope.row.show_icon"
              >
                <img
                  :src="scope.row.show_icon"
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

        <el-table-column prop="description" label="备注" align="center" />

        <!-- <el-table-column label="是否推荐" align="center">
          <template #default="scope">
            <span :class="scope.row.is_recommend == 1 ? 'success' : 'danger'">{{
              scope.row.is_recommend == 1 ? "是" : "否"
            }}</span>
          </template>
        </el-table-column> -->

        <el-table-column
          prop="deposit_amount"
          label="购买金额"
          align="center"
        />

        <el-table-column
          prop="expire_time"
          label="权限时长（天）"
          align="center"
        />

        <el-table-column
          prop="can_watch_time"
          label="观看时间（秒）"
          align="center"
        />

        <!-- <el-table-column label="状态" align="center">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="0"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="changeStatus(scope.row)"
              v-permission:user:level:edit
            />
          </template>
        </el-table-column> -->

        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-tooltip class="box-item" content="编辑" placement="top">
              <el-button
                type="primary"
                style="margin-left: 10px; margin-bottom: 5px"
                circle
                @click="handleEdit(scope.row)"
                v-permission:user:level:edit
              >
                <font-awesome-icon icon="fa-solid fa-file-pen" />
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
          v-permission:user:level:list
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
import { dateFormat } from "@/utils/timeFormat.js";
import { useI18n } from "vue-i18n";

export default {
  name: "UserLevel",
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
    });

    const tableList = useTableData(http.userManagement.getUserLevel);
    const store = useStore();

    const handleEdit = (row) => {
      state.dialog.dialogTitle = "修改";
      state.dialog.dialogData = JSON.parse(JSON.stringify(row));
      state.showDialog = true;
    };

    const addNew = () => {
      state.dialog.dialogTitle = "添加";
      state.dialog.dialogData = {};
      state.showDialog = true;
    };

    const closeDialog = () => {
      state.showDialog = false;
    };

    const filter = () => {
      state.param = {
        page: 1,
      };
      if (state.filterForm.name) {
        state.param.name = state.filterForm.name;
      }
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
            level_id: row.level_id,
            status: row.status,
            background_img: row.background_img,
            can_watch_time: row.can_watch_time,
            deposit_amount: row.deposit_amount,
            description: row.description,
            expire_time: row.expire_time,
            is_recommend: row.is_recommend,
            level_icon: row.level_icon,
            level_name: row.level_name,
          };

          http.userManagement.updateUserLevel(param).then((res) => {
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

    onMounted(() => {
      tableList.setParams(state.param);
    });

    return {
      ...toRefs(state),
      addNew,
      handleEdit,
      closeDialog,
      tableList,
      changeStatus,
      search,
      onSizeChange,
      onCurrentChange,
      dateFormat,

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
