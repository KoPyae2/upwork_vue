<template>
  <div
    v-loading="isLoading"
    element-loading-background="rgba(122, 122, 122, 0.3)"
  >
    <div class="form" v-permission:longvideo:resource:list>
      <div class="form-content">
        <el-form label-position="top" label-width="300px">
          <el-form-item :label="t('noteLongVideo.resourceIDTitle')">
            <el-input
              :placeholder="t('noteLongVideo.enterResourceIDTitle')"
              v-model="filterForm.title"
            />
          </el-form-item>

          <el-form-item :label="t('noteLongVideo.postStatus')">
            <el-select
              :multiple="false"
              :placeholder="t('noteLongVideo.selectPostStatus')"
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

          <el-form-item :label="t('noteLongVideo.allTopics')">
            <el-select
              :multiple="false"
              :placeholder="t('noteLongVideo.selectAllTopics')"
              style="width: 100%"
              v-model="filterForm.topic_id"
              default-first-option
            >
              <el-option value="" :label="t('common.all')" />
              <el-option
                v-for="item in topicList"
                :key="item.topic_id"
                :value="item.topic_id"
                :label="findName(item.topic_name)"
              />
            </el-select>
          </el-form-item>

          <el-form-item :label="t('noteLongVideo.originalResource')">
            <el-select
              :multiple="false"
              :placeholder="t('noteLongVideo.selectOriginalResource')"
              style="width: 100%"
              v-model="filterForm.is_original"
            >
              <el-option value="0" :label="t('common.all_status')" />
              <el-option value="1" :label="t('common.yes')" />
            </el-select>
          </el-form-item>

          <el-form-item :label="t('noteLongVideo.fanGroupResource')">
            <el-select
              :multiple="false"
              :placeholder="t('noteLongVideo.selectFanGroupResource')"
              style="width: 100%"
              v-model="filterForm.is_fan"
            >
              <el-option value="2" :label="t('common.all')" />
              <el-option value="0" :label="t('common.no')" />
              <el-option value="1" :label="t('common.yes')" />
            </el-select>
          </el-form-item>
          <el-form-item :label="t('noteLongVideo.paymentStatus')">
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

          <el-form-item
            :label="t('noteLongVideo.releaseTime')"
            style="margin-left: 30px; min-width: 300px"
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
          {{ currentNoteTitle }} {{ t("noteLongVideo.resourceImage") }}</span
        >
      </div>
      <el-table
        :data="tableList"
        :row-style="{ height: '55px' }"
        :header-row-style="{ height: '55px' }"
        :border="true"
        :max-height="825"
        v-permission:longvideo:resource:list
      >
        <el-table-column
          prop="note_id"
          label="ID"
          align="center"
          width="100px"
        />
        <el-table-column
          prop="user_name"
          :label="t('noteLongVideo.author')"
          align="center"
          width="100px"
        />
        <el-table-column
          :label="t('noteLongVideo.titletopic')"
          align="center"
          width="110px"
        >
          <template #default="scope">
            {{ scope.row.note_title }} / {{ checkTopic(scope.row.topic_id) }}
          </template>
        </el-table-column>

        <el-table-column
          prop="note_content"
          :label="t('noteLongVideo.content')"
          align="center"
          width="230px"
        />
        <el-table-column
          :label="t('noteLongVideo.cover')"
          align="center"
          width="100px"
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
                  style="height: 50px; cursor: zoom-in; width: 50px"
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
          :label="t('noteLongVideo.picturevideo')"
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
          :label="t('noteLongVideo.teacoinValue')"
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
          :label="t('noteLongVideo.readingVolume')"
          align="center"
          width="110px"
        />
        <el-table-column
          prop="like_count"
          :label="t('noteLongVideo.likes')"
          align="center"
          width="110px"
        />
        <el-table-column
          prop="fake_read_count"
          :label="t('noteLongVideo.manuallyAddReadingVolume')"
          align="center"
          :width="language == 'en' ? '220px' : '150px'"
        />
        <el-table-column
          prop="fake_like_count"
          :label="t('noteLongVideo.manuallyAddLikes')"
          align="center"
          width="150px"
        />
        <el-table-column
          :label="t('noteLongVideo.releaseTime')"
          align="center"
          width="150px"
        >
          <template #default="scope">
            <span>{{ scope.row.created_at }}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="status"
          :label="t('noteLongVideo.postStatus')"
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
          :label="t('noteLongVideo.fanGroupResource')"
          align="center"
          width="110px"
        >
          <template #default="scope">
            {{ checkIsFan(scope.row.group_id) }}
          </template>
        </el-table-column>

        <el-table-column
          :label="t('common.operate')"
          align="center"
          width="170px"
          fixed="right"
        >
          <template #default="scope">
            <el-button
              size="small"
              type="primary"
              style="margin-left: 10px; margin-bottom: 5px"
              @click="handleTypeDialog(scope.row)"
              v-permission:longvideo:resource:edit
            >
              {{ t("noteLongVideo.movie") }}
            </el-button>
            <el-tooltip
              class="box-item"
              :content="t('noteLongVideo.comment')"
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
                v-permission:longvideo:resource:edit
              >
                <font-awesome-icon icon="fa-solid fa-file-pen" />
              </el-button>
            </el-tooltip>

            <el-tooltip
              class="box-item"
              :content="t('noteLongVideo.release')"
              placement="top"
              v-if="
                scope.row.status !== 1 &&
                scope.row.status !== -1 &&
                scope.row.note_extend_status == 1
              "
            >
              <el-button
                type="success"
                style="margin-left: 10px; margin-bottom: 5px"
                circle
                @click="handleRelease(scope.row)"
                v-permission:longvideo:resource:edit
              >
                <font-awesome-icon icon="fa-solid fa-lock-open" />
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column
          :label="t('common.manage')"
          align="center"
          width="140px"
        >
          <template #default="scope">
            <el-tooltip
              class="box-item"
              :content="t('noteLongVideo.review')"
              placement="top"
            >
              <el-button
                type="warning"
                style="margin-left: 10px; margin-bottom: 5px"
                circle
                @click="handleAudit(scope.row)"
                v-permission:longvideo:resource:edit
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
                v-permission:longvideo:resource:remove
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
                v-permission:longvideo:resource:edit
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
          v-permission:longvideo:resource:list
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
    :title="t('noteLongVideo.reviewResource')"
    :close-on-click-modal="false"
    @close="closeAuditDialog(formRef)"
  >
    <el-form label-width="120px" ref="formRef" :model="form">
      <el-form-item
        :label="t('noteLongVideo.auditResult')"
        prop="reason"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-select
          v-model="form.reason"
          :placeholder="t('common.pleaseChoose')"
        >
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

  <el-dialog
    v-model="dialogType"
    :title="t('noteLongVideo.movie')"
    :close-on-click-modal="false"
    @close="closeTypeDialog(typeRef)"
  >
    <el-form
      label-width="150px"
      ref="typeRef"
      :model="typeForm"
      label-position="top"
    >
      <el-form-item
        :label="t('noteLongVideo.movieClassification')"
        prop="type_id"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <div style="padding: 10px; border: 1px solid #000; width: 96.5%">
          <el-radio-group v-model="typeForm.type_id">
            <el-radio
              v-for="item in typeList"
              :key="item"
              :label="item.type_id"
              >{{ findName(item.type_name) }}</el-radio
            >
          </el-radio-group>
        </div>
      </el-form-item>
      <br />
      <br />
      <el-form-item
        :label="t('noteLongVideo.thematicTags')"
        prop="topic_id"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <div style="padding: 10px; border: 1px solid #000; width: 96.5%">
          <el-checkbox-group v-model="typeForm.topic_id">
            <el-checkbox
              v-for="item in topicList"
              :key="item"
              :label="item.topic_id"
              >{{ findName(item.topic_name) }}</el-checkbox
            >
          </el-checkbox-group>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeTypeDialog(typeRef)">{{
          t("common.close")
        }}</el-button>
        <el-button class="app-button" @click="submitTypeDialog(typeRef)">{{
          t("common.sure")
        }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { onMounted, reactive, toRefs, computed, ref, watch } from "vue";
import http from "@/http";
import Dialog from "./dialog.vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { dateFormat } from "@/utils/timeFormat.js";
import { ElMessageBox, ElMessage } from "element-plus";
import { VideoPlayer } from "@videojs-player/vue";
import "video.js/dist/video-js.css";
import videojs from "video.js";
import { useI18n } from "vue-i18n";

export default {
  name: "LongVideoNotes",
  components: {
    Dialog,
    VideoPlayer,
  },
  setup() {
    const { t } = useI18n();
    const state = reactive({
      isLoading: true,
      showDialog: false,
      filterForm: {},
      pageList: [10, 20, 60, 80, 100],
      param: {
        note_type: 4,
        page: 1,
        page_size: 10,
        status: 5,
        free: 2,
        is_fan: 2,
      },
      dialog: {
        dialogTitle: "",
        dialogData: {},
      },
      previmg: "",
      dialogVideo: false,
      prevVideo: "",
      tableList: [],
      total: 0,
      statusList: [
        {
          value: "5",
          label: t("common.all"),
        },
        {
          value: "0",
          label: t("noteLongVideo.unpublished"),
        },
        {
          value: "1",
          label: t("noteLongVideo.published"),
        },
        {
          value: "-2",
          label: t("noteLongVideo.rejected"),
        },
        {
          value: "-1",
          label: t("noteLongVideo.deleted"),
        },
        {
          value: "-3",
          label: t("noteLongVideo.slicingfailed"),
        },
      ],
      paymentList: [
        {
          value: "2",
          label: t("common.all_status"),
        },
        {
          value: "1",
          label: t("noteLongVideo.toPay"),
        },
        {
          value: "0",
          label: t("noteLongVideo.free"),
        },
      ],
      topicList: [],
      typeList: [],
      dialogAudit: false,
      form: {
        note_id: "",
        reason: "",
      },
      auditList: [],
      dialogType: false,
      currentNoteTitle: "",
      typeForm: {
        note_id: "",
        topic_id: [],
        type_id: "",
      },
      playerOptions: {
        autoplay: true,
        muted: false,
        loop: true,
        preload: "auto",
        sources: [],
        poster: "",
        notSupportedMessage: "此视频暂无法播放，请稍后再试",
        controls: true,
        controlBar: {
          timeDivider: true, //当前时间和持续时间的分隔符
          durationDisplay: true, //显示持续时间
          remainingTimeDisplay: true, //是否显示剩余时间功能
          fullscreenToggle: true, //全屏按钮
          audioTrackButton: true,
        },
        bigPlayButton: false,
        disablePictureInPicture: true,
      },
    });

    const route = useRoute();
    const router = useRouter();
    const formRef = ref();
    const typeRef = ref();
    const store = useStore();

    const getData = () => {
      state.isLoading = true;
      http.businessManagement.getNoteLongVideoList(state.param).then((res) => {
        if (res.data.err_code == 0) {
          state.isLoading = false;
          state.total = res.data.data.total;
          state.tableList = res.data.data.notes_list;
        }
      });
    };

    const checkTopic = (id) => {
      let name;
      state.topicList.forEach((topic) => {
        if (topic.topic_id === id) {
          name = topic.topic_name;
        }
      });
      if (name !== undefined && name.length > 0) {
        const index = name.findIndex((x) => x.lang == store.state.user.lang);
        if (index !== -1) {
          return name[index].content;
        } else {
          return "--";
        }
      } else {
        return "--";
      }
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

    const closeAuditDialog = (formRef) => {
      state.form = {
        note_id: "",
        reason: "",
      };
      state.dialogAudit = false;
      state.isLoading = false;
      formRef.resetFields();
    };

    const closeTypeDialog = (formRef) => {
      state.typeForm = {
        note_id: "",
        topic_id: [],
        type_id: "",
      };
      state.dialogType = false;
      state.isLoading = false;
      formRef.resetFields();
    };

    const filter = () => {
      state.param = {
        page: 1,
        note_type: 4,
      };
      if (state.filterForm.status) {
        state.param.status = state.filterForm.status;
      } else {
        state.param.status = 5;
      }
      if (state.filterForm.topic_id) {
        state.param.topic_id = state.filterForm.topic_id;
      }
      if (state.filterForm.title) {
        state.param.note_id = state.filterForm.title;
      }
      if (state.filterForm.paymentValue) {
        state.param.free = state.filterForm.paymentValue;
      } else {
        state.param.free = 2;
      }
      if (state.filterForm.is_original) {
        state.param.is_original = state.filterForm.is_original;
      }
      if (state.filterForm.is_fan) {
        state.param.is_fan = state.filterForm.is_fan;
      } else {
        state.param.is_fan = 2;
      }

      if (state.filterForm.dateValue && state.filterForm.dateValue.length) {
        state.param.start_date = `${state.filterForm.dateValue[0]} 00:00:00`;

        state.param.end_date = `${state.filterForm.dateValue[1]} 23:59:59`;
      }
    };
    const previewVideo = (row) => {
      state.playerOptions.sources = row.note_media_url;
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
        created_at: row.created_at,
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

    const checkStatus = (status) => {
      if (status == 1) {
        return t("noteLongVideo.published");
      } else if (status == 0) {
        return t("noteLongVideo.unpublished");
      } else if (status == -2) {
        return t("noteLongVideo.rejected");
      } else {
        return t("noteLongVideo.deleted");
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

    const handleAudit = (row) => {
      state.form.reason = row.note_reason;
      state.form.note_id = row.note_id;
      state.dialogAudit = true;
    };

    const submitAuditDialog = (formRef) => {
      formRef.validate((valid) => {
        if (valid) {
          state.isLoading = true;
          http.businessManagement
            .updateAuditList(state.form)
            .then((res) => {
              if (res.data.err_code == 0) {
                state.isLoading = false;
                getData();
                ElMessage.success(t(`error.${res.data.err_code}`));
                closeAuditDialog(formRef);
              } else {
                ElMessage.success(t(`error.${res.data.err_code}`));
                state.isLoading = false;
              }
            })
            .catch((e) => {
              state.isLoading = false;
            });
        }
      });
    };

    const submitTypeDialog = (formRef) => {
      formRef.validate((valid) => {
        if (valid) {
          state.isLoading = true;
          http.businessManagement
            .updateNoteLongVideoDivide(state.typeForm)
            .then((res) => {
              if (res.data.err_code == 0) {
                ElMessage.success(t(`error.${res.data.err_code}`));
                getData();
                closeTypeDialog(formRef);
                state.isLoading = false;
              } else {
                ElMessage.error(t(`error.${res.data.err_code}`));
                state.isLoading = false;
              }
            })
            .catch((e) => {
              state.isLoading = false;
            });
        }
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
    const handleTypeDialog = (row) => {
      state.dialogType = true;
      state.typeForm.note_id = row.note_id;

      state.typeForm.type_id = row.type_id;
      state.typeForm.topic_id = row.topic_ids;
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

    const reset = () => {
      state.filterForm = {};
      search();
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
      param.note_media_url = row.note_media_url;
      param.status = row.status;
      param.note_type = 4;
      param.created_at = row.created_at;
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
            label: t("noteLongVideo.unpublished"),
          },
          {
            value: "1",
            label: t("noteLongVideo.published"),
          },
          {
            value: "-2",
            label: t("noteLongVideo.rejected"),
          },
          {
            value: "-1",
            label: t("noteLongVideo.deleted"),
          },
          {
            value: "-3",
            label: t("noteLongVideo.slicingfailed"),
          },
        ];
        state.paymentList = [
          {
            value: "2",
            label: t("common.all_status"),
          },
          {
            value: "1",
            label: t("noteLongVideo.toPay"),
          },
          {
            value: "0",
            label: t("noteLongVideo.free"),
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

      http.businessManagement
        .getNoteLongVideoTopic({ status: 1 })
        .then((res) => {
          if (res.data.err_code == 0) {
            state.topicList = res.data.data.video_topics;
          }
        });

      http.businessManagement
        .getNoteLongVideoType({ status: 1 })
        .then((res) => {
          if (res.data.err_code == 0) {
            state.typeList = res.data.data.video_type;
          }
        });

      http.businessManagement.getAuditList().then((res) => {
        if (res.data.err_code == 0) {
          state.auditList = res.data.data.list;
          state.form.reason = res.data.data.list[0];
        }
      });

      document.addEventListener("keydown", (e) => {
        if (e.keyCode == 27) {
          closeVideoDialog();
        }
      });
    });

    return {
      t,
      ...toRefs(state),
      handleTypeDialog,
      handleEdit,
      closeDialog,
      dateFormat,
      checkStatus,
      checkClass,
      checkIsFan,
      search,
      getData,
      onSizeChange,
      onCurrentChange,
      deleteHandler,
      previewVideo,
      playVideo,
      playing,
      closeVideoDialog,
      rollbackHandler,
      handleRelease,
      closeAuditDialog,
      handleAudit,
      submitAuditDialog,
      closeTypeDialog,
      submitTypeDialog,
      checkTopic,
      formRef,
      typeRef,
      clearUserFilter,
      goComment,
      reset,
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

  .icon {
    cursor: pointer;
  }

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
