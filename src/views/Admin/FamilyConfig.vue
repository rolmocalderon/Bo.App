<template>
  <div class="pickup-selector-container almost-full-width">
    <div class="configuration-container flex-container">
      <div class="configuration-content">
        <div class="configuration-header" v-on:click="$emit('showContent', 'family', $event)">
          <span>Familias</span>
        </div>
        <transition name="slide">
          <div class="configuration-values" v-if="canShowContent">
            <Dropdown v-if="defaultCity === ''" v-on:changeDropdown="onChangeCity" v-on:dropDownShown="changeDropdownStatus" :values="cities" :textMessage="'Selecciona una ciudad'" :isDropdownContentShown="isDropdownContentShown"></Dropdown>
            <div class="pickup-config config-item flex-container" v-for="family of families" :key="family.familyid" v-on:click="itemSelected(family)">
                <span class="item">{{ family[0].familyname }}</span>
            </div>
            <div class="flex-container non-values" v-if="families.length === 0">
              <span>No hay valores para mostrar</span>
            </div>
          </div>
        </transition>
      </div>
    </div>
    <Modal v-if="showModal" :headerMessage="modalHeaderMessage" v-on:close="onClose" :submitMessage="'Actualizar'">
        <div class="pickup-config config-item flex-container member-container" v-for="member of selectedFamily" :key="member.memberid">
            <span class="item family-member-item"><input type="date" :value="member.datebirth"></span>
            <span class="item family-member-item"><input :value="member.membername || '-'"/></span>
            <span class="item family-member-item family-member-gender"><font-awesome-icon :icon="getGenderIcon(member)" /></span>
        </div>
    </Modal>
  </div>
</template>

<script>
import Dropdown from '../../components/Dropdown';
import Modal from '../../components/Modal';
import * as moment from 'moment';
import cookies from "../../services/cookies";

export default {
  name: 'config-response',
  components: { Dropdown, Modal },
  props: ['itemType', 'items', 'canShowContent'],
  data(){
    return {
      families: [],
      showModal: false,
      selectedFamily: {},
      modalHeaderMessage: '',
      cities: [],
      selectedCity: '',
      isDropdownContentShown: false,
      date: "",
      city: '',
      defaultCity: ''
    }
  },
  mounted(){
    this.cities = this.getFromLocalStorage('cities');
    this.families = [];
    this.user = cookies.getCookie("user");
    if(this.user.cityid && this.user.cityid !== ''){
      this.defaultCity = this.cities.find(c => c.id === this.user.cityid);
    }
  },
  methods: {
    itemSelected(family){
      this.selectedFamily = family;
      this.modalHeaderMessage = 'Familia ' + this.selectedFamily[0].familyname;
      this.showModal = true;
    },
    getFamilies(){
      let paramCity = this.defaultCity !== '' ? this.defaultCity : this.city;
      if(paramCity !== ''){
        let params = {cityId: paramCity.id, date: this.date}
        this.getAll('getFamilies', (function(res){
          this.families = this.groupBy(res, 'familyid');
        }).bind(this), params);
      }
    },
    getGenderIcon(member){
        return member.gender === 'men' ? 'mars' : 'venus';
    },
    getDefaultDateValue(member){
        return moment(member.datebirth).format('YYYY-MM-DD');
    },
    onChangeCity(city){
      this.selectedCity = city;
      this.city = this.selectedCity;
      this.getFamilies();
    },
    changeDropdownStatus(value){
      this.isDropdownContentShown = value;
    },
    onClose(){
      this.showModal = false;
    },
    onChangeDate(){
        //swallow
    }
  },
  watch: {
    canShowContent(val) {
      if(!val){
        this.families = [];
        this.city = '';
      }
    }
  }
}
</script>

<style scoped>
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
.member-container{
    width: 95%;
    height: 3rem;
    padding: 0 1rem;
}
.family-member-item{
    height: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
}
.member-container input{
    line-height: 2rem;
    margin: 0;
    text-align: center;
}

.family-member-gender{
    font-size: 1.2rem;
}
</style>