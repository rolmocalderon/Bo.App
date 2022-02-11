<template>
  <div class="albaran">
    <div class="albaran-selector" v-if="!showProductList">
      <HeaderBar v-on:backSelected="goBack" :user="user" :title="title" :subtitle="''" :icon="'calendar-plus'" v-on:added="showAddPickupModal = true" :iconSubtitle="'Añadir recogida'"/>
      <AddPickupModal v-if="showAddPickupModal" @close="showAddPickupModal = false" :modalType="'add'" v-on:productModified="onPickupAdded"/>
      <ProductSelector :user="loggedUser" v-on:dateChanged="onDateChanged" :selectorName="'pickups'"></ProductSelector>
    </div>
    <div class="albaran-container" v-if="showProductList">
      <HeaderBar v-on:backSelected="hideProductList" :user="user" :title="selectedPickupName" :subtitle="selectedDate" :icon="'cart-plus'" v-on:added="addProduct" :iconSubtitle="'Añadir Producto'"/>
      <AddProductModal v-if="showAddProductModal" @close="closeProductModal" :modalType="modalType" v-on:productModified="onProductModified($event,'editProduct')" :selectedProduct="selectedProduct" v-on:productAdded="onProductModified($event,'insertProduct')"/>
      <div class="product-container">
        <Product v-for="(product,index) in products" :key="product.name" :product="product" :icon="icons[index]" v-on:productSelected="onProductSelected"/>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Product from "./Product";
import ProductSelector from "./ProductSelector";
import AddProductModal from './Modals/AddProductModal';
import AddPickupModal from './Modals/AddPickupModal';
import HeaderBar from './HeaderBar';

export default {
  components: { Product, ProductSelector, AddProductModal, AddPickupModal, HeaderBar },
  name: "Albaran",
  props: ["user", "title"],
  created(){
    this.cities = this.getCities();
  },
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
      showAddProductModal: false,
      showAddPickupModal: false,
      selectedPickupId: "",
      selectedPickupName: '',
      selectedDate: '',
      cities: [],
      selectedProduct: {},
      modalType: ''
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
      this.modalType = 'add';
      this.showAddProductModal = true;
    },
    closeProductModal(){
      this.showAddProductModal = false;
      this.selectedProduct = {};
    },
    hideProductList(){
      this.showProductList = false;
    },
    onProductListShown(){
      this.showProductList = true;
    },
    onDateChanged(e){
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
    onProductSelected(product){
      this.modalType = 'edit';
      this.selectedProduct = product;
      this.showAddProductModal = true;
    },
    onProductModified(e, endPoint){
      let params = {
        'data': this.serializeForm(e)
      };

      params.data.pickupId = this.selectedPickupId;
      let self = this;
      this.insert(endPoint, function(){ 
        //TODO: Mostrar de alguna forma que se ha insertado el producto
        self.getProducts(self.selectedPickupId);
        console.log("productModified", self.selectedPickupId)
        self.closeProductModal();
        console.log(self.showAddProductModal)
      }, params);
    },
    serializeForm (form) {
      var obj = {};
      var formData = new FormData(form);
      for (var key of formData.keys()) {
        obj[key] = formData.get(key);
      }
      return obj;
    },
    onPickupAdded(e){
      let params = {
        'data': this.serializeForm(e),
      };
      let cityId = this.cityAlreadyExists(params.data.cityName);

      if(cityId == -1){
        this.insertCity(params);
      }
      else if(cityId != -1){
        params.data.cityId = cityId;
        this.insertPickup(params);
      }

      this.showAddPickupModal = false;
    },
    insertPickup(params){
      this.insert('insertPickup', function(){ 
        //TODO: Mostrar de alguna forma que se ha insertado el producto
      }, params);
    },
    insertCity(params){
      let self = this;
      this.insert('insertCity', function(res){
        params.data.cityId = res.data.data.id;
        self.cities = self.getCities();
        self.$emit('setCities');
        self.insertPickup(params);
      }, params);
    },
    goBack(target = ''){
      this.$emit('navigation', target);
    },
    cityAlreadyExists(cityName){
      let city = this.cities.find(x => x.name === cityName);
      return city ? city.id : -1;
    },
    getCities(){
      let self = this;
      this.getAll("getCities", function(res){
        self.cities = res;
      });
    },
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
.albaran-selector{
  width: 100%;
  display: flex;
  flex-direction: column;
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
.back-arrow-container{
  margin-left: 1rem;
  font-size: 1.5rem;
  color: rgb(231 231 231);
}
.date-box{
  width: 100%;
  padding: 15px 0px;
  background: white;
  box-shadow: 0 0 5px rgb(0 0 0 / 50%);
  cursor: pointer;
}

.date-box span{
  padding-left: 1rem;
  color: #757575;
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