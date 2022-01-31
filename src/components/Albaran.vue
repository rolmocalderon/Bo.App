<template>
  <div class="albaran">
    <div v-if="loggedUser.category == 'admin'">
      <add-pickup></add-pickup>
    </div>
    <div class="cities">
        <dropdown dropdownName="cities" v-on:changeDropdown="onChangeCity" :values="cities"></dropdown>
    </div>
    <div class="pickups">
      <dropdown dropdownName="pickups" v-on:changeDropdown="onChangePickup" :values="pickups"></dropdown>
    </div>
    <div class="dates">
      <Calendar/>
      <dropdown dropdownName="dates" v-on:changeDropdown="onChangeDate" :values="dates"></dropdown>
    </div>
    <div class="product-container">
        <div v-if="products.length > 0" class="add-product">
            <div class="row almost-full-width">
                <button v-on:click="addProduct" class="background-blue form-input input-submit">Añadir product</button>
            </div>
        </div>
        <Product v-for="product in products" v-bind:key="product.name" :product="product"/>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import AddPickup from "./AddPickup";
import Dropdown from "./Dropdown";
import Product from "./Product";
import Calendar from "./Calendar";

export default {
  components: { AddPickup, Dropdown, Product, Calendar },
  name: "Albaran",
  props: ["user"],
  data() {
    return {
      loggedUser: this.user,
      products: [],
      dates: [],
      pickups: [],
      showPickupForm: false,
      selectedPickup: null,
      cities: []
    };
  },
  created: function () {
    this.getCities();
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
    async getCities(){
      let self = this;
      this.getAll("getCities", function(res){
        self.cities = res;
      });
    },
    async getPickups(cityId) {
      let self = this;
      let params = {
        cityId : cityId
      };
      this.getAll("getPickups", function (res) {
        self.pickups = res;
      }, params);
    },
    onChangePickup(e) {
      this.selectedPickup = Array.from(e.target.children).find((x) => x.selected);
      console.log(this.selectedPickup.value, "selected");
      if (this.selectedPickup.value != '') {
        let self = this;
        let params = {
          pickupName: this.selectedPickup.textContent
        };

        this.getAll(
          "getPickupDates",
          function (res) {
            console.log("date response", res);
            self.dates = res;
          },
          params
        );
      }else{
          this.dates = [];
          this.products = [];
      }
    },
    addProduct(){
      console.log('productAdded')
    },
    onChangeCity(e){
      let selectedCity = Array.from(e.target.children).find(x => x.selected);
      this.products = [];
      if (selectedCity.value) {
        this.getPickups(selectedCity.value);
      }else{
        this.pickups = [];
      }
    },
    onChangeDate(e){
      console.log("change date", e);
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
    box-shadow: 0px 2px 6px black;
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
    background: #ffce5f;
    padding: 1rem 0 1rem 0;

}
</style>