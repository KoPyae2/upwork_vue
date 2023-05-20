<template>
  <el-dialog
    :modelValue="show"
    @update:modelValue="show = $event"
    @close="closeDialog(formRef)"
    @open="openDialog"
    draggable
    :title="dialogTitle"
    :close-on-click-modal="false"
  >
    <el-form label-width="150px" ref="formRef" :model="form">
      <el-form-item
        :label="t('role.dialog.role')"
        prop="title"
        :rules="[
          { required: true, message: t('error.required'), trigger: 'blur' },
        ]"
      >
        <el-input
          v-model="form.title"
          placeholder=""
          maxlength="40"
          show-word-limit
        />
      </el-form-item>

      <el-form-item :label="t('role.dialog.remark')">
        <el-input
          v-model="form.desc"
          placeholder=""
          type="textarea"
          rows="3"
          maxlength="200"
          show-word-limit
        />
      </el-form-item>

      <el-form-item :label="t('role.dialog.permissions')">
        <!-- checkbox -->
        <el-checkbox
          :label="t('role.dialog.expand')"
          size="large"
          @change="expandMenus"
        />
        <el-checkbox
          :label="t('role.dialog.select_all')"
          size="large"
          @change="checkAllMenus"
        />
        <el-checkbox :label="t('role.dialog.link')" size="large" checked />
      </el-form-item>
      <div
        style="border: 0.2px solid #c0c4cc; width: 350px; margin-left: 150px"
      >
        <el-tree
          v-if="setExpandMenus"
          :show-checkbox="true"
          @check="checkList"
          ref="checkedDataRef"
          :data="menuLists"
          node-key="per_name"
          :default-checked-keys="form.permission"
          highlight-current
          :props="defaultProps"
          :default-expand-all="true"
          style="max-height: 600px; overflow: auto"
        />
        <el-tree
          v-else
          @check="checkList"
          ref="checkedDataRef"
          :data="menuLists"
          show-checkbox
          node-key="per_name"
          :default-checked-keys="form.permission"
          highlight-current
          :props="defaultProps"
          :default-expand-all="false"
        />
      </div>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog(formRef)">{{
          t("role.dialog.close")
        }}</el-button>
        <el-button
          class="app-button"
          @click="submitDialog(formRef)"
          :disabled="doubleClick"
          >{{ t("role.dialog.confirm") }}</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { onMounted, reactive, toRefs, ref, watch } from "vue";
import http from "@/http";
import { ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";

export default {
  name: "Dialog",
  props: ["show", "title", "data"],
  emits: ["closed", "created", "updated"],
  setup(props, context) {
    const store = useStore();
    const state = reactive({
      dialogTitle: "",
      form: {},
      doubleClick: false,
      setExpandMenus: false,
      menuLists: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
      checkStatus: false,
    });
    const { t } = useI18n();
    const formRef = ref();

    const closeDialog = (formRef) => {
      checkedDataRef.value.setCheckedKeys([]);
      formRef.resetFields();
      context.emit("closed");
    };

    const submitDialog = (formRef) => {
      formRef.validate((valid) => {
        if (valid) {
          if (state.dialogTitle == t("common.addTo")) {
            state.doubleClick = true;
            http.roleManagement.createRoleList(state.form).then((res) => {
              if (res.data.err_code == 0) {
                state.doubleClick = false;
                closeDialog(formRef);
                state.form = {};
                ElMessage.success(t(`error.${res.data.err_code}`));
                formRef.resetFields();
                context.emit("created");
              } else {
                state.doubleClick = false;

                ElMessage.error(t(`error.${res.data.err_code}`));
              }
            });
          } else {
            state.doubleClick = true;
            http.roleManagement.updateRoleList(state.form).then((res) => {
              if (res.data.err_code == 0) {
                state.doubleClick = false;
                closeDialog(formRef);
                state.form = {};
                ElMessage.success(t(`error.${res.data.err_code}`));

                formRef.resetFields();
                context.emit("updated");
              } else {
                state.doubleClick = false;

                ElMessage.error(t(`error.${res.data.err_code}`));
              }
            });
          }
        }
      });
    };

    let getMenuLists = () => {
      state.menuLists = JSON.parse(localStorage.getItem("menu")).map((M) => {
        M.name = t(`menu.${M.name}`);
        if (M.children) {
          M.children.map((C) => {
            C.name = t(`menu.${C.name}`);
            C.id = C.id;
            if (C.children) {
              C.children.map((L) => {
                L.name = t(`menu.${L.name}`);
                L.id = L.id;
                if (L.children) {
                  L.children.map((Z) => {
                    Z.name = t(`menu.${Z.name}`);
                    Z.id = Z.id;
                    return Z;
                  });
                }
                return L;
              });
            }
            return C;
          });
        }
        return M;
      });
    };

    watch(
      () => store.state.user.lang,
      () => {
        getMenuLists();
      }
    );

    const checkedDataRef = ref();

    const checkList = () => {
      state.form.permission = checkedDataRef.value.getCheckedKeys();
      state.form.sub_permission = checkedDataRef.value.getHalfCheckedKeys();
    };

    const expandMenus = () => {
      state.setExpandMenus = !state.setExpandMenus;
    };

    const checkAllMenus = () => {
      let ids = state.menuLists.map(({ per_name }) => per_name);

      state.checkStatus = !state.checkStatus;
      if (state.checkStatus) {
        checkedDataRef.value.setCheckedKeys(ids);
        state.form.permission = checkedDataRef.value.getCheckedKeys(false);
      } else {
        checkedDataRef.value.setCheckedKeys([]);
        state.form.permission = [];
      }
    };

    const openDialog = () => {
      state.dialogTitle = props.title;

      state.form.title = props.data.Title;
      state.form.status = props.data.Status ?? 1;
      state.form.sort = props.data.Sort ?? 0;
      state.form.desc = props.data.Desc;
      state.form.id = props.data.ID;

      if (props.data.Permission) {
        checkedDataRef.value.setCheckedNodes(JSON.parse(props.data.Permission));

        state.form.permission = JSON.parse(props.data.Permission);
        state.form.sub_permission = JSON.parse(props.data.SubPermission);
      }
    };

    onMounted(() => {
      getMenuLists();
      state.menuLists.shift();
    });

    return {
      ...toRefs(state),
      closeDialog,
      submitDialog,
      formRef,
      openDialog,
      expandMenus,
      checkAllMenus,
      checkList,
      checkedDataRef,
      t,
    };
  },
};
</script>

<style lang="scss" scoped>
:deep(.el-select .el-input__inner) {
  height: 42px !important;
}
</style>
