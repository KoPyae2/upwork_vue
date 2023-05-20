<template>
  <div
    v-loading="isLoading"
    element-loading-background="rgba(122, 122, 122, 0.3)"
  >
    <div class="table">
      <div class="btn-con">
        <div class="left"></div>
        <div class="right">
          <el-button
            class="app-button"
            style="margin-bottom: 25px"
            v-permission:config:advertise:list
            @click="showAdManagement"
          >
            {{ t(`advertises.advertise_management`) }}</el-button
          >
          <el-button
            class="app-button"
            style="margin-bottom: 25px"
            v-permission:config:advertise:add
            @click="addAdSlot"
          >
            <font-awesome-icon
              icon="fa-solid fa-plus"
              style="margin-right: 5px"
            />
            {{ t(`advertises.add_ad_slot`) }}
          </el-button>
          <el-button
            @click="addNew"
            class="app-button"
            style="margin-bottom: 25px"
            v-permission:config:advertise:add
          >
            <font-awesome-icon
              icon="fa-solid fa-plus"
              style="margin-right: 5px"
            />
            {{ t(`advertises.add_new_ad`) }}
          </el-button>
        </div>
      </div>

      <div
        class="advertise-space"
        v-permission:config:advertise:list
        :data-content="t('advertises.advertising_space')"
      >
        <el-button
          :class="checkActive == 0 ? 'active-app-button' : 'app-button'"
          style="margin-bottom: 25px; margin-right: 10px"
          v-permission:config:advertise:add
          @click="FilterbyCate(0)"
        >
          {{ t(`common.all`) }}
        </el-button>
        <div v-if="showAdSlotLists.length > 0">
          <template v-for="(item, index) in showAdSlotLists" :key="index">
            <el-button
              :class="
                checkActive == item.position
                  ? 'active-app-button'
                  : 'app-button'
              "
              style="margin-bottom: 25px"
              v-permission:config:advertise:add
              @click="FilterbyCate(item.position)"
              v-if="item.is_delete == 'N'"
            >
              {{ findName(item.type_name) }}
            </el-button>
          </template>
        </div>
      </div>

      <el-table
        :data="tableList"
        :row-style="{ height: '55px' }"
        :header-row-style="{ height: '55px' }"
        :border="true"
        v-permission:config:advertise:list
        :max-height="825"
      >
        <el-table-column prop="advert_id" label="ID" align="center" />

        <el-table-column
          prop="serial_no"
          :label="t(`advertises.tosort`)"
          align="center"
        />
        <el-table-column
          :label="t(`advertises.advertisement_type`)"
          align="center"
          :width="language == 'en' ? '200px' : '150px'"
        >
          <template #default="scope">
            {{ checkAdType(scope.row.advert_type) }}
          </template>
        </el-table-column>

        <el-table-column :label="t(`advertises.scope`)" align="center">
          <template #default="scope">
            {{ checkClientType(scope.row.client) }}
          </template>
        </el-table-column>

        <el-table-column
          :width="language == 'en' ? '200px' : '150px'"
          :label="t(`advertises.advertising_space`)"
          align="center"
        >
          <template #default="scope">
            <!-- {{ checkCategoryType(scope.row.position) }} -->
            {{ findName(scope.row.position_name) }}
          </template>
        </el-table-column>
        <el-table-column
          :label="t(`advertises.picture`)"
          align="center"
          width="200px"
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
                  class="view-box"
                  style="height: 50px; cursor: zoom-in"
                />
              </photo-consumer>
            </photo-provider>
          </template>
        </el-table-column>
        <el-table-column
          :label="t(`advertises.title`)"
          align="center"
          :width="language == 'en' ? '200px' : '150px'"
        >
          <template #default="scope">
            {{ findName(scope.row.advert_title) }}
          </template>
        </el-table-column>
        <el-table-column
          :label="t(`advertises.state`)"
          align="center"
          :width="language == 'en' ? '150px' : '150px'"
        >
          <!-- <template #default="scope">
            <span :class="scope.row.status == 1 ? 'success' : 'danger'">
              {{
                scope.row.status == 1
                  ? t("advertises.normal")
                  : t("advertises.disabled")
              }}
            </span>
          </template> -->
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="-1"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="changeStatus(scope.row)"
              v-permission:config:advertise:edit
            />
          </template>
        </el-table-column>
        <el-table-column
          :label="t(`advertises.validity_period`)"
          align="center"
          width="220px"
        >
          <template #default="scope">
            {{ scope.row.start_time.substring(0, 10) }} -
            {{ scope.row.end_time.substring(0, 10) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="created_at"
          :label="t(`advertises.creation_time`)"
          align="center"
          width="220px"
        />

        <el-table-column
          :label="t(`common.operate`)"
          align="center"
          width="150px"
          fixed="right"
        >
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
                v-permission:config:advertise:edit
              >
                <font-awesome-icon icon="fa-solid fa-file-pen" />
              </el-button>
            </el-tooltip>

            <el-tooltip
              class="box-item"
              :content="t(`common.delete`)"
              placement="top"
            >
              <el-button
                type="danger"
                style="margin-bottom: 5px"
                circle
                @click="deleteHandler(scope.row.advert_id)"
                v-permission:config:advertise:remove
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
          v-permission:config:advertise:list
        >
        </el-pagination>
      </div>
    </div>
  </div>

  <AddAdDialog
    :show="showDialog"
    @closed="closeDialog"
    @created="search"
    :title="dialog.dialogTitle"
    :data="dialog.dialogData"
    :adSlotList="adSlotList"
  />

  <AdManagementDialog
    :show="showAdManagementDialog"
    @closedComDialog="closedComDialog"
  />

  <AddAdSlot
    :show="showAddAdSlotDialog"
    @closed="closeAdSlotDialog"
    @created="search"
    :title="adSlotDialog.dialogTitle"
    :data="adSlotDialog.dialogData"
  />
</template>

<script>
import { onMounted, reactive, toRefs, computed } from "vue";
import AddAdDialog from "./addAdDialog.vue";
import AddAdSlot from "./addAdSlot.vue";
import AdManagementDialog from "./adManagementDialog.vue";
import http from "@/http";
import { useStore } from "vuex";
import { ElMessageBox, ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";
export default {
  name: "Advertise",
  components: {
    AddAdDialog,
    AdManagementDialog,
    AddAdSlot,
  },
  setup() {
    const state = reactive({
      isLoading: true,
      showDialog: false,
      showAddAdSlotDialog: false,
      showAdManagementDialog: false,
      pageList: [10, 20, 60, 80, 100],
      param: {
        page: 1,
        page_size: 10,
      },
      dialog: {
        dialogTitle: "",
        dialogData: {},
      },
      adSlotDialog: {
        dialogTitle: "",
        dialogData: {},
      },
      tableList: [],
      total: 0,
      tableHeight: 0,
      adSlotList: [],
      showAdSlotLists: [],
      checkActive: 0,
    });

    const store = useStore();

    const showAdManagement = () => {
      state.showAdManagementDialog = true;
    };

    const getData = () => {
      state.isLoading = false;
      http.systemManagement.getAD(state.param).then((res) => {
        if (res.data.err_code == 0) {
          state.isLoading = false;
          state.total = res.data.data.total;
          state.tableList = res.data.data.list;
        }
      });
    };
    const { t } = useI18n();
    const getAdSlots = () => {
      http.systemManagement.getAdList({ is_delete: "N" }).then((res) => {
        if (res.data.err_code == 0) {
          state.showAdSlotLists = [];
          state.adSlotList = [];
          state.isLoading = false;
          state.adSlotList = res.data.data.list;

          state.showAdSlotLists = state.showAdSlotLists.concat(
            res.data.data.list
          );
        }
      });
    };

    const addNew = () => {
      state.dialog.dialogTitle = t(`advertises.add_new_ad`);
      state.dialog.dialogData = {};
      state.showDialog = true;
      state.dialog.dialogData.client = 0;
    };

    const handleEdit = (row) => {
      state.dialog.dialogTitle = t(`common.edit`);
      state.dialog.dialogData = JSON.parse(JSON.stringify(row));
      state.showDialog = true;
    };

    const addAdSlot = () => {
      (state.adSlotDialog.dialogTitle = t(`common.addTo`)),
        (state.adSlotDialog.dialogData = {});
      state.showAddAdSlotDialog = true;
    };

    const closeDialog = () => {
      state.showDialog = false;
      getAdSlots();
    };

    const closeAdSlotDialog = () => {
      state.showAddAdSlotDialog = false;
      getAdSlots();
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
      state.showAdSlotLists = [];
      state.param.page_size = 10;
      getAdSlots();
      getData();
    };
    const checkType = (status) => {
      switch (status) {
        case 1:
          return "Home";
        case 2:
          return "Video";
        case 3:
          return "Game";
        case 4:
          return "Image";
        case 5:
          return "Live";
        case 6:
          return "Gift";
        default:
          return "--";
      }
    };
    const checkClientType = (client_id) => {
      switch (client_id) {
        case 0:
          return t("common.all");
        case 1:
          return t("advertises.android");
        case 2:
          return "IOS";

        default:
          return "--";
      }
    };
    const checkCategoryType = (position) => {
      let ary = [];
      state.showAdSlotLists.map((item) => {
        if (item.position == position) {
          ary.push(item.type_name);
        }
      });
      return ary[0];
    };

    const closedComDialog = () => {
      state.showAdManagementDialog = false;

      getAdSlots();
    };
    const FilterbyCate = (id) => {
      if (id == 0) {
        state.param.position = "";
      } else {
        state.param.position = id;
      }
      state.checkActive = id;
      getData();
    };
    const findName = (data) => {
      const index = data.findIndex((x) => x.lang == store.state.user.lang);

      if (index !== -1) {
        return data[index].content;
      } else {
        return "--";
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
            advert_id: row.advert_id,
            advert_type: row.advert_type,
            client: row.client,
            advert_title: row.advert_title,
            params: row.params,
            image_path: row.image_path,
            status: row.status,
            client: row.client,
            serial_no: row.serial_no,
            position: row.position,
            start_time: row.start_time + " 00:00:00",
            end_time: row.end_time + " 23:59:59",
            type: row.type,
            url: row.params[0]["url"],
            moduleID: row.params[0]["model"],
          };

          http.systemManagement.updateAd(param).then((res) => {
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
          http.systemManagement.deleteAd({ advert_id: id }).then((res) => {
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
    const checkAdType = (data) => {
      switch (data) {
        case 1:
          return t("advertises.pureImage");
        case 2:
          return t("advertises.graphLink");
        case 3:
          return t("advertises.graphic");
        case 4:
          return t("advertises.moduleJump");
        case 5:
          return t("advertises.videoAds");
        case 6:
          return t("advertises.resource");

        default:
          return "--";
      }
    };

    onMounted(() => {
      getAdSlots();
      getData();
    });

    return {
      ...toRefs(state),
      addNew,
      handleEdit,
      changeStatus,
      closeDialog,
      search,
      onSizeChange,
      onCurrentChange,
      checkType,
      deleteHandler,
      windowRect: computed(() => store.state.app.windowRect),
      device: computed(() => store.state.app.device),
      showAdManagement,
      closedComDialog,
      closeAdSlotDialog,
      addAdSlot,
      FilterbyCate,
      checkAdType,
      checkClientType,
      checkCategoryType,
      findName,
      language: computed(() => store.state.user.lang),
      t,
    };
  },
};
</script>

<style lang="scss" scoped>
.btn-con {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.advertise-space {
  display: flex;
  border: 1px solid $elTableBorder;
  padding: 30px 10px 0px 10px;
  position: relative;
  margin-bottom: 10px;

  &::after {
    content: attr(data-content);
    position: absolute;
    top: -10px;
    left: 10px;
    background-color: $cardBg;
    color: var(--text_color);
    padding: 0 10px;
  }
}

.danger {
  color: #f56c6c;
}

.success {
  color: #67c23a;
}

.active-app-button {
  background-color: #ffb800;
  border: none;
  color: white;
}
</style>
