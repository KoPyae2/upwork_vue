<template>
  <div class="container" v-loading="loading">
    <div class="form" v-permission:game:lottery:list>
      <div class="form-content">
        <el-form label-position="top" label-width="300px">
          <!--   -->
          <el-form-item label="游戏名">
            <el-select
              :multiple="false"
              placeholder="请输入发布状态"
              style="width: 100%"
              v-model="state.param.game_id"
              default-first-option
            >
              <el-option
                v-for="item in state.gameNameOption"
                :key="item"
                :value="item.game_id"
                :label="item.game_name"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="状态">
            <el-select
              :multiple="false"
              placeholder="请输入发布状态"
              style="width: 100%"
              v-model="state.selectStatus"
              default-first-option
            >
              <el-option
                v-for="item in state.gameStatus"
                :key="item"
                :value="item.value"
                :label="item.name"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="时间">
            <el-date-picker
              v-model="state.date"
              type="date"
              placeholder="Pick a day"
              value-format="YYYY-MM-DD"
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
          <!-- <div style="margin-top: 34px" class="buttonBox">
          <el-button type="warning">
            <font-awesome-icon
              icon="fa-solid fa-arrows-rotate"
              style="margin-right: 5px"
            />搜索</el-button
          >
        </div> -->
        </el-form>
      </div>
    </div>
    <div class="table">
      <el-table
        :data="state.tableData"
        :row-style="{ height: '55px' }"
        :header-row-style="{ height: '55px' }"
        :border="true"
        style="width: 100%"
        v-permission:game:lottery:list
        :max-height="825"
      >
        <el-table-column
          prop="game_name"
          label="游戏名"
          align="center"
          width="120"
        />
        <el-table-column
          prop="screen_no"
          label="场次"
          align="center"
          width="100"
        />
        <el-table-column prop="issue" label="期号" align="center" width="120" />
        <el-table-column
          prop="game_name"
          label="预留"
          align="center"
          width="120"
        />

        <el-table-column
          prop="reserved.number"
          label="开奖号码"
          align="center"
          width="120"
        />
        <el-table-column prop="status" label="状态" align="center" width="120">
          <template #default="scope"
            ><span>{{ statusFilter(scope.row.status) }}</span></template
          >
        </el-table-column>
        <el-table-column label="开奖时间" align="center" width="120">
          <template #default="scope">
            <span v-if="scope.row.status == 1">{{ scope.row.draw_time }}</span>
            <span v-if="scope.row.status == 2" id="currreennt">{{
              countDown(scope.row.draw_time, scope.row.time_interval)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="总投注额" align="center" width="120">
          <template #default="scope">
            <span style="color: blue">{{
              scope.row.user_betting.total_bet.toFixed(2)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="中奖金额" align="center"
          ><template #default="scope">
            <span style="color: orange">{{
              scope.row.user_betting.winning_amount.toFixed(2)
            }}</span>
          </template></el-table-column
        >

        <el-table-column label="开奖控制" align="center" width="250">
          <template #default="scope">
            <div style="display: flex">
              <!-- <el-input
                style="width: 200px"
                v-model="scope.row.reserved.aa"
                placeholder=""
              /> -->
              <input
                type="text"
                style="width: 70px"
                v-model="scope.row.temp"
                :disabled="scope.row.status == 3"
                v-permission:game:lottery:edit
              />
              <el-button
                :disabled="scope.row.status == 3"
                size="small"
                type="primary"
                style="margin-left: 10px; margin-bottom: 5px"
                @click="scope.row.temp = generateNum(scope.row.id, scope)"
                v-permission:game:lottery:edit
                >随机号码</el-button
              >
              <el-button
                :disabled="scope.row.status == 3"
                size="small"
                type="success"
                style="margin-left: 10px; margin-bottom: 5px"
                @click="saveGnNumber(scope.row, scope.row.temp)"
                v-permission:game:lottery:edit
                >保存</el-button
              >
            </div>
          </template>
        </el-table-column>

        <!-- <el-table-column label="操作" fixed="right" align="center">
          <template #default="scope">
            <el-button
              :disabled="scope.row.status != 3"
              type="warning"
              size="small"
              style="margin-left: 10px; margin-bottom: 5px"
              @click="LotteryCancle(scope.row)"
            >
              该期返款
            </el-button>
          </template>
        </el-table-column> -->
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
          v-permission:game:lottery:list
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Lottery",
};
</script>
<script setup>
import { ref, computed, reactive, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import http from "@/http";
import { useI18n } from "vue-i18n";
import moment from "moment";

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
  language: store.state.user.lang == "en" ? "English" : "Chinese",
  pageList: [10, 20, 60, 80, 100],
  param: {
    page: 1,
    page_size: 10,
    game_id: 0,
  },
  total: 0,
  selectStatus: "",
  gameStatus: [
    {
      value: "",
      name: "全部",
    },
    {
      value: 1,
      name: "未开奖",
    },
    {
      value: 2,
      name: "进行中",
    },
    {
      value: 3,
      name: "已开奖",
    },
  ],
  gameNameOption: [],
  tableData: [],
  date: null,
  loading: false,
  currentTime: 0,
  showCountDown: 0,
});
const getGameRoom = () => {
  state.loading = true;
  http.gameManagement.getGameRoomList({ status: 5 }).then((res) => {
    if (res.data.data.length > 0) {
      state.gameNameOption = res.data.data.game_rooms;
      state.param.game_id = state.gameNameOption[0].game_id;
      if (route.query.game_id) {
        state.param.game_id = parseInt(route.query.game_id);
      }
    }
  });
  getData(state.param);
};
const getData = (param) => {
  http.gameManagement.getLotteryList(param).then((res) => {
    if (res.data.err_code == 0) {
      state.total = res.data.data.total;
      state.tableData = res.data.data.game_rooms;
      state.loading = false;
      state.currentTime = res.data.data.current_time;
    }
  });
};
const onSizeChange = (val) => {
  state.param.page_size = val;
  search();
};
const onCurrentChange = (val) => {
  state.param.page = val;
  search();
};
const statusFilter = (val) => {
  if (val == 1) {
    return "未开奖";
  } else if (val == 2) {
    return "进行中";
  } else {
    return "已开奖";
  }
};

const generateNum = (id, scope) => {
  http.gameManagement.generateNumber({ game_id: id }).then((res) => {
    if (res.data.err_code == 0) {
      state.tableData[scope.$index].temp = res.data.data[0].number;

      return res.data.data[0].number;
    }
  });
};

const LotteryCancle = (data) => {
  http.gameManagement.cancleLottery({ game_id: data.id }).then((res) => {
    if (res.data.err_code == 0) {
      ElMessage.success(t(`error.${res.data.err_code}`));
      search();
    } else {
      ElMessage.error(t(`error.${res.data.err_code}`));
    }
  });
};

const saveGnNumber = (row) => {
  http.gameManagement
    .saveNumber({ game_id: row.id, issue: row.issue, number: row.temp })
    .then((res) => {
      if (res.data.err_code == 0) {
        search();
      }
    });
};

const countDown = (start, time) => {
  const highestId = window.setTimeout(() => {
    for (let i = highestId; i >= 0; i--) {
      window.clearInterval(i);
    }
  }, 0);
  var eventTime = new Date(start);
  var currentTime = new Date(state.currentTime);
  let gameTime = time * 60;
  //var diffTime = gameTime - (currentTime - eventTime) / 1000;
  var diffTime = (eventTime - currentTime) / 1000;
  var duration = moment.duration(diffTime, "seconds");
  var interval = 1000;
  //console.log(diffTime);
  setInterval(function () {
    let element = document.getElementById("currreennt");
    duration = moment.duration(duration.asSeconds() - 1, "seconds");
    let min = duration.minutes();
    let sec = duration.seconds();
    //console.log(min);
    //console.log(sec);
    if (min < 10) {
      min = "0" + min;
    }
    if (sec < 10) {
      sec = "0" + sec;
    }
    if (`${min}:${sec}` == "00:00") {
      element.innerText = "00:00";
      search();
    } else {
      element.innerText = min + ":" + sec;
    }
  }, interval);
};

const search = () => {
  state.loading = true;
  let param = {
    page: state.param.page,
    page_size: state.param.page_size,
    game_id: state.param.game_id,
  };

  if (state.selectStatus) {
    param.status = state.selectStatus;
  }

  if (state.date) {
    param.date = `${state.date} 00:00:00`;
  } else {
    delete param.date;
  }
  getData(param);
};

onMounted(() => {
  getGameRoom();
  state.date = `${new Date().toISOString().split("T")[0]}`;
});
</script>
<style lang="scss" scoped></style>
