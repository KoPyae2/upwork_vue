<template>
  <div element-loading-background="rgba(122, 122, 122, 0.3)">
    <div
      class="form"
      v-permission:money:revenue:list
      style="margin: 30px 0 50px"
    >
      <div>
        <el-form label-position="top" label-width="300px">
          <el-form-item
            :label="t('money.usernameSerialNum')"
            style="margin-left: 0"
          >
            <el-input
              :placeholder="t('money.usernameSerialNum_placeholder')"
              v-model="filterForm.common_search"
            />
          </el-form-item>

          <el-form-item :label="t('money.user')">
            <el-select
              :multiple="false"
              :placeholder="t('money.user')"
              style="width: 100%"
              v-model="filterForm.user"
              default-first-option
            >
              <el-option value="0" :label="t('money.authUser')" />
              <el-option value="1" :label="t('money.userList')" />
              <el-option value="3" :label="t('money.testUser')" />
            </el-select>
          </el-form-item>

          <el-form-item
            :label="t('money.transactionHour')"
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
        <div class="buttonBox" style="margin-left: 0">
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

    <div>
      <el-row>
        <el-col :span="24">
          <el-button
            type="warning"
            @click="handlerExport"
            style="margin-bottom: 25px"
            :disabled="!tableList.length > 0"
            v-permission:money:revenue:list
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
            v-permission:money:revenue:list
          >
            <el-table-column
              prop="id"
              label="ID"
              align="center"
              width="100px"
            />
            <el-table-column
              prop="user_name"
              :label="t('common.userName')"
              align="center"
            />
            <el-table-column
              prop="note_title"
              :label="t('money.resource')"
              align="center"
            />
            <el-table-column
              prop="note_coin"
              :label="t('money.consumeTeaCoins')"
              align="center"
            />
            <el-table-column
              prop="author"
              :label="t('money.author')"
              align="center"
            />
            <el-table-column
              prop="note_user_profit"
              :label="t('money.authorIncome')"
              align="center"
            />

            <el-table-column
              prop="trans_no"
              :label="t('money.commissionPercentage')"
              align="center"
              width="200"
            >
              <!-- <template #default="scope">
                {{ scope.row.trans_fee }} /
                {{ ((scope.row.trans_fee/scope.row.note_coin)*100).toFixed(0)}}%
              </template> -->
              <template #default="scope"
                >{{ scope.row.trans_fee }}/
                {{ scope.row.trans_fee_rate * 100 }}%
              </template>
            </el-table-column>

            <el-table-column
              :label="t('money.transactionSerialNum')"
              align="center"
              prop="trans_no"
            >
            </el-table-column>
            <el-table-column :label="t('money.state')" align="center">
              <template #default="scope">
                <span
                  :class="scope.row.trans_status == 1 ? 'success' : 'danger'"
                >
                  {{
                    scope.row.trans_status == 1
                      ? t("money.success")
                      : t("money.failed")
                  }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              :label="t('money.transactionHour')"
              align="center"
              width="155px"
              ><template #default="scope">
                {{ dateFormat(scope.row.created_at) }}
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
              v-permission:money:revenue:list
            >
            </el-pagination>
          </div>
        </el-col>
      </el-row>
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
  name: "RevenueTab",
  components: {},
  emits: ["loaded", "unloaded"],
  setup(props, context) {
    const { t } = useI18n();
    const state = reactive({
      isLoading: true,

      filterForm: {},
      pageList: [10, 20, 60, 80, 100],
      param: {
        page: 1,
        page_size: 10,
        //  user_type:3
      },

      tableList: [],

      total: 0,
      activeTab: "",
      exportData: [],
    });

    const store = useStore();

    const getData = () => {
      context.emit("loaded");
      http.moneyManagement
        .getPurchaseReport(state.param)
        .then((res) => {
          if (res.data.err_code == 0) {
            context.emit("unloaded");

            state.tableList = res.data.data.user_trans;
            state.total = res.data.data.total;
          }
        })
        .catch((err) => {
          context.emit("unloaded");
        });
    };

    const reset = () => {
      state.filterForm = {};
      search();
    };

    const filter = () => {
      state.param = {
        page: 1,
      };
      if (state.filterForm.common_search) {
        state.param.common_search = state.filterForm.common_search;
      }
      if (state.filterForm.user) {
        state.param.user_type = state.filterForm.user;
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

    /* Excel Export */

    const formatJson = (filterVal, jsonData) => {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
    };

    const handlerExport = () => {
      state.isLoading = true;

      filter();
      state.param.page_size = state.total;

      http.moneyManagement.getPurchaseReport(state.param).then((res) => {
        if (res.data.err_code === 0) {
          const data = res.data.data.user_trans;
          exportData(data);
        }
      });
    };

    const exportData = (data) => {
      state.exportData = [];
      const exportData = state.exportData;

      data.forEach(
        ({
          id,
          user_name,
          note_title,
          note_coin,
          author,
          note_user_profit,
          trans_fee,
          trans_fee_rate,
          trans_no,
          trans_status,
          created_at,
        }) => {
          exportData.push({
            id,
            user_name,
            note_title,
            note_coin,
            author,
            note_user_profit,
            trans_fee: trans_fee + "/" + trans_fee_rate * 100 + "%",
            trans_no,
            status: trans_status == 1 ? t("money.success") : t("money.failed"),
            created_at: dateFormat(created_at),
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
          t("common.userName"),
          t("money.resource"),
          t("money.consumeTeaCoins"),
          t("money.author"),
          t("money.authorIncome"),
          t("money.commissionPercentage"),
          t("money.transactionSerialNum"),
          t("money.state"),
          t("money.transactionHour"),
        ];
        const filterVal = [
          "id",
          "user_name",
          "note_title",
          "note_coin",
          "author",
          "note_user_profit",
          "trans_fee",
          "trans_no",
          "status",
          "created_at",
        ];

        const data = formatJson(filterVal, state.exportData);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: t("money.purchaseRecord") + date,
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
      t,
      ...toRefs(state),
      dateFormat,
      search,
      onSizeChange,
      onCurrentChange,
      reset,
      windowRect: computed(() => store.state.app.windowRect),
      device: computed(() => store.state.app.device),
      handlerExport,
    };
  },
};
</script>

<style lang="scss" scoped>
.warning {
  color: #e6a23c;
}

.success {
  color: #67c23a;
}

.danger {
  color: #f56c6c;
}
</style>
