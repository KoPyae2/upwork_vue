<template>
  <div
    v-loading="isLoading"
    element-loading-background="rgba(122, 122, 122, 0.3)"
  >
    <div class="form" v-permission:report:audit:list>
      <div class="form-content">
        <el-form label-position="top" label-width="300px">
          <el-form-item :label="t(`report.auditors`)">
            <el-input
              :placeholder="t(`report.auditors`)"
              v-model="filterForm.Username"
            />
          </el-form-item>
          <el-form-item
            :label="t(`report.review_time`)"
            style="min-width: 300px"
          >
            <el-date-picker
              v-model="filterForm.CreateAt"
              type="daterange"
              value-format="YYYY-MM-DD"
              unlink-panels
              :range-separator="t(`common.to`)"
              :start-placeholder="t(`common.startDate`)"
              :end-placeholder="t(`common.endDate`)"
            />
          </el-form-item>

          <el-form-item :label="t(`report.resource_id`)">
            <el-input
              :placeholder="t(`report.resource_id`)"
              v-model.number="filterForm.RecordID"
              maxlength="25"
              show-word-limit
              onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode == 46"
              @copy.prevent
              @paste.prevent
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
      <el-table
        :data="tableList"
        :row-style="{ height: '55px' }"
        :header-row-style="{ height: '55px' }"
        :border="true"
        :max-height="825"
        v-permission:report:audit:list
      >
        <el-table-column
          prop="RecordID"
          label="ID"
          align="center"
          width="150px"
        />

        <el-table-column
          prop="NoteID"
          :label="t(`report.resource_id`)"
          align="center"
        />

        <el-table-column :label="t(`report.audit_result`)" align="center">
          <template #default="scope">
            <span v-if="scope.row.AuditStatus == '1'" style="color: #090">{{
              t("report.pass")
            }}</span>
            <span
              v-else-if="scope.row.AuditStatus == '-2'"
              style="color: #ec494e"
            >
              {{ t("report.reject") }}</span
            >
          </template>
        </el-table-column>
        <el-table-column :label="t(`report.fail_reason_title`)" align="center">
          <template #default="scope">
            <span v-if="scope.row.Reason">{{ scope.row.Reason }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>

        <el-table-column :label="t(`report.auditors`)" align="center">
          <template #default="scope">
            <span v-if="scope.row.Username">{{ scope.row.Username }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>

        <el-table-column :label="t(`report.review_time`)" align="center">
          <template #default="scope">
            {{ scope.row.CreateAt ? scope.row.CreateAt : "--" }}
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
          v-permission:report:audit:list
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
import { originalDate, dateFormat } from "@/utils/timeFormat.js";
import { useI18n } from "vue-i18n";
export default {
  name: "PlayBackFeedBack",
  components: {},
  setup() {
    const state = reactive({
      isLoading: true,

      filterForm: {},
      pageList: [10, 20, 60, 80, 100],
      param: {
        reason_type: 1,
        page: 1,
        page_size: 10,
      },
      tableList: [],
      total: 0,
    });

    const store = useStore();

    const getData = () => {
      state.isLoading = true;
      http.reportManagement.getAuditTrail(state.param).then((res) => {
        if (res.data.err_code == 0) {
          state.isLoading = false;
          state.total = res.data.data.total;
          state.tableList = res.data.data.note_audit;
        }
      });
    };

    const closeDialog = () => {
      state.showDialog = false;
    };

    const { t } = useI18n();
    const filter = () => {
      state.param = {
        page: 1,
      };

      if (state.filterForm.Username) {
        state.param.user_name = state.filterForm.Username;
      }

      if (state.filterForm.RecordID) {
        state.param.note_id = state.filterForm.RecordID;
      }

      if (state.filterForm.CreateAt && state.filterForm.CreateAt.length) {
        state.param.start_date = `${state.filterForm.CreateAt[0]} 00:00:00`;
        state.param.end_date = `${state.filterForm.CreateAt[1]} 23:59:59`;
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

    const search = () => {
      filter();
      state.param.page_size = 10;
      getData();
    };

    const reset = () => {
      state.filterForm = {};
      search();
    };

    onMounted(() => {
      getData();
    });

    return {
      ...toRefs(state),
      closeDialog,
      search,
      onSizeChange,
      onCurrentChange,
      originalDate,
      dateFormat,
      reset,
      windowRect: computed(() => store.state.app.windowRect),
      device: computed(() => store.state.app.device),
      t,
    };
  },
};
</script>

<style lang="scss" scoped></style>
