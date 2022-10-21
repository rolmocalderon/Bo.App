<template>
	<div class="albaran">
		<div class="albaran-selector" v-if="!showProductList">
			<HeaderBar v-on:backSelected="goBack" :title="title" :modalType="'pickup'" v-on:showSnackbar="showSnackbar" :cities="cities"/>
			<ProductSelector v-on:dateChanged="onDateChanged" :selectorName="'pickups'"></ProductSelector>
		</div>
		<div class="albaran-container" v-if="showProductList">
			<HeaderBar :title="selectedPickupName" :subtitle="selectedDate" :modalType="'product'" :selectedPickupId="selectedPickupId" v-on:productAdded="onProductModified" v-on:backSelected="hideProductList"/>
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
		this.cities = this.getCities();
		if(this.getFromLocalStorage('data') !== ''){
			this.selectedPickupId = sessionStorage.getItem('selectedPickup');
			this.getProducts();
			this.showProductList = true;
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
			modalType: '',
			canShowSnackbar: false,
			showEditProductModal: false
		};
	},
	methods: {
		hideProductList(){
			this.showProductList = false;
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
				}, params);
			}else{
				this.products = data[this.selectedPickupId].products;
				this.showProductList = true;
			}
		},
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