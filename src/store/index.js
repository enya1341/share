import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import axios from "axios";
import router from "../router/index";

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    auth: true,
    user: "",
  },
  mutations: {
    auth(state, payload) {
      state.auth = payload;
    },
    user(state, payload) {
      state.user = payload;
    },
    logout(state, payload) {
      state.auth = payload;
    },
    changeUserData(state, payload) {
      state.user.profile = payload;
    },
  },
  actions: {
    async login({ commit }, { email, password }) {
      const responseLogin = await axios.post(
        "mysql://b3b68771563a1a:c2eb7952@us-cdbr-east-03.cleardb.com/heroku_572c1e054e27c87?reconnect=true/api/login",
        {
          email: email,
          password: password,
        }
      );
      const responseUser = await axios.get(
        "mysql://b3b68771563a1a:c2eb7952@us-cdbr-east-03.cleardb.com/heroku_572c1e054e27c87?reconnect=true/api/user",
        {
          params: {
            email: email,
          },
        }
      );
      commit("auth", responseLogin.data.auth);
      commit("user", responseUser.data.data[0]);
      router.replace("/home");
    },
    logout({ commit }) {
      axios
        .post("mysql://b3b68771563a1a:c2eb7952@us-cdbr-east-03.cleardb.com/heroku_572c1e054e27c87?reconnect=true/api/logout", {
          auth: this.state.auth,
        })
        .then((response) => {
          console.log(response);
          commit("logout", response.data.auth);
          router.replace("/");
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
});