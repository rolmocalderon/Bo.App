<template>
  <div class="product-selector-container almost-full-width">
    <add-pickup v-if="user && user.category == 'admin'"/>
    <div class="cities">
      <Dropdown dropdownName="cities" v-on:changeDropdown="onChangeCity" :values="cities"></Dropdown>
    </div>
    <div class="pickups">
      <Dropdown dropdownName="pickups" v-on:changeDropdown="onChangePickup" :values="pickups"></Dropdown>
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
import AddPickup from "./AddPickup";
import Calendar from "./Calendar";
import Dropdown from "./Dropdown";
import * as moment from 'moment';
export default {
  name: "ProductSelector",
  components: { AddPickup, Calendar, Dropdown },
  props: ["user"],
  created: function () {
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
      let selectedCity = Array.from(e.target.children).find(x => x.selected);
      if (selectedCity.value) {
          this.selectedCity = selectedCity;
        this.getPickups(selectedCity.value);
      }else{
        this.pickups = [];
      }
    },
    onChangePickup(e) {
      this.selectedPickup = Array.from(e.target.children).find((x) => x.selected);
      if (this.selectedPickup.value != '') {
        let params = {
          pickupName: this.selectedPickup.textContent
        };

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
      e.selectedPickup = this.selectedPickup.textContent?.trim();
      this.datechanged(e);
    },
    datechanged(e){
        this.$emit('dateChanged', e);
    },
    onHideCalendar(){
      this.calendarStatusChanged();
    },
    calendarStatusChanged(){
      this.calendarOpen = !this.calendarOpen;
    }
  }
};
</script>

<style>
</style>