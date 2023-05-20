<template>
  <div
    element-loading-background="rgba(122, 122, 122, 0.3)"
    v-loading="isLoading"
  >
    <div class="form" v-permission:user:auth:list>
      <div class="form-content">
        <el-form label-position="top" label-width="300px">
          <el-form-item
            :label="t(`user.user_id`) + ' / ' + t(`common.userName`)"
          >
            <el-input
              :placeholder="
                t(`user.please_enter`) +
                t(`user.user_id`) +
                ' / ' +
                t(`common.userName`)
              "
              v-model="filterForm.user_id"
            />
          </el-form-item>

          <el-form-item :label="t(`user.account_status`)">
            <el-select
              v-model="filterForm.user_status"
              :placeholder="t(`user.select_account_status`)"
            >
              <el-option
                v-for="item in statusList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :default-first-option="true"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item :label="t(`user.authentication_type`)">
            <el-select
              v-model="filterForm.is_authed"
              :placeholder="t(`user.select_auth_type`)"
            >
              <el-option
                v-for="item in authList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :default-first-option="true"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            :label="t(`user.registration_time`)"
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

          <!-- <el-form-item label="登录时间:" style="min-width: 300px">
            <el-date-picker
              v-model="filterForm.logDate"
              type="daterange"
              value-format="YYYY-MM-DD"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item> -->
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
            />
            {{ t(`common.reset`) }}</el-button
          >
        </div>
      </div>
    </div>

    <div class="table">
      <el-button
        @click="addNew"
        class="app-button"
        style="margin-bottom: 25px"
        v-permission:user:auth:add
        ><font-awesome-icon icon="fa-solid fa-plus" style="margin-right: 5px" />
        {{ t(`common.addTo`) }}</el-button
      >

      <el-button
        type="warning"
        @click="handlerExport"
        style="margin-bottom: 25px"
        v-permission:user:auth:list
        :disabled="!tableList.length > 0"
      >
        <font-awesome-icon
          icon="fa-solid fa-file-export"
          style="margin-right: 5px"
        />
        {{ t("common.export") }}
      </el-button>
      <el-table
        :data="tableList"
        :row-style="{ height: '55px' }"
        :header-row-style="{ height: '55px' }"
        :border="true"
        :max-height="825"
        v-permission:user:auth:list
      >
        <el-table-column
          prop="user_id"
          label="ID"
          align="center"
          width="100px"
        />
        <el-table-column :label="t(`user.avatar`)" align="center" width="100px">
          <template #default="scope">
            <photo-provider v-if="scope.row.user_head_img">
              <photo-consumer
                :intro="scope.row.user_head_img"
                :key="scope.row.user_head_img"
                :src="scope.row.user_head_img"
              >
                <img
                  :src="scope.row.user_head_img"
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
          :label="t(`common.userName`)"
          align="center"
          width="125px"
        >
          <template #default="scope">
            <div
              style="
                display: flex;
                justify-content: center;
                align-items: center;
              "
            >
              <span @click="addDetail(scope.row)" class="detail">{{
                scope.row.user_name
              }}</span>
              <font-awesome-icon
                icon="fa-solid fa-tag"
                class="remark"
                @click="addRemark(scope.row)"
              />
            </div>
          </template>
        </el-table-column>

        <!-- <el-table-column label="昵称" align="center">
          <template #default="scope">
            {{ scope.row.nick_name ? scope.row.nick_name : "--" }}
          </template>
        </el-table-column> -->
        <el-table-column :label="t(`user.phone`)" align="center" width="160px">
          <template #default="scope">
            {{ scope.row.user_phone ? "+86-" + scope.row.user_phone : "--" }}
          </template>
        </el-table-column>

        <el-table-column
          :label="t(`user.authentication_type`)"
          align="center"
          :width="language == 'en' ? '160px' : '100px'"
        >
          <template #default="scope">
            {{ checkAuth(scope.row.is_authed) }}
          </template>
        </el-table-column>

        <el-table-column
          :label="t(`user.user_level`)"
          align="center"
          width="100px"
        >
          <template #default="scope">
            {{ userLevelText(scope.row.user_level) }}
          </template>
        </el-table-column>

        <el-table-column :label="t(`user.member`)" align="center" width="150px">
          <template #default="scope">
            <span v-if="scope.row.vip_end_date">
              <p>{{ findName(scope.row.vip_type_name) }}</p>
              <p>{{ scope.row.vip_end_date }}</p>
            </span>
            <span v-else>{{ t(`user.no_member`) }}</span>
          </template>
        </el-table-column>

        <!-- <el-table-column label="收益/总收益" align="center" width="110px">
          <template #default="scope">
            <span
              style="color: #409eff; cursor: pointer"
              @click="addGoldCoinDialog(scope.row)"
            >
              {{ scope.row.gold_coin.toFixed(2) }} /
              {{ scope.row.gold_coin_income_total.toFixed(2) }}
            </span>
          </template>
        </el-table-column> -->

        <el-table-column
          :label="t(`user.tea_coin`) + '/' + t(`user.freeze`)"
          align="center"
          width="140px"
        >
          <template #default="scope">
            <span
              style="color: #409eff; cursor: pointer"
              @click="addTeaCoinDialog(scope.row)"
            >
              {{ scope.row.book_coin.toFixed(2) }} /
              {{ scope.row.book_coin_freeze.toFixed(2) }}
            </span>
          </template>
        </el-table-column>

        <el-table-column
          :label="t(`common.gender`) + '/' + t(`user.city`)"
          align="center"
          :width="language == 'en' ? '130px' : '100px'"
        >
          <template #default="scope">
            {{ checkSex(scope.row.user_sex) }} /
            {{
              scope.row.user_city ? scope.row.user_city : t(`common.unknown`)
            }}
          </template>
        </el-table-column>

        <el-table-column
          prop="note_count"
          :label="t(`user.publish_resource`)"
          align="center"
          :width="language == 'en' ? '147px' : '100px'"
        />

        <el-table-column
          prop="user_follows"
          :label="t(`user.focus_on`)"
          align="center"
          width="100px"
        />

        <el-table-column
          :label="t(`user.market_number`)"
          align="center"
          :width="language == 'en' ? '125px' : '100px'"
        >
          <template #default="scope">
            {{ scope.row.market_id ? scope.row.market_id : "--" }}
          </template>
        </el-table-column>
        <el-table-column
          prop="recharge_time"
          :label="t(`user.purchase_count`)"
          align="center"
          :width="language == 'en' ? '130px' : '100px'"
        />

        <el-table-column
          prop="real_recharge"
          :label="t(`user.real_recharge`)"
          align="center"
          :width="language == 'en' ? '120px' : '100px'"
        />

        <el-table-column
          prop="background_recharge"
          :label="t(`user.background_recharge`)"
          align="center"
          :width="language == 'en' ? '170px' : '100px'"
        />
        <el-table-column
          prop="gift_token_count"
          :label="t(`user.number_draw`)"
          align="center"
          :width="language == 'en' ? '207px' : '100px'"
        />
        <!-- <el-table-column label="Super User" align="center">
          <template #default="scope">
            <el-switch
              v-model="scope.row.is_super"
              :active-value="1"
              :inactive-value="0"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="changeSuper(scope.row)"
              v-permission:system:banner:edit
            />
          </template>
        </el-table-column> -->
        <el-table-column
          :label="t(`user.fan_group`)"
          align="center"
          width="100"
        >
          <template #default="scope">
            <el-button
              type="warning"
              size="small"
              @click="addFanGroup(scope.row)"
              v-if="scope.row.is_authed > 0"
            >
              {{ t(`user.opened`) }}
            </el-button>
          </template></el-table-column
        >

        <el-table-column
          :label="t(`user.Last_Active_RegistrationTime`)"
          align="center"
          :width="language == 'en' ? '226px' : '160px'"
        >
          <template #default="scope">
            <p>{{ originalDate(scope.row.last_activity_time) }}</p>
            <p>{{ originalDate(scope.row.created_at) }}</p>
          </template>
        </el-table-column>

        <el-table-column
          :label="t(`common.operate`)"
          align="center"
          width="250px"
          fixed="right"
        >
          <template #default="scope">
            <el-button
              type="success"
              style="margin-left: 10px; margin-bottom: 5px"
              size="small"
              @click="addNotes(scope.row)"
              v-permission:user:auth:note
            >
              {{ t(`user.notes`) }}
            </el-button>
            <el-button
              type="warning"
              style="margin-left: 10px; margin-bottom: 5px"
              size="small"
              @click="addChances(scope.row)"
              v-permission:user:auth:edit
            >
              {{ t(`user.add_number_of_sweepstakes`) }}
            </el-button>
            <el-button
              type="primary"
              style="margin-left: 10px; margin-bottom: 5px"
              size="small"
              @click="handleEdit(scope.row)"
              v-permission:user:auth:edit
            >
              {{ t(`common.edit`) }}
            </el-button>
            <!-- 
            <el-button
              type="danger"
              style="margin-left: 10px; margin-bottom: 5px"
              size="small"
              @click="banUser(scope.row)"
              v-if="scope.row.user_status !== 4"
              v-permission:user:auth:edit
            >
              禁提
            </el-button>

            <el-button
              type="primary"
              style="margin-left: 10px; margin-bottom: 5px"
              size="small"
              @click="unBanUser(scope.row)"
              v-if="scope.row.user_status == 4"
              v-permission:user:auth:edit
            >
              解禁
            </el-button> -->

            <!-- <el-button
              type="danger"
              style="margin-left: 10px; margin-bottom: 5px"
              size="small"
              @click="freezeUser(scope.row)"
              v-permission:user:auth:edit
            >
              冻结
            </el-button>

            <el-button
              type="primary"
              style="margin-left: 10px; margin-bottom: 5px"
              size="small"
              @click="unFreezeUser(scope.row)"
              v-permission:user:auth:edit
            >
              解冻
            </el-button> -->

            <el-button
              type="primary"
              style="margin-left: 10px; margin-bottom: 5px"
              size="small"
              @click="addRechargeDialog(scope.row)"
              v-permission:user:auth:edit
              v-if="scope.row.user_type !== 9"
            >
              {{ t(`user.recharge`) }}
            </el-button>

            <!-- <el-button
              type="info"
              style="margin-left: 10px; margin-bottom: 5px"
              size="small"
              @click="goWithdraw(scope.row)"
              v-permission:user:auth:edit
            >
              兑换
            </el-button> -->

            <el-button
              type="danger"
              style="margin-left: 10px; margin-bottom: 5px"
              size="small"
              @click="disableUser(scope.row)"
              v-if="scope.row.user_status == 1 || scope.row.user_status == 4"
              v-permission:user:auth:edit
            >
              {{ t(`user.disabled`) }}
            </el-button>
            <el-button
              type="success"
              style="margin-left: 10px; margin-bottom: 5px"
              size="small"
              @click="enableUser(scope.row)"
              v-else
              v-permission:user:auth:edit
            >
              {{ t(`user.enable`) }}
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
          v-permission:user:auth:list
        >
        </el-pagination>
      </div>
    </div>
  </div>

  <AddDialog
    :show="showAddDialog"
    @closed="closeAddDialog"
    @created="search"
    :title="dialog.dialogTitle"
    :data="dialog.dialogData"
    :level="levelList"
  />

  <EditDialog
    :show="showEditDialog"
    @closed="closeEditDialog"
    @created="getData"
    :title="dialog.dialogTitle"
    :data="dialog.dialogData"
    :level="levelList"
  />

  <AddRecharge
    :show="showRechargeDialog"
    @closed="closeRechargeDialog"
    @created="getData"
    :title="dialog.dialogTitle"
    :data="dialog.dialogData"
  />

  <RemarkDialog
    :show="showRemarkDialog"
    @closed="closeRemarkDialog"
    @created="getData"
    :title="dialog.dialogTitle"
    :data="dialog.dialogData"
  />

  <DetailDialog
    :show="showDetailDialog"
    @closed="closeDetailDialog"
    @created="getData"
    :title="dialog.dialogTitle"
    :data="dialog.dialogData"
    :coin="coinConfig"
  />

  <ChanceDialog
    :show="showChanceDialog"
    @closed="closeChanceDialog"
    @created="getData"
    :title="dialog.dialogTitle"
    :data="dialog.dialogData"
  />

  <FanGroupDialog
    :show="fanGroupDialog"
    @closed="closeFanGroupDialog"
    @created="getData"
    :title="dialog.dialogTitle"
    :data="dialog.dialogData"
    :id="dialog.id"
  />

  <TeaCoinDialog
    :show="showTeaCoinDialog"
    @closed="closeTeaCoinDialog"
    @created="getData"
    :title="dialog.dialogTitle"
    :data="dialog.dialogData"
  />

  <GoldCoinDialog
    :show="showGoldCoinDialog"
    @closed="closeGoldCoinDialog"
    @created="getData"
    :title="dialog.dialogTitle"
    :data="dialog.dialogData"
  />
</template>

<script>
import { onMounted, reactive, toRefs, computed, ref, watch } from "vue";
import AddDialog from "./addDialog.vue";
import EditDialog from "./editDialog.vue";
import RemarkDialog from "./remarkDialog.vue";
import DetailDialog from "./detailDialog.vue";
import AddRecharge from "./addRecharge.vue";
import FanGroupDialog from "./fanGroupDialog.vue";
import ChanceDialog from "./chanceDialog.vue";
import TeaCoinDialog from "./teaCoinDialog.vue";
import GoldCoinDialog from "./goldCoinDialog.vue";
import { useI18n } from "vue-i18n";
import http from "@/http";
import { useStore } from "vuex";
import { dateFormat } from "@/utils/timeFormat.js";
import { ElMessageBox, ElMessage } from "element-plus";
import { useRouter, useRoute } from "vue-router";
import { originalDate } from "@/utils/timeFormat.js";
import moment from "moment";

export default {
  name: "AuthUser",
  components: {
    AddDialog,
    EditDialog,
    AddRecharge,
    RemarkDialog,
    DetailDialog,
    ChanceDialog,
    FanGroupDialog,
    TeaCoinDialog,
    GoldCoinDialog,
  },
  setup() {
    const { t } = useI18n();
    const route = useRoute();
    const state = reactive({
      isLoading: true,
      showAddDialog: false,
      showEditDialog: false,
      showRemarkDialog: false,
      showDetailDialog: false,
      showChanceDialog: false,
      fanGroupDialog: false,
      showRechargeDialog: false,
      showTeaCoinDialog: false,
      showGoldCoinDialog: false,

      filterForm: {
        user_status: "",
        is_authed: 99,
        user_id: route.query.user_id,
      },
      pageList: [10, 20, 60, 80, 100],
      param: {
        user_id: route.query.user_id,
        page: 1,
        page_size: 10,
        user_status: 99,
        is_authed: 99,
        user_type: 0,
      },
      dialog: {
        dialogTitle: "",
        dialogData: {},
      },
      form: {},

      levelList: [],

      authList: [
        {
          value: 99,
          label: t(`user.all_auth_user`),
        },
        {
          value: 1,
          label: t(`user.certified_user`),
        },
        {
          value: 2,
          label: t(`user.platform_publisher`),
        },
        {
          value: 3,
          label: t(`user.original_publisher`),
        },
        {
          value: 20,
          label: t(`user.short_video_account`),
        },
        {
          value: 21,
          label: t(`user.long_video_account`),
        },
      ],

      statusList: [
        {
          value: 99,
          label: t("common.all_status"),
        },
        {
          value: 0,
          label: t(`user.disabled_user`),
        },
        {
          value: 1,
          label: t(`user.normal_user`),
        },
      ],
      tableList: [],
      total: 0,
      coinConfig: 0,
      exportData: [],
    });

    const formRef = ref();

    const router = useRouter();
    const getData = () => {
      state.isLoading = true;
      http.userManagement.getNormalUser(state.param).then((res) => {
        if (res.data.err_code == 0) {
          state.isLoading = false;
          state.tableList = res.data.data.users;
          state.total = res.data.data.total;
          state.coinConfig = res.data.data.coin_config;
        }
      });
    };

    const store = useStore();

    const addNew = () => {
      state.dialog.dialogTitle = t(`user.add_user`);
      state.dialog.dialogData = {};
      state.showAddDialog = true;
    };

    const addRemark = (row) => {
      state.dialog.dialogTitle = t(`user.remark`);
      state.dialog.dialogData = JSON.parse(JSON.stringify(row));
      state.showRemarkDialog = true;
    };

    const addDetail = (row) => {
      state.dialog.dialogTitle = t(`user.account_type`);
      state.dialog.dialogData = JSON.parse(JSON.stringify(row));
      state.showDetailDialog = true;
    };

    const addChances = (row) => {
      state.dialog.dialogTitle = t(`user.number_of_sweepstakes`);
      state.dialog.dialogData = JSON.parse(JSON.stringify(row));
      state.showChanceDialog = true;
    };

    const handleEdit = (row) => {
      state.dialog.dialogTitle = t(`user.modify_user`);
      state.dialog.dialogData = JSON.parse(JSON.stringify(row));
      state.showEditDialog = true;
    };

    const addRechargeDialog = (row) => {
      state.dialog.dialogTitle = t(`user.recharge`);
      state.dialog.dialogData = JSON.parse(JSON.stringify(row));
      state.showRechargeDialog = true;
    };

    const addTeaCoinDialog = (row) => {
      state.dialog.dialogTitle = t(`user.record`);
      state.dialog.dialogData = JSON.parse(JSON.stringify(row));
      state.showTeaCoinDialog = true;
    };

    const closeTeaCoinDialog = () => {
      state.showTeaCoinDialog = false;
    };

    const addGoldCoinDialog = (row) => {
      state.dialog.dialogTitle = t(`user.record`);
      state.dialog.dialogData = JSON.parse(JSON.stringify(row));
      state.showGoldCoinDialog = true;
    };

    const closeGoldCoinDialog = () => {
      state.showGoldCoinDialog = false;
    };

    const addFanGroup = (row) => {
      let param = { funs_group_id: row.user_id };
      http.userManagement.getFanGroup(param).then((res) => {
        if (res.data.err_code == 0) {
          // state.FanList = res.data.data;
          // state.form.funs_group_name = state.FanList[0]["funs_group_name"];
          // state.form.status = state.FanList[0]["status"];
          // state.form.remark = state.FanList[0]["remark"];
          state.dialog.dialogTitle = t(`user.opened_fangroup`);
          state.dialog.dialogData = res.data.data;
          state.dialog.id = row.user_id;
          state.fanGroupDialog = true;
        }
      });
    };
    const closeAddDialog = () => {
      state.showAddDialog = false;
    };
    const closeEditDialog = () => {
      state.showEditDialog = false;
    };

    const closeRechargeDialog = () => {
      state.showRechargeDialog = false;
    };

    const closeRemarkDialog = () => {
      state.showRemarkDialog = false;
    };

    const closeDetailDialog = () => {
      state.showDetailDialog = false;
    };

    const closeChanceDialog = () => {
      state.showChanceDialog = false;
    };
    const closeFanGroupDialog = () => {
      state.fanGroupDialog = false;
    };
    const addNotes = (row) => {
      router.push(`/usermanagement/authUser/${row.user_id}/userNote`);
    };

    const filter = () => {
      state.param = {
        page: 1,
        user_type: 0,
      };
      if (state.filterForm.user_id) {
        state.param.user_id = state.filterForm.user_id;
      }
      if (state.filterForm.user_status !== "") {
        state.param.user_status = state.filterForm.user_status;
      } else {
        state.param.user_status = 99;
      }
      if (state.filterForm.is_authed) {
        state.param.is_authed = state.filterForm.is_authed;
      } else {
        state.param.is_authed = 99;
      }
      if (state.filterForm.dateValue && state.filterForm.dateValue.length) {
        state.param.start_date = `${state.filterForm.dateValue[0]} 00:00:00`;
        state.param.end_date = `${state.filterForm.dateValue[1]} 23:59:59`;
      }
      if (state.filterForm.logDate && state.filterForm.logDate.length) {
        state.param.s_date = `${state.filterForm.logDate[0]} 00:00:00`;
        state.param.e_date = `${state.filterForm.logDate[1]} 23:59:59`;
      }
    };

    const changeSuper = (row) => {
      ElMessageBox.confirm(t("common.wantToChange"), t("common.warning"), {
        confirmButtonText: t("common.sure"),
        cancelButtonText: t("common.close"),
        type: "warning",
        draggable: true,
        closeOnClickModal: false,
      })
        .then(() => {
          let param = {
            user_id: row.user_id,
          };

          http.userManagement.updateSuperUser(param).then((res) => {
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

    const onSizeChange = (val) => {
      state.param.page_size = val;
      getData();
    };
    const onCurrentChange = (val) => {
      state.param.page = val;
      getData();
    };

    const disableUser = (row) => {
      ElMessageBox.confirm(t(`user.disable_text`), t(`common.warning`), {
        confirmButtonText: t(`common.sure`),
        cancelButtonText: t(`common.close`),
        type: "warning",
        draggable: true,
        closeOnClickModal: false,
      })
        .then(() => {
          let param = {
            user_id: row.user_id,
            user_status: 0,
          };

          http.userManagement.updateUserState(param).then((res) => {
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

    const enableUser = (row) => {
      ElMessageBox.confirm(t(`user.enable_text`), t(`common.warning`), {
        confirmButtonText: t(`common.sure`),
        cancelButtonText: t(`common.close`),
        type: "warning",
        draggable: true,
        closeOnClickModal: false,
      })
        .then(() => {
          let param = {
            user_id: row.user_id,
            user_status: 1,
          };

          http.userManagement.updateUserState(param).then((res) => {
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

    const banUser = (row) => {
      ElMessageBox.confirm(t("user.sureBanText"), t("common.warning"), {
        confirmButtonText: t(`common.sure`),
        cancelButtonText: t(`common.close`),
        type: "warning",
        draggable: true,
        closeOnClickModal: false,
      })
        .then(() => {
          let param = {
            user_id: row.user_id,
            user_status: 4,
          };

          http.userManagement.updateUserState(param).then((res) => {
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

    const unBanUser = (row) => {
      ElMessageBox.confirm("解禁后用户将可以提款？", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        draggable: true,
        closeOnClickModal: false,
      })
        .then(() => {
          let param = {
            user_id: row.user_id,
            user_status: 1,
          };

          http.userManagement.updateUserState(param).then((res) => {
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

    const freezeUser = (row) => {
      ElMessageBox.confirm("是否冻结用户所有资金？", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        draggable: true,
        closeOnClickModal: false,
      })
        .then(() => {
          let param = {
            user_id: row.user_id,
          };

          http.userManagement.updateUserFreeze(param).then((res) => {
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

    const unFreezeUser = (row) => {
      ElMessageBox.confirm("是否解冻用户所有资金？", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        draggable: true,
        closeOnClickModal: false,
      })
        .then(() => {
          let param = {
            user_id: row.user_id,
          };

          http.userManagement.updateUserUnfreeze(param).then((res) => {
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

    const deleteHandler = (id) => {
      ElMessageBox.confirm(t("common.wantToDelete"), t("common.warning"), {
        confirmButtonText: t("common.sure"),
        cancelButtonText: t("common.close"),
        type: "warning",
        draggable: true,
        closeOnClickModal: false,
      })
        .then(() => {
          http.moneyManagement.deleteBankList({ id: id }).then((res) => {
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

    const reset = () => {
      state.filterForm = {
        user_status: "",
        is_authed: 99,
      };
      search();
    };

    const search = () => {
      filter();

      state.param.page_size = 10;
      getData();
    };

    const goWithdraw = (row) => {
      router.push(`/moneyManagement/withdraw?user_id=${row.user_id}`);
    };

    const goBet = (row) => {
      router.push(`/gameManagement/bettingRecord?user_id=${row.user_id}`);
    };

    const checkType = (status) => {
      switch (status) {
        case 1:
          return t(`user.member`);
        case 2:
          return t(`user.acting`);

        default:
          return "--";
      }
    };

    const checkSex = (status) => {
      switch (status) {
        case 0:
          return t(`user.keep_secret`);
        case 1:
          return t(`common.female`);
        case 2:
          return t(`common.male`);
        default:
          return "--";
      }
    };

    const userLevelText = (id) => {
      const list = state.levelList.filter(function (level) {
        return level.level_id == id;
      });

      if (list.length) {
        const index = list[0].level_name.findIndex(
          (x) => x.lang == store.state.user.lang
        );

        if (index !== -1) {
          return list[0].level_name[index].content;
        } else {
          return "--";
        }
      } else {
        return "--";
      }
    };

    const checkAuth = (val) => {
      switch (val) {
        case 0:
          return t(`user.general_user`);
        case 1:
          return t(`user.certified_user`);
        case 2:
          return t(`user.platform_publisher`);
        case 3:
          return t(`user.original_publisher`);
        case 20:
          return t(`user.short_video_account`);
        case 21:
          return t(`user.long_video_account`);
        default:
          return "--";
      }
    };

    const getValidDate = (start_date, count) => {
      return moment
        .parseZone(start_date)
        .add(count, "days")
        .format("YYYY-MM-DD");
    };

    watch(
      () => store.state.user.lang,
      () => {
        state.authList = [
          {
            value: 99,
            label: t(`user.all_auth_user`),
          },
          {
            value: 1,
            label: t(`user.certified_user`),
          },
          {
            value: 2,
            label: t(`user.platform_publisher`),
          },
          {
            value: 3,
            label: t(`user.original_publisher`),
          },
          {
            value: 20,
            label: t(`user.short_video_account`),
          },
          {
            value: 21,
            label: t(`user.long_video_account`),
          },
        ];
        state.statusList = [
          {
            value: 99,
            label: t("common.all_status"),
          },
          {
            value: 0,
            label: t(`user.disabled_user`),
          },
          {
            value: 1,
            label: t(`user.normal_user`),
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

    /* Excel Export */

    const formatJson = (filterVal, jsonData) => {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
    };

    const handlerExport = () => {
      state.isLoading = true;

      filter();
      state.param.page_size = state.total;

      http.userManagement.getNormalUser(state.param).then((res) => {
        if (res.data.err_code === 0) {
          const data = res.data.data.users;
          exportData(data);
        }
      });
    };

    const exportData = (data) => {
      state.exportData = [];
      const exportData = state.exportData;

      data.forEach(
        ({
          user_id,
          user_head_img,
          user_name,
          user_phone,
          is_authed,
          user_level,
          vip_end_date,
          vip_type_name,
          book_coin,
          book_coin_freeze,
          user_sex,
          user_city,
          note_count,
          user_follows,
          market_id,
          recharge_time,
          real_recharge,
          background_recharge,
          gift_token_count,
          last_activity_time,
          created_at,
        }) => {
          exportData.push({
            user_id,
            user_head_img,
            user_name,
            user_phone: user_phone ? "+86-" + user_phone : "--",
            is_authed: checkAuth(is_authed),
            user_level: userLevelText(user_level),
            member: vip_end_date
              ? findName(vip_type_name) + "/" + vip_end_date
              : t(`user.no_member`),
            book_coin: book_coin.toFixed(2) + "/" + book_coin_freeze.toFixed(2),
            user_sex:
              checkSex(user_sex) +
              "/" +
              (user_city ? user_city : t(`common.unknown`)),
            note_count,
            user_follows,
            market_number: market_id ? market_id : "--",
            recharge_time,
            real_recharge,
            background_recharge,
            gift_token_count,
            last_activity_time:
              originalDate(last_activity_time) + "/" + originalDate(created_at),
          });
        }
      );
      excelExport();
    };

    const excelExport = () => {
      state.isLoading = true;

      import("@/utils/Export2Excel").then((excel) => {
        const date =
          new Date().getFullYear() +
          "-" +
          (new Date().getMonth() + 1) +
          "-" +
          new Date().getDate();
        const tHeader = [
          "ID",
          t(`user.avatar`),
          t(`common.userName`),
          t(`user.phone`),
          t(`user.authentication_type`),
          t(`user.user_level`),
          t(`user.member`),
          t(`user.tea_coin`) + "/" + t(`user.freeze`),
          t(`common.gender`) + "/" + t(`user.city`),
          t(`user.publish_resource`),
          t(`user.focus_on`),
          t(`user.market_number`),
          t(`user.purchase_count`),
          t(`user.real_recharge`),
          t(`user.background_recharge`),
          t(`user.number_draw`),
          t(`user.Last_Active_RegistrationTime`),
        ];
        const filterVal = [
          "user_id",
          "user_head_img",
          "user_name",
          "user_phone",
          "is_authed",
          "user_level",
          "member",
          "book_coin",
          "user_sex",
          "note_count",
          "user_follows",
          "market_number",
          "recharge_time",
          "real_recharge",
          "background_recharge",
          "gift_token_count",
          "last_activity_time",
        ];

        const data = formatJson(filterVal, state.exportData);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: t("menu.auth_user") + date,
          autoWidth: true,
          bookType: "xlsx",
        });
        state.isLoading = false;
      });
    };

    /* End */

    onMounted(() => {
      getData();

      http.userManagement.getUserLevel().then((res) => {
        if (res.data.err_code == 0) {
          state.levelList = res.data.data.users;
        }
      });

      // http.moneyManagement.getWithdrawConfig().then((res) => {
      //   if (res.data.err_code == 0) {
      //     state.max_user_bank = res.data.data.max_user_bank;
      //   }
      // });
    });

    return {
      ...toRefs(state),
      addNew,
      handleEdit,
      addDetail,
      addRechargeDialog,
      closeAddDialog,
      closeEditDialog,
      closeRechargeDialog,
      closeRemarkDialog,
      closeDetailDialog,
      closeChanceDialog,
      addTeaCoinDialog,
      closeTeaCoinDialog,
      addGoldCoinDialog,
      closeGoldCoinDialog,
      dateFormat,
      search,
      onSizeChange,
      onCurrentChange,
      deleteHandler,
      disableUser,
      enableUser,
      banUser,
      unBanUser,
      freezeUser,
      goWithdraw,
      goBet,
      checkType,
      userLevelText,
      unFreezeUser,
      originalDate,
      getValidDate,
      formRef,
      checkSex,
      addNotes,
      changeSuper,
      addRemark,
      checkAuth,
      addChances,
      getData,
      reset,
      closeFanGroupDialog,
      addFanGroup,
      findName,
      windowRect: computed(() => store.state.app.windowRect),
      device: computed(() => store.state.app.device),
      language: computed(() => store.state.user.lang),
      t,
      handlerExport,
    };
  },
};
</script>

<style lang="scss" scoped>
.remark {
  color: $mainColor;
  font-size: 18px;
  margin-left: 10px;
  cursor: pointer;
}

.detail {
  color: $mainColor;
  cursor: pointer;
}
</style>
