<template>
  <el-dialog
    :modelValue="show"
    @update:modelValue="show = $event"
    title="玩法修改"
    @close="closeDialog"
    :close-on-click-modal="false"
  >
    <el-form label-width="170px" ref="formRef" :model="singleGameData">
      <el-form-item
        label="游戏名称"
        prop="game_name"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input v-model="singleGameData.game_name" placeholder="" />
      </el-form-item>
      <el-form-item
        label="前台玩法菜单"
        prop="game_type"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input v-model="singleGameData.game_type" placeholder="" />
      </el-form-item>
      <el-form-item
        label="每天开始时间"
        prop="start_time"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input disabled v-model="singleGameData.start_time" placeholder="" />
      </el-form-item>
      <el-form-item
        label="每天结束时间"
        prop="end_time"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input disabled v-model="singleGameData.end_time" placeholder="" />
      </el-form-item>
      <el-form-item
        label="每一期时间间隔(分钟)"
        prop="time_interval"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input v-model="singleGameData.time_interval" placeholder="" />
      </el-form-item>
      <el-form-item
        label="彩种限红"
        prop="bonus_max_amount"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input v-model="singleGameData.bonus_max_amount" placeholder="" />
      </el-form-item>
      <el-form-item
        label="同类中游戏排序(顺序)"
        prop="sort"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input v-model="singleGameData.sort" placeholder="" />
      </el-form-item>
      <el-form-item
        label="官方开启"
        prop="sort"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-radio-group v-model="singleGameData.game_status" class="ml-4">
          <el-radio :label="1" size="large">正常</el-radio>
          <el-radio :label="0" size="large">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="上级返点比例(KG)"
        prop="superior_rate"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input v-model="singleGameData.superior_rate" placeholder="" />
      </el-form-item>

      <el-form-item
        label="封单时间(秒)"
        prop="invoice_time"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input v-model="singleGameData.invoice_time" placeholder="" />
      </el-form-item>
      <el-form-item
        label="最小投注额(KG)"
        prop="bet_min_amount"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input v-model="singleGameData.bet_min_amount" placeholder="" />
      </el-form-item>

      <!-- <el-form-item
        label="自动审核"
        prop="sort"
        :rules="[{ required: true, message: t('error.required'), trigger: 'blur' }]"
      >
        <el-radio-group v-model="singleGameData.pay_mode" class="ml-4">
          <el-radio :label="1" size="large">Manual</el-radio>
          <el-radio :label="0" size="large">Auto</el-radio>
        </el-radio-group>
      </el-form-item> -->

      <el-form-item label="img">
        <el-upload
          list-type="picture-card"
          :multiple="false"
          :on-remove="handleImageRemove"
          :on-preview="handlePictureCardPreview"
          :on-success="handleAvatarSuccess"
          :file-list="fileList"
          :limit="1"
          :http-request="handleHttp"
          accept="image/*"
        >
          <el-icon>+</el-icon>
        </el-upload>
      </el-form-item>
      <div class="btn_con">
        <el-button
          type="warning"
          style="margin-left: 10px; margin-bottom: 5px"
          @click="submit(formRef)"
          :disabled="doubleClick"
        >
          修改
        </el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
import {  reactive, toRefs, ref, onUpdated } from "vue";
import http from "@/http";
import { ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";

export default {
  name: "Dialog",

  props: ["show", "data"],
  emits: ["closed", "created"],
  setup(props, context) {
    const { t } = useI18n();
    const state = reactive({
      singleGameData: {
        game_name: "dsdsd",
        game_type: "",
      },
      fileList: [],

      visionState: false,
      doubleClick: false,
    });

    const formRef = ref();

    const closeDialog = (formRef) => {
      state.fileList = [];
      context.emit("closed");
    };

    const handleHttp = (fileList) => {
      const form = new FormData();
      form.append("file", fileList.file);

      http.systemManagement
        .appUpload(form, (progressEvent) => {
          fileList.onProgress({
            percent: parseInt(
              Math.round((progressEvent.loaded * 100) / progressEvent.total)
            ),
          });
        })
        .then((res) => {
          if (res.data.result == 1) {
            fileList.onSuccess();
            state.singleGameData.game_img = res.data.data.file;
          }
        });
    };

    const handleAvatarSuccess = (response, file, fileList) => {
      if (fileList.length > 1) {
        fileList.shift();
      }
    };

    const handlePictureCardPreview = () => {
      state.visionState = true;
    };

    const handleImageRemove = (uploadFile, uploadFiles) => {
      state.singleGameData.game_img = "";
    };

    const submit = (formRef) => {
      let param = {
        game_name: state.singleGameData.game_name,
        game_type: parseFloat(state.singleGameData.game_type),
        start_time: state.singleGameData.start_time,
        end_time: state.singleGameData.end_time,
        time_interval: parseFloat(state.singleGameData.time_interval),
        bonus_max_amount: parseFloat(state.singleGameData.bonus_max_amount),
        bet_min_amount: parseFloat(state.singleGameData.bet_min_amount),
        sort: parseFloat(state.singleGameData.sort),
        superior_rate: parseFloat(state.singleGameData.superior_rate),
        invoice_time: parseFloat(state.singleGameData.invoice_time),
        game_description: state.singleGameData.game_description,
        game_id: parseFloat(state.singleGameData.game_id),
        game_img: state.singleGameData.game_img,
        game_status: parseFloat(state.singleGameData.game_status),
        is_recommend: parseFloat(state.singleGameData.is_recommend),
        return_rate: parseFloat(state.singleGameData.return_rate),
        // pay_mode: parseFloat(state.singleGameData.pay_mode),
      };

      formRef.validate((valid) => {
        if (valid) {
          state.doubleClick = true;
          http.gameManagement.updateGameRoomList(param).then((res) => {
            if (res.data.err_code == 0) {
              state.doubleClick = false;
              context.emit("created");
            } else {
              state.doubleClick = false;
              ElMessage.error(t(`error.${res.data.err_code}`));
            }
          });
        }
      });
    };

    onUpdated(() => {
      if (props.show) {
        state.singleGameData = props.data;
        if (!state.fileList.length) {
          state.fileList.push({
            url: props.data.game_img,
          });
        }
      }
    });

    return {
      ...toRefs(state),
      formRef,
      closeDialog,
      submit,
      handleHttp,
      handlePictureCardPreview,
      handleImageRemove,
      handleAvatarSuccess,
    };
  },
};
</script>

<style lang="scss" scoped>
.btn_con {
  display: flex;
  .el-button {
    margin: 0 auto !important;
  }
}
</style>
