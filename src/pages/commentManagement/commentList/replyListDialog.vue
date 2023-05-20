<template>
  <el-dialog
    :close-on-click-modal="false"
    :modelValue="show"
    @update:modelValue="show = $event"
    @close="closeComDialog"
    @open="openDialog"
    draggable
    :title="t(`comment.record`)"
    width="100%"
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
          <el-table-column :label="t(`comment.resource_title`)" align="center">
            <template #default="scope">
              {{ scope.row.note_title ? scope.row.note_title : "--" }}
            </template>
          </el-table-column>
          <el-table-column
            prop="parent_comment_id"
            :label="t(`comment.comment_id`)"
            align="center"
          />
          <el-table-column
            prop="comment"
            :label="t(`comment`)"
            align="center"
          />
          <el-table-column
            prop="comment_user"
            :label="t(`comment.comment_user`)"
            align="center"
          />
          <el-table-column
            prop="like_count"
            :label="t(`comment.like`)"
            align="center"
          />
          <el-table-column
            prop="parent_reply_id"
            :label="t(`comment.superior_reply_id`)"
            align="center"
          />
          <el-table-column
            prop="reply_id"
            :label="t(`comment.reply_id`)"
            align="center"
          />
          <el-table-column
            prop="content"
            :label="t(`comment.content`)"
            align="center"
          />
          <el-table-column
            prop="comment_reply_user"
            :label="t(`comment.reply_to_user`)"
            align="center"
          >
            <template #default="scope">
              {{
                scope.row.comment_reply_user
                  ? scope.row.comment_reply_user
                  : "--"
              }}
            </template>
          </el-table-column>
          <el-table-column
            prop="like_count"
            :label="t(`comment.reply_like`)"
            align="center"
          />
          <el-table-column
            width="180px"
            prop="created_at"
            :label="t(`comment.response_time`)"
            align="center"
          />
          <el-table-column :label="t(`comment.state`)" align="center">
            <template #default="scope">
              <span :class="scope.row.status == 1 ? 'green' : ''">
                {{ filterStatus(scope.row.status) }}
              </span>
            </template>
          </el-table-column>

          <!-- <el-table-column label="状态" align="center">
            <template #default="scope">
              <span :class="scope.row.status == 1 ? 'green' : ''">
                {{ filterStatus(scope.row.status) }}
              </span>
            </template>
          </el-table-column> -->
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
  </el-dialog>
</template>

<script>
import { onMounted, reactive, toRefs, computed } from "vue";
import http from "@/http";
import { originalDate } from "@/utils/timeFormat.js";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";
export default {
  name: "AdManagementDialog",
  components: {},
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
        comment_id: 0,
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
          return "已审核";
        case 0:
          return "待审核";
        default:
          return "--";
      }
    };

    const getReplyLists = () => {
      state.isLoading = true;
      state.tableList = [];
      state.total = 0;
      http.commentManagement.getCommentReply(state.param).then((res) => {
        if (res.data.err_code == 0) {
          state.isLoading = false;
          state.tableList = res.data.data.list;
          state.total = res.data.data.total;
          state.isLoading = false;
        }
      });
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
      getReplyLists();
    };
    const onCurrentChange = (val) => {
      state.param.page = val;
      getReplyLists();
    };

    const search = () => {
      // alert(JSON.stringify(state.param));
      // filter();
      // tableList.setParams(state.param);
      getReplyLists();
    };

    const closeComDialog = () => {
      //  console.log("Here is @closed");
      context.emit("closedComDialog");
    };

    const openDialog = () => {
      //   console.log(props.data.comment_id);
      state.param.comment_id = props.data.comment_id;

      getReplyLists();
    };
    onMounted(() => {});

    return {
      ...toRefs(state),
      search,
      onSizeChange,
      onCurrentChange,
      originalDate,
      windowRect: computed(() => store.state.app.windowRect),
      device: computed(() => store.state.app.device),
      closeComDialog,
      openDialog,
      filterStatus,
      t,
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
