<template>
  <ul class="link-list" v-if="data.length">
    <li
      class="list"
      :class="{ active: list.url == activeCompute }"
      v-for="list in data"
      :key="list.name"
      @click="handleTo"
      @mouseenter="handleMouse(list)"
    >
      <div class="link">
        <span>{{ t(`menu.${list.name}`) }}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="2em"
          height="2em"
          preserveAspectRatio="xMidYMid meet"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M19 7v4H5.83l3.58-3.59L8 6l-6 6l6 6l1.41-1.42L5.83 13H21V7h-2Z"
          />
        </svg>
      </div>
    </li>
  </ul>
  <el-empty class="empty" v-else />
</template>

<script>
import { onMounted, reactive, toRefs, computed } from "vue";
import { useI18n } from "vue-i18n";

export default {
  name: "SearchResult",
  props: ["data", "value"],
  emits: ["enter", "update:value"],
  setup(props, context) {
    const state = reactive({});
    const { t } = useI18n();
    const handleTo = (e) => {
      context.emit("enter", e);
    };

    const activeCompute = computed({
      get() {
        return props.value;
      },
      set(val) {
        context.emit("update:value", val);
      },
    });

    async function handleMouse(item) {
      activeCompute.value = item.url;
    }

    onMounted(() => {});

    return {
      ...toRefs(state),
      handleTo,
      activeCompute,
      handleMouse,
      t,
    };
  },
};
</script>

<style lang="scss" scoped>
.link-list {
  max-height: 300px;
  overflow: scroll;
  color: #4b4d50 !important;
  .list {
    padding: 20px;
    background-color: #e9e9eb;
    margin-bottom: 16px;
    font-weight: 600;
    cursor: pointer;

    &:hover {
      background-color: $mainColor;
      color: #fff;
    }

    .icon {
      font-weight: normal;
      margin-right: 7px;
    }
  }

  .list.active {
    background-color: $mainColor;
    color: #fff;
  }

  .link {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
.empty {
  padding: 10px;
}
</style>
