<template>
  <span class="rectangle" @click="openDialog">
    <svg
      fill="none"
      viewBox="0 0 70 70"
      height="45px"
      width="45px"
      xmlns="http://www.w3.org/2000/svg"
      class="svg-rectangle"
    >
      <path
        xmlns="http://www.w3.org/2000/svg"
        d="M29 4.04145C32.3316 1.54059 37.6684 1.54059 42 4.04145L58.3109 13.4585C62.6425 15.9594 65.3109 20.5812 65.3109 25.5829V44.4171C65.3109 49.4188 62.6425 54.0406 58.3109 56.5415L42 65.9585C37.6684 68.4594 32.3316 68.4594 28 65.9585L11.6891 56.5415C7.3575 54.0406 4.68911  49.4188 4.68911 44.4171V25.5829C4.68911 20.5812 7.3575 15.9594 11.6891 13.4585L28 4.04145Z"
        fill="#D9F3FF"
      ></path>
    </svg>

    <font-awesome-icon icon="fa-solid fa-magnifying-glass" class="fullscreen" />
    <!-- <div style="margin-left: 3px; display: inline" v-if="device !== 'mobile'">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 16 16"
        class="icon"
      >
        <path
          fill="currentColor"
          d="M9 7V6H8V5H7v1h-.5v1H7v3.56a1.823 1.823 0 0 0 2.009 1.439L9 11a.899.899 0 0 1-.998-.495L8 7h1zm5-4h1v9h-1V3zm-1 3l-.085-.001c-.773 0-1.462.358-1.911.917L11 6.001h-1v6h1v-3a1.88 1.88 0 0 1 2.006-2l-.006-1zm-8.81 6C2.16 12 1 10.54 1 8s1.16-4 3.19-4h.029c.539 0 1.052.114 1.515.32l-.424.901a2.719 2.719 0 0 0-1.08-.22h-.042C2.38 5.001 2 6.631 2 8.001s.38 3 2.19 3c.497-.013.96-.145 1.366-.368l.444.898a3.943 3.943 0 0 1-1.806.47z"
        />
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 48 48"
        class="icon"
      >
        <path
          fill="currentColor"
          fill-rule="evenodd"
          d="M18 23.172V12a2 2 0 1 0-4 0v24a2 2 0 1 0 4 0v-7.172l2-2l10.586 10.586a2 2 0 1 0 2.828-2.828L22.828 24l10.586-10.586a2 2 0 1 0-2.828-2.828L18 23.172Z"
          clip-rule="evenodd"
        />
      </svg>
    </div> -->
  </span>

  <SearchDialog :show="showDialog" @closed="closeDialog" @opened="openDialog" />
</template>

<script>
import { reactive, toRefs, computed } from "vue";
import SearchDialog from "./components/SearchDialog.vue";
import { useStore } from "vuex";

export default {
  name: "SearchMenu",
  components: {
    SearchDialog,
  },
  setup() {
    const state = reactive({
      showDialog: false,
    });

    const store = useStore();

    const openDialog = () => {
      state.showDialog = true;
    };

    const closeDialog = () => {
      state.showDialog = false;
    };

    return {
      ...toRefs(state),
      openDialog,
      closeDialog,
      device: computed(() => store.state.app.device),
    };
  },
};
</script>

<style lang="scss" scoped>
.rectangle {
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
</style>
