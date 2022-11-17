<template>
	<div class="albaran">
		<div class="albaran-selector" v-if="!showProductList">
			<HeaderBar v-if="!showProductList" v-on:backSelected="goBack" :title="title" v-on:showSnackbar="showSnackbar"/>
			<PickupSelector v-on:pickupSelected="onPickupSelected" :cities="cities"/>
		</div>
		<ProductList class="albaran-container" v-if="showProductList" :selectedPickup="selectedPickup" :modalType="modalType" :products="products" v-on:backSelected="hideProductList"/>
		<Snackbar v-if="canShowSnackbar" :canShowSnackbar="canShowSnackbar"/>
	</div>
</template>

<script>
import PickupSelector from "./PickupSelector";
import Snackbar from '../components/Snackbar';
import HeaderBar from '../components/HeaderBar';
import ProductList from './ProductList';

export default {
	components: { PickupSelector, HeaderBar, Snackbar, ProductList },
	name: "Albaran",
	props: ["title"],
	created(){
		this.cities = this.getFromLocalStorage('cities');
		if(this.navigation.page.includes("productList")){
			this.setCurrentPickup(this.navigation.params.selectedPickup);
			this.getProducts();
			this.showProductList = true;
			this.modalType = 'product';
		}
	},
	data() {
		return {
			products: [],
			showProductList: false,
			selectedDate: '',
			cities: [],
			modalType: 'pickup',
			canShowSnackbar: false,
			selectedPickup: {}
		};
	},
	methods: {
		hideProductList(){
			this.showProductList = false;
			this.navigate('pickups');
			this.modalType = 'pickup';
		},
		onPickupSelected(e){
			console.log(e)
			this.setCurrentPickup(e);
			this.updateLocalStorage('selectedPickup', e);
			this.getProducts();
		},
		setCurrentPickup(e){
			this.selectedPickup = e;
		},
		getProducts(){
			var data = this.getFromLocalStorage('data');
			if(data === '' || !data[this.selectedPickup.id]){
				let self = this;
				let params = { pickupId: this.selectedPickup.id };
				this.getAll("getPickupProducts", function (res) {
					self.products = self.parseProducts(res);
					if(data.length > 0){
						data[self.selectedPickup.id] = {'products': self.products};
					}else{
						data = { [self.selectedPickup.id]:  {'products': self.products} }
					}
					
					self.updateLocalStorage('data', data);
					self.showProductList = true;
					self.navigate('pickups-productList', {selectedPickup: self.selectedPickup});
					self.modalType = 'product';
				}, params);
			}else{
				this.products = data[this.selectedPickup.id].products;
				this.showProductList = true;
				this.navigate('pickups-productList', {selectedPickup: this.selectedPickup});
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
		onProductAdded(){
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
					'subproductid': product[0].subproductid,
					'measures': measures,
					'issubproduct': product[0].issubproduct
				};
				parsedProducts.push(obj);
			}

			return parsedProducts;
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
	color: #06346f;
    font-weight: 700;
}
</style>