<template>
  <div class="product-selector-container">
    <div class="cities">
      <Dropdown dropdownName="cities" v-on:changeDropdown="onChangeCity" :values="cities" :textMessage="'Selecciona una ciudad'"></Dropdown>
    </div>
    <div class="pickups">
      <Dropdown dropdownName="pickups" v-on:changeDropdown="onChangePickup" :disabled="pickups.length == 0" :values="pickups" :textMessage="'Selecciona una recogida'"></Dropdown>
    </div>
    <div v-if="showDates" class="dates">
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
  props: ["user"],
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
          selectedCity: "",
          selectedPickup: {}
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
      db.getAll("getPickups", function (res) {
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
        this.selectedCity = e;
        this.getPickups(e.valueId);
      }else{
        this.pickups = [];
      }
    },
    onChangePickup(e) {
      console.log("pickuped", e)
      if (e && e.name) {
        let params = {
          pickupName: e.name
        };
        this.selectedPickup = e.name;

        let self = this;
        db.getAll(
          "getPickupDates",
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
  }
};
</script>

<style>
.product-selector-container{
  width: 100%;
}
.disabled{
  background: #e9e9e9;
  border: 1px solid grey;
  color: grey;
}
</style>