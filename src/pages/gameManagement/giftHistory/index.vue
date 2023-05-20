<template>
  <div v-loading="isLoading">
    <div class="form" v-permission:game:gifthistory:list>
      <div class="form-content">
        <el-form label-position="top" label-width="300px">
          <el-form-item :label="t('game.userIDName')">
            <el-input
              :placeholder="t('game.enterUserIDName')"
              v-model="filterForm.user_id"
            />
          </el-form-item>

          <el-form-item :label="t('game.activityTab')">
            <el-input
              :placeholder="t('game.enterActivityTab')"
              v-model="filterForm.gift_name"
            />
          </el-form-item>

          <el-form-item
            :label="t('game.creationTime')"
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
      <el-table
        :data="tableList"
        :row-style="{ height: '55px' }"
        :header-row-style="{ height: '55px' }"
        :border="true"
        v-permission:game:gifthistory:list
        :max-height="825"
      >
        <el-table-column
          prop="user_id"
          :label="t('game.userID')"
          align="center"
        />
        <el-table-column
          prop="user_name"
          :label="t('common.userName')"
          align="center"
        />
        <el-table-column
          prop="gift_label"
          :label="t('game.activityTab')"
          align="center"
        />
        <!-- <el-table-column label="图片" align="center">
          <template #default="scope">
            <el-image
              style="height: 50px; cursor: zoom-in"
              :src="scope.row.gift_img_url"
         
            />
          </template>
        </el-table-column> -->
        <el-table-column :label="t('game.picture')" align="center">
          <template #default="scope">
            <photo-provider v-if="scope.row.gift_img_url">
              <photo-consumer
                :intro="scope.row.gift_img_url"
                :key="scope.row.gift_img_url"
                :src="scope.row.gift_img_url"
              >
                <img
                  :src="scope.row.gift_img_url"
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
        <el-table-column :label="t('game.creationTime')" align="center">
          <template #default="scope">
            <span>{{ dateFormat(scope.row.created_at) }}</span>
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
          v-permission:game:gifthistory:list
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
import { dateFormat } from "@/utils/timeFormat.js";
import { useI18n } from "vue-i18n";

export default {
  name: "GiftHistory",
  components: {},
  setup() {
    const { t } = useI18n();
    const state = reactive({
      isLoading: true,
      showDialog: false,
      filterForm: {},
      pageList: [10, 20, 60, 80, 100],
      param: {
        page: 1,
        page_size: 10,
      },
      tableList: [],
      isLoading: false,
      total: 0,
    });

    const store = useStore();

    const getData = () => {
      state.isLoading = true;
      http.gameManagement.getGiftHistoryList(state.param).then((res) => {
        if (res.data.err_code == 0) {
          state.isLoading = false;
          state.tableList = res.data.data.list;
          state.total = res.data.data.total;
        } else {
          state.isLoading = false;
        }
      });
    };

    const filter = () => {
      state.param = {
        page: 1,
      };
      if (state.filterForm.user_id) {
        state.param.user_id = state.filterForm.user_id;
      }

      if (state.filterForm.gift_name) {
        state.param.gift_name = state.filterForm.gift_name;
      }

      if (state.filterForm.dateValue && state.filterForm.dateValue.length) {
        state.param.start_date = `${state.filterForm.dateValue[0]} 00:00:00`;
        state.param.end_date = `${state.filterForm.dateValue[1]} 23:59:59`;
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
      t,
      ...toRefs(state),
      dateFormat,
      search,
      onSizeChange,
      onCurrentChange,
      reset,
      windowRect: computed(() => store.state.app.windowRect),
      device: computed(() => store.state.app.device),
    };
  },
};
</script>

<style lang="scss" scoped></style>
