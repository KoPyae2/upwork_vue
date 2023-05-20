<template>
  <div
    v-loading="isLoading"
    element-loading-background="rgba(122, 122, 122, 0.3)"
  >
    <div class="form" v-permission:resource:imrecommend:list>
      <div class="form-content">
        <el-form label-position="top" label-width="300px">
          <el-form-item :label="t('noteResource.resourceID')">
            <el-input
              :placeholder="t('noteResource.enterResourceID')"
              v-model="filterForm.note_id"
            />
          </el-form-item>

          <el-form-item :label="t('noteResource.postStatus')">
            <el-select
              :multiple="false"
              :placeholder="t('noteResource.selectPostStatus')"
              style="width: 100%"
              v-model="filterForm.status"
              default-first-option
            >
              <el-option
                v-for="item in statusList"
                :key="item"
                :value="item.value"
                :label="item.label"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="t('noteResource.fanGroupResource')">
            <el-select
              :multiple="false"
              :placeholder="t('noteResource.selectFanGroupResource')"
              style="width: 100%"
              v-model="filterForm.is_fan"
            >
              <el-option value="2" :label="t('common.all')" />
              <el-option value="0" :label="t('common.no')" />
              <el-option value="1" :label="t('common.yes')" />
            </el-select>
          </el-form-item>
          <el-form-item :label="t('noteResource.paymentStatus')">
            <el-select
              :multiple="false"
              :placeholder="t('common.all_status')"
              style="width: 100%"
              v-model="filterForm.paymentValue"
              default-first-option
            >
              <el-option
                v-for="item in paymentList"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              />
            </el-select>
          </el-form-item>

          <el-form-item :label="t('noteResource.allTopics')">
            <el-select
              :multiple="false"
              :placeholder="t('noteResource.selectAllTopics')"
              style="width: 100%"
              v-model="filterForm.topic_id"
              default-first-option
            >
              <el-option value="" :label="t('common.all')" />
              <el-option
                v-for="item in topicList"
                :key="item.id"
                :value="item.id"
                :label="findName(item.name)"
              />
            </el-select>
          </el-form-item>

          <el-form-item :label="t('noteResource.originalResource')">
            <el-select
              :multiple="false"
              :placeholder="t('noteResource.selectOriginalResource')"
              style="width: 100%"
              v-model="filterForm.is_original"
              default-first-option
            >
              <el-option value="0" :label="t('common.all_status')" />
              <el-option value="1" :label="t('common.yes')" />
            </el-select>
          </el-form-item>
          <el-form-item
            :label="t('noteResource.releaseTime')"
            style="min-width: 300px"
          >
            <el-date-picker
              v-model="filterForm.dateValue"
              type="daterange"
              value-format="YYYY-MM-DD"
              unlink-panels
              :range-separator="t('common.to')"
              :start-placeholder="t('common.startDate')"
              :end-placeholder="t('common.endDate')"
            />
          </el-form-item>
        </el-form>
        <div class="buttonBox">
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
      </div>
    </div>

    <div class="table">
      <div class="note-info" :class="theme" v-if="currentNoteTitle">
        <el-button type="primary" size="small" @click="clearUserFilter"
          ><font-awesome-icon icon="fa-solid fa-chevron-left" /> &nbsp;
          {{ t("common.return") }}</el-button
        >
        <span>
          {{ currentNoteTitle }} {{ t("noteResource.imageResource") }}</span
        >
      </div>
      <el-table
        :data="tableList"
        :row-style="{ height: '55px' }"
        :header-row-style="{ height: '55px' }"
        :border="true"
        v-permission:resource:imrecommend:list
        :max-height="825"
      >
        <el-table-column
          prop="note_id"
          label="ID"
          align="center"
          width="100px"
        />

        <el-table-column
          prop="user_name"
          :label="t('noteResource.author')"
          align="center"
          width="110px"
        />
        <el-table-column
          :label="t('noteResource.titletopic')"
          align="center"
          width="110px"
        >
          <template #default="scope">
            {{ scope.row.note_title }} / {{ checkTopic(scope.row.topic_id) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="note_content"
          :label="t('noteResource.content')"
          align="center"
        />

        <el-table-column
          :label="t('noteResource.cover')"
          align="center"
          width="120px"
        >
          <template #default="scope">
            <photo-provider v-if="scope.row.note_cover">
              <photo-consumer
                :intro="scope.row.note_cover"
                :key="scope.row.note_cover"
                :src="scope.row.note_cover"
              >
                <img
                  :src="scope.row.note_cover"
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
          :label="t('noteResource.picturevideo')"
          align="center"
          width="120px"
        >
          <template #default="scope">
            <div
              class="play"
              @click="previewVideo(scope.row)"
              v-if="scope.row.note_thumbnail"
            >
              <span>
                <font-awesome-icon icon="fa-solid fa-play" />
              </span>
              <el-image
                style="height: 50px; width: 50px; cursor: zoom-in"
                :src="scope.row.note_thumbnail"
              />
            </div>
            <div v-else>--</div>
          </template>
        </el-table-column>

        <el-table-column
          :label="t('noteResource.teacoinValue')"
          align="center"
          width="100px"
        >
          <template #default="scope">
            <el-input
              v-model="scope.row.note_coin"
              placeholder=""
              @blur="changeCoin(scope.row.note_coin, scope.row)"
              @input="scope.row.note_coin = Math.abs(scope.row.note_coin)"
              onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode == 46"
              class="coin-input"
            />
          </template>
        </el-table-column>

        <el-table-column
          prop="read_count"
          :label="t('noteResource.readingVolume')"
          align="center"
          width="110px"
        />
        <el-table-column
          prop="like_count"
          :label="t('noteResource.likes')"
          align="center"
          width="110px"
        />
        <el-table-column
          prop="fake_read_count"
          :label="t('noteResource.manuallyAddReadingVolume')"
          align="center"
          :width="language == 'en' ? '220px' : '150px'"
        />
        <el-table-column
          prop="fake_like_count"
          :label="t('noteResource.manuallyAddLikes')"
          align="center"
          width="150px"
        />

        <el-table-column
          :label="t('noteResource.releaseTime')"
          align="center"
          width="150px"
        >
          <template #default="scope">
            <span>{{ scope.row.created_at }}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="status"
          :label="t('noteResource.postStatus')"
          align="center"
          width="110px"
        >
          <template #default="scope">
            <span :class="checkClass(scope.row.status)">{{
              checkStatus(scope.row.status)
            }}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="group_id"
          :label="t('noteResource.fanGroupResource')"
          align="center"
          width="110px"
        >
          <template #default="scope">
            {{ checkIsFan(scope.row.group_id) }}
          </template>
        </el-table-column>

        <el-table-column
          prop="group_id"
          :label="t('noteResource.category')"
          align="center"
          width="100px"
        >
          <template #default="scope">
            {{ checkGroupId(scope.row.group_id) }}
          </template>
        </el-table-column>

        <el-table-column
          :label="t('common.operate')"
          align="center"
          width="150px"
          fixed="right"
        >
          <template #default="scope">
            <el-button
              type="success"
              style="margin-left: 10px; margin-bottom: 5px"
              size="small"
              @click="imPush(scope.row)"
              v-if="scope.row.note_push == 1"
              v-permission:resource:imrecommend:edit
            >
              {{ t("noteResource.IMpush") }}
            </el-button>
            <el-tooltip
              class="box-item"
              :content="t('noteResource.comment')"
              placement="top"
            >
              <el-button
                type="primary"
                style="margin-left: 10px; margin-bottom: 5px"
                circle
                @click="goComment(scope.row)"
              >
                <font-awesome-icon icon="fa-solid fa-comments" />
              </el-button>
            </el-tooltip>
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
                v-permission:resource:imrecommend:edit
              >
                <font-awesome-icon icon="fa-solid fa-file-pen" />
              </el-button>
            </el-tooltip>

            <el-tooltip
              class="box-item"
              :content="t('noteResource.release')"
              placement="top"
              v-if="scope.row.status !== 1 && scope.row.status !== -1"
            >
              <el-button
                type="success"
                style="margin-left: 10px; margin-bottom: 5px"
                circle
                @click="handleRelease(scope.row)"
                v-permission:resource:imrecommend:edit
              >
                <font-awesome-icon icon="fa-solid fa-lock-open" />
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column
          :label="t('common.manage')"
          align="center"
          width="130px"
        >
          <template #default="scope">
            <el-tooltip
              class="box-item"
              :content="t('noteResource.review')"
              placement="top"
            >
              <el-button
                type="warning"
                style="margin-left: 10px; margin-bottom: 5px"
                circle
                @click="handleAudit(scope.row)"
                v-permission:resource:imrecommend:edit
              >
                <font-awesome-icon icon="fa-solid fa-file-circle-check" />
              </el-button>
            </el-tooltip>

            <el-tooltip
              class="box-item"
              :content="t('common.delete')"
              placement="top"
              v-if="scope.row.status !== -1"
            >
              <el-button
                type="danger"
                circle
                style="margin-bottom: 5px"
                @click="deleteHandler(scope.row.note_id)"
                v-permission:resource:imrecommend:remove
              >
                <font-awesome-icon icon="fa-solid fa-trash" />
              </el-button>
            </el-tooltip>

            <el-tooltip
              class="box-item"
              :content="t('common.restore')"
              placement="top"
              v-if="scope.row.status == -1"
            >
              <el-button
                type="success"
                circle
                style="margin-bottom: 5px"
                @click="rollbackHandler(scope.row)"
                v-permission:resource:imrecommend:edit
              >
                <font-awesome-icon icon="fa-solid fa-trash-arrow-up" />
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
          v-permission:resource:imrecommend:list
        >
        </el-pagination>
      </div>
    </div>
  </div>

  <Dialog
    :show="showDialog"
    @closed="closeDialog"
    @created="getData"
    :title="dialog.dialogTitle"
    :data="dialog.dialogData"
  />

  <div class="video-dialog" v-if="dialogVideo">
    <div class="child" @click="closeVideoDialog">
      <div class="close" @click="closeVideoDialog">
        <font-awesome-icon icon="fa-solid fa-xmark" />
      </div>
    </div>
    <div class="video">
      <video-player
        id="video"
        ref="video"
        :options="playerOptions"
        v-if="prevVideo"
        @click="playVideo"
        @play="playing"
        class="video"
      />
    </div>
  </div>

  <el-dialog
    v-model="dialogAudit"
    :title="t('noteResource.reviewResource')"
    @close="closeAuditDialog(formRef)"
    :close-on-click-modal="false"
  >
    <el-form label-width="120px" ref="formRef" :model="form">
      <el-form-item
        :label="t('noteResource.auditResult')"
        prop="reason"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-select v-model="form.reason" placeholder="请选择">
          <el-option
            v-for="item in auditList"
            :key="item"
            :label="item"
            :value="item"
            :default-first-option="true"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeAuditDialog(formRef)">{{
          t("common.close")
        }}</el-button>
        <el-button class="app-button" @click="submitAuditDialog(formRef)">{{
          t("common.sure")
        }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import {
  onMounted,
  reactive,
  toRefs,
  computed,
  ref,
  watch,
} from "vue";
import Dialog from "./dialog.vue";
import http from "@/http";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { dateFormat } from "@/utils/timeFormat.js";
import { ElMessageBox, ElMessage } from "element-plus";
import { VideoPlayer } from "@videojs-player/vue";
import "video.js/dist/video-js.css";
import videojs from "video.js";
import { useI18n } from "vue-i18n";

export default {
  name: "ShortVideoNotes",
  components: {
    Dialog,
    VideoPlayer,
  },
  setup() {
    const { t } = useI18n();
    const state = reactive({
      playerOptions: {
        autoplay: true,
        muted: false,
        loop: true,
        preload: "auto",
        // fluid: true,
        sources: [],
        poster: "",
        notSupportedMessage: "此视频暂无法播放，请稍后再试",
        controls: true,
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: true,
          fullscreenToggle: true,
          audioTrackButton: true,
        },
        bigPlayButton: false,
        disablePictureInPicture: true,
      },
      testOptions: {
        autoplay: true,
        muted: false,
        loop: true,
        preload: "auto",
        // fluid: true,
        sources: [
          "https://tearesources01.com/static/m4u8/20220906/QlNRRj/p.m3u8",
        ],
        poster: "",
        notSupportedMessage: "此视频暂无法播放，请稍后再试",
        controls: true,
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: true,
          fullscreenToggle: true,
          audioTrackButton: true,
        },
        bigPlayButton: false,
      },
      isLoading: true,
      showDialog: false,
      filterForm: {
        group_id: "",
      },
      currentNoteTitle: "",
      pageList: [10, 20, 60, 80, 100],
      param: {
        note_type: 2,
        status: 5,
        page: 1,
        page_size: 10,
        note_push: 1,
        is_fan: 2,
        free: 2,
      },
      dialog: {
        dialogTitle: "",
        dialogData: {},
      },
      dialogPrev: false,
      previmg: "",
      tableList: [],
      total: 0,
      dialogVideo: false,
      prevVideo: "",
      statusList: [
        {
          value: "5",
          label: t("common.all"),
        },
        {
          value: "0",
          label: t("noteResource.unpublished"),
        },
        {
          value: "1",
          label: t("noteResource.published"),
        },
        {
          value: "-2",
          label: t("noteResource.rejected"),
        },
        {
          value: "-1",
          label: t("noteResource.deleted"),
        },
        {
          value: "-3",
          label: t("noteResource.slicingfailed"),
        },
      ],
      // groupList: [
      //   {
      //     value: "",
      //     label: t("common.all"),
      //   },
      //   {
      //     value: "0",
      //     label: t("noteResource.find"),
      //   },
      //   {
      //     value: "1",
      //     label: t("noteResource.fanCircle"),
      //   },
      // ],
      paymentList: [
        {
          value: "2",
          label: t("common.all_status"),
        },
        {
          value: "1",
          label: t("noteResource.toPay"),
        },
        {
          value: "0",
          label: t("noteResource.free"),
        },
      ],
      topicList: [],
      isplaying: false,
      form: {
        note_id: "",
        reason: "",
      },
      auditList: [],
      dialogAudit: false,
    });
    const router = useRouter();
    const route = useRoute();
    const formRef = ref();
    const store = useStore();

    const getData = () => {
      state.isLoading = true;
      http.businessManagement.getNoteVideoList(state.param).then((res) => {
        if (res.data.err_code == 0) {
          state.isLoading = false;
          state.total = res.data.data.total;
          state.tableList = res.data.data.notes_list;
        }
      });
    };

    const handleEdit = (row) => {
      state.dialog.dialogTitle = t("common.edit");
      state.dialog.dialogData = JSON.parse(JSON.stringify(row));
      state.showDialog = true;
    };

    const closeDialog = () => {
      state.showDialog = false;
    };

    const closeVideoDialog = () => {
      state.dialogVideo = false;
      state.playerOptions.sources = [];
      state.prevVideo = "";
    };

    const filter = () => {
      state.param = {
        page: 1,
        note_type: 2,
        note_push: 1,
      };
      if (state.filterForm.status) {
        state.param.status = state.filterForm.status;
      } else {
        state.param.status = 5;
      }
      if (state.filterForm.topic_id) {
        state.param.topic_id = state.filterForm.topic_id;
      }
      if (state.filterForm.note_id) {
        state.param.note_id = state.filterForm.note_id;
      }
      if (state.filterForm.is_original) {
        state.param.is_original = state.filterForm.is_original;
      }
      if (state.filterForm.is_fan) {
        state.param.is_fan = state.filterForm.is_fan;
      }

      if (state.filterForm.paymentValue) {
        state.param.free = state.filterForm.paymentValue;
      } else {
        state.param.free = 2;
      }
      if (state.filterForm.dateValue && state.filterForm.dateValue.length) {
        state.param.start_date = `${state.filterForm.dateValue[0]} 00:00:00`;

        state.param.end_date = `${state.filterForm.dateValue[1]} 23:59:59`;
      }
    };

    const previewVideo = (row) => {
      state.playerOptions.sources.push(row.note_media_url);
      state.prevVideo = row.note_media_url;
      state.dialogVideo = true;
    };

    const playVideo = () => {
      let player = videojs("#video");

      if (state.isplaying) {
        player.pause();
        state.isplaying = false;
      } else {
        player.play();
      }
    };

    const playing = (e) => {
      state.isplaying = true;
    };

    const onSizeChange = (val) => {
      state.param.page_size = val;
      getData();
    };
    const onCurrentChange = (val) => {
      state.param.page = val;
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
          http.businessManagement.deleteNoteList({ id: id }).then((res) => {
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

    const checkStatus = (status) => {
      if (status == 1) {
        return t("noteResource.published");
      } else if (status == 0) {
        return t("noteResource.unpublished");
      } else if (status == -2) {
        return t("noteResource.rejected");
      } else {
        return t("noteResource.deleted");
      }
    };

    const checkIsFan = (group_id) => {
      if (group_id == 0) {
        return t("common.no");
      } else if (group_id == 1) {
        return t("common.yes");
      } else if (group_id == 2) {
        return t("common.all");
      }
    };

    const checkClass = (status) => {
      if (status == 1) {
        return "success";
      } else {
        return "danger";
      }
    };

    const checkGroupId = (group_id) => {
      if (group_id == 2) {
        return t("common.all");
      } else if (group_id == 0) {
        return t("noteResource.find");
      } else if (group_id == 1) {
        return t("noteResource.fanCircle");
      }
    };

    const handleAudit = (row) => {
      state.form.note_id = row.note_id;
      state.form.reason = row.note_reason;
      state.dialogAudit = true;
    };

    const closeAuditDialog = (formRef) => {
      state.form = {
        note_id: "",
        reason: "",
      };
      state.dialogAudit = false;
      state.isLoading = false;
      formRef.resetFields();
    };

    const submitAuditDialog = (formRef) => {
      formRef.validate((valid) => {
        state.isLoading = true;
        if (valid) {
          http.businessManagement.updateAuditList(state.form).then((res) => {
            if (res.data.err_code == 0) {
              state.isLoading = false;
              getData();
              ElMessage.success(t(`error.${res.data.err_code}`));
              closeAuditDialog(formRef);
            }
          });
        }
      });
    };

    const handleRelease = (row) => {
      let param = {
        note_id: row.note_id,
        user_id: row.user_id,
        note_thumbnail: row.note_thumbnail,
        group_id: row.group_id,
        city_code: row.city_code,
        province_code: row.province_code,
        note_type: row.note_type,
        note_media_url: row.note_media_url,
        note_cover: row.note_cover,
        note_content: row.note_content,
        topic_id: row.topic_id,
        note_title: row.note_title,
        status: 1,
        created_at: row.created_at,
      };

      ElMessageBox.confirm(t("common.wantToPublish"), t("common.warning"), {
        confirmButtonText: t("common.sure"),
        cancelButtonText: t("common.close"),
        type: "warning",
        draggable: true,
        closeOnClickModal: false,
      })
        .then(() => {
          http.businessManagement.updateNoteList(param).then((res) => {
            if (res.data.err_code == 0) {
              getData();
              ElMessage.success(t(`error.${res.data.err_code}`));
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

    const rollbackHandler = (row) => {
      let param = {
        note_id: row.note_id,
        user_id: row.user_id,
        note_thumbnail: row.note_thumbnail,
        group_id: row.group_id,
        city_code: row.city_code,
        province_code: row.province_code,
        note_type: row.note_type,
        note_media_url: row.note_media_url,
        note_cover: row.note_cover,
        note_content: row.note_content,
        topic_id: row.topic_id,
        note_title: row.note_title,
        status: 0,
      };

      ElMessageBox.confirm(t("common.wantToRestore"), t("common.warning"), {
        confirmButtonText: t("common.sure"),
        cancelButtonText: t("common.close"),
        type: "warning",
        draggable: true,
        closeOnClickModal: false,
      })
        .then(() => {
          http.businessManagement.updateNoteList(param).then((res) => {
            if (res.data.err_code == 0) {
              getData();
              ElMessage.success(t(`error.${res.data.err_code}`));
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

    const noteIdFilter = (note_id) => {
      state.filterForm.note_id = note_id;
      search();
    };

    const clearUserFilter = () => {
      window.history.go(-1);
    };

    const search = () => {
      filter();
      state.param.page_size = 10;
      getData();
    };

    const goComment = (row) => {
      router.push({
        path: "/commentManagement/commentList",
        query: { note_id: row.note_id },
      });
    };

    const imPush = (row) => {
      http.businessManagement
        .updateImPush({ note_id: row.note_id })
        .then((res) => {
          if (res.data.err_code == 0) {
            getData();
            ElMessage.success(t(`error.${res.data.err_code}`));
          }
        });
    };

    const reset = () => {
      state.filterForm = {
        group_id: "",
      };
      search();
    };
    const findName = (data) => {
      const index = data.findIndex((x) => x.lang == store.state.user.lang);

      if (index !== -1) {
        return data[index].content;
      } else {
        return "--";
      }
    };
    const changeCoin = (coin, row) => {
      let param = {};
      param.note_coin = coin;
      param.note_id = row.note_id;
      param.note_title = row.note_title;
      param.topic_id = row.topic_id;
      param.note_content = row.note_content;
      param.note_title = row.note_title;
      param.group_id = row.group_id;
      param.position_at = row.position_at;
      param.note_cover = row.note_cover;
      param.note_thumbnail = row.note_thumbnail;
      param.status = row.status;
      param.note_type = row.type;
      param.read_count = row.read_count;
      param.like_count = row.like_count;
      param.fake_read_count = row.fake_read_count;
      param.fake_like_count = row.fake_like_count;

      http.businessManagement.updateNoteList(param).then((res) => {
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
            value: "5",
            label: t("common.all"),
          },
          {
            value: "0",
            label: t("noteResource.unpublished"),
          },
          {
            value: "1",
            label: t("noteResource.published"),
          },
          {
            value: "-2",
            label: t("noteResource.rejected"),
          },
          {
            value: "-1",
            label: t("noteResource.deleted"),
          },
          {
            value: "-3",
            label: t("noteResource.slicingfailed"),
          },
        ];
        state.paymentList = [
          {
            value: "2",
            label: t("common.all_status"),
          },
          {
            value: "1",
            label: t("noteResource.toPay"),
          },
          {
            value: "0",
            label: t("noteResource.free"),
          },
        ];
      }
    );

    onMounted(() => {
      state.currentNoteTitle = route.query.note_title;
      let qparam = route.query.note_id;
      if (qparam == undefined) {
        getData();
      } else {
        noteIdFilter(qparam);
      }
      http.businessManagement.getNoteTopicList({ status: 1 }).then((res) => {
        if (res.data.err_code == 0) {
          state.topicList = res.data.data.topic_list;
        }
      });

      http.businessManagement.getAuditList().then((res) => {
        if (res.data.err_code == 0) {
          state.auditList = res.data.data.list;
          state.form.reason = res.data.data.list[0];
        }
      });
    });
    const checkTopic = (id) => {
      let name;
      state.topicList.forEach((res) => {
        if (res.id === id) {
          name = res.name;
        }
      });

      if (name !== undefined && name.length > 0) {
        const index = name.findIndex((x) => x.lang == store.state.user.lang);
        if (index !== -1) {
          return name[index].content;
        }
      } else {
        return "--";
      }
    };

    return {
      t,
      ...toRefs(state),
      getData,
      handleEdit,
      closeDialog,
      dateFormat,
      checkStatus,
      checkIsFan,
      search,
      getData,
      onSizeChange,
      onCurrentChange,
      deleteHandler,
      previewVideo,
      checkClass,
      handleRelease,
      rollbackHandler,
      closeVideoDialog,
      handleAudit,
      submitAuditDialog,
      closeAuditDialog,
      playVideo,
      playing,
      formRef,
      clearUserFilter,
      goComment,
      imPush,
      reset,
      checkTopic,
      checkGroupId,
      changeCoin,
      windowRect: computed(() => store.state.app.windowRect),
      device: computed(() => store.state.app.device),
      theme: computed(() => store.state.theme.mode),
      language: computed(() => store.state.user.lang),
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

.play {
  position: relative;
  cursor: pointer;

  span {
    position: absolute;
    z-index: 1;
    background: rgba(#000, 0.5);
    color: white;
    width: 50px;
    height: 50px;

    svg {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}

.video-dialog {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2000;
  height: 100%;
  background-color: rgba(#000, 0.5);
  overflow: auto;

  .child {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: auto;
    background-color: #000;
  }

  .video {
    width: auto;
    max-width: 500px;
    height: 95vh;
    cursor: pointer;
    margin: 0 auto;
  }

  .close {
    color: rgba(#fff, 0.6);
    font-size: 24px;
    right: 10px;
    position: absolute;
    top: 10px;
    cursor: pointer;
  }
}

.note-info {
  padding-bottom: 21px;

  span {
    padding-left: 10px;
  }
}

.dark {
  color: white;
}

.coin-input {
  :deep(.el-input__inner) {
    text-align: center !important;
  }
}
</style>
