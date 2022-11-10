<template>
    <div class="configuration-container">
    <div class="configuration-content">
      <div class="configuration-header" v-on:click="$emit('showContent', 'urgentProduct', $event)">
        <span>Productos Urgentes</span>
        <font-awesome-icon icon="plus" class="right-icon" v-if="canShowContent"/>
      </div>
      <transition name="slide">
        <div class="configuration-values" v-if="canShowContent">
          <Dropdown :values="cities" :textMessage="'Selecciona una ciudad'" v-on:changeDropdown="onChangeCity"></Dropdown>
          <div class="config-item flex-container" v-for="product of products" :key="product.id">
            <span class="item">{{ product.name }}</span>
            <span class="item">{{ product.monthlyaverage }} Kg</span>
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
      selectedCityId: {},
      cities: []
    }
  },
  mounted(){
    this.cities = this.getFromLocalStorage('cities');
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
.item:first-child{
  flex: 2;
}
.item-selectable{
  height: 1.2rem;
  width: 1.2rem;
}
</style>