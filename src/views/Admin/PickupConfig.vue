<template>
  <div class="pickup-selector-container almost-full-width">
    <div class="configuration-container flex-container">
      <div class="configuration-content">
        <div class="configuration-header" v-on:click="$emit('showContent', 'pickup', $event)">
          <span>Recogidas</span>
          <font-awesome-icon icon="plus" class="right-icon" v-on:click="openModal" v-if="canShowContent"/>
        </div>
        <transition name="slide">
          <div class="configuration-values" v-if="canShowContent">
            <Dropdown v-if="defaultCity === ''" v-on:changeDropdown="onChangeCity" v-on:dropDownShown="changeDropdownStatus" :values="cities" :textMessage="'Selecciona una ciudad'" :isDropdownContentShown="isDropdownContentShown"></Dropdown>
            <Calendar v-on:changeDate="onChangeDate" class="pickup-selector-calendar"/>
            <div class="pickup-config config-item flex-container" v-for="pickup of pickups" :key="pickup.id" v-on:click="itemSelected(pickup)">
              <span class="item">{{ pickup.name }}</span>
              <span class="item" v-if="date === ''">{{ pickup.date }}</span>
              <div class="config-item-close" v-on:click="openCloseModal($event, pickup)" v-if="getUser().category === 'Admin'">
                <font-awesome-icon icon="times" />
              </div>
            </div>
            <div class="flex-container non-values" v-if="pickups.length === 0">
              <span>No hay valores para mostrar</span>
            </div>
          </div>
        </transition>
      </div>
    </div>
    <AddPickupModal v-if="showModal" :city="selectedCity" v-on:close="onClose" :selectedPickup="selectedPickup || {}" :cities="cities" :defaultCity="defaultCity" v-on:pickupAdded="onPickupAdded"/>
    <CloseModal v-if="showCloseModal" v-on:close="closeModal" v-on:delete="deletePickup"/>
    <Snackbar :canShow="canShowSnackbar" :isError="isSnackbarError" :isDeleting="isDeletingSnackbar"/>
  </div>
</template>

<script>
import AddPickupModal from '../../components/modals/AddPickupModal';
import Calendar from '../../components/Calendar';
import Dropdown from '../../components/Dropdown';
import * as moment from 'moment';
import cookies from "../../services/cookies";
import Snackbar from '../../components/Snackbar';
import CloseModal from '../../components/modals/CloseModal';

export default {
  name: 'config-response',
  components: { AddPickupModal, Dropdown, Calendar, Snackbar, CloseModal },
  props: ['itemType', 'items', 'canShowContent'],
  data(){
    return {
      pickups: [],
      showModal: false,
      selectedPickup: {},
      cities: [],
      selectedCity: '',
      isDropdownContentShown: false,
      date: "",
      city: '',
      defaultCity: '',
      showCloseModal: false
    }
  },
  mounted(){
    this.cities = this.getFromLocalStorage('cities');
    this.pickups = [];
    this.user = cookies.getCookie("user");
    if(this.user.cityid && this.user.cityid !== ''){
      this.defaultCity = this.cities.find(c => c.id === this.user.cityid);
    }
  },
  methods: {
    itemSelected(pickup){
      this.selectedPickup = pickup;
      this.showModal = true;
    },
    openModal(){
      this.selectedCity = '';
      this.selectedPickup = '';
      this.showModal = true;
    },
    closeModal(){
      this.showModal = false;
      this.showCloseModal = false;
      this.selectedPickup = {};
    },
    getPickups(){
      let paramCity = this.defaultCity !== '' ? this.defaultCity : this.city;
      if(paramCity !== ''){
        let params = {cityId: paramCity.id, date: this.date}
        this.getAll('pickups', (res) => {
          this.pickups = res;
        }, params);
      }
    },
    onChangeCity(city){
      this.selectedCity = city;
      this.city = this.selectedCity;
      this.getPickups();
    },
    onClose(){
      this.showModal = false;
      this.selectedCity = this.city;
    },
    changeDropdownStatus(value){
      this.isDropdownContentShown = value;
    },
    onChangeDate(e){
      if(!e) return;
      this.date = moment(e.date).format('DD/MM/YYYY');
      this.getPickups();
    },
    onPickupAdded(){
      this.showSnackbar();
      this.getPickups();
    },
    openCloseModal(e, pickup){
      e.preventDefault();
      e.stopPropagation();
      this.showCloseModal = true;
      this.selectedPickup = pickup;
    },
    deletePickup(){
      this.doDelete(`pickup/${this.selectedPickup.id}`, () => {
        this.getPickups();
        this.closeModal();
      }, undefined, this.showSnackbar);
    }
  },
  watch: {
    canShowContent(val) {
      if(!val){
        this.pickups = [];
        this.city = '';
      }
    }
  }
}
</script>

<style>
.pickup-selector-container{
  width: 100%;
}

.pickup-selector-calendar{
  margin-bottom: 1rem;
}

.pickup-selector-calendar > .date-box{
    border-radius: 4px;
}

.dropdown.date-box{
  border-radius: 0 0 4px 4px;
}

.config-item:last-child{
  border-radius: 0 !important;
}
.non-values{
  color: white;
}
</style>