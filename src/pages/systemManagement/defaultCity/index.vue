<template>
  <div
    element-loading-background="rgba(122, 122, 122, 0.3)"
    v-loading="isLoading"
  >
    <div class="table">
      <el-table
        :data="tableList"
        :row-style="{ height: '55px' }"
        :header-row-style="{ height: '55px' }"
        :border="true"
        v-permission:system:defaultcity:list
        :max-height="825"
      >
        <el-table-column
          prop="city_code"
          :label="t('defaultCity.table.code')"
          align="center"
        />
        <el-table-column :label="t('defaultCity.table.name')" align="center">
          <template #default="scope">
            {{ findName(scope.row.city_name) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="short_name"
          :label="t('defaultCity.table.abbreviation')"
          align="center"
        >
          <template #default="scope">
            {{ findName(scope.row.short_name) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="lat"
          :label="t('defaultCity.table.lat')"
          align="center"
        />
        <el-table-column
          prop="lng"
          :label="t('defaultCity.table.lng')"
          align="center"
        />
        <el-table-column
          prop="province_code"
          :label="t('defaultCity.table.province')"
          align="center"
        />
        <el-table-column :label="t('common.operate')" align="center">
          <template #default="scope">
            <el-tooltip
              class="box-item"
              :content="t('common.edit')"
              placement="top"
            >
              <el-button
                type="primary"
                style="margin-left: 10px; margin-bottom: 5px"
                circle
                @click="handleEdit(scope.row)"
                v-permission:system:defaultcity:edit
              >
                <font-awesome-icon icon="fa-solid fa-file-pen" />
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>

  <Dialog
    :show="showDialog"
    @closed="closeDialog"
    @created="search"
    :title="dialog.dialogTitle"
    :data="dialog.dialogData"
  />
</template>

<script>
import { onMounted, reactive, toRefs, computed } from "vue";
import Dialog from "./dialog.vue";
import http from "@/http";
import { useStore } from "vuex";
import { dateFormat } from "@/utils/timeFormat.js";
import { useI18n } from "vue-i18n";

export default {
  name: "DefaultCity",
  components: {
    Dialog,
  },
  setup() {
    const state = reactive({
      isLoading: true,
      showDialog: false,
      filterForm: {},
      pageList: [10, 20, 60, 80, 100],
      param: {
        page: 1,
        page_size: 10,
      },
      dialog: {
        dialogTitle: "",
        dialogData: {},
      },
      tableList: [],
      total: 1,
      isLoading: true,
      tableHeight: 0,
    });
    const { t } = useI18n();
    const store = useStore();

    const handleEdit = (row) => {
      state.dialog.dialogTitle = t("common.edit");
      state.dialog.dialogData = JSON.parse(JSON.stringify(row));
      state.showDialog = true;
    };

    const closeDialog = () => {
      state.showDialog = false;
    };

    const search = () => {
      state.showDialog = false;
      state.tableList = [];
      http.systemManagement.getDefaultLocation().then((res) => {
        if (res.data.err_code == 0) {
          state.isLoading = false;
          state.tableList.push(res.data.data.cities[0]);
        }
      });
    };

    const findName = (data) => {
      const index = data.findIndex((x) => x.lang == store.state.user.lang);

      if (index !== -1) {
        if (
          data[index].content == null ||
          data[index].content == "" ||
          data[index].content == undefined
        ) {
          return "--";
        }
        return data[index].content;
      } else {
        return "--";
      }
    };

    onMounted(() => {
      state.isLoading = true;
      http.systemManagement.getDefaultLocation().then((res) => {
        if (res.data.err_code == 0) {
          state.isLoading = false;
          state.tableList.push(res.data.data.cities[0]);
        }
      });
    });

    return {
      ...toRefs(state),
      handleEdit,
      closeDialog,
      search,
      dateFormat,
      windowRect: computed(() => store.state.app.windowRect),
      device: computed(() => store.state.app.device),
      t,
      findName,
    };
  },
};
</script>

<style lang="scss" scoped></style>
