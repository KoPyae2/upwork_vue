<template>
  <el-dialog
    :modelValue="show"
    @update:modelValue="show = $event"
    title="查看投注详情"
    :close-on-click-modal="false"
    center
    @close="closePreview"
  >
    <div class="card_con">
      <div class="card">
        <div class="cell">
          <p>投注名称:</p>
          <span>{{ data.bet_number }}</span>
        </div>
        <div class="cell">
          <p>游戏名称:</p>
          <span>{{ data.game_name }}</span>
        </div>
      </div>

      <div class="card">
        <div class="cell">
          <p>期数:</p>
          <span>{{ data.issue }}</span>
        </div>
        <div class="cell">
          <p>投注时间:</p>
          <span>{{ dateFormat(data.created_at) }}</span>
        </div>
      </div>

      <div class="card">
        <div class="cell">
          <p>开奖号码:</p>
          <span>{{ data.win_number }}</span>
        </div>
        <div class="cell">
          <p>赔率:</p>
          <span>{{ data.win_rate }}</span>
        </div>
      </div>

      <div class="card">
        <div class="cell">
          <p>总投注金额:</p>
          <span>{{ data.bet_amount }}</span>
        </div>
        <div class="cell">
          <p>总中奖金额:</p>
          <span>{{
            data.profit_amount > 0 ? data.profit_amount - data.bet_amount : "0"
          }}</span>
        </div>
      </div>

      <div class="card">
        <div class="cell">
          <p>盈亏:</p>
          <span>{{ data.profit_amount }}</span>
        </div>
        <div class="cell">
          <p>用户名:</p>
          <span>{{ data.user_name }}</span>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { reactive, toRefs } from "vue";
import { dateFormat } from "@/utils/timeFormat.js";

export default {
  name: "ViewDialog",
  props: ["show", "data"],
  emits: ["closed", "created"],
  setup(props, context) {
    const state = reactive({});

    const closePreview = () => {
      context.emit("closed");
    };

    return {
      ...toRefs(state),
      closePreview,
      dateFormat,
    };
  },
};
</script>

<style lang="scss" scoped>
.card_con {
  .card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 50px 0;
    .cell {
      display: flex;
      align-items: center;
      p {
        font-weight: bolder;
        font-size: 16px;
        padding-right: 10px;
      }
    }
  }
}
</style>
