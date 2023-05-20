<template>
  <div
    v-loading="isLoading"
    element-loading-background="rgba(122, 122, 122, 0.3)"
  >
    <div class="form" v-permission:feedback:help:list>
      <div class="form-content">
        <el-form label-position="top" label-width="300px">
          <el-form-item :label="t(`feedback.time`)" style="min-width: 300px">
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

          <el-form-item
            :label="
              t(`feedback.feedback_content`) + ' , ' + t(`feedback.user_id`)
            "
          >
            <el-input
              :placeholder="
                t(`feedback.feedback_content`) + ' , ' + t(`feedback.user_id`)
              "
              v-model="filterForm.content"
              maxlength="25"
              show-word-limit
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
        type="warning"
        @click="handlerExport"
        style="margin-bottom: 25px"
        v-permission:feedback:help:list
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
        v-permission:feedback:help:list
      >
        <el-table-column prop="id" label="ID" align="center" width="100px" />
        <el-table-column
          prop="user_id"
          :label="t(`feedback.user_id`)"
          align="center"
        />
        <el-table-column
          prop="user_name"
          :label="t(`common.userName`)"
          align="center"
        />
        <!-- <el-table-column label="类型" align="center">
          举报用户
        </el-table-column> -->
        <!-- <el-table-column label="信息" align="center" width="200px">
          <template #default="scope">
            <span v-if="scope.row.reason_title">{{
              scope.row.reason_title
            }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column> -->
        <el-table-column
          prop="help_content"
          :label="t(`feedback.content`)"
          align="center"
          width="350px"
        />

        <el-table-column :label="t(`feedback.picture`)" align="center">
          <template #default="scope">
            <div v-if="scope.row.images != null">
              <div class="carousel" v-if="scope.row.images.length > 1">
                <photo-provider>
                  <div
                    id="showCount"
                    @click="multipleCardPreview(scope.row.id)"
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
                    :id="scope.row.id"
                  >
                    <img
                      :src="scope.row.images[0]"
                      :class="index"
                      class="custom-table-image"
                    />
                  </photo-consumer>
                </photo-provider>
              </div>
              <div v-else>
                <photo-provider>
                  <photo-consumer
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
              </div>
            </div>

            <div v-else>
              <photo-provider>
                <photo-consumer
                  intro="/default-no.png"
                  key="/default-no.png"
                  src="/default-no.png"
                >
                  <img src="/default-no.png" width="50" height="50" alt="" />
                </photo-consumer>
              </photo-provider>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          :label="t(`feedback.time`)"
          align="center"
          width="200px"
        >
          <template #default="scope">
            {{ scope.row.created_time ? scope.row.created_time : "--" }}
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
          v-permission:feedback:help:list
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
import { useI18n } from "vue-i18n";
export default {
  name: "UserFeedBack",
  components: {},
  setup() {
    const state = reactive({
      isLoading: true,

      filterForm: {},
      pageList: [10, 20, 60, 80, 100],
      param: {
        page: 1,
        page_size: 10,
      },
      tableList: [],
      total: 0,
      exportData: [],
    });

    const store = useStore();
    const { t } = useI18n();
    const getData = () => {
      state.isLoading = true;
      http.feedbackManagement.gethelpFeedback(state.param).then((res) => {
        if (res.data.err_code == 0) {
          state.isLoading = false;
          state.total = res.data.data.total;
          state.tableList = res.data.data.list;
        }
      });
    };

    const closeDialog = () => {
      state.showDialog = false;
    };

    const multipleCardPreview = (id) => {
      document.getElementById(id).click();
    };

    const filter = () => {
      state.param = {
        page: 1,
      };

      if (state.filterForm.content) {
        state.param.uid_or_content = state.filterForm.content;
      }

      if (state.filterForm.dateValue && state.filterForm.dateValue.length) {
        state.param.start_time = `${state.filterForm.dateValue[0]} 00:00:00`;
        state.param.end_time = `${state.filterForm.dateValue[1]} 23:59:59`;
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
    /* Excel Export */

    const formatJson = (filterVal, jsonData) => {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
    };

    const handlerExport = () => {
      state.isLoading = true;

      filter();
      state.param.page_size = state.total;

      http.feedbackManagement.gethelpFeedback(state.param).then((res) => {
        if (res.data.err_code === 0) {
          const data = res.data.data.list;
          exportData(data);
        }
      });
    };

    const exportData = (data) => {
      state.exportData = [];
      const exportData = state.exportData;

      data.forEach(
        ({ id, user_id, user_name, help_content, images, created_time }) => {
          exportData.push({
            id,
            user_id,
            user_name,
            help_content: help_content
              ? help_content.replace(/(\r\n|\n|\r)/gm, "")
              : "--",
            images,
            created_time,
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
          t(`feedback.user_id`),
          t(`common.userName`),
          t(`feedback.feedback_content`),
          t(`feedback.picture`),
          t(`feedback.time`),
        ];
        const filterVal = [
          "id",
          "user_id",
          "user_name",
          "help_content",
          "images",
          "created_time",
        ];

        const data = formatJson(filterVal, state.exportData);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: t("menu.help_feedback") + date,
          autoWidth: true,
          bookType: "xlsx",
        });
        state.isLoading = false;
      });
    };

    /* End */

    onMounted(() => {
      getData();
    });

    return {
      ...toRefs(state),
      closeDialog,
      search,
      onSizeChange,
      onCurrentChange,
      reset,
      multipleCardPreview,
      windowRect: computed(() => store.state.app.windowRect),
      device: computed(() => store.state.app.device),
      t,
      handlerExport,
    };
  },
};
</script>

<style lang="scss" scoped>
.carousel {
  position: relative;
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
</style>
