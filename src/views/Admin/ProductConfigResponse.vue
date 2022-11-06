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
            <span class="item">1</span>
            <font-awesome-icon icon="edit" class="right-icon"/>
          </div>
        </div>
      </transition>
    </div>
    <Modal v-if="showModal" :headerMessage="modalHeaderMessage" :submitMessage="'Añadir'" :isSubmitActive="isSubmitActive" v-on:close="closeModal" v-on:submit="onSubmit">
      <input type="text" name="product" placeholder="Nombre del producto... " v-on:input="isSubmitActive = true" :value="selectedProduct.name">
      <input type="text" name="monthlyaverage" placeholder="Media mensual... " v-on:input="isSubmitActive = true" :value="selectedProduct.monthlyaverage">
      <input type="text" name="priority" placeholder="Prioridad... " v-on:input="isSubmitActive = true">
      <label class="checkbox-inline">Es producto urgente: <input type="checkbox" name="terms" /></label>
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
    this.getAll('getProducts', (function(res){
      this.products = res;
    }).bind(this));
  },
  methods: {
    onSubmit(e){
      var product = e.target.querySelector('input').value;
      var params = {
        'name': product,
        'id': this.selectedProduct.id
      };

      console.log(params);
      this.closeModal();
      /*this.insert('insertCity', (function() { 
        this.getCities((function(){
          this.cities = this.getFromLocalStorage('cities')
        }).bind(this));
      }).bind(this), params);*/
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
    }
  }
}
</script>

<style>
.configuration-container{
  width: 100%;
  margin-top: 1rem;
}
.configuration-content{
  width: 90%;
}
.configuration-header{
  padding: 1rem;
  background-color: #4065AD;
  color: white;
  border-radius: 4px 4px 0 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: relative;
  font-size: 1rem;
  font-weight: 700;
}
.configuration-values{
  display: flex;
  flex-direction: column;
}
.config-item{
  padding: 1rem;
  background-color: white;
  border-bottom: 1px solid rgba(0,0,0,0.1);
  position: relative;
}
.config-item:last-child{
  border-radius: 0 0 4px 4px;
  margin-bottom: 1rem;
}
.configuration-header > .right-icon{
  position: absolute;
  right: 1rem;
  font-size: 1.5rem;
}

.config-item > .right-icon{
  position: absolute;
  right: 1rem;
  font-size: 1.2rem;
}
.checkbox-inline{
  position: relative;
  display: inline-block;
  padding-left: 20px;
  margin-bottom: 0;
  font-weight: 400;
  vertical-align: middle;
  cursor: pointer;
}
.item{
  flex: 1;
}
</style>