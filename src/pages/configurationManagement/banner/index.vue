<template>
  <div
    element-loading-background="rgba(122, 122, 122, 0.3)"
    v-loading="tableList.tableData.isLoading"
  >
    <div class="form" v-permission:system:bannedword:list>
      <div class="form-content">
        <el-form label-position="top" label-width="300px">
          <el-form-item :label="t('banner.filter.type')">
            <el-select
              v-model="filterForm.type"
              :placeholder="t('banner.filter.type_placeholder')"
            >
              <el-option
                v-for="item in typeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :default-first-option="true"
              >
              </el-option>
            </el-select>
          </el-form-item>

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
    </div>
    <div class="table">
      <el-button
        @click="addNew"
        class="app-button"
        style="margin-bottom: 25px"
        v-permission:config:banner:add
        ><font-awesome-icon icon="fa-solid fa-plus" style="margin-right: 5px" />
        {{ t("common.addTo") }}</el-button
      >

      <el-table
        :data="tableList.tableData.list.banner"
        :row-style="{ height: '55px' }"
        :header-row-style="{ height: '55px' }"
        :border="true"
        v-permission:config:banner:list
        :max-height="825"
      >
        <el-table-column prop="id" label="ID" align="center" />

        <el-table-column
          prop="title"
          :label="t('banner.table.title')"
          align="center"
        />
        <el-table-column
          prop="sort"
          :label="t('banner.table.sort')"
          align="center"
        />

        <el-table-column :label="t('banner.table.type')" align="center">
          <template #default="scope">
            {{ checkType(scope.row.type) }}
          </template>
        </el-table-column>

        <el-table-column :label="t('banner.table.class')" align="center">
          <template #default="scope">
            {{
              findClass(
                scope.row.type,
                scope.row.vod_type,
                scope.row.vod_type_name
              )
            }}
          </template>
        </el-table-column>

        <el-table-column :label="t('banner.table.picture')" align="center">
          <template #default="scope">
            <photo-provider v-if="scope.row.image">
              <photo-consumer
                :intro="scope.row.image"
                :key="scope.row.image"
                :src="scope.row.image"
              >
                <img
                  :src="scope.row.image"
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

        <el-table-column :label="t('banner.table.link')" align="center">
          <template #default="scope">
            {{ scope.row.link ? scope.row.link : "--" }}
          </template>
        </el-table-column>

        <el-table-column :label="t('banner.table.state')" align="center">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="0"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="changeStatus(scope.row)"
              v-permission:config:banner:edit
            />
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
                v-permission:config:banner:edit
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
                v-permission:config:banner:remove
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
          v-permission:config:banner:list
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
import { onMounted, reactive, toRefs, computed, watch } from "vue";
import Dialog from "./dialog.vue";
import http from "@/http";
import { useStore } from "vuex";
import useTableData from "@/hooks/useTableData.js";
import { ElMessageBox, ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";

export default {
  name: "Banner",
  components: {
    Dialog,
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
      filterForm: {},
      typeList: [
        {
          value: 1,
          label: t("banner.filter.home_page_ad"),
        },
        {
          value: 2,
          label: t("banner.filter.television_ad"),
        },
        // {
        //   value: 3,
        //   label: "Game",
        // },
        // {
        //   value: 4,
        //   label: "Image",
        // },
        {
          value: 5,
          label: t("banner.filter.popular_ad"),
        },
        // {
        //   value: 6,
        //   label: "Gift",
        // },
      ],
    });
    const tableList = useTableData(http.systemManagement.getBannerList);
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

    const onSizeChange = (val) => {
      state.param.page_size = val;
      tableList.setParams(state.param);
    };
    const onCurrentChange = (val) => {
      state.param.page = val;
      tableList.setParams(state.param);
    };

    const filter = () => {
      // state.param.page = 1;
      if (state.filterForm.type) {
        state.param.type = state.filterForm.type;
      } else {
        state.param.type = undefined;
      }
    };

    const reset = () => {
      state.filterForm = {};
      search();
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
          };

          http.systemManagement.updateBannerStatus(param).then((res) => {
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

    const search = () => {
      filter();
      state.param.page_size = 10;
      tableList.setParams(state.param);
    };

    const checkType = (status) => {
      switch (status) {
        case 1:
          return t("banner.filter.home_page_ad");
        case 2:
          return t("banner.filter.television_ad");
        // case 3:
        //   return "Game";
        // case 4:
        //   return "Image";
        case 5:
          return t("banner.filter.popular_ad");
        // case 6:
        //   return "Gift";
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
          http.systemManagement.deleteBannerList({ id: id }).then((res) => {
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

    watch(
      () => store.state.user.lang,
      () => {
        state.typeList = [
          {
            value: 1,
            label: t("banner.filter.home_page_ad"),
          },
          {
            value: 2,
            label: t("banner.filter.television_ad"),
          },
          {
            value: 5,
            label: t("banner.filter.popular_ad"),
          },
        ];
      }
    );

    const findName = (data) => {
      const index = data.findIndex((x) => x.lang == store.state.user.lang);

      if (index !== -1) {
        return data[index].content;
      } else {
        return "--";
      }
    };

    const findClass = (type, vod_type, type_name) => {
      if (type == 2) {
        if (vod_type == 777) {
          return t("banner.recommend");
        } else if (vod_type == 888) {
          return t("banner.leaderboard");
        } else {
          return findName(type_name);
        }
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
      reset,
      search,
      onSizeChange,
      onCurrentChange,
      changeStatus,
      checkType,
      deleteHandler,
      windowRect: computed(() => store.state.app.windowRect),
      device: computed(() => store.state.app.device),
      t,
      findName,
      store,
      findClass,
    };
  },
};
</script>

<style lang="scss" scoped></style>
