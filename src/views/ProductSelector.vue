<template>
  <div class="product-selector-container almost-full-width">
    <Dropdown v-on:changeDropdown="onChangeCity" v-on:dropDownShown="changeDropdownStatus" :values="cities" :textMessage="'Selecciona una ciudad'" :isDropdownContentShown="isDropdownContentShown"></Dropdown>
    <div class="dates">
      <div class="date-box" v-on:click="calendarStatusChanged">
        <span v-if="date">{{ date }}</span>
        <span v-if="!date">Escoge una fecha</span>
      </div>
      <Calendar
        v-if="calendarOpen"
        v-on:changeDate="onChangeDate"
        v-on:hideCalendar="onHideCalendar"
        :dateSelected="date"
      />
    </div>
    <div class="configuration-container flex-container">
      <div class="configuration-content">
        <div class="configuration-header">
          <span>Recogidas disponibles</span>
        </div>
        <div class="configuration-values">
          <div class="config-item flex-container" v-for="pickup of pickups" :key="pickup.id" v-on:click="$emit('pickupSelected', pickup)">
            <span class="item">{{ pickup.name }}</span>
            <span class="item" v-if="date === ''">{{ pickup.date }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Calendar from "../components/Calendar";
import Dropdown from "../components/Dropdown";
import * as moment from 'moment';

export default {
  name: "ProductSelector",
  components: { Calendar, Dropdown },
  props: ['cities'],
  data: function(){
      return{
          pickups: [],
          date: "",
          calendarOpen: false,
          isDropdownContentShown: false,
          cityId: undefined
      }
  },
  methods:{
    async getPickups() {
      if(this.cityId){
        let params = { date: this.date, cityId: this.cityId };
        this.getAll('getPickups', (function(response){
          this.pickups = response;
        }).bind(this), params)
      }
    },
    onChangeCity(e){
      if (e && e.valueId) {
        this.cityId = e.valueId;
        this.getPickups();
      }else{
        this.pickups = [];
      }

      this.cityId = e.valueId;
    },
    onChangeDate(e){
      this.date = moment(e.date).format('DD/MM/YYYY');
      this.getPickups(this.cityId,this.date);
    },
    onHideCalendar(){
      this.calendarStatusChanged();
    },
    calendarStatusChanged(){
      this.calendarOpen = !this.calendarOpen;
    },
    changeDropdownStatus(value){
      this.isDropdownContentShown = value;
      this.calendarOpen = this.calendarOpen ? !value : this.calendarOpen;
    }
  }
};
</script>

<style>
.product-selector-container{
  width: 100%;
  padding-top: 0.8rem;
}
.almost-full-width{
	width: 90%;
}
.white{
  color:white;
}
</style>