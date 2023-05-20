export default {
  state() {
    return {
      mode: localStorage.getItem("theme") || "light",
    };
  },
  getters: {
    mode: (state) => state.mode,
  },
  mutations: {
    SET_THEME(state, data) {
      state.mode = data;
    },
  },
  actions: {
    setMode({ commit }, data) {
      commit("SET_THEME", data);
    },
  },
};
