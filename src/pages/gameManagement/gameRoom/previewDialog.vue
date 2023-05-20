<template>
  <el-dialog
    :modelValue="show"
    @update:modelValue="show = $event"
    center
    @close="closePreview"
    :close-on-click-modal="false"
  >
    <img :src="img" alt="" class="previewImg" />
  </el-dialog>
</template>

<script>
import { reactive, toRefs} from "vue";

export default {
  name: "PreviewDialog",
  props: ["show", "img"],
  emits: ["closed", "created"],
  setup(props, context) {
    const state = reactive({});

    const closePreview = () => {
      context.emit("closed");
    };

    return {
      ...toRefs(state),
      closePreview,
    };
  },
};
</script>

<style lang="scss" scoped>
.previewImg {
  display: block;
  width: auto;
  max-width: 100%;
  max-height: 700px;
  margin: 0 auto;
}
</style>
