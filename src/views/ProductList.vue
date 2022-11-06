<template>
  <div>
    <HeaderBar :title="selectedPickup.name" :subtitle="selectedPickup.date" :modalType="modalType" v-on:productAdded="onProductAdded" v-on:backSelected="$emit('backSelected')"/>
    <Alert v-if="alertMessage !== ''" :message="alertMessage"/>
    <div class="product-container">
        <Product v-for="(product) in products.filter(p => p.issubproduct === 'false')" :key="product.name" :product="product" :pickupId="selectedPickup.id" :subproducts="getSubproducts(product)"/>
    </div>
  </div>
</template>

<script>
import Product from "../components/Product";
import HeaderBar from '../components/HeaderBar';
import Alert from '../components/alerts/Alert';

export default {
    name: 'product-list',
    components: { HeaderBar, Alert, Product },
    props: ['selectedPickup', 'modalType', 'products'],
    data(){
        return {
            alertMessage: ''
        }
    },
    methods: {
        onProductAdded(e){
			let form = this.serializeForm(e);
			let data = this.getFromLocalStorage("data");
			let products = data[this.selectedPickup.id].products;

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
                this.$emit('productAdded')
			}
		},
        getSubproducts(product){
			return this.products.filter(p => p.issubproduct === "true" && p.id === product.id);
		},
		getAlertMessage(){
			var self = this;
			this.getAll('getNeededProducts', function(res){
				var products = res.filter(p => p.amount > 0 && Number(p.amount) < Number(p.monthlyaverage))
				var message = products.length > 0 ? 'Productos urgentes: {0}, {1} y {2}' : '';
				for(var product of products){
					let index = products.indexOf(product);
					message = message.replace(`{${index}}`, product.name);
				}

				self.alertMessage = message;
			}, { 'cityId': this.selectedPickup.cityId });
		}
    },
    mounted() {
        this.getAlertMessage()
    }
}
</script>

<style>
.product-container{
	display: flex;
	flex-direction: column;
}
</style>