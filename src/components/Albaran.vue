<template>
  <div class="albaran">
    <h2>Hello {{ loggedUser.name }}</h2>
    <div v-if="loggedUser.category == 'admin'">
      <div class="add-pickup">
            <div class="row almost-full-width">
                <button v-on:click="addPickup" class="background-blue form-input input-submit">Add pickup</button>
            </div>
        <div class="add-pickup-form" v-if="showPickupForm">
            <form action="#">
                <div class="row">
                    <label>PlaceName</label>
                    <input type="text" v-model="placeName" name="placeName" class="form-input">
                </div>
                <div class="row">
                    <label>Date</label>
                    <input type="date" v-model="date" name="date" class="form-input" pattern="\d{2}/\d{2}-\d{4}">
                </div>
                <div class="row">
                    <input type="submit" value="Add" class="form-input input-submit" v-on:click="submit">
                </div>
            </form>
        </div>
      </div>
      <div class="pickups">
        <select name="pickups" v-on:change="changePickup">
          <option value="">
            -- Select Option --
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
    </div>
    <div class="product-container">
        <div class="product" v-for="product in products" v-bind:key="product.name">
            <div>{{ product.amount }} paquetes de {{ product.productName }}</div>
            <div> {{ product.weight }} gramos</div>
        </div>
    </div>
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
      showPickupForm: false,
      placeName: "",
      date: ""
    };
  },
  created: function () {
    this.getPickups();
  },
  methods: {
    submit(event) {
        event.preventDefault();
        var self = this;
        if(this.placeName && this.date){
            var options = { year: 'numeric', month: 'numeric', day: 'numeric' };
            var formattedDate = new Date(this.date)
                .toLocaleDateString('es', options)
                .replace(/ /g,'/')
                .replace('.','')
                .replace(/-([a-z])/, function (x) {return '/' + x[1].toUpperCase()});

            var existingPickup = Array.from(this.pickups).find(pickup => pickup.name.toLowerCase() == this.placeName.toLowerCase() && pickup.date == formattedDate);
            if(!existingPickup){
                let params = {
                    'placeName': this.placeName,
                    'date': formattedDate
                }
                this.insert('insertPickup', function(){
                    self.showPickupForm = false;
                    self.getPickups();
                }, params);
            }else{
                console.log('Already exists');
            }
        }else{
            console.log("Missing data");
        }
    },
    async insert(endPoint, callback, params){
        axios({
            method: "post",
            url: "http://192.168.1.41:3000/" + endPoint,
             params: params,
        }).then((response) => {
            callback(response.data.data);
        })
    },
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
      console.log("selectedvalue", selected)
      if (selected.value) {
        let self = this;
        let params = {
          pickupId: selected.value
        };
        console.log("getall", params);
        this.getAll(
          "getPickupProducts",
          function (res) {
              console.log("responseProducts", res)
            self.products = res;
          },
          params
        );
      }else{
          this.products = [];
      }
    },
    addPickup(){
        this.showPickupForm = !this.showPickupForm;
    }
  },
};
</script>

<style>
.add-pickup-form{
    display: flex;
    flex-direction: column;
    align-items: center;
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
}
.row{
    height: 3.5rem;
    margin: 0.5rem;
    display: flex;
    flex-direction: column;
    width: 80%;
}
.almost-full-width{
    width: 96%;
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
</style>