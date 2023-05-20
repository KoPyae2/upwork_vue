<template>
  <div
    element-loading-background="rgba(122, 122, 122, 0.3)"
    v-loading="isLoading"
  >
    <div class="form" v-permission:livevideo:resource:list>
      <div class="form-content">
        <el-form label-position="top" label-width="300px">
          <el-form-item :label="t('liveResource.memberID')">
            <el-input
              :placeholder="t('liveResource.enterMemberID')"
              v-model="filterForm.user_id"
            />
          </el-form-item>

          <el-form-item :label="t('liveResource.state')">
            <el-select
              :multiple="false"
              :placeholder="t('common.pleaseChoose')"
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

          <el-form-item
            :label="t('liveResource.liveStartTime')"
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
      <el-button
        @click="addNew"
        class="app-button"
        style="margin-bottom: 25px"
        v-permission:livevideo:resource:add
        ><font-awesome-icon icon="fa-solid fa-plus" style="margin-right: 5px" />
        {{ t("common.addTo") }}</el-button
      >

      <el-table
        :data="tableList"
        :row-style="{ height: '55px' }"
        :header-row-style="{ height: '55px' }"
        :border="true"
        v-permission:livevideo:resource:list
        :max-height="825"
        id="table"
      >
        <el-table-column
          prop="id"
          :label="t('liveResource.id')"
          align="center"
        />
        <el-table-column
          prop="title"
          :label="t('liveResource.title')"
          align="center"
        />
        <el-table-column
          prop="user_id"
          :label="t('liveResource.memberID')"
          align="center"
        />
        <el-table-column
          prop="user_name"
          :label="t('liveResource.memberNickname')"
          align="center"
          width="150px"
        />
        <el-table-column
          prop="live_id"
          :label="t('liveResource.liveID')"
          align="center"
        />
        <el-table-column
          prop="status"
          :label="t('liveResource.state')"
          align="center"
        >
          <template #default="scope">
            <span :class="checkClass(scope.row.status)">{{
              checkStatus(scope.row.status)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="170px"
          :label="t('liveResource.liveStartTime')"
          align="center"
        >
          <template #default="scope">
            <span>{{ dateFormat(scope.row.start_time) }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="房间类型" align="center">
          <template #default="scope">
            <span>{{ typeStatus(scope.row.type) }}</span>
          </template>
        </el-table-column> -->

        <el-table-column :label="t('liveResource.cover')" align="center">
          <template #default="scope">
            <photo-provider v-if="scope.row.img_url">
              <photo-consumer
                :intro="scope.row.img_url"
                :key="scope.row.img_url"
                :src="scope.row.img_url"
              >
                <img
                  :src="scope.row.img_url"
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
        <el-table-column :label="t('liveResource.pictureVideo')" align="center">
          <template #default="scope">
            <div class="play" @click="previewVideo(scope.row)">
              <span>
                <font-awesome-icon icon="fa-solid fa-play" />
              </span>
              <el-image
                style="height: 50px; width: 50px; cursor: zoom-in"
                :src="scope.row.thumbnail"
              />
            </div>
          </template>
        </el-table-column>

        <el-table-column
          :label="t('common.operate')"
          align="center"
          width="300px"
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
                v-permission:livevideo:resource:edit
              >
                <font-awesome-icon icon="fa-solid fa-file-pen" />
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
                @click="deleteHandler(scope.row.live_id)"
                v-permission:livevideo:resource:remove
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
                v-permission:livevideo:resource:remove
              >
                <font-awesome-icon icon="fa-solid fa-trash-arrow-up" />
              </el-button>
            </el-tooltip>
            <el-button
              type="success"
              size="small"
              @click="
                goToPage(
                  `/businessmanagement/noteLiveVideo/${scope.row.live_id}/commentList`
                )
              "
              v-permission:livevideo:resource:list
            >
              {{ t("liveResource.commentList") }}
            </el-button>
            <el-button
              type="success"
              size="small"
              @click="
                goToPage(
                  `/businessmanagement/noteLiveVideo/${scope.row.live_id}/audienceList`
                )
              "
              v-permission:livevideo:resource:list
            >
              {{ t("liveResource.audienceList") }}
            </el-button>
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
          v-permission:livevideo:resource:list
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

  <div class="video-dialog" v-if="dialogVideo">
    <div class="child" @click="dialogVideo = false">
      <div class="close" @click="dialogVideo = false">
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
</template>

<script>
import { onMounted, reactive, toRefs, computed, ref, watch } from "vue";
import Dialog from "./dialog.vue";
import http from "@/http";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { dateFormat } from "@/utils/timeFormat.js";
import { ElMessageBox, ElMessage } from "element-plus";
import { VideoPlayer } from "@videojs-player/vue";
import "video.js/dist/video-js.css";
import videojs from "video.js";
import { useI18n } from "vue-i18n";

export default {
  name: "NoteLiveVideos",
  components: {
    Dialog,
    VideoPlayer,
  },
  setup() {
    const { t } = useI18n();
    const state = reactive({
      tableHeight: 0,
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
      tableList: [],
      total: 0,
      dialogVideo: false,
      prevVideo: "",
      statusList: [
        {
          value: "",
          label: t("common.all"),
        },
        {
          value: "1",
          label: t("liveResource.live"),
        },
        {
          value: "-1",
          label: t("liveResource.offline"),
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
      showCommentDialog: false,
      commentHistory: [],
      commentParam: {
        page: 1,
        page_size: 10,
        user_id: "",
        note_id: "",
      },
    });

    const formRef = ref();
    const router = useRouter();
    const store = useStore();

    const getData = () => {
      state.isLoading = true;
      http.businessManagement.getLiveVideoList(state.param).then((res) => {
        if (res.data.err_code == 0) {
          state.isLoading = false;
          state.total = res.data.data.total;
          state.tableList = res.data.data.data;
        }
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
      state.commentHistory = [];
    };

    const closeVideoDialog = () => {
      state.dialogVideo = false;
      state.playerOptions.sources = [];
      state.prevVideo = "";
    };

    const filter = () => {
      state.param = {
        page: 1,
      };

      if (state.filterForm.dateValue && state.filterForm.dateValue.length) {
        state.param.start_date = `${state.filterForm.dateValue[0]} 00:00:00`;
        state.param.end_date = `${state.filterForm.dateValue[1]} 23:59:59`;
      }
      if (state.filterForm.status) {
        state.param.status = state.filterForm.status;
      }
      if (state.filterForm.user_id) {
        state.param.user_id = state.filterForm.user_id;
      }
    };

    const previewVideo = (row) => {
      state.playerOptions.sources = row.video_url;
      state.prevVideo = row.video_url;
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
          http.businessManagement
            .deleteLiveVideo({ live_id: id })
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

    const checkStatus = (status) => {
      if (status == 1) {
        return t("liveResource.live");
      } else {
        return t("liveResource.offline");
      }
    };

    const typeStatus = (status) => {
      if (status == 1) {
        return t("liveResource.common");
      } else {
        return "--";
      }
    };
    const checkClass = (status) => {
      if (status == 1) {
        return "success";
      } else {
        return "danger";
      }
    };

    const rollbackHandler = (row) => {
      let param = {
        live_id: row.live_id,
        status: 1,
      };

      ElMessageBox.confirm(t("common.wantToRestore"), t("common.warning"), {
        confirmButtonText: t("common.sure"),
        cancelButtonText: t("common.close"),
        type: "warning",
        closeOnClickModal: false,
      })
        .then(() => {
          http.businessManagement.deleteLiveVideo(param).then((res) => {
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

    const onSizeCommentChange = (val) => {
      state.commentParam.page_size = val;
      getCommentData();
    };
    const onCurrentCommentChange = (val) => {
      state.commentParam.page = val;
      getCommentData();
    };

    const search = () => {
      filter();
      state.param.page_size = 10;
      getData();
    };

    const goToPage = (name) => {
      router.push(name);
    };

    const reset = () => {
      state.filterForm = {};
      search();
    };

    watch(
      () => store.state.user.lang,
      () => {
        state.statusList = [
          {
            value: "",
            label: t("common.all"),
          },
          {
            value: "1",
            label: t("liveResource.live"),
          },
          {
            value: "-1",
            label: t("liveResource.offline"),
          },
        ];
      }
    );

    onMounted(() => {
      getData();
    });

    return {
      t,
      ...toRefs(state),
      handleEdit,
      closeDialog,
      dateFormat,
      checkStatus,
      search,
      onSizeChange,
      onCurrentChange,
      onSizeCommentChange,
      onCurrentCommentChange,
      deleteHandler,
      previewVideo,
      checkClass,
      rollbackHandler,
      closeVideoDialog,
      playVideo,
      playing,
      goToPage,
      addNew,
      typeStatus,
      formRef,
      getData,
      reset,
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
</style>
