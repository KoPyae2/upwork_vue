<template>
  <el-dialog
    :modelValue="show"
    @update:modelValue="show = $event"
    title="玩法修改"
    @close="closeDialog"
    :close-on-click-modal="false"
  >
    <el-form label-width="150px" ref="formRef" :model="singleGameData">
      <el-form-item
        label-width="300"
        label="玩法名称"
        prop="name"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input v-model="singleGameData.name" placeholder="" />
      </el-form-item>
      <el-form-item
        label-width="300"
        label="正则"
        prop="show_name"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input v-model="singleGameData.show_name" placeholder="" />
      </el-form-item>
      <el-form-item
        label-width="300"
        label="投注限额"
        prop="max_bet_amount"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input v-model="singleGameData.max_bet_amount" placeholder="" />
      </el-form-item>
      <el-form-item
        label-width="300"
        label="用户最大中奖金额(0为不限制)"
        prop="limit_win_amount"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input v-model="singleGameData.limit_win_amount" placeholder="" />
      </el-form-item>
      <el-form-item
        label-width="300"
        label="玩法基准赔率"
        prop="odds"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input v-model="singleGameData.odds" placeholder="" />
      </el-form-item>
      <el-form-item
        label-width="300"
        label="每1返点对应赔率"
        prop="rebate"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input v-model="singleGameData.rebate" placeholder="" />
      </el-form-item>
      <el-form-item
        label-width="300"
        label="最大单注金额(0为不限制)"
        prop="max_single_bet_amount"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input
          v-model="singleGameData.max_single_bet_amount"
          placeholder=""
        />
      </el-form-item>
      <el-form-item
        label-width="300"
        label="最大注数(0为不限制)"
        prop="bet_limit"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input v-model="singleGameData.bet_limit" placeholder="" />
      </el-form-item>
      <!-- <el-form-item
        label-width="300"
        label="玩法介绍Play Info"
        prop="invoice_time"
        :rules="[{ required: true, message: t('error.required'), trigger: 'blur' }]"
      >
        <el-input v-model="singleGameData.invoice_time" placeholder="" />
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
import { reactive, toRefs, ref,  onUpdated } from "vue";
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
      imgVision: false,
      visionState: false,
      doubleClick: false,
    });

    const formRef = ref();

    const closeDialog = () => {
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
            state.singleGameData.img_url = res.data.data.file;
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
      state.singleGameData.img_url = "";
    };

    const submit = (formRef) => {
      let param = {
        id: state.singleGameData.id,
        name: state.singleGameData.name,
        show_name: state.singleGameData.show_name,
        bet_limit: parseFloat(state.singleGameData.bet_limit),
        limit_win_amount: parseFloat(state.singleGameData.limit_win_amount),
        odds: parseFloat(state.singleGameData.odds),
        rebate: parseFloat(state.singleGameData.rebate),
        max_single_bet_amount: parseFloat(
          state.singleGameData.max_single_bet_amount
        ),
        max_bet_amount: parseFloat(state.singleGameData.max_bet_amount),
        img_url: state.singleGameData.img_url,
      };

      formRef.validate((valid) => {
        if (valid) {
          state.doubleClick = true;
          http.gameManagement.singleGameUpdate(param).then((res) => {
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

        state.fileList = [];
        state.fileList.push({
          url: props.data.img_url,
        });
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
