<template>
  <div
    v-loading="isLoading"
    element-loading-background="rgba(122, 122, 122, 0.3)"
  >
    <div class="form" v-permission:order:coin:list>
      <div class="form-content">
        <el-form label-position="top" label-width="300px">
          <el-form-item :label="t('order.paymentChannel')">
            <el-select
              v-model="filterForm.payment_code"
              :placeholder="t('common.pleaseChoose')"
            >
              <el-option
                v-for="item in paymentList"
                :key="item.id"
                :label="findName(item.payname)"
                :value="item.paytype"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="t('order.state')">
            <el-select
              v-model="filterForm.status"
              :placeholder="t('common.pleaseChoose')"
            >
              <el-option :label="t('order.approved')" value="1"> </el-option>
              <el-option :label="t('order.tobeReview')" value="0"> </el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            :label="t('order.paymentTime')"
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
          <el-form-item :label="t('order.userNameOrderNumber')">
            <el-input
              :placeholder="t('order.userNameOrderNumber_placeholder')"
              v-model="filterForm.uid_or_order_no"
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
        type="warning"
        @click="handlerExport"
        style="margin-bottom: 25px"
        v-permission:order:coin:list
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
        v-permission:order:coin:list
        :max-height="825"
      >
        <el-table-column prop="id" label="ID" align="center" />
        <el-table-column
          :label="t('common.userName')"
          align="center"
          width="120"
        >
          <template #default="scope">
            <span
              class="user"
              @click="goUser(scope.row.user_type, scope.row.user_name)"
              >{{ scope.row.user_name }}</span
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="order_number"
          :label="t('order.orderNumber')"
          align="center"
          width="200px"
        />
        <el-table-column
          prop="order_time_str"
          :label="t('order.orderTime')"
          align="center"
          width="200"
        />
        <el-table-column
          :label="t('order.paymentChannel')"
          align="center"
          width="200"
        >
          <template #default="scope">
            <span v-if="scope.row.payment_channel_name">
              {{ scope.row.payment_channel_name }}</span
            >
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="t('order.orderType')"
          align="center"
          width="150"
        >
          <template #default="scope">
            <span v-if="scope.row.order_type == 1">{{
              t("order.coinPackage")
            }}</span>
            <span v-else>{{ t("order.vipPackage") }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="t('order.orderName')"
          align="center"
          width="200"
        >
          <template #default="scope">
            <span v-if="scope.row.order_type == 1">{{
              findName(scope.row.vip_point_type_order_name)
            }}</span>
            <span v-else>{{ findName(scope.row.vip_type_order_name) }}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="order_amount"
          :label="t('order.orderAmount')"
          align="center"
          width="150"
        />

        <el-table-column
          prop="payment_amount"
          :label="t('order.paymentAmount')"
          align="center"
          width="150"
        />
        <el-table-column
          prop="actual_amount"
          :label="t('order.actualPayment')"
          align="center"
          width="150"
        />
        <el-table-column
          prop="vip_points_add"
          :label="t('order.actualAmount')"
          align="center"
          width="150"
        />
        <el-table-column prop="rate" :label="t('order.rate')" align="center" />
        <el-table-column :label="t('order.state')" align="center" width="150">
          <template #default="scope">
            <span :class="classFilter(scope.row.state)">
              {{ checkType(scope.row.state) }}</span
            >
          </template>
        </el-table-column>
        <el-table-column prop="ip" label="IP" align="center" width="200" />
        <el-table-column
          prop="payment_time_str"
          :label="t('order.paymentTime')"
          align="center"
          width="200"
        >
          <template #default="scope">
            {{ scope.row.payment_time_str ? scope.row.payment_time_str : "--" }}
          </template>
        </el-table-column>
        <el-table-column
          :label="t('common.operate')"
          align="center"
          width="100px"
          fixed="right"
        >
          <template #default="scope">
            <el-button
              type="primary"
              @click="approveOrder(scope.row)"
              v-if="checkOrder(scope.row) && scope.row.pay_status == 0"
            >
              {{ t("order.review") }}</el-button
            >
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
          v-permission:order:coin:list
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
import { ElMessageBox, ElMessage } from "element-plus";
import moment from "moment";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

export default {
  name: "CoinOrder",
  components: {},
  setup() {
    const { t } = useI18n();
    const router = useRouter();
    const state = reactive({
      isLoading: true,

      filterForm: {},
      pageList: [10, 20, 60, 80, 100],
      param: {
        order_type: 1,
        page: 1,
        page_size: 10,
      },
      total: 0,
      tableList: [],
      paymentList: [],
      exportData: [],
    });

    const getData = () => {
      state.isLoading = true;
      http.orderManagement.getOrderTracking(state.param).then((res) => {
        if (res.data.err_code == 0) {
          state.isLoading = false;
          state.total = res.data.data.total;
          state.tableList = res.data.data.list;
        }
      });
    };

    const store = useStore();

    const filter = () => {
      state.param = {
        page: 1,
        order_type: 1,
      };
      if (state.filterForm.status) {
        state.param.status = state.filterForm.status;
      }
      if (state.filterForm.uid_or_order_no) {
        state.param.uid_or_order_no = state.filterForm.uid_or_order_no;
      }
      if (state.filterForm.payment_code) {
        state.param.payment_code = state.filterForm.payment_code;
      }
      if (state.filterForm.dateValue && state.filterForm.dateValue.length) {
        state.param.payment_start_time = `${state.filterForm.dateValue[0]} 00:00:00`;
        state.param.payment_end_time = `${state.filterForm.dateValue[1]} 23:59:59`;
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

    const checkType = (type) => {
      switch (type) {
        case 0:
          return t("order.tobeReview");
        case 1:
          return t("order.approved");
        case 2:
          return t("order.reject");
        default:
          return "--";
      }
    };

    const classFilter = (state) => {
      switch (state) {
        case 0:
          return "warning";
        case 1:
          return "success";
        case 2:
          return "danger";

        default:
          return "--";
      }
    };

    const checkOrder = (row) => {
      if (moment(row.order_time_str).unix() + 30 * 24 * 3600 < Date.now()) {
        return true;
      } else {
        return false;
      }
    };

    const approveOrder = (row) => {
      ElMessageBox.confirm(t("common.wantToReview"), t("common.warning"), {
        confirmButtonText: t("common.sure"),
        cancelButtonText: t("common.close"),
        type: "warning",
        draggable: true,
        closeOnClickModal: false,
      })
        .then(() => {
          http.orderManagement.approveOrder({ id: row.id }).then((res) => {
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

    const search = () => {
      filter();
      state.param.page_size = 10;
      getData();
    };

    const reset = () => {
      state.filterForm = {};
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

    const goUser = (type, name) => {
      if (type == 0) {
        router.push({
          path: "/userManagement/authUser",
          query: { user_id: name },
        });
      } else if (type == 1) {
        router.push({
          path: "/userManagement/normalUser",
          query: { user_id: name },
        });
      } else {
        router.push({
          path: "/userManagement/testUser",
          query: { user_id: name },
        });
      }
    };

    // excel export

    const formatJson = (filterVal, jsonData) => {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
    };

    const handlerExport = () => {
      state.isLoading = true;

      filter();
      state.param.page_size = state.total;

      http.orderManagement.getOrderTracking(state.param).then((res) => {
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
        ({
          id,
          user_name,
          order_number,
          order_time_str,
          payment_channel_name,
          order_type,
          vip_point_type_order_name,
          vip_type_order_name,
          order_amount,
          payment_amount,
          actual_amount,
          vip_points_add,
          rate,
          state,
          ip,
          payment_time_str,
        }) => {
          exportData.push({
            id,
            user_name,
            order_number,
            order_time_str,
            payment_channel_name: payment_channel_name
              ? payment_channel_name
              : "--",
            order_type:
              order_type == 1 ? t("order.coinPackage") : t("order.vipPackage"),
            order_name:
              order_type == 1
                ? findName(vip_point_type_order_name)
                : findName(vip_type_order_name),
            order_amount,
            payment_amount,
            actual_amount,
            vip_points_add,
            rate,
            state: checkType(state),
            ip,
            payment_time_str: payment_time_str ? payment_time_str : "--",
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
          t(`common.userName`),
          t("order.orderNumber"),
          t("order.orderTime"),
          t("order.paymentChannel"),
          t("order.orderType"),
          t("order.orderName"),
          t("order.orderAmount"),
          t("order.paymentAmount"),
          t("order.actualPayment"),
          t("order.actualAmount"),
          t("order.rate"),
          t("order.state"),
          "IP",
          t("order.paymentTime"),
        ];
        const filterVal = [
          "id",
          "user_name",
          "order_number",
          "order_time_str",
          "payment_channel_name",
          "order_type",
          "order_name",
          "order_amount",
          "payment_amount",
          "actual_amount",
          "vip_points_add",
          "rate",
          "state",
          "ip",
          "payment_time_str",
        ];

        const data = formatJson(filterVal, state.exportData);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: t("menu.tea_coin_order") + date,
          autoWidth: true,
          bookType: "xlsx",
        });
        state.isLoading = false;
      });
    };
    onMounted(() => {
      getData();

      http.paymentManagement.getPaymentMethod().then((res) => {
        if (res.data.err_code == 0) {
          state.paymentList = res.data.data.data;
        }
      });
    });

    return {
      t,
      ...toRefs(state),
      dateFormat,
      search,
      onSizeChange,
      onCurrentChange,
      checkOrder,
      approveOrder,
      checkType,
      classFilter,
      reset,
      findName,
      goUser,
      windowRect: computed(() => store.state.app.windowRect),
      device: computed(() => store.state.app.device),
      handlerExport,
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

.warning {
  color: #e6a23c;
}

.user {
  color: $mainColor;
  cursor: pointer;
}
</style>
