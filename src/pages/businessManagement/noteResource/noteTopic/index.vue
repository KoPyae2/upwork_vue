<template>
  <div
    element-loading-background="rgba(122, 122, 122, 0.3)"
    v-loading="isLoading"
  >
    <div class="card">
      <div class="form" v-permission:resource:topic:list>
        <div class="form-title">{{ t("noteResource.hotTopic") }}</div>
        <div class="form-content">
          <template
            v-for="item in hotTopic"
            :key="item"
            style="position: relative"
          >
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
        @click="addNewType"
        class="app-button"
        style="margin-bottom: 25px"
        v-permission:resource:topic:add
        ><font-awesome-icon icon="fa-solid fa-plus" style="margin-right: 5px" />
        {{ t("noteResource.addTopicType") }}</el-button
      >
      <el-table
        :data="tableList"
        :row-style="{ height: '55px' }"
        :header-row-style="{ height: '55px' }"
        :border="true"
        row-key="id"
        v-permission:resource:topic:list
        :max-height="825"
      >
        <el-table-column
          prop="id"
          :label="t('noteResource.tagTypeID')"
          align="center"
        />
        <el-table-column :label="t('noteResource.cover')" align="center">
          <template #default="scope">
            <photo-provider v-if="scope.row.resource_icon">
              <photo-consumer
                :intro="scope.row.resource_icon"
                :key="scope.row.resource_icon"
                :src="scope.row.resource_icon"
              >
                <img
                  :src="scope.row.resource_icon"
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

        <el-table-column :label="t('noteResource.topicType')" align="center">
          <template #default="scope">
            {{ scope.row.name ? findName(scope.row.name) : "--" }}
          </template>
        </el-table-column>

        <el-table-column
          prop="sort"
          :label="t('noteResource.toSort')"
          align="center"
        />
        <el-table-column :label="t('noteResource.topic')" align="center">
          <template #default="scope">
            {{ scope.row.topic_name ? findName(scope.row.topic_name) : "--" }}
          </template>
        </el-table-column>

        <el-table-column
          :label="t('noteResource.topicDescription')"
          align="center"
        >
          <template #default="scope">
            {{ scope.row.content ? findName(scope.row.content) : "--" }}
          </template>
        </el-table-column>
        <el-table-column :label="t('noteResource.isPopular')" align="center">
          <template #default="scope">
            <span
              :class="scope.row.is_hot == 1 ? 'success' : 'danger'"
              v-if="scope.row.topic_name"
              >{{
                scope.row.is_hot == 1 ? t("common.yes") : t("common.no")
              }}</span
            >
            <span v-else> -- </span>
          </template>
        </el-table-column>

        <el-table-column
          :label="t('common.operate')"
          align="center"
          width="200px"
          fixed="right"
        >
          <template #default="scope">
            <template v-if="scope.row.type_id">
              <el-button
                type="success"
                size="small"
                style="margin-left: 10px; margin-bottom: 5px"
                @click="handlePopular(scope.row)"
                v-if="scope.row.is_hot == 0"
                v-permission:resource:topic:edit
              >
                {{ t("noteResource.hotTopic") }}
              </el-button>

              <el-button
                type="danger"
                size="small"
                style="margin-left: 10px; margin-bottom: 5px"
                @click="handlePopular(scope.row)"
                v-else
                v-permission:resource:topic:edit
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
                  v-permission:resource:topic:edit
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
                  v-permission:resource:topic:edit
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
                  v-permission:resource:topic:edit
                >
                  <font-awesome-icon icon="fa-solid fa-lock-open" />
                </el-button>
              </el-tooltip>
            </template>

            <template v-else>
              <el-button
                @click="addNew(scope.row)"
                size="small"
                type="primary"
                v-permission:resource:topic:add
              >
                {{ t("noteResource.addTopic") }}
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
                  @click="handleTypeEdit(scope.row)"
                  v-permission:resource:topic:edit
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
                  @click="disableTypeHandler(scope.row)"
                  v-permission:resource:topic:edit
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
                  @click="disableTypeHandler(scope.row)"
                  v-permission:resource:topic:edit
                >
                  <font-awesome-icon icon="fa-solid fa-lock-open" />
                </el-button>
              </el-tooltip>
            </template>
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
          v-permission:resource:topic:list
        >
        </el-pagination>
      </div>
    </div>
  </div>

  <Dialog
    :show="showDialog"
    @closed="closeDialog"
    @created="getData"
    @edited="edited"
    :title="dialog.dialogTitle"
    :data="dialog.dialogData"
  />

  <TypeDialog
    :show="showTypeDialog"
    @closed="closeTypeDialog"
    @created="getData"
    @edited="edited"
    :title="dialog.dialogTitle"
    :data="dialog.dialogData"
  />
</template>

<script>
import { onMounted, reactive, toRefs, computed } from "vue";
import Dialog from "./dialog.vue";
import TypeDialog from "./typeDialog.vue";
import http from "@/http";
import { useStore } from "vuex";
import { ElMessageBox, ElMessage } from "element-plus";
import { dateFormat } from "@/utils/timeFormat.js";
import { useI18n } from "vue-i18n";

export default {
  name: "NoteTopic",
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
      dialogPrev: false,
      tableList: [],
      total: 0,
      hotTopic: [],
    });

    const store = useStore();

    const getData = () => {
      state.isLoading = true;

      http.businessManagement.getNoteTypeTopicList(state.param).then((res) => {
        if (res.data.err_code == 0) {
          state.tableList = res.data.data.list;
          state.total = res.data.data.total;
          state.isLoading = false;
        }
      });
    };

    const getHotTopic = () => {
      http.businessManagement.getNoteTopicList({ is_hot: 1 }).then((res) => {
        if (res.data.err_code == 0) {
          state.hotTopic = res.data.data.topic_list;
        }
      });
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

    const addNew = (row) => {
      state.dialog.dialogTitle = t("common.addTo");
      state.dialog.dialogData = JSON.parse(JSON.stringify(row));
      state.showDialog = true;
    };

    const addNewType = () => {
      state.dialog.dialogTitle = t("common.addTo");
      state.dialog.dialogData = {};
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
      getData();
      getHotTopic();
    };
    const onCurrentChange = (val) => {
      state.param.page = val;
      getData();
      getHotTopic();
    };

    const search = () => {
      filter();
      state.param.page_size = 10;
      getData();
      getHotTopic();
    };

    const edited = () => {
      getData();
      getHotTopic();
    };

    const checkHot = (hot) => {
      if (hot == 1) {
        return "success";
      } else {
        return "danger";
      }
    };

    const handlePopular = (row) => {
      let param = {
        id: row.topic_id,
        is_hot: row.is_hot == 1 ? 0 : 1,
        name: row.topic_name,
        resource_icon: row.resource_icon,
        resource_url: row.resource_url,
        sort: row.sort,
        status: row.status,
        type_id: row.type_id,
        content: row.content,
      };

      ElMessageBox.confirm(t("common.wantToChange"), t("common.warning"), {
        confirmButtonText: t("common.sure"),
        cancelButtonText: t("common.close"),
        type: "warning",
        draggable: true,
        closeOnClickModal: false,
      })
        .then(() => {
          http.businessManagement.updateNoteTopicList(param).then((res) => {
            if (res.data.err_code == 0) {
              ElMessage.success(t(`error.${res.data.err_code}`));
              getData();
              getHotTopic();
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
        id: row.topic_id,
        status: row.status == 1 ? 0 : 1,
        is_hot: row.is_hot,
        name: row.topic_name,
        resource_icon: row.resource_icon,
        resource_url: row.resource_url,
        sort: row.sort,
        type_id: row.type_id,
        content: row.content,
      };

      ElMessageBox.confirm(t("common.wantToChange"), t("common.warning"), {
        confirmButtonText: t("common.sure"),
        cancelButtonText: t("common.close"),
        type: "warning",
        draggable: true,
        closeOnClickModal: false,
      })
        .then(() => {
          http.businessManagement.updateNoteTopicList(param).then((res) => {
            if (res.data.err_code == 0) {
              getData();
              getHotTopic();
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
            content: item.content,
          };

          http.businessManagement.updateNoteTopicList(param).then((res) => {
            if (res.data.err_code == 0) {
              ElMessage.success(t(`error.${res.data.err_code}`));
              getData();
              getHotTopic();
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
    const disableTypeHandler = (row) => {
      let param = {
        type_id: row.id,
        status: row.status == 1 ? 0 : 1,
        sort: row.sort,
        type_name: row.name,
        type_icon: row.resource_icon,
      };

      ElMessageBox.confirm(t("common.wantToChange"), t("common.warning"), {
        confirmButtonText: t("common.sure"),
        cancelButtonText: t("common.close"),
        type: "warning",
        draggable: true,
        closeOnClickModal: false,
      })
        .then(() => {
          http.businessManagement.updateNoteTopicType(param).then((res) => {
            if (res.data.err_code == 0) {
              getData();
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

    onMounted(() => {
      getData();
      getHotTopic();
    });

    return {
      t,
      ...toRefs(state),
      addNew,
      addNewType,
      handleEdit,
      handleTypeEdit,
      closeDialog,
      closeTypeDialog,
      search,
      edited,
      onSizeChange,
      onCurrentChange,
      dateFormat,
      checkHot,
      handlePopular,
      disableHandler,
      disableTypeHandler,
      removeHot,
      getData,
      windowRect: computed(() => store.state.app.windowRect),
      device: computed(() => store.state.app.device),
      findName,
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
