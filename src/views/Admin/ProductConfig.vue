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
          </div>
        </div>
      </transition>
    </div>
    <AddProductModal v-if="showModal" v-on:close="closeModal" v-on:productAdded="onSubmit" :selectedProduct="selectedProduct"/>
  </div>
</template>

<script>
import AddProductModal from '../../components/modals/AddProductModal';

export default {
  name: 'config-response',
  components: { AddProductModal },
  props: ['itemType', 'items', 'canShowContent'],
  data(){
    return {
      products: [],
      showModal: false,
      isSubmitActive: false,
      selectedProduct: {}
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
      this.selectedProduct = {}
    },
    getProducts(){
      this.getAll('getProducts', (function(res){
        this.products = res;
      }).bind(this));
    },
    insertProduct(name, id, measureid){
      var params = { name, id, measureid };
      this.insert('insertProduct', (function() { 
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
    }
  }
}
</script>

<style>

</style>