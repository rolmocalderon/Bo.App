<template>
    <div class="configuration-container">
    <div class="configuration-content">
      <div class="configuration-header" v-on:click="$emit('showContent', 'pickup', $event)">
        <span>Recogidas</span>
        <font-awesome-icon icon="plus" class="right-icon" v-on:click="openModal" v-if="canShowContent"/>
      </div>
      <transition name="slide">
        <div class="configuration-values" v-if="canShowContent">
          <Dropdown v-if="canShowContent" :values="cities" :textMessage="'Selecciona una ciudad'" v-on:changeDropdown="onChangeCity"></Dropdown>
          <div class="config-item flex-container" v-for="pickup of pickups" :key="pickup.id" v-on:click="itemSelected(pickup)">
            <span class="item">{{ pickup.name }}</span>
          </div>
        </div>
      </transition>
    </div>
    <AddPickupModal v-if="showModal" :selectedCity="selectedCity" v-on:close="onClose" :selectedPickup="selectedPickup" :cities="cities"/>
  </div>
</template>

<script>
import AddPickupModal from '../../components/Modals/AddPickupModal';
import Dropdown from '../../components/Dropdown';

export default {
  name: 'config-response',
  components: { AddPickupModal, Dropdown },
  props: ['itemType', 'items', 'canShowContent'],
  data(){
    return {
      pickups: [],
      showModal: false,
      isSubmitActive: false,
      selectedPickup: {},
      modalHeaderMessage: '',
      cities: [],
      selectedCity: '',
      date: ''
    }
  },
  mounted(){
    this.cities = this.getFromLocalStorage('cities');
    this.selectedCity = {};
    this.pickups = [];
  },
  methods: {
    onSubmit(e){
      let pickup = e.target.querySelector("[name='pickup']").value;
      this.closeModal();
      this.insertPickup(pickup, this.selectedPickup.id);
    },
    itemSelected(pickup){
      this.selectedPickup = pickup;
      this.modalHeaderMessage = 'Modificar recogida';
      this.showModal = true;
    },
    openModal(){
      this.modalHeaderMessage = 'Añadir recogida';
      this.showModal = true;
    },
    closeModal(){
      this.showModal = false;
      this.selectedPickup = {}
    },
    getPickups(){
      let params = {cityId: this.selectedCity.valueId}
      this.getAll('getPickups', (function(res){
        this.pickups = res;
      }).bind(this), params);
    },
    insertPickup(name, id, avg){
      var params = { name, id, avg };
      this.insert('insertPickup', (function() { 
        this.getPickups();
      }).bind(this), params);
    },
    onChangeCity(city){
      this.selectedCity = city;
      this.getPickups();
    },
    onClose(){
      this.showModal = false;
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