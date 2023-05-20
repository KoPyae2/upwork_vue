<template>
  <div
    element-loading-background="rgba(122, 122, 122, 0.3)"
    v-loading="isLoading"
  >
    <div class="table">
      <el-button
        @click="addNew"
        class="app-button"
        style="margin-bottom: 25px"
        v-permission:game:room:add
        ><font-awesome-icon icon="fa-solid fa-plus" style="margin-right: 5px" />
        {{ t("common.addTo") }}</el-button
      >

      <el-table
        :data="tableList"
        :row-style="{ height: '55px' }"
        :header-row-style="{ height: '55px' }"
        :border="true"
        v-permission:game:room:list
        :max-height="825"
      >
        <el-table-column prop="id" label="ID" align="center" />

        <!-- <el-table-column prop="name" :label="t('game.name')" align="center" /> -->

        <el-table-column :label="t('game.picture')" align="center">
          <template #default="scope">
            <photo-provider v-if="scope.row.image_url.length > 0">
              <photo-consumer
                :intro="findName(scope.row.image_url)"
                :key="scope.row.image_url"
                :src="findName(scope.row.image_url)"
              >
                <img
                  :src="findName(scope.row.image_url)"
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
          prop="link_url"
          :label="t('game.link')"
          align="center"
        />
        <!-- <el-table-column
          prop="remark"
          :label="t('game.remark')"
          align="center"
        /> -->

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
                v-permission:game:room:edit
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
                @click="deleteHandler(scope.row.id)"
                v-permission:game:room:remove
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
          v-permission:game:room:list
        >
        </el-pagination>
      </div>
    </div>
  </div>

  <AddDialog
    :show="showDialog"
    @closed="closeDialog"
    @created="getData"
    :title="dialog.dialogTitle"
    :data="dialog.dialogData"
  />
</template>

<script>
import { onMounted, reactive, toRefs, computed } from "vue";
import AddDialog from "./AddDialog.vue";
import http from "@/http";
import { useStore } from "vuex";
import { ElMessageBox, ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";

export default {
  name: "GameRoom",
  components: {
    AddDialog,
  },
  setup() {
    const { t } = useI18n();
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
      tableList: [],
      total: 0,
    });
    const store = useStore();
    const getData = () => {
      state.isLoading = true;
      http.gameManagement
        .getDiscoveryList(state.param)
        .then((res) => {
          if (res.data.err_code == 0) {
            state.isLoading = false;
            state.tableList = res.data.data.list;
            state.total = res.data.data.count;
          }
        })
        .catch((err) => {
          state.isLoading = false;
        });
    };
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
      getData();
    };
    const onCurrentChange = (val) => {
      state.param.page = val;
      getData();
    };

    const search = () => {
      state.param.page_size = 10;
      getData();
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
          http.gameManagement.deleteDiscoveryList({ id: id }).then((res) => {
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
      search,
      onSizeChange,
      onCurrentChange,
      deleteHandler,
      getData,
      windowRect: computed(() => store.state.app.windowRect),
      device: computed(() => store.state.app.device),
      findName,
    };
  },
};
</script>

<style lang="scss" scoped></style>
