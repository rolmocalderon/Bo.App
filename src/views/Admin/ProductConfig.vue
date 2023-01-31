<template>
    <div class="configuration-container">
    <div class="configuration-content">
      <div class="configuration-header" v-on:click="$emit('showContent', 'product', $event)">
        <span>Productos</span>
        <font-awesome-icon icon="plus" class="right-icon" v-on:click="openModal" v-if="canShowContent"/>
      </div>
      <transition name="slide">
        <div class="configuration-values" v-if="canShowContent">
          <div class="config-item flex-container" v-for="(product, index) of products" :key="index" v-on:click="itemSelected(product)">
            <span class="item">{{ product.name }}</span>
            <span class="item">{{ getMeasure(product.measureid) }}</span>
            <div class="config-item-close" v-on:click="openCloseModal($event, product)">
              <font-awesome-icon icon="times" />
            </div>
          </div>
        </div>
      </transition>
    </div>
    <AddProductModal v-if="showModal" v-on:close="closeModal" v-on:productAdded="onSubmit" :selectedProduct="selectedProduct"/>
    <CloseModal v-if="showCloseModal" v-on:close="closeModal" v-on:delete="deleteProduct"/>
  </div>
</template>

<script>
import AddProductModal from '../../components/modals/AddProductModal';
import CloseModal from '../../components/modals/CloseModal';

export default {
  name: 'config-response',
  components: { AddProductModal, CloseModal },
  props: ['itemType', 'items', 'canShowContent'],
  data(){
    return {
      products: [],
      showModal: false,
      isSubmitActive: false,
      selectedProduct: {},
      showCloseModal: false
    }
  },
  mounted(){
    this.getProducts();
  },
  methods: {
    onSubmit(e){
      let form = this.serializeForm(e);
      this.insertProduct(form.productName, this.selectedProduct.id, form.measure);
      this.closeModal();
    },
    itemSelected(product){
      this.selectedProduct = product;
      this.showModal = true;
    },
    openModal(){
      this.showModal = true;
    },
    closeModal(){
      this.showModal = false;
      this.showCloseModal = false;
      this.selectedProduct = {}
    },
    getProducts(){
      this.getAll('products', (function(res){
        this.products = res;
      }).bind(this));
    },
    insertProduct(name, id, measureid){
      var params = { name, id, measureid };
      this.doPost('product', (function() { 
        this.getProducts();
      }).bind(this), params);
    },
    getMeasure(measureId){
      let measure = this.getMeasures().find(m => m.id === measureId);
      return measure ? measure.type : '';
    },
    getMeasures(){
      let measures = this.getFromLocalStorage('measures');
      this.currentTypeOfMeasure = measures[0].type;
      return measures;
    },
    openCloseModal(e, product){
      e.preventDefault();
      e.stopPropagation();
      this.showCloseModal = true;
      this.selectedProduct = product;
    },
    deleteProduct(){
      this.doDelete(`product/${this.selectedProduct.id}`, () => {
        this.getProducts();
        this.closeModal();
      }, {}, () => {
        this.closeModal();
      });
    }
  }
}
</script>

<style>

</style>