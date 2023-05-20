<template>
  <el-dialog
    :show-close="false"
    :modelValue="show"
    @open="openDialog"
    @update:modelValue="show = $event"
    @close="closeDialog(formRef)"
    draggable
    width="35%"
  >
    <el-form label-width="100px" label-position="top">
      <el-form-item>
        <el-input
          v-model="keyword"
          :placeholder="t('common.search_placeholder')"
          @input="handleSearch"
          ref="inputRef"
        >
          <template #prefix>
            <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
          </template>
        </el-input>
      </el-form-item>

      <div class="link-section" v-loading="searchLoading">
        <SearchResult
          :data="resultOptions"
          v-model:value="activePath"
          @enter="handleEnter"
        />
      </div>
    </el-form>
    <template #footer>
      <hr />
      <div class="icon-footer">
        <span class="mr-14px flex-y-center icon-main">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 24 24"
            class="icon"
          >
            <path
              fill="currentColor"
              d="M19 7v4H5.83l3.58-3.59L8 6l-6 6l6 6l1.41-1.42L5.83 13H21V7h-2Z"
            />
          </svg>
          <span>{{ t("common.enter") }}</span>
        </span>
        <span class="mr-14px flex-y-center icon-main">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 24 24"
            class="icon"
          >
            <path
              fill="currentColor"
              d="M11 20V7.825l-5.6 5.6L4 12l8-8l8 8l-1.4 1.425l-5.6-5.6V20Z"
            />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 24 24"
            class="icon"
          >
            <path
              fill="currentColor"
              d="m12 20l-8-8l1.4-1.425l5.6 5.6V4h2v12.175l5.6-5.6L20 12Z"
            />
          </svg>
          <span>{{ t("common.arrow") }}</span>
        </span>
        <span class="flex-y-center icon-main">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 24 24"
            class="icon"
          >
            <path
              fill="currentColor"
              d="M1 7h6v2H3v2h4v2H3v2h4v2H1V7m10 0h4v2h-4v2h2a2 2 0 0 1 2 2v2c0 1.11-.89 2-2 2H9v-2h4v-2h-2a2 2 0 0 1-2-2V9c0-1.1.9-2 2-2m8 0h2a2 2 0 0 1 2 2v1h-2V9h-2v6h2v-1h2v1c0 1.11-.89 2-2 2h-2a2 2 0 0 1-2-2V9c0-1.1.9-2 2-2Z"
            />
          </svg>
          <span>{{ t("common.esc") }}</span>
        </span>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { onMounted, reactive, toRefs, ref, nextTick } from "vue";
import { ElMessage } from "element-plus";
import { useRouter, isNavigationFailure } from "vue-router";
import SearchResult from "./SearchResult.vue";
import { useI18n } from "vue-i18n";
import {
  onKeyStroke,
  useDebounceFn,
  useMagicKeys,
  whenever,
} from "@vueuse/core";

export default {
  name: "SearchDialog",
  props: ["show"],
  emits: ["closed", "opened"],
  components: { SearchResult },
  setup(props, context) {
    const state = reactive({
      keyword: "",
      searchLoading: false,
      activePath: "",
      resultOptions: [],
      menuLists: [],
    });
    const { t } = useI18n();
    const router = useRouter();

    const inputRef = ref();

    const closeDialog = () => {
      state.menuLists = [];
      state.resultOptions = [];
      state.keyword = "";
      state.activePath = "";
      context.emit("closed");
    };

    const search = () => {
      state.searchLoading = true;

      state.resultOptions = state.menuLists.filter(
        (menu) =>
          state.keyword &&
          t(`menu.${menu.name}`)
            .toLocaleLowerCase()
            .includes(state.keyword.toLocaleLowerCase().trim())
      );
      if (state.resultOptions?.length > 0) {
        state.searchLoading = false;
        state.activePath = state.resultOptions[0].url;
      } else {
        state.searchLoading = false;
        state.activePath = "";
      }
    };

    const handleSearch = useDebounceFn(search, 300);

    const openDialog = () => {
      nextTick(() => {
        inputRef.value.focus();
      });
      JSON.parse(localStorage.getItem("menu")).map((ele) => {
        if (ele?.children) {
          ele.children.forEach((ch) => {
            if (
              ch.name == "image_video" ||
              ch.name == "long_video" ||
              ch.name == "live_broadcast"
            ) {
              ch.children.forEach((gc) => {
                state.menuLists.push(gc);
              });
            } else {
              state.menuLists.push(ch);
            }
          });
        } else {
          state.menuLists.push(ele);
        }
      });
    };

    const handleEnter = (e) => {
      const { length } = state.resultOptions;
      if (length === 0 || state.activePath === "") return;
      e.preventDefault();
      router.push(state.activePath);
      closeDialog();
    };

    const handleUp = () => {
      const { length } = state.resultOptions;
      if (length === 0) return;
      const index = state.resultOptions.findIndex(
        (item) => item.url === state.activePath
      );
      if (index === 0) {
        state.activePath = state.resultOptions[length - 1].url;
      } else {
        state.activePath = state.resultOptions[index - 1].url;
      }
    };

    const handleDown = () => {
      const { length } = state.resultOptions;
      if (length === 0) return;
      const index = state.resultOptions.findIndex(
        (item) => item.url === state.activePath
      );
      if (index + 1 === length) {
        state.activePath = state.resultOptions[0].url;
      } else {
        state.activePath = state.resultOptions[index + 1].url;
      }
    };

    const { ctrl_k } = useMagicKeys({
      passive: false,
      onEventFired(e) {
        if (e.ctrlKey && e.key === "k" && e.type === "keydown")
          e.preventDefault();
      },
    });

    whenever(ctrl_k, () => {
      context.emit("opened");
    });

    onKeyStroke("Escape", closeDialog);
    onKeyStroke("Enter", handleEnter);
    onKeyStroke("ArrowUp", handleUp);
    onKeyStroke("ArrowDown", handleDown);

    onMounted(() => {});

    return {
      ...toRefs(state),
      openDialog,
      closeDialog,
      handleSearch,
      handleEnter,
      inputRef,
      t,
    };
  },
};
</script>

<style lang="scss" scoped>
hr {
  display: block;
  height: 1px;
  border: 0;
  border-top: 1px solid rgb(239, 239, 245);
  padding: 0;
}
.icon-footer {
  margin-right: 24px;
  height: 44px;
  display: flex;
  align-items: center;
  font-weight: normal;
}

.icon-main {
  margin-right: 14px;
  display: flex;
  align-items: center;
}
.icon {
  box-shadow: inset 0 -2px #cdcde6, inset 0 0 1px 1px #fff,
    0 1px 2px 1px #1e235a66;
  font-size: 16px;
  padding: 3px;
  margin-right: 6px;
}

.link-section {
  margin-top: 20px;
}
</style>
