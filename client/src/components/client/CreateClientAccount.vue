<template>
  <div class="createClient">
    <form class="form" @submit.prevent="submitData" novalidate="true">
      <label>Full name</label>
      <input v-model.trim="client.fullname" type="text" />
      <label>Email</label>
      <input v-model.trim="client.email" type="text" />
      <label>Phone</label>
      <input v-model.trim="client.phone" type="text" />
      <label>Choose Services (optional)</label>
      <button class="btn" @click.prevent="openModal(modalID)">Show services list</button>
      <button class="btn" :disabled="!client.email">Submit</button>
      <div class="total">
        Total value of selected services:
        <span>
          {{total.toFixed(2)}}
          <p v-html="currCode" class="codeP"></p>
        </span>
      </div>
    </form>
    <Modal v-if="open" :modalID="modalID">
      <div class="center">
        <div class="overflow">
          <ServicesChoice
            class="serviceSection"
            v-for="service in servicesArr"
            :key="service._id"
            :service="service"
            @totalSum="totalFunc"
          />
        </div>
        <span>
          Total value: {{total.toFixed(2)}}
          <p v-html="currCode" class="codeP"></p>
        </span>

        <button @click.prevent="openModal(modalID)" class="modal-btn">I choosen</button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import ServicesChoice from "./ServicesChoice";
import Modal from "../events/Modal";
import { findObj } from "../../shared/sharedFunctions";
import { clientValidation } from "../../shared/validate";
export default {
  name: "CreateClientAccount",
  components: { Modal, ServicesChoice },
  data() {
    return {
      client: {
        fullname: "",
        phone: "",
        email: "",
        clientArr: [],
        totalIncome: 0
      },
      servicesArr: [],
      total: 0,
      modalID: 931231032137
    };
  },
  mounted() {
    this.setServicesArr();
  },
  computed: {
    ...mapGetters(["eventInfo", "services", "modals", "appSettings"]),
    open() {
      return findObj(this.modals, this.modalID);
    },
    currCode() {
      return this.appSettings.currencyCode;
    }
  },
  methods: {
    ...mapActions(["createClient", "errHandler", "openModal"]),
    setServicesArr() {
      this.servicesArr = JSON.parse(JSON.stringify(this.services));
      this.servicesArr.forEach(i => (i.total = 0));
    },
    async submitData() {
      this.client.clientArr = this.servicesArr.filter(({ active }) => active);
      const { err, status } = await clientValidation(this.client);
      if (!status) return this.errHandler({ msg: err[0], status: 400 });
      const result = await this.createClient(this.client);
      if (result) {
        this.client = {
          fullname: "",
          phone: "",
          email: "",
          clientArr: [],
          totalIncome: 0
        };
        this.setServicesArr();
      }
    },
    totalFunc() {
      let value = 0;
      this.servicesArr.forEach(i => {
        if (i.active) value += i.total;
        this.total - i.total;
      });
      this.total = value;
      this.client.totalIncome = +this.total.toFixed(2);
    }
  }
};
</script>

<style lang="scss" scoped>
.createClient {
  height: 100vh;
  .form {
    height: 97%;
    padding-top: 80px;
    margin: auto;
    input {
      border: none;
      border-bottom: 1px solid $dark-blue;
      border-radius: 0;
      outline: none;
    }
    label {
      font-weight: 700;
    }
  }
  .btn {
    @include primary-btn;
  }
  .total {
    text-align: center;
    font-weight: 700;
    font-size: 18px;
    span {
      margin-left: 5px;
      font-size: 1.2em;
    }
  }
}
.center {
  @include inside(100%, 100%);
  padding: 10px;
  p {
    margin-top: 8px;
  }
  .overflow {
    height: 100%;
    overflow-y: auto;
  }
  .serviceSection {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid #817f7f;
    min-height: 77px;
    margin-bottom: 7px;
    padding: 5px 10px;
    width: 100%;
    border-radius: 7px;
  }
}
@media (min-width: 500px) {
  .center {
    @include inside(85%, 80%);
  }
  .form {
    width: 70%;
  }
}
@media (min-width: 768px) {
  .center {
    @include inside(60%, 90%);
    .serviceSection {
      padding: 10px 15px;
      height: 80px;
    }
  }
  .createClient .form {
    width: 60%;
  }
}
@media (min-width: 1000px) {
  .createClient .form {
    width: 50%;
  }
}
</style>