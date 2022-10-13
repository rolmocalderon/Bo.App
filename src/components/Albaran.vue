<template>
	<div class="albaran">
		<div class="albaran-selector" v-if="!showProductList">
			<HeaderBar v-on:backSelected="goBack" :user="user" :title="title" :icon="'calendar-plus'" :iconSubtitle="'Añadir recogida'" :modalType="'pickup'" v-on:insertPickup="insertPickup"/>
			<ProductSelector :user="loggedUser" v-on:dateChanged="onDateChanged" :selectorName="'pickups'"></ProductSelector>
		</div>
		<div class="albaran-container" v-if="showProductList">
			<HeaderBar v-on:backSelected="hideProductList" :user="user" :title="selectedPickupName" :subtitle="selectedDate" :icon="'cart-plus'" :iconSubtitle="'Añadir Producto'" :modalType="'product'" :selectedPickupId="selectedPickupId" v-on:productAdded="getProducts" v-on:showSnackbar="showSnackbar"/>
			<div class="product-container">
				<Product v-for="(product,index) in products" :key="product.name" :product="product" :icon="icons[index]" v-on:productSelected="onProductSelected"/>
			</div>
		</div>

		<Snackbar v-if="canShowSnackbar" :canShowSnackbar="canShowSnackbar"/>
	</div>
</template>

<script>
import axios from "axios";
import Product from "./Product";
import ProductSelector from "./ProductSelector";
import Snackbar from './Snackbar';
import HeaderBar from './HeaderBar';

export default {
	components: { Product, ProductSelector, HeaderBar, Snackbar },
	name: "Albaran",
	props: ["user", "title"],
	created(){
		this.cities = this.getCities();
		document.addEventListener('asdf', function(event, data){
			console.log("data",data);
		});
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
			selectedPickupId: "",
			selectedPickupName: '',
			selectedDate: '',
			cities: [],
			selectedProduct: {},
			modalType: '',
			canShowSnackbar: false
		};
	},
	methods: {
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
			this.getProducts()
		},
		getProducts(){
			let self = this;
			let params = { pickupId: this.selectedPickupId };
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
		insertPickup(params){
			let self = this;
			let cityId = this.cityAlreadyExists(params.data.cityName);

			if(cityId == -1){
				this.insertCity(params);
			}
			else if(cityId != -1){
				params.data.cityId = cityId;
			}
			
			this.insert('insertPickup', function() { 
				self.showSnackbar();
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
		showSnackbar(){
			var self = this;
			self.canShowSnackbar = true;
			setTimeout(function(){
				//self.canShowSnackbar = false;
			}, 5000);
			
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