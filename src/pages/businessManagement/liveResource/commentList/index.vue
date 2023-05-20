<template>
  <div
    v-loading="isLoading"
    element-loading-background="rgba(122, 122, 122, 0.3)"
  >
    <div class="form" v-permission:livevideo:comment:list>
      <div class="form-content">
        <el-form label-position="top" label-width="300px">
          <el-form-item label="用户ID">
            <el-input
              placeholder="请输入用户ID"
              type="number"
              v-model.number="filterForm.user_id"
              onkeypress="return event.charCode >= 48 && event.charCode <= 57"
              @copy.prevent
              @paste.prevent
            />
          </el-form-item>

          <el-form-item label="用户昵称">
            <el-input
              placeholder="请输入用户昵称"
              v-model="filterForm.user_name"
            />
          </el-form-item>
          <el-form-item label="评论内容">
            <el-input
              placeholder="请输入评论内容"
              v-model="filterForm.comment"
            />
          </el-form-item>

          <div style="margin-top: 34px" class="buttonBox">
            <el-button class="app-button" @click="search()">
              <font-awesome-icon
                icon="fa-solid fa-magnifying-glass"
                style="margin-right: 5px"
              />搜索</el-button
            >
          </div>
        </el-form>
      </div>
    </div>

    <div class="table">
      <el-button
        style="margin-bottom: 21px"
        type="primary"
        size="small"
        @click="backToLivePage()"
        ><font-awesome-icon icon="fa-solid fa-chevron-left" /> &nbsp;
        返回</el-button
      >
      <el-table
        :data="tableList"
        :row-style="{ height: '55px' }"
        :header-row-style="{ height: '55px' }"
        :border="true"
        v-permission:livevideo:comment:list
        :max-height="825"
        id="table"
      >
        <el-table-column prop="comment_id" label="评论ID" align="center" />
        <el-table-column prop="user_id" label="用户ID" align="center" />
        <el-table-column prop="user_name" label="用户昵称" align="center" />
        <el-table-column prop="comment" label="评论内容" align="center">
          <template #default="scope">
            {{ scope.row.content }}
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="评论时间" align="center">
          <template #default="scope">
            {{ dateFormat(scope.row.created_at) }}
          </template>
        </el-table-column>
        <el-table-column label="管理" align="center">
          <template #default="scope">
            <el-tooltip class="box-item" content="删除" placement="top">
              <el-button
                type="danger"
                circle
                style="margin-bottom: 5px"
                @click="deleteHandler(scope.row.comment_id)"
                v-permission:livevideo:resource:comment:remove
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
          v-permission:livevideo:comment:list
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, reactive, toRefs, computed } from "vue";
import http from "@/http";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { dateFormat } from "@/utils/timeFormat.js";
import { ElMessageBox, ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";

export default {
  name: "liveCommentList",
  setup() {
    const { t } = useI18n();
    const state = reactive({
      tableList: [],
      total: 0,
      isLoading: true,
      filterForm: {},
      pageList: [10, 20, 60, 80, 100],
      param: {
        page: 1,
        page_size: 10,
      },
    });

    const route = useRoute();
    const store = useStore();

    const filter = () => {
      state.param = {
        page: 1,
      };
      if (state.filterForm.user_id) {
        state.param.user_id = state.filterForm.user_id;
      }
      if (state.filterForm.user_name) {
        state.param.username = state.filterForm.user_name;
      }
      if (state.filterForm.comment) {
        state.param.context = state.filterForm.comment;
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

    const getData = () => {
      state.isLoading = true;
      state.param.live_id = route.params.liveid;
      http.businessManagement
        .getLiveVideoCommentList(state.param)
        .then((res) => {
          if (res.data.err_code == 0) {
            state.isLoading = false;
            state.tableList = res.data.data.list;
            state.total = res.data.data.total;
          }
        })
        .catch((err) => {
          state.isLoading = false;
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
          http.businessManagement
            .deleteLiveVideoComment({ comment_id: id })
            .then((res) => {
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

    const backToLivePage = () => {
      window.history.go(-1);
    };

    const search = () => {
      filter();
      state.param.page_size = 10;
      getData();
      state.param.user_id = "";
      state.param.username = "";
      state.param.context = "";
    };

    onMounted(() => {
      getData();
    });

    return {
      ...toRefs(state),
      deleteHandler,
      dateFormat,
      search,
      onSizeChange,
      onCurrentChange,
      backToLivePage,
      windowRect: computed(() => store.state.app.windowRect),
      device: computed(() => store.state.app.device),
    };
  },
};
</script>

<style lang="scss" scoped></style>
