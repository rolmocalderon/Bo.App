<template>
  <div class="albaran">
    <ProductSelector :user="loggedUser" v-if="!showProductList" v-on:dateChanged="onDateChanged"></ProductSelector>
    <div class="almost-full-width" v-if="showProductList">
      <div class="buttons-container">
        <div class="back-button" v-on:click="hideProductList">
          <Button :value="'Atras'"/>
        </div>
        <div v-if="products.length > 0" class="add-product">
              <div class="row">
                  <button v-on:click="addProduct" class="background-blue form-input input-submit">Añadir producto</button>
              </div>
        </div>
      </div>
      <div class="product-container">
        <Product v-for="(product,index) in products" v-bind:key="product.name" :product="product" :icon="icons[index]"/>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Product from "./Product";
import ProductSelector from "./ProductSelector";
import Button from './Button';

export default {
  components: { Product, ProductSelector, Button },
  name: "Albaran",
  props: ["user"],
  data() {
    return {
      loggedUser: this.user,
      products: [],
      showProductList: false,
      icons: [
        "apple-alt",
        "pump-soap"
      ]
    };
  },
  methods: {
    async insert(endPoint, callback, params){
        axios({
            method: "post",
            url: process.env.VUE_APP_WEBAPI_URL + "/" + endPoint,
             params: params,
        }).then((response) => {
            callback(response.data.data);
        })
    },
    async getAll(endPoint, callback, params) {
      axios({
        method: "get",
        url: process.env.VUE_APP_WEBAPI_URL + "/" + endPoint,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        params: params,
      }).then((response) => {
        callback(response.data.data);
      });
    },
    created(){
      
    },
    addProduct(){
      console.log('productAdded')
    },
    hideProductList(){
      this.showProductList = false;
    },
    onProductListShown(){
      this.showProductList = true;
    },
    onDateChanged(id){
      console.log(this.getProducts(id));
    },
    getProducts(id){
      let self = this;
      let params = {
        pickupId: id
      };
      this.getAll("getPickupProducts", function (res) {
        self.products = res;
        self.onProductListShown();
      }, params);
    }
  },
};
</script>

<style>
.albaran{
  display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
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
.back-button{
  margin-bottom: 1rem;
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

.product-property{
    flex: 1;
    padding: 1.2rem;
}

.product-types{
    display: flex;
    flex-direction: row;
}
.dropdown{
  width: 100%;
  border-radius: 5px;
  margin-bottom: 10px;
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
.date-box{
  width: 100%;
  border-radius: 5px;
  padding: 15px 0px;
  background: white;
  text-align: left;
  border: 2px solid black;
  cursor: pointer;
  z-index: 100;
}

.date-box span{
  padding-left: 1rem;
}
.buttons-container{
  margin: 0.5rem;
}
</style>