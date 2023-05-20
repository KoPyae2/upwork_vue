<template>
  <div
    element-loading-background="rgba(122, 122, 122, 0.3)"
    v-loading="isLoading"
  >
    <div class="form" v-permission:user:auth:note>
      <div class="form-content">
        <el-form label-position="top" label-width="300px">
          <el-form-item :label="$t(`user.resource_id`)">
            <el-input
              :placeholder="$t(`user.please_enter`) + $t(`user.resource_id`)"
              v-model="filterForm.note_id"
            />
          </el-form-item>

          <el-form-item :label="$t(`user.post_status`)">
            <el-select
              :multiple="false"
              :placeholder="$t(`user.enter_release_status`)"
              allow-create
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

          <el-form-item :label="$t(`user.original_resources`)">
            <el-select
              :multiple="false"
              :placeholder="
                $t(`user.please_enter`) + $t(`user.original_resources`)
              "
              style="width: 100%"
              v-model="filterForm.is_original"
              default-first-option
            >
              <el-option value="0" :label="t('common.all_status')" />
              <el-option value="1" :label="t('common.yes')" />
            </el-select>
          </el-form-item>

          <!-- <el-form-item label="粉丝团资源">
            <el-select
              :multiple="false"
              placeholder="请输入粉丝团资源"
              style="width: 100%"
              v-model="filterForm.is_fan"
              default-first-option
            >
              <el-option value="" label="全部状态" />
              <el-option value="1" label="是" />
              <el-option value="0" label="否" />
            </el-select>
          </el-form-item> -->

          <el-form-item
            :label="$t(`user.release_time`)"
            style="margin-left: 30px; min-width: 300px"
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
      <el-button
        @click="addImageNew"
        class="app-button"
        style="margin-bottom: 25px"
        v-permission:resource:image:add
        ><font-awesome-icon icon="fa-solid fa-plus" style="margin-right: 5px" />
        {{ t(`user.publish_img_resources`) }}</el-button
      >

      <el-button
        @click="addVideoNew"
        class="app-button"
        style="margin-bottom: 25px"
        v-permission:resource:video:add
        ><font-awesome-icon icon="fa-solid fa-plus" style="margin-right: 5px" />
        {{ t(`user.publish_vid_assets`) }}</el-button
      >

      <el-button
        @click="addLongVideoNew"
        class="app-button"
        style="margin-bottom: 25px"
        v-permission:longvideo:resource:add
        ><font-awesome-icon icon="fa-solid fa-plus" style="margin-right: 5px" />
        {{ t(`user.post_long_vid`) }}</el-button
      >

      <el-table
        :data="tableList"
        :row-style="{ height: '70px' }"
        :header-row-style="{ height: '55px' }"
        :border="true"
        v-permission:user:auth:note
        :max-height="825"
      >
        <el-table-column prop="note_id" label="ID" align="center" />

        <el-table-column
          prop="user_name"
          :label="$t(`user.author`)"
          align="center"
        />
        <el-table-column
          prop="note_title"
          :label="$t(`user.topic`) + '/' + $t(`user.title`)"
          align="center"
          width="100px"
        />
        <el-table-column
          prop="note_content"
          :label="$t(`user.content`)"
          align="center"
        />

        <el-table-column
          :label="$t(`user.the_cover`)"
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
                  class="custom-table-image"
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
                <img src="/default-no.png" width="55" height="55" alt="" />
              </photo-consumer>
            </photo-provider>
          </template>
        </el-table-column>

        <el-table-column
          :label="$t(`user.picture_vid`)"
          align="center"
          width="120px"
        >
          <template #default="scope">
            <div v-if="scope.row.note_type == 1">
              <div class="carousel" v-if="scope.row.images.length > 1">
                <photo-provider v-if="scope.row.images.length > 0">
                  <div
                    id="showCount"
                    @click="multipleCardPreview(scope.row.note_id)"
                  >
                    <div style="margin-top: 15px !important">
                      +{{ scope.row.images.length }}
                    </div>
                  </div>
                  <photo-consumer
                    v-for="(img, index) in scope.row.images"
                    :intro="img"
                    :key="img"
                    :src="img"
                    :id="scope.row.note_id"
                  >
                    <img
                      v-if="scope.row.images[0]"
                      :src="scope.row.images[0]"
                      :class="index"
                      class="custom-table-image"
                    />
                  </photo-consumer>
                </photo-provider>
              </div>
              <div v-else>
                <photo-provider v-if="scope.row.note_cover">
                  <photo-consumer
                    v-if="scope.row.images[0]"
                    :intro="scope.row.images[0]"
                    :key="scope.row.images[0]"
                    :src="scope.row.images[0]"
                  >
                    <img
                      :src="scope.row.images[0]"
                      class="view-box custom-table-image"
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
              </div>
            </div>

            <div v-else>
              <div class="play" @click="previewVideo(scope.row)">
                <span>
                  <font-awesome-icon icon="fa-solid fa-play" />
                </span>
                <el-image
                  v-if="scope.row.note_thumbnail"
                  style="height: 50px; width: 50px; cursor: zoom-in"
                  :src="scope.row.note_thumbnail"
                />
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column :label="$t(`user.typeof`)" align="center">
          <template #default="scope">
            {{ checkType(scope.row.note_type) }}
          </template>
        </el-table-column>

        <el-table-column
          :label="$t(`user.teacoin_val`)"
          align="center"
          width="130px"
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
          :label="$t(`user.reading_val`)"
          align="center"
          width="125px"
        />
        <el-table-column
          prop="like_count"
          :label="$t(`user.like`)"
          align="center"
          width="110px"
        />

        <el-table-column
          prop="fake_read_count"
          :label="$t(`user.add_reading_volume`)"
          align="center"
          :width="language == 'en' ? '215px' : '150px'"
        />
        <el-table-column
          prop="fake_like_count"
          :label="$t(`user.add_likes`)"
          align="center"
          width="150px"
        />

        <el-table-column
          :label="$t(`user.release_time`)"
          align="center"
          width="150px"
        >
          <template #default="scope">
            <span>{{ scope.row.created_at }}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="status"
          :label="$t(`user.post_status`)"
          align="center"
          width="120px"
        >
          <template #default="scope">
            <span :class="checkClass(scope.row.status)">{{
              checkStatus(scope.row.status)
            }}</span>
          </template>
        </el-table-column>

        <el-table-column
          :label="t(`common.operate`)"
          align="center"
          width="150"
        >
          <template #default="scope">
            <el-tooltip
              class="box-item"
              :content="$t(`user.comment`)"
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
              :content="t(`common.edit`)"
              placement="top"
            >
              <el-button
                type="primary"
                style="margin-left: 10px; margin-bottom: 5px"
                circle
                @click="handleEdit(scope.row)"
                v-permission:user:auth:note
              >
                <font-awesome-icon icon="fa-solid fa-file-pen" />
              </el-button>
            </el-tooltip>

            <el-tooltip
              class="box-item"
              :content="$t(`user.release`)"
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
                v-permission:user:auth:note
              >
                <font-awesome-icon icon="fa-solid fa-lock-open" />
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column
          :label="$t(`user.manage`)"
          align="center"
          width="150px"
        >
          <template #default="scope">
            <el-tooltip
              class="box-item"
              :content="$t(`user.review`)"
              placement="top"
            >
              <el-button
                type="warning"
                style="margin-left: 10px; margin-bottom: 5px"
                circle
                @click="handleAudit(scope.row)"
                v-permission:user:auth:note
              >
                <font-awesome-icon icon="fa-solid fa-file-circle-check" />
              </el-button>
            </el-tooltip>

            <el-tooltip
              class="box-item"
              :content="$t(`common.delete`)"
              placement="top"
              v-if="scope.row.status !== -1"
            >
              <el-button
                type="danger"
                circle
                style="margin-bottom: 5px"
                @click="deleteHandler(scope.row.note_id)"
                v-permission:user:auth:note
              >
                <font-awesome-icon icon="fa-solid fa-trash" />
              </el-button>
            </el-tooltip>

            <el-tooltip
              class="box-item"
              :content="$t(`user.recover`)"
              placement="top"
              v-if="scope.row.status == -1"
            >
              <el-button
                type="success"
                circle
                style="margin-bottom: 5px"
                @click="rollbackHandler(scope.row)"
                v-permission:user:auth:note
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
          v-permission:user:auth:note
        >
        </el-pagination>
      </div>
    </div>
  </div>

  <ImageDialog
    :show="showImageDialog"
    @closed="closeImageDialog"
    @created="search"
    :title="dialog.dialogTitle"
    :data="dialog.dialogData"
  />

  <VideoDialog
    :show="showVideoDialog"
    @closed="closeVideoDialog"
    @created="search"
    :title="dialog.dialogTitle"
    :data="dialog.dialogData"
  />

  <LongVideoDialog
    :show="showLongVideoDialog"
    @closed="closeLongVideoDialog"
    @created="search"
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

  <el-dialog v-model="dialogCarousel" center>
    <el-carousel height="700px" type="card">
      <el-carousel-item v-for="item in carouselList" :key="item">
        <img v-if="item" :src="item" alt="" />
      </el-carousel-item>
    </el-carousel>
  </el-dialog>

  <el-dialog
    v-model="dialogAudit"
    :title="$t(`user.review_resource`)"
    @close="closeAuditDialog(formRef)"
    :close-on-click-modal="false"
  >
    <el-form label-width="120px" ref="formRef" :model="form">
      <el-form-item
        :label="$t(`user.audit_result`)"
        prop="reason"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-select
          v-model="form.reason"
          :placeholder="$t(`user.please_select`)"
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
          t(`common.close`)
        }}</el-button>
        <el-button class="app-button" @click="submitAuditDialog(formRef)">{{
          t(`common.sure`)
        }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { onMounted, reactive, toRefs, computed, ref } from "vue";
import ImageDialog from "./imageDialog.vue";
import VideoDialog from "./videoDialog.vue";
import LongVideoDialog from "./longVideoDialog.vue";
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
  name: "UserNotes",
  components: {
    ImageDialog,
    VideoDialog,
    LongVideoDialog,
    VideoPlayer,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const { t } = useI18n();
    const state = reactive({
      isLoading: true,
      showImageDialog: false,
      showVideoDialog: false,
      showLongVideoDialog: false,
      showLiveVideoDialog: false,
      filterForm: {},
      pageList: [10, 20, 60, 80, 100],
      param: {
        user_id: route.params.id,
        page: 1,
        page_size: 10,
        status: 5,
        is_fan: 2,
        free: 2,
      },
      dialog: {
        dialogTitle: "",
        dialogData: {},
      },
      tableList: [],
      total: 0,
      dialogCarousel: false,
      dialogVideo: false,
      prevVideo: "",
      carouselList: [],
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

      dialogAudit: false,
      form: {
        note_id: "",
        reason: "",
      },
      multipleImages: [],
      auditList: [],
      isplaying: false,

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

      provinces: [],
      city: [],
    });

    const formRef = ref();
    // const tableList = useTableData(http.businessManagement.getNotesList);
    const store = useStore();

    const getData = () => {
      state.isLoading = true;

      http.businessManagement.getNoteImageList(state.param).then((res) => {
        if (res.data.err_code == 0) {
          state.isLoading = false;
          state.total = res.data.data.total;
          state.tableList = res.data.data.notes_list;
        }
      });
    };

    const addImageNew = () => {
      state.dialog.dialogTitle = t(`common.addTo`);
      state.dialog.dialogData = {};
      state.showImageDialog = true;
    };

    const addVideoNew = () => {
      state.dialog.dialogTitle = t(`common.addTo`);
      state.dialog.dialogData = {};
      state.showVideoDialog = true;
    };

    const addLongVideoNew = () => {
      state.dialog.dialogTitle = t(`common.addTo`);
      state.dialog.dialogData = {};
      state.showLongVideoDialog = true;
    };

    const addLiveVideoNew = () => {
      state.dialog.dialogTitle = t(`common.addTo`);
      state.dialog.dialogData = {};
      state.showLiveVideoDialog = true;
    };

    const handleEdit = (row) => {
      state.dialog.dialogTitle = t(`common.edit`);
      state.dialog.dialogData = JSON.parse(JSON.stringify(row));

      if (row.note_type == 1) {
        state.showImageDialog = true;
      } else if (row.note_type == 2) {
        state.showVideoDialog = true;
      } else if (row.note_type == 4) {
        state.showLongVideoDialog = true;
      } else {
        state.showLiveVideoDialog = true;
      }
    };

    const closeImageDialog = () => {
      state.showImageDialog = false;
    };
    const closeVideoDialog = () => {
      state.showVideoDialog = false;
      state.playerOptions.sources = [];
      state.prevVideo = "";
    };
    const closeLongVideoDialog = () => {
      state.showLongVideoDialog = false;
    };
    const closeLiveVideoDialog = () => {
      state.showLiveVideoDialog = false;
    };

    const closeVideoPlay = () => {
      state.dialogVideo = false;
      state.playerOptions.sources = [];
      state.prevVideo = "";
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

    const closeAuditDialog = (formRef) => {
      state.form = {
        note_id: "",
        reason: "",
      };
      state.dialogAudit = false;
      state.isLoading = false;
      formRef.resetFields();
    };

    const filter = () => {
      state.param = {
        page: 1,
        user_id: route.params.id,
        free: 2,
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
      } else {
        state.param.is_fan = 2;
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

    const previewCarousel = (row) => {
      state.carouselList = row.images;
      state.dialogCarousel = true;
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
      ElMessageBox.confirm(t(`common.wantToDelete`), t(`common.warning`), {
        confirmButtonText: t(`common.sure`),
        cancelButtonText: t(`common.close`),
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

    const reset = () => {
      state.filterForm = {};
      search();
    };

    const checkStatus = (status) => {
      if (status == 1) {
        return t("user.published");
      } else if (status == 0) {
        return t("user.unpublished");
      } else if (status == -2) {
        return t("user.rejected");
      } else {
        return t("common.delete");
      }
    };

    const checkType = (status) => {
      if (status == 1) {
        return t("user.picture");
      } else if (status == 2) {
        return t("user.video");
      } else if (status == 4) {
        return t("user.longVideo");
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

      ElMessageBox.confirm(t(`common.wantToPublish`), t(`common.warning`), {
        confirmButtonText: t(`common.sure`),
        cancelButtonText: t(`common.close`),
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

    const handleAudit = (row) => {
      state.form.note_id = row.note_id;
      state.form.reason = row.note_reason;
      state.dialogAudit = true;
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

    const search = () => {
      filter();
      state.param.page_size = 10;
      getData();
    };

    const multipleCardPreview = (id) => {
      document.getElementById(id).click();
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
      param.note_type = row.note_type;
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

    onMounted(() => {
      getData();
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
    const goComment = (row) => {
      router.push({
        path: "/commentManagement/commentList",
        query: { note_id: row.note_id },
      });
    };
    return {
      ...toRefs(state),
      handleEdit,
      addImageNew,
      closeImageDialog,
      addVideoNew,
      addLongVideoNew,
      addLiveVideoNew,
      closeVideoDialog,
      closeLongVideoDialog,
      closeLiveVideoDialog,
      closeVideoPlay,
      dateFormat,
      checkStatus,
      search,
      onSizeChange,
      onCurrentChange,
      deleteHandler,
      checkClass,
      previewVideo,
      previewCarousel,
      handleRelease,
      rollbackHandler,
      handleAudit,
      submitAuditDialog,
      closeAuditDialog,
      playVideo,
      playing,
      multipleCardPreview,
      goComment,
      reset,
      checkType,
      formRef,
      changeCoin,
      windowRect: computed(() => store.state.app.windowRect),
      device: computed(() => store.state.app.device),
      language: computed(() => store.state.user.lang),
      t,
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

#showCount {
  color: white;
  position: absolute;
  width: 55px;
  height: 55px;
  background: rgba(0, 0, 0, 0.5);
  z-index: 3;
  text-align: center;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
  cursor: pointer;
  border-radius: 5px;
}

#carousel-multi-image {
  z-index: 1;
  position: relative;
}

.carousel {
  position: relative;
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

.coin-input {
  :deep(.el-input__inner) {
    text-align: center !important;
  }
}
</style>
