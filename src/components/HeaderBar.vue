<template>
	<div class="info-box">
		<div class="back-arrow-container" v-on:click="backSelected">
			<font-awesome-icon icon="arrow-left" />
		</div>
		<div class="info">
			<span v-if="title != ''">{{ title }}</span>
			<span v-if="subtitle != ''" class="subtitle">{{ subtitle }}</span>
		</div>
		<div v-if="modalType" class="add-product-icon" v-on:click="added">
			<font-awesome-icon icon="calendar-plus" />
			<span>{{ getSubtitle }}</span>
		</div>

		<AddProductModal v-if="showAddProductModal" @close="showAddProductModal = false" v-on:productAdded="onProductAdded($event)"/>
	</div>
</template>

<script>
import AddProductModal from './Modals/AddProductModal';

export default {
	name: 'header-bar',
	components: { AddProductModal },
	props: ['title', 'subtitle', 'modalType'],
	data(){
		return {
			showAddProductModal: false
		}
    },
    methods: {
        backSelected(){
            this.$emit('backSelected');
        },
        added(){
			this.showAddProductModal = this.modalType === 'product';
        },
		onProductAdded(e){
			this.showAddProductModal = false;
			this.$emit('productAdded', e);
		}
    },
	computed:{
		getSubtitle(){
			return this.modalType === 'pickup' ? "Añadir recogida" : "Añadir Producto";
		}	
	}
};
</script>

<style scoped>
.info-box{
	height: 3.5rem;
	background: #4065AD;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
}
.info{
	display: flex;
	flex-direction: column;
	line-height: 23px;
	font-size: 1.2rem;
	font-weight: 400;
	flex: 1;
	margin-left: 2rem;
	color: white;
}
.info > .subtitle{
	font-size: 0.9rem;
}
.add-product-icon{
	display: flex;
	flex-direction: column;
	align-items: center;
	color: white;
	font-size: 1.6rem;
	margin-right: 1.2rem;
}
.add-product-icon  span{
	font-size: 0.7rem;
	margin-top: 2px;
}
</style>