<template>
  <div class="albaran">
    <div v-if="loggedUser.category == 'admin'">
      <add-pickup></add-pickup>
    </div>
    <div class="cities">
        <select name="cities" v-on:change="changePickup" class="dropdown">
            <option value="">-- Selecciona una ciudad --</option>
            <option value="1">Barcelona</option>
            <option value="2">Madrid</option>
        </select>
    </div>
    <div class="pickups">
        <select name="pickups" v-on:change="changePickup" class="dropdown">
          <option value="">
            -- Selecciona una opción --
          </option>
          <option
            v-for="pickup in pickups"
            v-bind:key="pickup.id"
            :value="pickup.id"
            v-bind:date="pickup.date"
          >
            {{ pickup.name }} {{ pickup.date }}
          </option>
        </select>
      </div>
    <div class="product-container">
        <div v-if="products.length > 0" class="add-product">
            <div class="row almost-full-width">
                <button v-on:click="addProduct" class="background-blue form-input input-submit">Añadir product</button>
            </div>
        </div>
        <div class="product" v-for="product in products" v-bind:key="product.name">
            <div>{{ product.amount }} paquetes de {{ product.productName }}</div>
            <div> {{ product.weight }} gramos</div>
        </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import AddPickup from "./AddPickup";

export default {
  components: { AddPickup },
  name: "Albaran",
  props: ["user"],
  data() {
    return {
      loggedUser: this.user,
      products: {},
      pickups: {},
      showPickupForm: false,
      selectedPickup: null
    };
  },
  created: function () {
    this.getPickups();
  },
  methods: {
    async insert(endPoint, callback, params){
        axios({
            method: "post",
            url: "http://192.168.1.38:3000/" + endPoint,
             params: params,
        }).then((response) => {
            callback(response.data.data);
        })
    },
    async getAll(endPoint, callback, params) {
      axios({
        method: "get",
        url: "http://192.168.1.38:3000/" + endPoint,
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
      this.selectedPickup = Array.from(e.target.children).find((x) => x.selected);
      if (this.selectedPickup.value) {
        let self = this;
        let params = {
          pickupId: this.selectedPickup.value
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
    }
  },
};
</script>

<style>
.add-pickup{
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    transition: 300ms ease-out;
    margin-bottom: 1rem;
}
.add-pickup-form{
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 70%;
}
.add-pickup-form form{
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
}
.row .form-input {
    height: 100%;
    width: auto;
    outline: none;
    border-radius: 5px;
    border: 1px solid lightgrey;
    font-size: 16px;
    transition: all 0.3s ease;
    padding-left: 0.5rem;
}
.row .form-input:focus{
    border-color: #4386c9;
    box-shadow: inset 0px 0px 2px 2px rgba(26, 188, 156, 0.25);
}
.row .input-submit{
    color: #fff;
    font-size: 20px;
    font-weight: 500;
    padding-left: 0px;
    background: #009f25;
    border: 1px solid #009f25;
    cursor: pointer;
    height: 80%;
    padding: 0.6rem;
}
.row{
    display: flex;
    flex-direction: column;
    width: 100%;
}
.almost-full-width{
    width: 90%;
}
.product-container{
    display: flex;
    flex-direction: column;
    margin: 0.5rem;
}

.product-container .product{
    width: 100%;
    display: flex;
    border-bottom: 1px solid rgba(0,0,0,0.4);
    padding: 1.2rem;
    flex-direction: column;
    align-items: flex-start;
}

.product-property{
    flex: 1;
    padding: 1.2rem;
}

.product-types{
    display: flex;
    flex-direction: row;
}
.dropdown{
    width: 90%;
    height: 2.75rem;
    border-radius: 5px;
}
.add-product{
    display: flex;
    align-items: center;
    justify-content: center;
}
.add-pickup-form-container{
    width: 90%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f1f1c4;
    padding: 1rem 0 1rem 0;

}
</style>