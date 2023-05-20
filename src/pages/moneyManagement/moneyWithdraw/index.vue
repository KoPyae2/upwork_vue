<template>
  <div
    element-loading-background="rgba(122, 122, 122, 0.3)"
    v-loading="isLoading"
  >
    <div class="form" v-permission:money:withdraw:list>
      <div class="form-content">
        <el-form label-position="top" label-width="300px">
          <el-form-item :label="t('money.orderNum')">
            <el-input
              :placeholder="t('money.orderNum_placeholder')"
              v-model="filterForm.trans_no"
            />
          </el-form-item>
          <el-form-item :label="t('money.userIDName')">
            <el-input
              :placeholder="t('money.userIDName_placeholder')"
              v-model="filterForm.user_id"
            />
          </el-form-item>

          <el-form-item :label="t('money.state')">
            <el-select
              :multiple="false"
              :placeholder="t('common.pleaseChoose')"
              style="width: 100%"
              v-model="filterForm.trans_status"
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
            :label="t('money.withdrawalTime')"
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
        type="warning"
        @click="handlerExport"
        style="margin-bottom: 25px"
        v-permission:money:withdraw:list
        :disabled="!tableList.length > 0"
      >
        <font-awesome-icon
          icon="fa-solid fa-file-export"
          style="margin-right: 5px"
        />
        {{ t("common.export") }}
      </el-button>
      <el-row>
        <el-col :span="24">
          <el-table
            :data="tableList"
            :row-style="{ height: '55px' }"
            :header-row-style="{ height: '55px' }"
            :border="true"
            :max-height="825"
            v-permission:money:withdraw:list
          >
            <el-table-column prop="id" label="ID" align="center" />
            <el-table-column
              prop="trans_no"
              :label="t('money.orderNum')"
              align="center"
              width="200"
            />
            <el-table-column
              prop="user_id"
              :label="t('money.userID')"
              align="center"
              width="150"
            />
            <!-- <el-table-column :label="t('money.picture')" align="center"> 
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
            </el-table-column> -->
            <el-table-column
              prop="user_name"
              :label="t('common.userName')"
              align="center"
              width="150"
            />
            <el-table-column
              prop="trans_amount"
              :label="t('money.numofTea')"
              align="center"
              width="190"
            />
            <el-table-column :label="t('money.fee')" align="center" width="100">
              <template #default="scope">
                {{ scope.row.trans_fee_rate }}%
              </template>
            </el-table-column>
            <el-table-column
              :label="t('money.actualAmount')"
              align="center"
              width="170"
            >
              <template #default="scope">
                <span v-if="scope.row.trans_status == 10"> 0 </span>
                <span v-else>
                  {{ scope.row.trans_amount - scope.row.trans_fee }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="created_at_str"
              :label="t('money.withdrawalTime')"
              align="center"
              width="180"
            />
            <el-table-column
              :label="t('money.reviewTime')"
              align="center"
              width="180"
            >
              <template #default="scope">
                {{
                  scope.row.success_at == 0 ? "--" : scope.row.success_at_str
                }}
              </template>
            </el-table-column>
            <el-table-column
              prop="id"
              :label="t('money.state')"
              align="center"
              width="150"
            >
              <template #default="scope">
                <span :class="checkClass(scope.row.trans_status)">
                  {{ checkType(scope.row.trans_status) }}
                </span>
              </template>
            </el-table-column>
            <!-- <el-table-column label="状态" align="center">
              <template #default="scope">
                <span :class="checkClass(scope.row.trans_status)">
                  {{ checkType(scope.row.trans_status) }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="user_id" label="用户" align="center" />
            <el-table-column
              prop="trans_no"
              label="编号"
              align="center"
              width="180px"
            />

            <el-table-column prop="trans_amount" label="金额" align="center" />
            <el-table-column prop="user_id" label="手续费/费率" align="center">
              <template #default="scope">
                {{ scope.row.trans_fee }} /
                {{
                  (
                    (scope.row.trans_fee / scope.row.trans_amount) *
                    100
                  ).toFixed(0)
                }}%
              </template>
            </el-table-column>
            <el-table-column
              prop="trans_type"
              label="提现类型"
              align="center"
            />
            <el-table-column
              label="提交时间"
              align="center"
              prop="created_at_str"
            />

            <el-table-column label="成功时间" align="center">
              <template #default="scope">
                {{
                  scope.row.success_at == 0 ? "--" : scope.row.success_at_str
                }}
              </template>
            </el-table-column> -->

            <el-table-column
              :label="t('common.operate')"
              align="center"
              width="200px"
              fixed="right"
            >
              <template #default="scope">
                <el-button
                  type="success"
                  style="margin-left: 10px; margin-bottom: 5px"
                  size="small"
                  @click="updateStatus(8, scope.row)"
                  v-if="scope.row.trans_status == 1"
                  v-permission:money:withdraw:edit
                >
                  {{ t("money.examinationPassed") }}
                </el-button>

                <el-button
                  type="danger"
                  style="margin-left: 10px; margin-bottom: 5px"
                  size="small"
                  @click="openRejectDialog(scope.row)"
                  v-if="scope.row.trans_status == 1"
                  v-permission:money:withdraw:edit
                >
                  {{ t("money.violationRejected") }}
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
              v-permission:money:withdraw:list
            >
            </el-pagination>
          </div>
        </el-col>
      </el-row>
    </div>

    <el-dialog
      v-model="showRejectDialog"
      @close="closeRejectDialog(formRef)"
      draggable
      :title="t('money.remark')"
      :close-on-click-modal="false"
    >
      <el-form label-width="100px" ref="formRef" :model="form">
        <el-form-item
          :label="t('money.remark')"
          prop="trans_remark"
          :rules="[
            { required: true, message: t('error.required'), trigger: 'blur' },
          ]"
        >
          <el-input
            v-model="form.trans_remark"
            placeholder=""
            maxlength="500"
            show-word-limit
            type="textarea"
            rows="3"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeRejectDialog(formRef)">{{
            t("common.close")
          }}</el-button>
          <el-button
            class="app-button"
            @click="submitRejectDialog(formRef)"
            :disabled="doubleClick"
            >{{ t("common.sure") }}</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { onMounted, reactive, toRefs, computed, ref, watch } from "vue";
import http from "@/http";
import { useStore } from "vuex";
import { ElMessage, ElMessageBox } from "element-plus";
import { useI18n } from "vue-i18n";

export default {
  name: "moneywithdraw",
  components: {},
  setup() {
    const { t } = useI18n();
    const state = reactive({
      isLoading: true,
      filterForm: {},
      pageList: [10, 20, 60, 80, 100],
      param: {
        page: 1,
        page_size: 10,
        // user_type: 3
      },

      statusList: [
        {
          value: 1,
          label: t("money.review"),
        },
        // {
        //   value: 2,
        //   label: "审核成功",
        // },
        // {
        //   value: 3,
        //   label: "银行处理中",
        // },
        {
          value: 8,
          label: t("money.withdrawal"),
        },
        // {
        //   value: 9,
        //   label: "提现失败",
        // },
        {
          value: 10,
          label: t("money.rejected"),
        },
        // {
        //   value: 11,
        //   label: "USDT拦截",
        // },
      ],
      tableList: [],
      isLoading: false,
      total: 0,
      activeTab: "",
      form: {},
      showRejectDialog: false,
      doubleClick: false,
      exportData: [],
    });

    const store = useStore();

    const formRef = ref();

    const getData = () => {
      state.isLoading = true;
      http.moneyManagement
        .getWithdrawList(state.param)
        .then((res) => {
          if (res.data.err_code == 0) {
            state.isLoading = false;
            state.tableList = res.data.data.users;
            state.total = res.data.data.total;
          }
        })
        .catch((err) => {
          state.isLoading = false;
        });
    };

    const openRejectDialog = (row) => {
      state.form.user_id = row.user_id;
      state.form.trans_no = row.trans_no;
      state.form.trans_status = 10;
      state.showRejectDialog = true;
    };

    const closeRejectDialog = (formRef) => {
      formRef.resetFields();
      state.form = {};
      state.showRejectDialog = false;
    };

    const submitRejectDialog = (formRef) => {
      formRef.validate((valid) => {
        if (valid) {
          state.doubleClick = true;
          http.moneyManagement.updateWithdrawList(state.form).then((res) => {
            if (res.data.err_code == 0) {
              state.doubleClick = false;
              closeRejectDialog(formRef);
              state.form = {
                status: 1,
              };
              ElMessage.success(t(`error.${res.data.err_code}`));

              formRef.resetFields();
              getData();
            } else {
              ElMessage.error(t(`error.${res.data.err_code}`));
            }
          });
        }
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
      if (state.filterForm.trans_no) {
        state.param.trans_no = state.filterForm.trans_no;
      }
      if (state.filterForm.user_id) {
        state.param.user_id = state.filterForm.user_id;
      }
      if (state.filterForm.trans_status) {
        state.param.trans_status = state.filterForm.trans_status;
      }

      if (state.filterForm.dateValue && state.filterForm.dateValue.length) {
        state.param.start_date = `${state.filterForm.dateValue[0]} 00:00:00`;
        state.param.end_date = `${state.filterForm.dateValue[1]} 23:59:59`;
      }
      if (state.filterForm.user) {
        state.param.user_type = state.filterForm.user;
      }
    };

    const updateStatus = (status, row) => {
      ElMessageBox.confirm(t("common.wantToChange"), t("common.warning"), {
        confirmButtonText: t("common.sure"),
        cancelButtonText: t("common.close"),
        type: "warning",
        draggable: true,
        closeOnClickModal: false,
      })
        .then(() => {
          state.isLoading = true;

          let param = {
            user_id: row.user_id,
            trans_no: row.trans_no,
            trans_status: status,
          };

          http.moneyManagement
            .updateWithdrawList(param)
            .then((res) => {
              if (res.data.err_code == 0) {
                state.isLoading = false;
                getData();
                ElMessage.success(t(`error.${res.data.err_code}`));
              }
            })
            .catch((err) => {
              state.isLoading = false;
              ElMessage.error(t(`error.${res.data.err_code}`));
            });
        })
        .catch(() => {
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

    const search = () => {
      filter();
      state.param.page_size = 10;
      getData();
    };

    const checkType = (val) => {
      switch (val) {
        case 1:
          return t("money.pendingReview");
        case 2:
          return t("money.audited");
        case 3:
          return t("money.bankProcessing");
        case 8:
          return t("money.withdrawalSuccessful");
        case 9:
          return t("money.withdrawalFailed");
        case 10:
          return t("money.violationRejected");
        case 11:
          return t("money.USDTIntercept");
        case 100:
          return t("money.cancel");
        default:
          return t("money.unknownStatus");
      }
    };

    const checkClass = (val) => {
      switch (val) {
        case 1:
          return "warning";
        case 2:
          return "warning";
        case 3:
          return "warning";
        case 8:
          return "success";
        case 9:
          return "danger";
        case 10:
          return "danger";
        case 11:
          return "danger";
        case 100:
          return "dark";
        default:
          return "danger";
      }
    };

    watch(
      () => store.state.user.lang,
      () => {
        state.statusList = [
          {
            value: 1,
            label: t("money.review"),
          },
          {
            value: 8,
            label: t("money.withdrawal"),
          },
          {
            value: 10,
            label: t("money.rejected"),
          },
        ];
      }
    );

    /* Excel Export */

    const formatJson = (filterVal, jsonData) => {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
    };

    const handlerExport = () => {
      state.isLoading = true;

      filter();
      state.param.page_size = state.total;

      http.moneyManagement.getWithdrawList(state.param).then((res) => {
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
          id,
          trans_no,
          user_id,
          user_name,
          trans_amount,
          trans_fee_rate,
          trans_status,
          trans_fee,
          created_at_str,
          success_at,
          success_at_str,
        }) => {
          exportData.push({
            id,
            trans_no,
            user_id,
            user_name,
            trans_amount,
            trans_fee_rate: trans_fee_rate + "%",
            trans_status: trans_status == 10 ? 0 : trans_amount - trans_fee,
            created_at_str,
            success_at: success_at == 0 ? "--" : success_at_str,
            state: checkType(trans_status),
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
          t("money.orderNum"),
          t("money.userID"),
          t("common.userName"),
          t("money.numofTea"),
          t("money.fee"),
          t("money.actualAmount"),
          t("money.withdrawalTime"),
          t("money.reviewTime"),
          t("money.state"),
        ];
        const filterVal = [
          "id",
          "trans_no",
          "user_id",
          "user_name",
          "trans_amount",
          "trans_fee_rate",
          "trans_status",
          "created_at_str",
          "success_at",
          "state",
        ];

        const data = formatJson(filterVal, state.exportData);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: t("menu.withdraw_record") + date,
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
      search,
      onSizeChange,
      onCurrentChange,
      reset,
      checkType,
      checkClass,
      updateStatus,
      openRejectDialog,
      closeRejectDialog,
      submitRejectDialog,
      formRef,
      windowRect: computed(() => store.state.app.windowRect),
      device: computed(() => store.state.app.device),
      handlerExport,
    };
  },
};
</script>

<style lang="scss" scoped>
.primary {
  color: #409eff;
}

.warning {
  color: #e6a23c;
}

.success {
  color: #67c23a;
}

.danger {
  color: #f56c6c;
}

.dark {
  color: #303133;
}
</style>
