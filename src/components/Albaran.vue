<template>
  <div class="albaran">
    <ProductSelector :user="loggedUser" v-if="!showProductList" v-on:dateChanged="onDateChanged"></ProductSelector>
    <div class="albaran-container" v-if="showProductList">
      <div class="albaran-info-box">
        <div class="back-arrow-container" v-on:click="hideProductList">
          <font-awesome-icon icon="arrow-left"/>
        </div>
        <div class="albaran-info">
          <span>{{ selectedPickupName }}</span>
          <span>{{ selectedDate }}</span>
        </div>
        <div class="add-product-icon" v-if="products.length > 0" v-on:click="addProduct">
          <font-awesome-icon icon="cart-plus"/>
        </div>
      </div>
      <div class="product-container">
        <Modal v-if="showModal" @close="showModal = false" :modalType="'add'" v-on:productModified="onProductModified"/>
        <Product v-for="(product,index) in products" v-bind:key="product.name" :product="product" :icon="icons[index]" v-on:productSelected="onProductSelected"/>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Product from "./Product";
import ProductSelector from "./ProductSelector";
import Modal from './Modal';

export default {
  components: { Product, ProductSelector, Modal },
  name: "Albaran",
  props: ["user"],
  data() {
    return {
      loggedUser: this.user,
      products: [],
      showProductList: false,
      icons: [
        "apple-alt",
        "pump-soap",
        "cheese"
      ],
      showModal: false,
      selectedPickupId: "",
      selectedPickupName: '',
      selectedDate: ''
    };
  },
  methods: {
    async insert(endPoint, callback, params){
        axios({
            method: "post",
            url: process.env.VUE_APP_WEBAPI_URL + "/" + endPoint,
            data: params
        }).then((response) => {
            callback(response);
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
    addProduct(){
      this.showModal = true;
    },
    hideProductList(){
      this.showProductList = false;
    },
    onProductListShown(){
      this.showProductList = true;
    },
    onDateChanged(e){
      console.log("date changed", e);
      this.selectedPickupName = e.selectedPickup;
      this.selectedDate = e.date;
      this.selectedPickupId = e.id;
      this.getProducts(e.id)
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
    },
    onProductSelected(){
      this.showModal = true;
    },
    onProductModified(e){
      let params = {
        'data': this.serializeForm(e)
      };

      params.data.pickupId = this.selectedPickupId;
      let self = this;
      this.insert('editProduct', function(){ 
        //TODO: Mostrar de alguna forma que se ha insertado el producto
        self.getProducts(self.selectedPickupId);
        self.showModal = false; 
      }, params);
    },
    serializeForm (form) {
      var obj = {};
      var formData = new FormData(form);
      for (var key of formData.keys()) {
        obj[key] = formData.get(key);
      }
      return obj;
    }
  },
};
</script>

<style>
.albaran{
  display: flex;
  flex-direction: column;
  align-items: center;
}
.albaran-container{
  width: 100%;
}
.albaran-info-box{
  height: 3.5rem;
  background: #5d85c5;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
}
.albaran-info{
  display: flex;
  flex-direction: column;
  line-height: 23px;
  font-size: 1rem;
  font-weight: 700;
  flex: 1;
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
.add-product-icon{
  color: white;
  font-size: 1.8rem;
  margin-right: 1.2rem;
}
.back-button{
  margin-bottom: 1rem;
}
.back-arrow-container{
  margin-left: 1rem;
  font-size: 1.5rem;
  color: rgb(231 231 231);
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

</style>