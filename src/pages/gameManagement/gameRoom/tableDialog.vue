<template>
  <el-dialog
    :modelValue="show"
    @update:modelValue="show = $event"
    title="空降数据 -- 官方玩法"
    @close="closeDialog(formRef)"
    :close-on-click-modal="false"
  >
    <el-table :data="data" :max-height="825">
      <el-table-column property="name" label="玩法名" align="center" />
      <el-table-column label="图片" align="center">
        <template #default="scope">
          <el-image
            style="height: 50px; cursor: zoom-in"
            :src="scope.row.img_url"
          />
        </template>
      </el-table-column>
      <el-table-column
        property="max_bet_amount"
        label="投注限额"
        align="center"
      />
      <el-table-column property="odds" label="基准赔率" align="center" />
      <el-table-column property="rebate" label="每返点赔率" align="center" />
      <!-- <el-table-column label="游戏状态"
        ><template #default="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="1"
            :inactive-value="2"
            active-color="#13ce66"
            inactive-color="#ff4949"
          /> </template
      ></el-table-column> -->

      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            type="success"
            plain
            style="margin-bottom: 5px"
            @click="selfEdit(scope.row)"
          >
            修改
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>

  <SingleGameDialog
    :show="editFormDialog"
    :data="singleForm"
    @created="closeEditDailog"
    @close="closeEditDailog"
  />
</template>

<script>
import { reactive, toRefs, ref } from "vue";

import SingleGameDialog from "./singleGameDialog.vue";

export default {
  name: "Dialog",
  components: {
    SingleGameDialog,
  },
  props: ["show", "data"],
  emits: ["closed", "created"],
  setup(props, context) {
    const state = reactive({
      dialogPrev: false,
      editFormDialog: false,
      singleForm: {},
    });

    const formRef = ref();

    const closeDialog = (formRef) => {
      context.emit("closed");
    };
    const selfEdit = (row) => {
      state.editFormDialog = true;
      state.singleForm = row;
    };

    const closePreview = () => {
      state.dialogPrev = false;
    };

    const closeEditDailog = () => {
      state.editFormDialog = false;
      context.emit("created");
    };

    return {
      ...toRefs(state),
      closeDialog,
      selfEdit,
      closePreview,
      closeEditDailog,
    };
  },
};
</script>

<style lang="scss" scoped></style>
