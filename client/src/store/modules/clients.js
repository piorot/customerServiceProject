import axios from "axios";
import router from "../../router/index";

const state = {
  clients: []
};

const getters = {
  clientData: state => state.clients
};

const mutations = {
  setClientsData: (state, payload) => (state.clients = payload)
};
const actions = {
  async getClients({ commit }) {
    const res = await axios.get("/getClients");
    commit("setClientsData", res.data);
  },

  resetClientsArray({ commit }) {
    commit("setClientsData", []);
  },

  async createClient({ commit, dispatch }, data) {
    try {
      const res = await axios.post("/createClient", data);
      commit("setClientsData", res.data.data);
      dispatch("errHandler", { msg: res.data.msg, status: 200 });
    } catch (err) {
      dispatch("errHandler", { msg: err.response.data, status: 400 });
    }
  },

  async addNewServiceToClient({ commit, dispatch }, data) {
    try {
      const res = await axios.post("/clientServiceUpdate", data);
      commit("setClientsData", res.data);
      dispatch("errHandler", { msg: "Service added", status: 200 });
    } catch (err) {
      dispatch("errHandler", { msg: err.reponse.data, status: 400 });
    }
  },

  async createNote({ commit, dispatch }, data) {
    if (data.body.length < 1) return dispatch("errHandler", { msg: "Please, enter a message", status: 400 });
    try {
      const res = await axios.post("/createNote", data);
      commit("setClientsData", res.data);
      dispatch("errHandler", { msg: "Note added", status: 200 });
    } catch (err) {
      dispatch("errHandler", { msg: err.reponse.data, status: 400 });
    }
  },

  async removeNote({ commit, dispatch }, data) {
    try {
      const res = await axios.post("/deleteNote", data);
      commit("setClientsData", res.data);
      dispatch("errHandler", { msg: "Note removed", status: 200 });
    } catch (err) {
      dispatch("errHandler", { msg: err.reponse.data, status: 400 });
    }
  },

  async deleteClient({ commit, dispatch }, id) {
    try {
      const res = await axios.delete("/deleteClient", { params: { id } });
      commit("setClientsData", res.data);
      dispatch("errHandler", { msg: "Client deleted", status: 200 });
      router.push("/client-list");
    } catch (err) {
      dispatch("errHandler", { msg: err.reponse.data, status: 400 });
    }
  },

  async updateClient({ commit, dispatch }, data) {
    try {
      const res = await axios.put("/updateClient", data);
      commit("setClientsData", res.data);
      dispatch("errHandler", { msg: "Client dupdated", status: 200 });
      return true;
    } catch (err) {
      dispatch("errHandler", { msg: err.reponse.data, status: 400 });
      return false;
    }
  },

  async extendService({ commit, dispatch }, data) {
    if (data.value === 0 || typeof this.value === "string") return this.errHandler({ msg: "Value must be at least 1", status: 400 });
    try {
      const res = await axios.put("/extendService", data);
      commit("setClientsData", res.data);
      dispatch("errHandler", { msg: "Service updated", status: 200 });
    } catch (err) {
      dispatch("errHandler", { msg: "Error, try again", status: 400 });
    }
  },

  async sendEmail({ dispatch }, data) {
    try {
      await axios.post("/sendEmail", data);
      dispatch("errHandler", { msg: "Email sent", status: 200 });
      return true;
    } catch (err) {
      dispatch("errHandler", { msg: "Error, try again", status: 400 });
      return false;
    }
  },

  async closeService({ commit, dispatch }, data) {
    const confirm = window.confirm("Close this service?");
    const { clientID, serviceID } = data;
    if (!confirm) return;
    try {
      const res = await axios.put(`/clients/services/close?userid=${clientID}&serviceid=${serviceID}`);
      dispatch("errHandler", { msg: "This service has been closed", status: 200 });
      commit("setClientsData", res.data);
      return true;
    } catch (err) {
      dispatch("errHandler", { msg: "Error, try again", status: 400 });
      return false;
    }
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
