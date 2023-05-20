<template>
  <div class="container" v-loading="state.loading">
    <div class="form" v-permission:game:record:list>
      <div class="form-content">
        <el-form label-position="top" label-width="300px">
          <el-form-item label="请输入用户ID/用户名">
            <el-input v-model="state.user_name" placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item label="奖期号">
            <el-input v-model="state.issue" placeholder="请输入奖期号" />
          </el-form-item>
          <el-form-item label="金额">
            <el-input v-model="state.amount" placeholder="请输入金额" />
          </el-form-item>
          <el-form-item label="彩种">
            <el-input v-model="state.gname" placeholder="所有彩种" />
          </el-form-item>
          <el-form-item label="投注时间">
            <el-date-picker
              v-model="state.dateValue"
              type="daterange"
              value-format="YYYY-MM-DD"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
          <div style="margin-top: 34px" class="buttonBox">
            <el-button class="app-button" @click="search()">
              <font-awesome-icon
                icon="fa-solid fa-magnifying-glass"
                style="margin-right: 5px"
              />搜索</el-button
            >
          </div>
          <div style="margin-top: 34px" class="buttonBox">
            <el-button type="warning" @click="refresh()">
              <font-awesome-icon
                icon="fa-solid fa-arrows-rotate"
                style="margin-right: 5px"
              />重置</el-button
            >
          </div>
        </el-form>
      </div>
    </div>
    <div class="table">
      <el-table
        :data="state.tableData"
        :row-style="{ height: '55px' }"
        :header-row-style="{ height: '55px' }"
        :border="true"
        v-permission:game:record:list
        :max-height="825"
      >
        <el-table-column prop="user_name" label="用户名" align="center" />
        <el-table-column prop="cur_bal" label="用户余额" align="center" />
        <el-table-column prop="game_name" label="彩种" align="center" />
        <el-table-column label="期号" align="center">
          <template #default="scope">
            <span>{{ changeString(scope.row.issue) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="bet_number" label="投注号码" align="center" />
        <el-table-column prop="bet_amount" label="单注金额" align="center" />
        <el-table-column label="注数" align="center">
          <span>{{ 1 }}</span>
        </el-table-column>
        <el-table-column prop="bet_amount" label="投注总额" align="center" />
        <el-table-column prop="" label="中奖金额" align="center">
          <template #default="scope">
            <span>{{
              scope.row.profit_amount > 0
                ? (scope.row.profit_amount - scope.row.bet_amount).toFixed(2)
                : "0"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="profit_amount" label="盈亏" align="center">
          <template #default="scope">
            <span>{{ winOrLose(scope.row.profit_amount) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="投注时间" align="center">
          <template #default="scope">
            <span>{{ dateFormat(scope.row.created_at) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button
              size="small"
              type="primary"
              style="margin-left: 10px; margin-bottom: 5px"
              @click="check(scope.row)"
            >
              Check
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="table-pager">
        <el-pagination
          @size-change="onSizeChange"
          @current-change="onCurrentChange"
          :page-size="state.param.page_size"
          :page-sizes="state.pageList"
          :current-page="state.param.page"
          :layout="`total,prev,pager,next,jumper,${
            device === 'mobile' ? '' : 'sizes'
          }`"
          :total="state.total"
          :small="device === 'mobile' ? true : false"
          v-permission:game:record:list
        >
        </el-pagination>
      </div>
    </div>

    <ViewDialog
      :show="state.viewDialog"
      @closed="closeViewDialog"
      :data="state.DialogData"
    />
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import http from "@/http";
import { useI18n } from "vue-i18n";
const loginForm = ref({
  email: "",
  password: "",
  confirm_password: "",
});
const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const store = useStore();
const loading = ref(false);
const loginFromRef = ref(null);
const query = computed(() => route.query);
const windowRect = computed(() => store.state.app.windowRect);
const device = computed(() => store.state.app.device);
const state = reactive({
  user_name: "",
  issue: "",
  amount: "",
  gname: "",
  dateValue: [],
  tableData: [],
  pageList: [10, 20, 60, 80, 100],
  total: 0,
  param: {
    page: 1,
    page_size: 10,
  },
  gameTable: false,
  editDialog: false,
  game_status: "",
  gameType: [
    {
      value: "5",
      label: "所有",
    },
    {
      value: "0",
      label: "未发布",
    },
    {
      value: "1",
      label: "已发布",
    },
    {
      value: "-1",
      label: "已删除",
    },
  ],
  gameStatus: [
    {
      value: "",
      label: "全部",
    },
    {
      value: 1,
      label: "开启",
    },
    {
      value: 2,
      label: "关闭",
    },
  ],
  viewDialog: false,
  DialogData: {},
  loading: false,
});
const getData = (param) => {
  state.loading = true;
  http.gameManagement.gameHistory(param).then((res) => {
    if (res.data.err_code == 0) {
      state.tableData = res.data.data.purchase_game;
      state.total = res.data.data.total;
      state.loading = false;
    }
  });
};
const statusFilter = (val) => {
  if (val == 1) {
    return "正常";
  } else {
    return "关闭";
  }
};
const onSizeChange = (val) => {
  state.param.page_size = val;
  search();
};
const onCurrentChange = (val) => {
  state.param.page = val;
  search();
};
const winOrLose = (pfm) => {
  if (pfm > 0) {
    return "+" + pfm;
  } else if (pfm == 0) {
    return pfm;
  } else {
    return pfm;
  }
};

const voide = () => {};

const check = (val) => {
  state.DialogData = val;
  state.viewDialog = true;
};

const filter = () => {
  let param = {
    page: state.param.page,
    page_size: state.param.page_size,
  };
  if (state.user_name) {
    param.user_id = state.user_name;
  } else {
    delete param.user_name;
  }

  if (state.issue) {
    param.lottery_issue = state.issue;
  } else {
    delete param.lottery_issue;
  }

  if (state.amount) {
    param.bet_amount = state.amount;
  } else {
    delete param.bet_amount;
  }

  if (state.gname) {
    param.game_name = state.gname;
  } else {
    delete param.game_name;
  }

  if (state.dateValue && state.dateValue.length) {
    param.start_date = `${state.dateValue[0]} 00:00:00`;
    param.end_date = `${state.dateValue[1]} 23:59:59`;
  } else {
    delete param.start_time;
    delete param.end_time;
  }

  return param;
};

const search = () => {
  let param = filter();
  getData(param);
};

const closeViewDialog = () => {
  state.viewDialog = false;
};

const refresh = () => {
  router.push("/gameManagement/bettingRecord");
  state.user_name = "";

  state.issue = "";
  state.amount = "";
  state.gname = "";
  state.dateValue = [];
  getData();
};

const changeString = (val) => {
  return val.toString();
};

onMounted(() => {
  state.loading = true;
  let param = {
    page: state.param.page,
    page_size: state.param.page_size,
  };
  if (route.query.game_name) {
    param.game_name = route.query.game_name;
    state.gname = route.query.game_name;
  }

  if (route.query.user_id) {
    param.user_id = route.query.user_id;
    state.user_name = route.query.user_id;
  }
  setTimeout(() => {
    getData(param);
  }, 100);
});
</script>
<style lang="scss" scoped>
.btn_con {
  display: flex;
  .el-button {
    margin: 0 auto !important;
  }
}
</style>
