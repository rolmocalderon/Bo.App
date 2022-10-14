<template>
	<div class="albaran">
		<div class="albaran-selector" v-if="!showProductList">
			<HeaderBar v-on:backSelected="goBack" :user="user" :title="title" :modalType="'pickup'" v-on:showSnackbar="showSnackbar" :cities="cities"/>
			<ProductSelector v-on:dateChanged="onDateChanged" :selectorName="'pickups'"></ProductSelector>
		</div>
		<div class="albaran-container" v-if="showProductList">
			<HeaderBar :user="user" :title="selectedPickupName" :subtitle="selectedDate" :modalType="'product'" :selectedPickupId="selectedPickupId" v-on:productAdded="onProductModified" v-on:backSelected="hideProductList"/>
			<div class="product-container">
				<Product v-for="(product,index) in products" :key="product.name" :product="product" :icon="icons[index]" v-on:productSelected="onProductSelected"/>
			</div>
			<AddProductModal v-if="showEditProductModal" @close="showEditProductModal = false" :modalType="'edit'" :selectedProduct="selectedProduct" v-on:productModified="onProductModified($event,'editProduct')"/>
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
import AddProductModal from './Modals/AddProductModal';

export default {
	components: { Product, ProductSelector, HeaderBar, Snackbar, AddProductModal },
	name: "Albaran",
	props: ["user", "title"],
	created(){
		this.cities = this.getCities();
	},
	data() {
		return {
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
			canShowSnackbar: false,
			showEditProductModal: false
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
			this.showEditProductModal = true;
		},

		/*insertCity(params){
			let self = this;
			this.insert('insertCity', function(res){
				params.data.cityId = res.data.data.id;
				self.cities = self.getCities();
				self.$emit('setCities');
				self.insertPickup(params);
			}, params);
		},*/
		goBack(target = ''){
			this.$emit('navigation', target);
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
				self.canShowSnackbar = false;
			}, 5000);
		},
		onProductModified(e, endPoint){
			let params = {
				'data': this.serializeForm(e)
			};

			params.data.pickupId = this.selectedPickupId;
			let self = this;
			this.insert(endPoint, function(){ 
				self.showAddProductModal = false;
				self.showEditProductModal = false;
				self.showSnackbar();
				self.getProducts();
			}, params);
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
	text-align: center !important;
	font-size: 0.9rem;
}

.date-box span{
	padding-left: 1rem;
	color: #757575;
}

.product-container{
	display: flex;
	flex-direction: column;
}
</style>