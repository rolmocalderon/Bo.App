<template>
	<div class="albaran">
		<div class="albaran-selector" v-if="!showProductList">
			<HeaderBar v-if="!showProductList" v-on:backSelected="goBack" :title="title" :modalType="modalType" v-on:showSnackbar="showSnackbar" :cities="cities"/>
			<ProductSelector v-on:dateChanged="onDateChanged" :selectorName="'pickups'" :cities="cities"></ProductSelector>
		</div>
		<div class="albaran-container" v-if="showProductList">
			<HeaderBar :title="selectedPickupName" :subtitle="selectedDate" :modalType="modalType" :selectedPickupId="selectedPickupId" v-on:productAdded="onProductAdded" v-on:backSelected="hideProductList"/>
			<Alert :message="alertMessage"/>
			<div class="product-container">
				<Product v-for="(product) in products.filter(p => p.issubproduct === 'false')" :key="product.name" :product="product" :pickupId="selectedPickupId" :subproducts="getSubproducts(product)"/>
			</div>
		</div>

		<Snackbar v-if="canShowSnackbar" :canShowSnackbar="canShowSnackbar"/>
	</div>
</template>

<script>
import Product from "../components/Product";
import ProductSelector from "./ProductSelector";
import Snackbar from '../components/Snackbar';
import HeaderBar from '../components/HeaderBar';
import Alert from '../components/alerts/Alert';

export default {
	components: { Product, ProductSelector, HeaderBar, Snackbar, Alert },
	name: "Albaran",
	props: ["title"],
	created(){
		this.cities = this.getFromLocalStorage('cities');
		if(this.getFromLocalStorage('data') !== ''){
			this.setCurrentPickup(this.getFromLocalStorage('selectedPickup'));
			this.getProducts();
			this.showProductList = true;
			this.modalType = 'product';
		}
	},
	data() {
		return {
			products: [],
			showProductList: false,
			selectedPickupId: "",
			selectedPickupName: '',
			selectedDate: '',
			cities: [],
			modalType: 'pickup',
			canShowSnackbar: false,
			showEditProductModal: false,
			alertMessage: ''
		};
	},
	methods: {
		hideProductList(){
			this.showProductList = false;
			//this.initLocalStorage();
			this.modalType = 'pickup';
		},
		onDateChanged(e){
			this.setCurrentPickup(e);
			this.updateLocalStorage('selectedPickup', e);
			this.getProducts();
		},
		setCurrentPickup(e){
			this.selectedPickupName = e.selectedPickup;
			this.selectedDate = e.date;
			this.selectedPickupId = e.id;
			this.getAlertMessage(e.cityId)
		},
		getProducts(){
			var data = this.getFromLocalStorage('data');
			if(data === '' || !data[this.selectedPickupId]){
				let self = this;
				let params = { pickupId: this.selectedPickupId };
				this.getAll("getPickupProducts", function (res) {
					self.products = self.parseProducts(res);
					if(data.length > 0){
						data[self.selectedPickupId] = {'products': self.products};
					}else{
						data = { [self.selectedPickupId]:  {'products': self.products} }
					}
					
					self.updateLocalStorage('data', data);
					self.showProductList = true;
					self.modalType = 'product';
				}, params);
			}else{
				this.products = data[this.selectedPickupId].products;
				this.showProductList = true;
				this.modalType = 'product';
			}
		},
		goBack(target = ''){
			this.$emit('navigation', target);
		},
		showSnackbar(){
			var self = this;
			self.canShowSnackbar = true;
			setTimeout(function(){
				self.canShowSnackbar = false;
			}, 5000);
		},
		onProductAdded(e){
			let form = this.serializeForm(e);
			let data = this.getFromLocalStorage("data");
			let products = data[this.selectedPickupId].products;

			if(!products.find(p => p.name.toLowerCase() === form.productName.toLowerCase())){
				let newProduct = {
					id: Math.max(...products.map(p => p.id)) + 1,
					name: form.productName,
					measures: [
						{
							id: form.measure,
							type: form.measuretype,
							amount: form.productAmount
						}
					]
				}
				products.push(newProduct);
				this.updateLocalStorage("data", data);
				this.showSnackbar();
				this.getProducts();
			}
		},
		parseProducts(products){
			var parsedProducts = [];
			products = this.groupBy(products,'name');
			for(let key in products){
				let product = products[key];
				let measures = [];
				product.forEach(p => measures.push({'id': p.measureid, 'type': p.type, 'amount': p.amount}))
				let obj = {
					'id': product[0].id,
					'name': key,
					'subproductid': product[0].subproductid,
					'measures': measures,
					'issubproduct': product[0].issubproduct
				};
				parsedProducts.push(obj);
			}

			return parsedProducts;
		},
		getSubproducts(product){
			return this.products.filter(p => p.issubproduct === "true" && p.id === product.id);
		},
		getAlertMessage(cityId){
			var self = this;
			this.getAll('getNeededProducts', function(res){
				var products = res.filter(p => p.amount > 0 && p.amount < p.monthlyaverage)
				var message = 'Productos urgentes: {0}, {1} y {2}';
				for(var product of products){
					let index = products.indexOf(product);
					message = message.replace(`{${index}}`, product.name);
				}

				self.alertMessage = message;
			}, { cityId });
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