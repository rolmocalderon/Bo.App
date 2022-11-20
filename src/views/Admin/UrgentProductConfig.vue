<template>
    <div class="configuration-container">
    <div class="configuration-content">
      <div class="configuration-header" v-on:click="$emit('showContent', 'urgentProduct', $event)">
        <span>Productos Urgentes</span>
      </div>
      <transition name="slide">
        <div class="configuration-values" v-if="canShowContent">
          <Dropdown v-if="canShowContent && defaultCity === ''" :values="cities" :textMessage="'Selecciona una ciudad'" v-on:changeDropdown="onChangeCity"></Dropdown>
          <div class="config-item flex-container" v-for="product of products" :key="product.id">
            <span class="item">{{ product.name }}</span>
            <label class="checkbox-inline">
              <input type="checkbox" name="urgent" class="item-selectable" v-on:click="setUrgent($event,product)" :checked="product.isurgent == 1"/>
            </label>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import Dropdown from '../../components/Dropdown';
import cookies from "../../services/cookies";

export default {
  name: 'config-response',
  components: { Dropdown },
  props: ['itemType', 'items', 'canShowContent'],
  data(){
    return {
      products: [],
      showModal: false,
      isSubmitActive: false,
      selectedProduct: {},
      modalHeaderMessage: '',
      selectedCityId: '',
      cities: [],
      defaultCity: ''
    }
  },
  mounted(){
    this.cities = this.getFromLocalStorage('cities');
    this.selectedCityId = '';
    this.products = [];
    this.user = cookies.getCookie("user");
    if(this.user.cityid && this.user.cityid !== ''){
      this.defaultCity = this.cities.find(c => c.id === this.user.cityid);
      this.selectedCityId = this.defaultCity.id;
      this.getProducts();
    }
  },
  methods: {
    onChangeCity(city){
      this.selectedCityId = city.valueId;
      this.getProducts();
    },
    getProducts(){
      this.getAll('getUrgentProducts', (function(res){
        this.products = res;
      }).bind(this),{cityId: this.selectedCityId});
    },
    setUrgent(e, product){
      e.stopPropagation();
      let items = Array.from(document.querySelectorAll('.item-selectable'))
      let isUpdate = false;
      if(items.filter(i => i.checked).length <= 3){
        isUpdate = true;
      }else {
        e.target.checked = false;
      }

      if(isUpdate){
        this.insert('updateUrgentProduct', (function() { 
          this.getProducts();
        }).bind(this), { cityId: this.selectedCityId, productId: product.id, isAdd: e.target.checked });
      }
    }
  },
  watch: {
    canShowContent(val) {
      if(!val){
        this.products = [];
        this.selectedCityId = '';
      }
    }
  }
}
</script>

<style>

</style>