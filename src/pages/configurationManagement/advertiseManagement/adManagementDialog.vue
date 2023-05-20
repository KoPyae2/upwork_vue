<template>
  <el-dialog
    :close-on-click-modal="false"
    :modelValue="show"
    @update:modelValue="show = $event"
    @close="closeComDialog"
    @open="openDialog"
    draggable
    :title="t(`advertises.manage_ad_slot`)"
    width="90%"
  >
    <div
      v-loading="isLoading"
      element-loading-background="rgba(122, 122, 122, 0.3)"
    >
      <div>
        <el-table
          :data="tableList"
          :row-style="{ height: '55px' }"
          :header-row-style="{ height: '55px' }"
          :border="true"
          v-permission:system:city:list
          :max-height="825"
        >
          <el-table-column
            prop="position"
            :label="t(`advertises.advertise_logo`)"
            align="center"
          />
          <!-- <el-table-column
            prop="type_name"
            :label="t(`advertises.advertising_space`)"
            align="center"
          /> -->
          <el-table-column
            :label="t(`advertises.advertising_space`)"
            align="center"
          >
            <template #default="scope">
              {{ findName(scope.row.type_name) }}
            </template>
          </el-table-column>

          <el-table-column :label="t(`common.operate`)" align="center">
            <template #default="scope">
              <el-tooltip
                class="box-item"
                :content="t(`common.edit`)"
                placement="top"
              >
                <el-button
                  type="primary"
                  style="margin-left: 10px; margin-bottom: 5px"
                  circle
                  @click="handleEdit(scope.row)"
                  v-permission:system:city:edit
                >
                  <font-awesome-icon icon="fa-solid fa-file-pen" />
                </el-button>
              </el-tooltip>

              <el-tooltip
                class="box-item"
                :content="t(`common.disabled`)"
                placement="top"
                v-if="scope.row.is_delete == 'N'"
              >
                <el-button
                  type="danger"
                  circle
                  style="margin-bottom: 5px"
                  @click="deleteHandler(scope.row, t(`common.delete`))"
                  v-permission:system:city:remove
                >
                  <font-awesome-icon icon="fa-solid fa-ban" />
                </el-button>
              </el-tooltip>

              <el-tooltip
                class="box-item"
                :content="t(`common.restore`)"
                placement="top"
                v-if="scope.row.is_delete == 'D'"
              >
                <el-button
                  circle
                  style="
                    margin-bottom: 5px;
                    background-color: rgb(239 209 112);
                    border: none;
                    color: white;
                  "
                  @click="deleteHandler(scope.row, t(`common.restore`))"
                  v-permission:system:city:remove
                >
                  <font-awesome-icon icon="fa-solid fa-recycle" />
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
            v-permission:system:city:list
          >
          </el-pagination>
        </div>
      </div>
    </div>

    <AddAdSlot
      :show="showDialog"
      @closed="closeDialog"
      @created="search"
      :title="dialog.dialogTitle"
      :data="dialog.dialogData"
    />
  </el-dialog>
</template>

<script>
import {
  onMounted,
  reactive,
  toRefs,
  computed,
} from "vue";
import http from "@/http";
import { ElMessageBox, ElMessage } from "element-plus";
import { originalDate } from "@/utils/timeFormat.js";
import AddAdSlot from "./addAdSlot.vue";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";
export default {
  name: "AdManagementDialog",
  components: {
    AddAdSlot,
  },
  props: ["show", "title", "data"],

  setup(props, context) {
    const state = reactive({
      isLoading: false,
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
      tableList: [],
      total: 0,
    });

    const store = useStore();
    const { t } = useI18n();
    const filterStatus = (val) => {
      switch (val) {
        case 1:
          return "正常";
        case 2:
          return "已删除";
        default:
          return "--";
      }
    };

    const getAdSlots = () => {
      state.isLoading = true;
      http.systemManagement.getAdList(state.param).then((res) => {
        if (res.data.err_code == 0) {
          state.isLoading = false;
          state.tableList = res.data.data.list;
          state.total = res.data.data.total;
          state.isLoading = false;
        }
      });
    };

    const addNew = () => {
      state.dialog.dialogTitle = t(`common.addTo`);
      state.dialog.dialogData = {};
      state.showDialog = true;
    };

    const handleEdit = (row) => {
      state.dialog.dialogTitle = t(`common.edit`);
      state.dialog.dialogData = JSON.parse(JSON.stringify(row));
      state.showDialog = true;
    };

    const closeDialog = () => {
      state.showDialog = false;
    };

    const onSizeChange = (val) => {
      state.param.page_size = val;
      getAdSlots();
    };
    const onCurrentChange = (val) => {
      state.param.page = val;
      getAdSlots();
    };
    const findName = (data) => {
      const index = data.findIndex((x) => x.lang == store.state.user.lang);

      if (index !== -1) {
        return data[index].content;
      } else {
        return "--";
      }
    };
    const search = () => {
      getAdSlots();
    };

    const deleteHandler = (row, type) => {
      ElMessageBox.confirm(
        t(`advertises.are_you_sure_text`, { val: type }),
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
          let param = {
            type_id: row.type_id,
            is_delete: row.is_delete == "N" ? "D" : "N",
          };
          http.systemManagement.deleteAdSlot(param).then((res) => {
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

    const closeComDialog = () => {
      context.emit("closedComDialog");
    };

    const openDialog = () => {
      getAdSlots();
    };
    onMounted(() => {});

    return {
      ...toRefs(state),
      addNew,
      handleEdit,
      closeDialog,
      search,
      onSizeChange,
      onCurrentChange,
      originalDate,
      deleteHandler,
      windowRect: computed(() => store.state.app.windowRect),
      device: computed(() => store.state.app.device),
      closeComDialog,
      openDialog,
      filterStatus,
      t,
      findName,
    };
  },
};
</script>

<style lang="scss" scoped>
:deep(.el-select .el-input__inner) {
  height: 42px !important;
}

.green {
  color: green;
}
</style>
