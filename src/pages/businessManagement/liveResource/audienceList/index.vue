<template>
  <div
    v-loading="isLoading"
    element-loading-background="rgba(122, 122, 122, 0.3)"
  >
    <div class="form" v-permission:livevideo:audience:list>
      <div class="form-content">
        <el-form label-position="top" label-width="300px">
          <el-form-item :label="t('liveResource.userID')">
            <el-input
              :placeholder="t('liveResource.enterUserID')"
              v-model.number="filterForm.user_id"
              type="number"
              onkeypress="return event.charCode >= 48 && event.charCode <= 57"
              @copy.prevent
              @paste.prevent
            />
          </el-form-item>

          <el-form-item :label="t('liveResource.userNickname')">
            <el-input
              :placeholder="t('liveResource.enterUserNickname')"
              v-model="filterForm.user_name"
            />
          </el-form-item>

          <div style="margin-top: 34px" class="buttonBox">
            <el-button class="app-button" @click="search()">
              <font-awesome-icon
                icon="fa-solid fa-magnifying-glass"
                style="margin-right: 5px"
              />{{ t("common.search") }}</el-button
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
        {{ t("common.return") }}</el-button
      >
      <el-table
        :data="tableList"
        :row-style="{ height: '55px' }"
        :header-row-style="{ height: '55px' }"
        :border="true"
        v-permission:livevideo:audience:list
        :max-height="825"
        id="table"
      >
        <el-table-column
          prop="live_id"
          :label="t('liveResource.liveID')"
          align="center"
        ></el-table-column>

        <el-table-column
          prop="user_id"
          :label="t('liveResource.userID')"
          align="center"
        ></el-table-column>

        <el-table-column
          prop="user_name"
          :label="t('liveResource.userNickname')"
          align="center"
        ></el-table-column>

        <el-table-column
          prop="gender"
          :label="t('common.gender')"
          align="center"
        >
          <template #default="scope">
            <template v-if="scope.row.gender == 1">
              {{ t("common.male") }}
            </template>
            <template v-else-if="scope.row.gender == 2">
              {{ t("common.female") }}
            </template>
            <template v-else> -- </template>
          </template>
        </el-table-column>

        <el-table-column
          prop=""
          :label="t('liveResource.watchTime')"
          align="center"
        >
          <template #default="scope">
            {{ chineseDate(dateSecFormat(scope.row.start_time)) }} 至
            {{ chineseDate(dateSecFormat(scope.row.end_time)) }}
          </template>
        </el-table-column>

        <el-table-column
          prop=""
          :label="t('liveResource.duration')"
          align="center"
        >
          <template #default="scope">
            {{ farFrom(scope.row.start_time, scope.row.end_time) }}
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
          v-permission:livevideo:audience:list
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
import { dateSecFormat, farFrom } from "@/utils/timeFormat.js";
import { ElMessageBox, ElMessage } from "element-plus";
import moment from "moment";
import "moment/dist/locale/zh-cn";
import { useI18n } from "vue-i18n";
moment.locale("zh-cn");

export default {
  name: "liveAudienceList",
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
    };

    const onSizeChange = (val) => {
      state.param.page_size = val;
      getData();
    };

    const onCurrentChange = (val) => {
      state.param.page = val;
      getData();
    };

    const duration = (startTime, endTime) => {
      let s = moment(new Date(startTime));
      let e = moment(new Date(endTime));
      return s.from(e);
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

    const backToLivePage = () => {
      window.history.go(-1);
    };

    const search = () => {
      filter();
      state.param.page_size = 10;
      getData();
      state.param.user_id = "";
      state.param.username = "";
    };

    const getData = () => {
      state.isLoading = true;
      state.param.live_id = route.params.liveid;
      http.businessManagement
        .getLiveVideoAudienceList(state.param)
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

    const chineseDate = (date) => {
      let m = moment(date).format("LL[]LTS");
      return m;
    };

    onMounted(() => {
      getData();
    });

    return {
      t,
      ...toRefs(state),
      dateSecFormat,
      search,
      onSizeChange,
      onCurrentChange,
      deleteHandler,
      farFrom,
      duration,
      backToLivePage,
      chineseDate,
      windowRect: computed(() => store.state.app.windowRect),
      device: computed(() => store.state.app.device),
    };
  },
};
</script>

<style lang="scss" scoped></style>
