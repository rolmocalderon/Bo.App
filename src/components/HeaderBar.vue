<template>
  <div class="info-box">
    <div class="back-arrow-container" v-on:click="backSelected">
      <font-awesome-icon icon="arrow-left" />
    </div>
    <div class="info">
      <span v-if="title != ''">{{ title }}</span>
      <span v-if="subtitle != ''">{{ subtitle }}</span>
    </div>
    <div class="add-product-icon" v-on:click="added" v-show="user.category === 'admin'">
      <font-awesome-icon :icon="icon" />
      <span>{{ iconSubtitle }}</span>
    </div>

    <AddPickupModal v-if="showAddPickupModal" @close="showAddPickupModal = false" v-on:pickupAdded="onPickupAdded" :cities="cities"/>
    <AddProductModal v-if="showAddProductModal" @close="showAddProductModal = false" :modalType="'add'" v-on:productAdded="onProductAdded($event,'insertProduct')"/>
  </div>
</template>

<script>
import AddProductModal from './Modals/AddProductModal';
import AddPickupModal from './Modals/AddPickupModal';

export default {
	name: 'header-bar',
	components: { AddPickupModal, AddProductModal },
	props: ['title', 'subtitle', 'user', 'modalType', 'selectedPickupId', 'cities'],
	created(){
		switch(this.modalType){
			case 'pickup':
				this.icon = "calendar-plus";
				this.iconSubtitle = "Añadir recogida";
				break;
			case 'product':
				this.icon = "cart-plus";
				this.iconSubtitle = "Añadir Producto";
				break;
		}
	},
	data(){
		return {
			showAddProductModal: false,
			showAddPickupModal: false,
			icon: "",
			iconSubtitle: ""
		}
    },
    methods: {
        backSelected(){
            this.$emit('backSelected');
        },
        added(){
            this.showAddPickupModal = this.modalType === 'pickup';
			this.showAddProductModal = this.modalType === 'product';
        },
		onProductAdded(e, endPoint){
			this.showAddProductModal = false;
			this.$emit('productAdded', e, endPoint);
		},
		onPickupAdded(){
			this.$emit('showSnackbar');
			this.showAddPickupModal = false;
		}
    }
};
</script>

<style scoped>
.info-box{
  height: 3.5rem;
  background: #5d85c5;
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