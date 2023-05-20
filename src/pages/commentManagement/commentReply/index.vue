<template>
  <div
    v-loading="isLoading"
    element-loading-background="rgba(122, 122, 122, 0.3)"
  >
    <div class="form" v-permission:reply:list>
      <div class="form-content">
        <el-form label-position="top" label-width="300px">
          <el-form-item :label="t(`comment.comment_status`)">
            <el-select
              v-model="filterForm.status"
              :placeholder="t(`comment.please_choose`)"
            >
              <el-option
                v-for="item in statusList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            :label="t(`comment.comment_time`)"
            style="min-width: 300px"
          >
            <el-date-picker
              v-model="filterForm.dateValue"
              type="daterange"
              value-format="YYYY-MM-DD"
              unlink-panels
              :range-separator="t(`common.to`)"
              :start-placeholder="t(`common.startDate`)"
              :end-placeholder="t(`common.endDate`)"
            />
          </el-form-item>

          <el-form-item :label="$t(`comment.comment`)">
            <el-input
              :placeholder="t(`comment.comment_content`)"
              v-model="filterForm.content"
            />
          </el-form-item>
        </el-form>
        <div class="buttonBox">
          <el-button class="app-button" @click="search()">
            <font-awesome-icon
              icon="fa-solid fa-magnifying-glass"
              style="margin-right: 5px"
            />{{ t(`common.search`) }}</el-button
          >

          <el-button type="warning" @click="reset()">
            <font-awesome-icon
              icon="fa-solid fa-arrows-rotate"
              style="margin-right: 5px"
            />{{ t(`common.reset`) }}</el-button
          >
        </div>
      </div>
    </div>

    <div class="table">
      <div class="user-info" :class="theme" v-if="currentUserName">
        <el-button type="primary" size="small" @click="clearUserFilter"
          ><font-awesome-icon icon="fa-solid fa-chevron-left" /> &nbsp;
          {{ t(`common.return`) }}</el-button
        >
        <span> {{ currentUserName }} {{ t(`comment.comment_reply`) }}</span>
      </div>
      <el-table
        :data="tableList"
        :row-style="{ height: '55px' }"
        :header-row-style="{ height: '55px' }"
        :border="true"
        v-permission:reply:list
        :max-height="825"
      >
        <el-table-column
          prop="reply_id"
          :label="t(`comment.comment_id`)"
          align="center"
        />
        <el-table-column :label="t(`comment.user`)" align="center">
          <template #default="scope">
            <span
              :class="currentUserName == '' ? 'blue' : ''"
              v-if="scope.row.user_name"
              @click="currentUserName == '' ? filterUserName(scope.row) : null"
            >
              {{ scope.row.user_name }}
            </span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column :label="t(`comment.resource_title`)" align="center">
          <template #default="scope">
            <span
              class="blue"
              v-if="scope.row.note_title"
              @click="goToNoteDetails(scope.row)"
            >
              {{ scope.row.note_title }}
            </span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="content"
          :label="t(`comment.comment`)"
          align="center"
        />
        <el-table-column
          prop="like_count"
          :label="t(`comment.won_praise`)"
          align="center"
        />
        <el-table-column
          prop="created_at"
          :label="t(`comment.comment_time`)"
          align="center"
        />
        <el-table-column :label="t(`comment.comment_status`)" align="center">
          <template #default="scope">
            <span
              :class="
                scope.row.status == 1
                  ? 'green'
                  : scope.row.status == -1
                  ? 'red'
                  : ''
              "
            >
              {{ filterStatus(scope.row.status) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          :label="t(`common.operate`)"
          align="center"
          width="250"
          fixed="right"
        >
          <template #default="scope">
            <el-button
              type="success"
              size="small"
              style="margin-left: 10px; margin-bottom: 5px"
              v-if="scope.row.ban_status == 0"
              @click="banStatus(scope.row, 1)"
              v-permission:reply:edit
            >
              {{ t(`comment.forbidden_mention`) }}
            </el-button>
            <el-button
              type="danger"
              size="small"
              style="margin-left: 10px; margin-bottom: 5px"
              v-else
              @click="banStatus(scope.row, 0)"
              v-permission:reply:edit
            >
              {{ t(`comment.lift_ban`) }}
            </el-button>

            <el-button
              type="success"
              size="small"
              style="margin-left: 10px; margin-bottom: 5px"
              v-if="scope.row.status !== 1"
              @click="approveCommentHandler(scope.row)"
            >
              {{ t(`comment.exam_passed`) }}
            </el-button>
            <el-tooltip
              class="box-item"
              :content="t(`common.edit`)"
              placement="top"
            >
              <el-button
                type="primary"
                style="margin-left: 10px; margin-bottom: 5px"
                circle
                @click="handleEditComment(scope.row)"
                v-permission:reply:edit
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
                circle
                style="margin-bottom: 5px"
                @click="deleteHandler(scope.row)"
                v-permission:reply:remove
                v-if="scope.row.status !== -1"
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
          v-permission:reply:list
        >
        </el-pagination>
      </div>
    </div>
  </div>

  <el-dialog
    v-model="showEditComment"
    @close="closeEditDialog(eidtFormRef)"
    draggable
    :title="t(`common.edit`)"
    :close-on-click-modal="false"
  >
    <el-form label-width="150px" ref="eidtFormRef" :model="editForm">
      <el-form-item
        :label="t(`comment.comments`)"
        prop="content"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input
          v-model="editForm.content"
          type="textarea"
          placeholder=""
          maxlength="200"
          show-word-limit
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeEditDialog(eidtFormRef)">{{
          t(`common.close`)
        }}</el-button>
        <el-button
          class="app-button"
          @click="submitEditDialog(eidtFormRef)"
          :disabled="doubleClick"
          >{{ t(`common.sure`) }}</el-button
        >
      </span>
    </template>
  </el-dialog>

  <el-dialog
    v-model="showCommentSetting"
    @close="closeSettingDialog(settingFormRef)"
    draggable
    :title="t(`comment.comment_setting`)"
    :close-on-click-modal="false"
    width="300px"
  >
    <el-form label-width="150px" ref="settingFormRef" :model="settingForm">
      <el-form-item :label="t(`comment.no_comment`)">
        <el-checkbox
          v-model="settingForm.deny_user_comment"
          label=""
          size="large"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeSettingDialog(settingFormRef)">{{
          t(`common.close`)
        }}</el-button>
        <el-button
          class="app-button"
          @click="submitSettingDialog(settingFormRef)"
          >{{ t(`common.sure`) }}</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { onMounted, reactive, toRefs, computed, ref, watch } from "vue";
import http from "@/http";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { dateFormat } from "@/utils/timeFormat.js";
import { ElMessageBox, ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";
export default {
  name: "Bank",
  components: {},
  setup() {
    const { t } = useI18n();
    const store = useStore();
    const state = reactive({
      isLoading: true,
      showEditComment: false,
      showCommentSetting: false,
      showReplyList: false,
      currentUserName: "",
      editForm: {},
      settingForm: {
        deny_user_comment: 1,
      },
      filterForm: {
        status: "",
      },
      pageList: [10, 20, 60, 80, 100],
      param: {
        page: 1,
        page_size: 10,
      },
      doubleClick: false,
      total: 0,
      tableList: [],
      statusList: [
        {
          value: "",
          label: `-- ${t("common.all_status")} --`,
        },
        {
          value: "0",
          label: t("comment.to_be_review"),
        },
        {
          value: "1",
          label: t("comment.audited"),
        },
        {
          value: "-1",
          label: t("comment.deleted"),
        },
      ],
    });

    const filterStatus = (val) => {
      switch (val) {
        case 1:
          return t("comment.audited");
        case 0:
          return t("comment.to_be_review");
        case -1:
          return t("comment.deleted");
        default:
          return "--";
      }
    };

    const router = useRouter();
    const eidtFormRef = ref();
    const settingFormRef = ref();

    const getData = () => {
      state.isLoading = true;
      http.commentManagement.getCommentReplyList(state.param).then((res) => {
        if (res.data.err_code == 0) {
          state.isLoading = false;
          state.total = res.data.data.total;
          state.tableList = res.data.data.list;
        }
      });
    };

    const filterUserName = (data) => {
      state.currentUserName = data.user_name;
      state.filterForm.user_id = data.user_id;
      search();
    };

    const clearUserFilter = () => {
      state.currentUserName = "";
      state.filterForm.user_id = undefined;
      search();
    };

    const goToNoteDetails = (data) => {
      if (data.note_type == 1) {
        router.push({
          path: "/businessmanagement/noteImage",
          query: { note_id: data.note_id, note_title: data.note_title },
        });
      } else if (data.note_type == 2) {
        router.push({
          path: "/businessmanagement/noteVideo",
          query: { note_id: data.note_id, note_title: data.note_title },
        });
      } else if (data.note_type == 4) {
        router.push({
          path: "/businessmanagement/noteLongVideo",
          query: { note_id: data.note_id, note_title: data.note_title },
        });
      }
    };

    const filter = () => {
      state.param = {
        page: 1,
      };
      if (state.filterForm.status) {
        state.param.status = parseInt(state.filterForm.status);
      }
      if (state.filterForm.content) {
        state.param.content = state.filterForm.content;
      }

      if (state.filterForm.dateValue && state.filterForm.dateValue.length) {
        state.param.start_date = `${state.filterForm.dateValue[0]} 00:00:00`;
        state.param.end_date = `${state.filterForm.dateValue[1]} 23:59:59`;
      }
      if (state.filterForm.user_id) {
        state.param.user_id = state.filterForm.user_id;
      }
    };

    const search = () => {
      filter();
      state.param.page_size = 10;
      getData();
    };

    const onSizeChange = (val) => {
      state.param.page_size = val;
      getData();
    };

    const onCurrentChange = (val) => {
      state.param.page = val;
      getData();
    };

    //Edit comment start
    const handleEditComment = (row) => {
      state.editForm.reply_id = row.reply_id;
      state.editForm.content = row.content;
      state.showEditComment = true;
    };

    const closeEditDialog = (formRef) => {
      formRef.resetFields();
      state.showEditComment = false;
    };

    const submitEditDialog = (formRef) => {
      formRef.validate((valid) => {
        if (valid) {
          state.doubleClick = true;
          http.commentManagement
            .updateCommentReply(state.editForm)
            .then((res) => {
              if (res.data.err_code == 0) {
                getData();
                ElMessage.success(t(`error.${res.data.err_code}`));
                state.showEditComment = false;
              } else {
                ElMessage.error(t(`error.${res.data.err_code}`));
                state.showEditComment = false;
              }
            });
        }
      });
    };
    //Edit comment end

    //Start comment setting
    const handleCommentSetting = (row) => {
      state.settingForm.user_id = row.user_id;
      state.settingForm.deny_user_comment =
        row.deny_user_comment == 1 ? true : false;
      state.showCommentSetting = true;
    };
    const closeSettingDialog = (formRef) => {
      formRef.resetFields();
      state.showCommentSetting = false;
    };
    const submitSettingDialog = (formRef) => {
      formRef.validate((valid) => {
        if (valid) {
          state.settingForm.deny_user_comment =
            state.settingForm.deny_user_comment == true ? 1 : 0;
          http.commentManagement
            .commentReplySetting(state.settingForm)
            .then((res) => {
              if (res.data.err_code == 0) {
                ElMessage.success(t(`error.${res.data.err_code}`));
                getData();
                state.showCommentSetting = false;
              } else {
                ElMessage.error(t(`error.${res.data.err_code}`));
                state.showCommentSetting = false;
              }
            });
        }
      });
    };
    //End comment setting

    //Delete comment
    const deleteHandler = (row) => {
      ElMessageBox.confirm(t("common.wantToDelete"), t("common.warning"), {
        confirmButtonText: t("common.sure"),
        cancelButtonText: t("common.close"),
        type: "warning",
        draggable: true,
        closeOnClickModal: false,
      })
        .then(() => {
          let param = {
            reply_id: row.reply_id,
          };
          //   console.log("Delete successful ", param);
          http.commentManagement.deleteCommentReply(param).then((res) => {
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

    //Approve Handler
    const approveCommentHandler = (row) => {
      ElMessageBox.confirm(t("common.wantToChange"), t("common.warning"), {
        confirmButtonText: t("common.sure"),
        cancelButtonText: t("common.close"),
        type: "warning",
        draggable: true,
        closeOnClickModal: false,
      })
        .then(() => {
          let param = {
            reply_id: row.reply_id,
          };
          http.commentManagement.changeCommentReplyStatus(param).then((res) => {
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

    const reset = () => {
      state.filterForm = {
        status: "",
      };
      search();
    };
    const banStatus = (row, status) => {
      console.log(row);
      let param = {
        user_id: row.user_id,
        note_id: row.note_id,
        status: status,
      };
      http.commentManagement.banComment(param).then((res) => {
        if (res.data.err_code == 0) {
          ElMessage.success(t(`error.${res.data.err_code}`));
          getData();
        } else {
          ElMessage.error(t(`error.${res.data.err_code}`));
        }
      });
    };

    watch(
      () => store.state.user.lang,
      () => {
        state.statusList = [
          {
            value: "",
            label: `-- ${t("common.all_status")} --`,
          },
          {
            value: "0",
            label: t("comment.to_be_review"),
          },
          {
            value: "1",
            label: t("comment.audited"),
          },
          {
            value: "-1",
            label: t("comment.deleted"),
          },
        ];
      }
    );

    onMounted(() => {
      getData();
    });

    return {
      ...toRefs(state),
      dateFormat,
      search,
      onSizeChange,
      onCurrentChange,
      handleEditComment,
      closeEditDialog,
      submitEditDialog,
      eidtFormRef,
      settingFormRef,
      closeSettingDialog,
      submitSettingDialog,
      handleCommentSetting,
      deleteHandler,
      approveCommentHandler,
      filterStatus,
      filterUserName,
      goToNoteDetails,
      clearUserFilter,
      reset,
      banStatus,
      windowRect: computed(() => store.state.app.windowRect),
      device: computed(() => store.state.app.device),
      theme: computed(() => store.state.theme.mode),
      t,
    };
  },
};
</script>

<style lang="scss" scoped>
.blue {
  color: rgb(0, 100, 250);
  cursor: pointer;
}

.green {
  color: rgb(5, 141, 5);
}

.user-info {
  padding-bottom: 21px;

  span {
    padding-left: 10px;
  }
}

.red {
  color: #f56c6c;
}

.dark {
  color: white;
}
</style>
