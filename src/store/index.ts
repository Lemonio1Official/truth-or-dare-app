import { createStore } from "vuex";

interface store {
  state: state;
  mutations: {
    [name: string]: (s: state, v: any) => void;
  };
  actions: {
    [name: string]: (i: any, v: any) => void;
  };
}

interface state {
  path: string;
}

const store = createStore({
  state: {
    path: "menu",
  },
  getters: {},
  mutations: {
    changePath(s, v) {
      s.path = v;
    },
  },
  actions: {
    changePath({ commit }, v) {
      commit("changePath", v);
    },
  },
} as store);

export default store;
