<template>
  <div class="parent">
    <el-tabs type="card" v-model="activeTab" class="demo-tabs" id="tab">
      <el-tab-pane
        :label="t('money.purchaseRecord')"
        name="purchase"
        v-loading="isPurchaseLoading"
      >
        <PurchaseTab @loaded="loadedPurchase" @unloaded="unloadedPurchase" />
      </el-tab-pane>
      <el-tab-pane
        :label="t('money.billRecord')"
        name="revenue"
        v-loading="isRevenueLoading"
      >
        <TeaTab @loaded="loadedRevenue" @unloaded="unloadedRevenue" />
      </el-tab-pane>
      <!-- <el-tab-pane label="茶币账单记录" name="gold" v-loading="isGoldLoading">
        <GoldTab @loaded="loadedGold" @unloaded="unloadedGold" />
      </el-tab-pane
      > -->
    </el-tabs>
  </div>
</template>

<script>
import { onMounted, reactive, toRefs } from "vue";
import TeaTab from "./tea.vue";
import GoldTab from "./gold.vue";
import PurchaseTab from "./purchase.vue";
import { useI18n } from "vue-i18n";

export default {
  name: "Revenue",
  components: {
    PurchaseTab,
    TeaTab,
    GoldTab,
  },
  setup() {
    const { t } = useI18n();
    const state = reactive({
      activeTab: "purchase",
      isPurchaseLoading: true,
      isRevenueLoading: true,
      isGoldLoading: true,
    });

    const loadedRevenue = () => {
      state.isRevenueLoading = true;
    };

    const unloadedRevenue = () => {
      state.isRevenueLoading = false;
    };

    const loadedGold = () => {
      state.isGoldLoading = true;
    };

    const unloadedGold = () => {
      state.isGoldLoading = false;
    };

    const loadedPurchase = () => {
      state.isPurchaseLoading = true;
    };

    const unloadedPurchase = () => {
      state.isPurchaseLoading = false;
    };

    onMounted(() => {});
    return {
      t,
      ...toRefs(state),
      loadedRevenue,
      unloadedRevenue,
      loadedGold,
      unloadedGold,
      loadedPurchase,
      unloadedPurchase,
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
.parent {
  padding: 30px;
  background: var(--sidebar_bg);
  border-radius: 15px;
}
#tab {
  background: var(--sidebar_bg);
  box-shadow: none !important;
  // padding: 20px;
}
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
</style>
