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
        {{ t(`common.addTo`) }}</el-button
      >

      <el-table
        :data="tableList.tableData.list.users"
        :row-style="{ height: '55px' }"
        :header-row-style="{ height: '55px' }"
        :border="true"
        v-permission:user:level:list
        :max-height="825"
      >
        <el-table-column
          prop="user_level"
          :label="$t(`user.grade_id`)"
          align="center"
          width="100px"
        />
        <el-table-column
          :label="$t(`user.grade`)"
          align="center"
          :width="language == 'en' ? '120px' : '100px'"
        >
          <template #default="scope">
            {{ findName(scope.row.level_name) }}
          </template>
        </el-table-column>
        <el-table-column
          :label="$t(`user.level_icon`)"
          align="center"
          :width="language == 'en' ? '100px' : '110px'"
        >
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
        <el-table-column
          prop="release_note"
          :label="$t(`user.post_v_video`)"
          align="center"
          width="130px"
        />
        <el-table-column
          prop="be_liked"
          :label="$t(`user.get_v_likes`)"
          align="center"
          width="130px"
        />
        <el-table-column
          prop="be_comment"
          :label="$t(`user.get_v_cmt`)"
          align="center"
          :width="language == 'en' ? '148px' : '130px'"
        />
        <el-table-column
          prop="be_followed"
          :label="$t(`user.get_v_follow`)"
          align="center"
          width="140px"
        />
        <el-table-column
          prop="be_unlocked"
          :label="$t(`user.unlock_v_times`)"
          align="center"
          :width="language == 'en' ? '290px' : '140px'"
        />
        <el-table-column
          prop="follow_topics"
          :label="$t(`user.follow_v_topics`)"
          align="center"
          width="135px"
        />
        <el-table-column
          prop="liked_number"
          :label="$t(`user.like_v_video`)"
          align="center"
          width="135px"
        />
        <el-table-column
          prop="release_comment"
          :label="$t(`user.post_v_cmt`)"
          align="center"
          :width="language == 'en' ? '155px' : '135px'"
        />
        <el-table-column
          prop="follow_users"
          :label="$t(`user.follow_v_users`)"
          align="center"
          width="135px"
        />
        <el-table-column
          prop="unlock_notes"
          :label="$t(`user.unlock_v_videos`)"
          align="center"
          :width="language == 'en' ? '140px' : '135px'"
        />
        <el-table-column
          :label="$t(`user.default`)"
          align="center"
          width="100px"
          fixed="right"
        >
          <template #default="scope">
            <el-switch
              v-model="scope.row.is_default"
              :active-value="1"
              :inactive-value="0"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @click="changeStatus(scope.row)"
              v-permission:config:banner:edit
            />
          </template>
        </el-table-column>

        <el-table-column
          :label="t(`common.operate`)"
          align="center"
          width="100px"
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
      dialogPrev: false,
    });
    const { t } = useI18n();
    const tableList = useTableData(http.userManagement.getUserLevel);

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
            be_comment: row.be_comment,
            be_followed: row.be_followed,
            be_liked: row.be_liked,
            be_unlocked: row.be_unlocked,
            follow_topics: row.follow_topics,
            follow_users: row.follow_users,
            level_icon: row.level_icon,
            level_name: row.level_name,
            liked_number: row.liked_number,
            min_amount: row.min_amount,
            release_comment: row.release_comment,
            release_note: row.release_note,
            unlock_notes: row.unlock_notes,
            user_level: row.user_level,
            is_default: row.is_default,
          };

          http.userManagement.updateUserLevel(param).then((res) => {
            if (res.data.err_code == 0) {
              ElMessage.success(t(`error.${res.data.err_code}`));
              tableList.setParams(state.param);
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

    const store = useStore();

    const handleEdit = (row) => {
      state.dialog.dialogTitle = t(`common.edit`);
      state.dialog.dialogData = JSON.parse(JSON.stringify(row));
      state.showDialog = true;
    };

    const addNew = () => {
      state.dialog.dialogTitle = t(`common.addTo`);
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

    const previewBackground = (row) => {
      state.previmg = row.background_img;
      state.dialogPrev = true;
    };

    const previewProfile = (row) => {
      state.previmg = row.show_icon;
      state.dialogPrev = true;
    };

    const getData = () => {
      tableList.setParams(state.param);
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
      getData,
      search,
      onSizeChange,
      onCurrentChange,
      dateFormat,
      previewBackground,
      previewProfile,
      changeStatus,
      t,
      findName,
      windowRect: computed(() => store.state.app.windowRect),
      device: computed(() => store.state.app.device),
      language: computed(() => store.state.user.lang),
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
