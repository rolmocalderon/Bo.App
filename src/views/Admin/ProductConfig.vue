<template>
    <div class="configuration-container">
    <div class="configuration-content">
      <div class="configuration-header" v-on:click="$emit('showContent', 'product', $event)">
        <span>Productos</span>
        <font-awesome-icon icon="plus" class="right-icon" v-on:click="openModal" v-if="canShowContent"/>
      </div>
      <transition name="slide">
        <div class="configuration-values" v-if="canShowContent">
          <div class="config-item flex-container" v-for="product of products" :key="product.id" v-on:click="itemSelected(product)">
            <span class="item">{{ product.name }}</span>
            <span class="item">{{ product.monthlyaverage }} Kg</span>
          </div>
        </div>
      </transition>
    </div>
    <Modal v-if="showModal" :headerMessage="modalHeaderMessage" :submitMessage="'Añadir'" :isSubmitActive="isSubmitActive" v-on:close="closeModal" v-on:submit="onSubmit">
      <input type="text" name="product" placeholder="Nombre del producto... " v-on:keyup="isSubmitActive = true" :value="selectedProduct.name">
      <input type="number" name="monthlyaverage" placeholder="Media mensual... " min="0" :value="selectedProduct.monthlyaverage">
    </Modal>
  </div>
</template>

<script>
import Modal from '../../components/Modal';

export default {
  name: 'config-response',
  components: { Modal },
  props: ['itemType', 'items', 'canShowContent'],
  data(){
    return {
      products: [],
      showModal: false,
      isSubmitActive: false,
      selectedProduct: {},
      modalHeaderMessage: ''
    }
  },
  mounted(){
    this.getProducts();
  },
  methods: {
    onSubmit(e){
      var product = e.target.querySelector("[name='product']").value;
      var avg = e.target.querySelector("[name='monthlyaverage']").value;
      this.closeModal();
      this.insertProduct(product, this.selectedProduct.id, avg);
    },
    itemSelected(product){
      this.selectedProduct = product;
      this.modalHeaderMessage = 'Modificar producto';
      this.showModal = true;
    },
    openModal(){
      this.modalHeaderMessage = 'Añadir producto';
      this.showModal = true;
    },
    closeModal(){
      this.showModal = false;
      this.selectedProduct = {}
    },
    getProducts(){
      this.getAll('getProducts', (function(res){
        this.products = res;
      }).bind(this));
    },
    insertProduct(name, id, avg){
      var params = { name, id, avg };
      this.insert('insertProduct', (function() { 
        this.getProducts();
      }).bind(this), params);
    }
  }
}
</script>

<style>

</style>