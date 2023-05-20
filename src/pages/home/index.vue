<template>
  <div class="home-container" v-loading="isLoading">
    <el-row :gutter="20" v-if="data.hasOwnProperty('home_widget')">
      <el-col :lg="8" :md="12" :xs="24">
        <el-card class="home-card first" :body-style="{ padding: '0px' }">
          <div class="body">
            <div class="left">
              <div class="child-left">
                <h1 class="header">
                  {{ t(`dashboard.total_user`) }}
                </h1>
                <span class="number">
                  {{ data.home_widget.RegUser }}
                </span>
                <h3 class="desc">
                  {{ t(`dashboard.total_current_user`) }}
                </h3>
              </div>
              <!-- <div class="child-right">
                <h1 class="header">{{ t(`dashboard.current_online`) }}</h1>
                <span class="number">
                  {{ data.home_widget.ActiveMember }}
                </span>
              </div> -->
            </div>
            <div class="right">
              <font-awesome-icon icon="fa-solid fa-users" class="icon" />
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :lg="8" :md="12" :xs="24">
        <el-card :body-style="{ padding: '0px' }" class="home-card fifth">
          <div class="body">
            <div class="left">
              <div>
                <h1 class="header">
                  {{ t(`dashboard.current_online`) }}
                </h1>
                <span class="number">
                  {{ data.home_widget.ActiveMember }}
                </span>
                <h3 class="desc">
                  {{ t(`dashboard.total_current_online`) }}
                </h3>
              </div>
            </div>
            <div class="right">
              <font-awesome-icon
                icon="fa-solid fa-chalkboard-user"
                class="icon"
              />
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :lg="8" :md="12" :xs="24">
        <el-card :body-style="{ padding: '0px' }" class="home-card second">
          <div class="body">
            <div class="left">
              <div>
                <h1 class="header">
                  {{ t(`dashboard.total_register`) }}
                </h1>
                <span class="number">
                  {{ data.home_widget.TodayRegUser }}
                </span>
                <h3 class="desc">
                  {{ t(`dashboard.total_register_count`) }}
                </h3>
              </div>
            </div>
            <div class="right">
              <font-awesome-icon icon="fa-solid fa-user" class="icon" />
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :lg="8" :md="12" :xs="24">
        <el-card :body-style="{ padding: '0px' }" class="home-card sixth">
          <div class="body">
            <div class="left">
              <div>
                <h1 class="header">
                  {{ t(`dashboard.total_resource`) }}
                </h1>
                <span class="number">
                  {{ data.home_widget.NoteResource }}
                </span>
                <h3 class="desc">
                  {{ t(`dashboard.total_current_resource`) }}
                </h3>
              </div>
            </div>
            <div class="right">
              <font-awesome-icon icon="fa-solid fa-gear" class="icon" />
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :lg="8" :md="12" :xs="24">
        <el-card :body-style="{ padding: '0px' }" class="home-card third">
          <div class="body">
            <div class="left">
              <div>
                <h1 class="header">
                  {{ t(`dashboard.total_order`) }}
                </h1>
                <span class="number">
                  {{ data.home_widget.TotalOrder }}
                </span>
                <h3 class="desc">
                  {{ t(`dashboard.total_paid_order`) }}
                </h3>
              </div>
            </div>
            <div class="right">
              <font-awesome-icon
                icon="fa-solid fa-cart-shopping"
                class="icon"
              />
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :lg="8" :md="12" :xs="24">
        <el-card :body-style="{ padding: '0px' }" class="home-card fourth">
          <div class="body">
            <div class="left">
              <div>
                <h1 class="header">
                  {{ t(`dashboard.total_evaluation`) }}
                </h1>
                <span class="number">
                  {{ data.home_widget.TotalEvaluation }}
                </span>
                <h3 class="desc">
                  {{ t(`dashboard.total_order_review`) }}
                </h3>
              </div>
            </div>
            <div class="right">
              <font-awesome-icon
                icon="fa-solid fa-clipboard-list"
                class="icon"
              />
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" v-if="data.hasOwnProperty('home_widget')">
      <el-col :lg="6" :md="12" :xs="24">
        <div class="card-v2 one">
          <font-awesome-icon
            icon="fa-solid fa-money-bill-transfer"
            class="icon"
          />
        </div>

        <el-card class="cards">
          <div class="body">
            <div class="left">
              <div>
                <h1 class="header">
                  {{ t(`dashboard.member_order`) }}
                </h1>
                <span class="number" style="color: #fe3d68">
                  {{ data.home_widget.MemberOrder }}
                </span>
                <p class="desc">
                  {{ t(`dashboard.yesterday`) }} :
                  {{ data.home_widget.YesterdayMemberOrder }}
                </p>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :lg="6" :md="12" :xs="24">
        <div class="card-v2 two">
          <font-awesome-icon icon="fa-solid fa-coins" class="icon" />
        </div>

        <el-card class="cards">
          <div class="body">
            <div class="left">
              <div>
                <h1 class="header">
                  {{ t(`dashboard.teacoin_order`) }}
                </h1>
                <span class="number" style="color: #3c88ff">
                  {{ data.home_widget.CoinOrder }}
                </span>
                <p class="desc">
                  {{ t(`dashboard.yesterday`) }} :
                  {{ data.home_widget.YesterDayCoinOrder }}
                </p>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :lg="6" :md="12" :xs="24">
        <div class="card-v2 three">
          <font-awesome-icon
            icon="fa-solid fa-arrow-up-from-bracket"
            class="icon"
          />
        </div>

        <el-card class="cards">
          <div class="body">
            <div class="left">
              <div>
                <h1 class="header">
                  {{ t(`dashboard.add_share_ios`) }}
                </h1>
                <span class="number" style="color: #47ca7f">
                  {{ data.home_widget.UserAdded }} /
                  {{ data.home_widget.UserShared }} /
                  {{ data.home_widget.UserAddedIOS }}
                </span>
                <p class="desc">
                  {{ t(`dashboard.yesterday`) }} :
                  {{ data.home_widget.YesterdayUserAdded }}
                </p>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :lg="6" :md="12" :xs="24">
        <div class="card-v2 four">
          <font-awesome-icon icon="fa-solid fa-user-check" class="icon" />
        </div>

        <el-card class="cards">
          <div class="body">
            <div class="left">
              <div>
                <h1 class="header">
                  {{ t(`dashboard.order_user`) }}
                </h1>
                <span class="number" style="color: #f48c24">
                  {{ data.home_widget.OrderNumber }}
                </span>
                <p class="desc">
                  {{ t(`dashboard.yesterday`) }} :
                  {{ data.home_widget.YesterdayOrderUser }}
                </p>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- <el-col :lg="8" :md="12" :xs="24">
        <div class="card-v2 two">
          <font-awesome-icon
            icon="fa-solid fa-file-invoice-dollar"
            class="icon"
          />
        </div>

        <el-card class="cards">
          <div class="body">
            <div class="left">
              <div>
                <h1 class="header">今日充值(总额/人数/次数)</h1>
                <span class="number" style="color: #3c88ff">
                  {{ data.home_widget.TodayRecharge }}
                  <sub style="font-size: 20px">元</sub> /
                  {{ data.home_widget.TodayRechargeMember }} /
                  {{ data.home_widget.TodayRechargeCount }}
                </span>
                <p class="desc">今日充值总额/人数/次数</p>
              </div>
            </div>
          </div>
        </el-card>
      </el-col> -->

      <!-- <el-col :lg="8" :md="12" :xs="24">
        <div class="card-v2 three">
          <font-awesome-icon
            icon="fa-solid fa-money-bill-transfer"
            class="icon"
          />
        </div>

        <el-card class="cards">
          <div class="body">
            <div class="left">
              <div>
                <h1 class="header">今日提现(总额/人数/次数)</h1>
                <span class="number" style="color: #47ca7f">
                  {{ data.home_widget.TodayWithdraw }}
                  <sub style="font-size: 20px">元</sub> /
                  {{ data.home_widget.TodayWithdrawMember }} /
                  {{ data.home_widget.TodayWithdrawCount }}
                </span>
                <p class="desc">今日提现总额/人数/次数</p>
              </div>
            </div>
          </div>
        </el-card>
      </el-col> -->
    </el-row>
  </div>
</template>

<script>
import { onMounted, reactive, toRefs } from "vue";
import http from "@/http";
import { useI18n } from "vue-i18n";
export default {
  name: "Home",
  components: {},
  setup() {
    const { t } = useI18n();
    const state = reactive({
      data: {},
      isLoading: false,
      imgList: [
        "https://cdn.strpst.com/cdn/previews/2/5/3/2537bb65f3186120c2c7b246fc1d67cb-thumb-big",
        "https://cdn.strpst.com/cdn/previews/b/3/1/b31ba50772045b2b70f2b9d212f66242-thumb-big",
        "https://cdn.strpst.com/cdn/previews/8/3/4/8347116b70cd3fadcdd7a916ef15e573-thumb-big",
      ],
    });

    onMounted(() => {
      state.isLoading = true;
      http.user.getHomeInfo().then((res) => {
        if (res.data.err_code == 0) {
          state.data = res.data.data;
          state.isLoading = false;
        }
      });
    });

    const multipleCardPreview = (url) => {
      document.getElementById("carousel-multi-image").click();
    };
    return {
      ...toRefs(state),
      multipleCardPreview,
      t,
    };
  },
};
</script>

<style lang="scss" scoped>
:deep(.el-select .el-input__inner) {
  height: 42px !important;
}

.base-card {
  padding-bottom: 15px;
}

.lose {
  color: #f56c6c;
}

.win {
  color: #67c23a;
}

.home-card {
  margin-bottom: 20px;
  padding: 30px;
  color: black;
  border-radius: 1rem;
  box-shadow: none;
  border: none;

  .body {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .left {
    display: flex;
    // align-items: center;
    justify-content: space-between;
  }

  .header {
    margin-bottom: 10px;
    font-size: 18px;
    letter-spacing: 1px;
    line-height: 1.2;
  }

  .number {
    font-size: 35px;
  }

  .desc {
    font-size: 15px;
    margin-top: 20px;
    line-height: 1.5;
    letter-spacing: 2px;
  }

  .icon {
    font-size: 70px;
    color: grey;
  }
}

.first {
  background: #fcd0d8;

  .right {
    background: #fe3d68;
    padding: 23px;
    border-radius: 50%;
  }

  .icon {
    color: #fe3d68;
    background: white;
    font-size: 15px;
    padding: 9px;
    border-radius: 50%;
    width: 15px;
  }

  .child-right {
    padding-left: 2rem;
  }

  .number {
    color: #fe3d68;
  }
}

.fifth {
  background: #bfd0fc;

  .right {
    background: #3c88ff;
    padding: 23px;
    border-radius: 50%;
  }

  .icon {
    color: #3c88ff;
    background: white;
    font-size: 15px;
    padding: 9px;
    border-radius: 50%;
    width: 15px;
  }

  .number {
    color: #3c88ff;
  }
}

.third {
  background: #cef8e3;

  .right {
    background: #47ca7f;
    padding: 23px;
    border-radius: 50%;
  }

  .icon {
    color: #47ca7f;
    background: white;
    font-size: 15px;
    padding: 9px;
    border-radius: 50%;
    width: 15px;
  }

  .number {
    color: #47ca7f;
  }
}

.fourth {
  background: #f9e4c9;

  .right {
    background: #f48c24;
    padding: 23px;
    border-radius: 50%;
  }

  .icon {
    color: #f48c24;
    background: white;
    font-size: 15px;
    padding: 9px;
    border-radius: 50%;
    width: 15px;
  }

  .number {
    color: #f48c24;
  }
}

.second {
  background: #e5d3fa;

  .right {
    background: #995eea;
    padding: 23px;
    border-radius: 50%;
  }

  .icon {
    color: #995eea;
    background: white;
    font-size: 15px;
    padding: 9px;
    border-radius: 50%;
    width: 15px;
  }

  .number {
    color: #995eea;
  }
}

.sixth {
  background: #bffafa;

  .right {
    background: #03c4c4;
    padding: 23px;
    border-radius: 50%;
  }

  .icon {
    color: #03c4c4;
    background: white;
    font-size: 15px;
    padding: 9px;
    border-radius: 50%;
    width: 15px;
  }

  .number {
    color: #03c4c4;
  }
}

.table {
  :deep(.el-table th) {
    background: #303133 !important;
    color: #fff;
  }
}

.form {
  .el-form-item {
    //   width: 150px;
    display: inline-block;
    margin: 0 10px;
  }

  .buttonBox {
    display: inline-block;
    margin: 0 10px;
  }
}

.cards {
  padding: 10px;
  margin-bottom: 20px;
  border-radius: 1rem;
  box-shadow: none;
  text-align: center;
  border: none;
  height: 170px;
  color: var(--text_color);
  background-color: var(--card_bg);
  box-shadow: 0px 0px 56px -8px rgb(0 0 0 / 17%);

  .body {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .left {
    display: flex;

    #login {
      background-color: #e0f5ca;

      .fa-unlock {
        color: #8bd525;
      }
    }
  }

  .header {
    margin: 40px 0px 15px 0px;
    font-size: 16px;
    font-weight: bold;
    letter-spacing: 1px;
  }

  .number {
    font-size: 28px;
  }

  .desc {
    font-size: 15px;
    margin-top: 10px;
    line-height: 1.5;
  }

  .icon {
    margin-top: 22px;
    opacity: 0.4;
    font-size: 40px;
  }
}

.card-v2 {
  position: relative;
  height: 50px;
  width: 100px;
  text-align: center;

  left: 50%;
  top: 10%;
  transform: translate(-50%);

  .icon {
    margin-top: 10px;
    opacity: 0.4;
    font-size: 30px;
  }
}

.card-v2.one {
  background: #fee9ec;

  .icon {
    color: #fe3d68;
  }

  &::before {
    border-color: transparent transparent #fee9ec transparent;
  }

  &::after {
    border-color: #fee9ec transparent transparent transparent;
  }
}

.card-v2.two {
  background: #e6eeff;

  .icon {
    color: #3c88ff;
  }

  &::before {
    border-color: transparent transparent #e6eeff transparent;
  }

  &::after {
    border-color: #e6eeff transparent transparent transparent;
  }
}

.card-v2.three {
  background: #d7efe3;

  .icon {
    color: #47ca7f;
  }

  &::before {
    border-color: transparent transparent #d7efe3 transparent;
  }

  &::after {
    border-color: #d7efe3 transparent transparent transparent;
  }
}

.card-v2.four {
  background: #f7dcba;

  .icon {
    color: #f48c24;
  }

  &::before {
    border-color: transparent transparent #f7dcba transparent;
  }

  &::after {
    border-color: #f7dcba transparent transparent transparent;
  }
}

.card-v2::before {
  position: absolute;
  left: 0;
  right: 0;
  content: "";

  top: -30px;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 50px 30px 50px;
}

.card-v2::after {
  position: absolute;
  left: 0;
  right: 0;
  content: "";

  bottom: -30px;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 30px 50px 0 50px;
}

#showCount {
  color: red;
  position: absolute;
  width: 150px;
  height: 150px;
  background: rgba(#000, 0.5);
  z-index: 3;
  text-align: center;
}

#carousel-multi-image {
  z-index: 1;
  position: relative;
}
</style>
