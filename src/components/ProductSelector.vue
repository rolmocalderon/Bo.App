<template>
  <div class="product-selector-container almost-full-width">
    <div class="cities">
      <Dropdown dropdownName="cities" v-on:changeDropdown="onChangeCity"  v-on:dropDownShown="changeDropdownStatus" :values="cities" :textMessage="'Selecciona una ciudad'" :isDropdownContentShown="isDropdownContentShown"></Dropdown>
    </div>
    <div class="pickups">
      <Dropdown v-on:changeDropdown="onChangePickup" v-on:dropDownShown="changeDropdownStatus" :disabled="pickups.length == 0" :values="pickups" :textMessage="dropdownMessage" :isDropdownContentShown="isDropdownContentShown"></Dropdown>
    </div>
    <div v-if="showDates && pickups.length > 0" class="dates">
      <div class="date-box" v-on:click="calendarStatusChanged">
        <span v-if="date">{{ date }}</span>
        <span v-if="!date">Escoge una fecha</span>
      </div>
      <Calendar
        v-if="calendarOpen"
        v-on:changeDate="onChangeDate"
        v-on:hideCalendar="onHideCalendar"
        :dateSelected="date"
        :actualDay="actualDay"
        :selectableDates="selectableDates"
      />
    </div>
  </div>
</template>

<script>
import db from '../services/db';
import Calendar from "./Calendar";
import Dropdown from "./Dropdown";
import * as moment from 'moment';
export default {
  name: "ProductSelector",
  components: { Calendar, Dropdown },
  props: ["selectorName"],
  created: function () {
    this.$parent.$on('setCities', this.setCities);
    this.getCities();
  },
  data: function(){
      return{
          pickups: [],
          showDates: false,
          selectableDates: [],
          cities: [],
          actualDay: "",
          date: "",
          calendarOpen: false,
          selectedPickup: {},
          categoryUri: this.getCategoryUri(),
          datesUri: this.getDatesUri(),
          dropdownMessage: this.selectorName === 'pickups' ? 'Selecciona una recogida' : 'Selecciona un reparto',
          isDropdownContentShown: false
      }
  },
  methods:{
    setCities(){
      this.cities = this.getCities();
    },
    async getPickups(cityId) {
      let self = this;
      let params = {
        cityId : cityId
      };
      db.getAll(this.categoryUri, function (res) {
        self.pickups = res;
      }, params);
    },
    async getCities(){
      let self = this;
      db.getAll("getCities", function(res){
        self.cities = res;
      });
    },
    onChangeCity(e){
      if (e && e.valueId) {
        this.getPickups(e.valueId);
      }else{
        this.pickups = [];
      }
    },
    onChangePickup(e) {
      if (e && e.name) {
        let params = {
          pickupName: e.name
        };
        this.selectedPickup = e.name;

        let self = this;
        db.getAll(
          this.datesUri,
          function (res) {
            self.setSelectableDates(res)
          },
          params
        );
      }else{
          this.dates = [];
      }
    },
    setSelectableDates(res){
        this.showDates = true;
        let datesSelectables = [];
        for(let pickupDate of res){
            let splittedDate = pickupDate.date.split('/');
            datesSelectables.push({ 'year': splittedDate[2], 'month': splittedDate[1], 'day': splittedDate[0], 'id': pickupDate.id });
        }

        this.selectableDates = datesSelectables;
    },
    onChangeDate(e){
      this.date = moment(e.date).format('DD/MM/YYYY');
      this.actualDay = moment(e.date).date();
      e.selectedPickup = this.selectedPickup;
      e.date = this.date;
      this.datechanged(e);
    },
    onHideCalendar(){
      this.calendarStatusChanged();
    },
    calendarStatusChanged(){
      this.calendarOpen = !this.calendarOpen;
    },
    datechanged(e){
        this.$emit('dateChanged', e);
    },
    getCategoryUri(){
      switch(this.selectorName){
        case 'pickups':
          return 'getPickups';
        case 'delivery':
          return 'getDeliveries';
      }
    },
    getDatesUri(){
      switch(this.selectorName){
        case 'pickups':
          return 'getPickupDates';
        case 'delivery':
          return 'getDeliveryDates';
      }
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
.disabled{
  background: #e9e9e9;
  color: grey;
}
.almost-full-width{
	width: 90%;
}
</style>