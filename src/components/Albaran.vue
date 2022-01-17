<template>
  <div class="albaran">
    <h1>Hello {{ loggedUser.name }}</h1>
    <div v-if="loggedUser.category == 'admin'">
      <div class="add-pickup">
        <button>Add pickup</button>
      </div>
      <div class="pickups">
        <select name="pickups" v-on:change="changePickup">
          <option value="">
            -- Select Option --
          </option>
          <option
            v-for="pickup in pickups"
            v-bind:key="pickup.id"
            :value="pickup.placeId"
            v-bind:date="pickup.date"
          >
            {{ pickup.name }} {{ pickup.date }}
          </option>
        </select>
      </div>
    </div>
    <p v-for="product in products" v-bind:key="product.name">
      {{ product.name }} || {{ product.amount }}
    </p>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "Albaran",
  props: ["user"],
  data() {
    return {
      loggedUser: this.user,
      products: {},
      pickups: {},
    };
  },
  created: function () {
    this.getPickups();
  },
  methods: {
    async getAll(endPoint, callback, params) {
      axios({
        method: "get",
        url: "http://192.168.1.41:3000/" + endPoint,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        params: params,
      }).then((response) => {
        callback(response.data.data);
      });
    },
    async getPickups() {
      let self = this;
      this.getAll("getPickups", function (res) {
        self.pickups = res;
      });
    },
    changePickup(e) {
      let selected = Array.from(e.target.children).find((x) => x.selected);
      if (selected.value) {
        let self = this;
        let params = {
          placeId: selected.value,
          date: selected.getAttribute("date"),
        };
        this.getAll(
          "getPickupProducts",
          function (res) {
            self.products = res;
          },
          params
        );
      }else{
          this.products = [];
      }
    },
  },
};
</script>

<style>
</style>