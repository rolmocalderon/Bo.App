<template>
  <div class="product-selector-container almost-full-width">
    <Dropdown v-if="!defaultCityId || defaultCityId === ''" v-on:changeDropdown="onChangeCity" v-on:dropDownShown="changeDropdownStatus" :values="cities" :textMessage="'Selecciona una ciudad'" :isDropdownContentShown="isDropdownContentShown"></Dropdown>
    <Calendar v-on:changeDate="onChangeDate" :dateSelected="date"/>
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
          <div class="flex-container non-values" v-if="pickups.length === 0">
            <span>No hay valores para mostrar</span>
          </div>
          <font-awesome-icon icon="times" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Calendar from "../components/Calendar";
import Dropdown from "../components/Dropdown";
import * as moment from 'moment';
import cookies from "../services/cookies";

export default {
  name: "PickupSelector",
  components: { Calendar, Dropdown },
  props: ['cities'],
  created(){
    this.user = cookies.getCookie("user");
    this.defaultCityId = this.user.cityid;
    this.cityId = this.defaultCityId;
  },
  data: function(){
      return{
          pickups: [],
          date: "",
          calendarOpen: false,
          isDropdownContentShown: false,
          cityId: undefined,
          defaultCityId: ''
      }
  },
  methods:{
    async getPickups() {
      if(this.cityId){
        let params = { date: this.date, cityId: this.cityId };
        this.getAll('pickups', (function(response){
          this.pickups = response;
        }).bind(this), params)
      }
    },
    onChangeCity(e){
      if (e && e.id) {
        this.cityId = e.id;
        this.getPickups();
      }else{
        this.pickups = [];
      }
    },
    onChangeDate(e){
      this.date = e ? moment(e.date).format('DD/MM/YYYY') : undefined;      
      this.getPickups(this.cityId,this.date);
    },
    changeDropdownStatus(value){
      this.isDropdownContentShown = value;
    }
  }
};
</script>

<style scoped>
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
.configuration-content{
  width: 100%;
}
.non-values{
  margin-top: 1rem;
  color: white;
}
</style>