//author by jack
import http from "@/http";
import { useStore } from "vuex";
const store = useStore;
const getDefaultState = () => {
  return {
    permissions: JSON.parse(localStorage.getItem("permissions")),
  };
};

const state = getDefaultState();

const getters = {
  permissions: (state) => state.permissions,
};

const mutations = {
  SET_PERMISSIONS: (state, permissions) => {
    state.permissions = permissions;
    localStorage.setItem("permissions", JSON.stringify(permissions));
  },
  SET_SECRETKEY(state, secret_key) {
    state.secret_key = secret_key;
  },
};

const actions = {
  setPermissions({ commit }) {
    return new Promise((resolve, reject) => {
      http.user
        .getUserInfo()
        .then((response) => {
          let per = JSON.parse(response.data.data.authinfo.permission).concat(
            JSON.parse(response.data.data.authinfo.sub_permission)
          );

          commit("SET_PERMISSIONS", JSON.stringify(per));

          location.reload();
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
