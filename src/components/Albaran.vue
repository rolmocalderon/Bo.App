<template>
	<div class="albaran">
		<div class="albaran-selector" v-if="!showProductList">
			<HeaderBar v-if="!showProductList" v-on:backSelected="goBack" :title="title" :modalType="modalType" v-on:showSnackbar="showSnackbar" :cities="cities"/>
			<ProductSelector v-on:dateChanged="onDateChanged" :selectorName="'pickups'" :cities="cities"></ProductSelector>
		</div>
		<div class="albaran-container" v-if="showProductList">
			<HeaderBar :title="selectedPickupName" :subtitle="selectedDate" :modalType="modalType" :selectedPickupId="selectedPickupId" v-on:productAdded="onProductAdded" v-on:backSelected="hideProductList"/>
			<div class="product-container">
				<Product v-for="(product) in products" :key="product.name" :product="product" :pickupId="selectedPickupId"/>
			</div>
		</div>

		<Snackbar v-if="canShowSnackbar" :canShowSnackbar="canShowSnackbar"/>
	</div>
</template>

<script>
import Product from "./Product";
import ProductSelector from "./ProductSelector";
import Snackbar from './Snackbar';
import HeaderBar from './HeaderBar';

export default {
	components: { Product, ProductSelector, HeaderBar, Snackbar },
	name: "Albaran",
	props: ["title"],
	created(){
		this.cities = this.getFromLocalStorage('cities');
		if(this.getFromLocalStorage('data') !== ''){
			this.selectedPickupId = sessionStorage.getItem('selectedPickup');
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
			showEditProductModal: false
		};
	},
	methods: {
		hideProductList(){
			this.showProductList = false;
			this.initLocalStorage();
			this.modalType = 'pickup';
		},
		onDateChanged(e){
			this.selectedPickupName = e.selectedPickup;
			this.selectedDate = e.date;
			this.selectedPickupId = e.id;
			sessionStorage.setItem('selectedPickup', e.id);
			this.getProducts();
		},
		getProducts(){
			var data = this.getFromLocalStorage('data');
			if(data === '' || !data[this.selectedPickupId]){
				let self = this;
				let params = { pickupId: this.selectedPickupId };
				this.getAll("getPickupProducts", function (res) {
					self.products = self.parseProducts(res);
					localStorage.data = JSON.stringify({ [self.selectedPickupId]:  {'products': self.products} });
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
					'measures': measures
				};
				parsedProducts.push(obj);
			}

			return parsedProducts;
		},
		groupBy(xs, key) {
			return xs.reduce(function(rv, x) {
				(rv[x[key]] = rv[x[key]] || []).push(x);
				return rv;
			}, {});
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