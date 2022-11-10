<template>
    <div class="configuration-container">
    <div class="configuration-content">
      <div class="configuration-header" v-on:click="$emit('showContent', 'city', $event)">
        <span>Ciudades</span>
        <font-awesome-icon icon="plus" class="right-icon" v-on:click="openModal" v-if="canShowContent"/>
      </div>
      <transition name="slide">
        <div class="configuration-values" v-if="canShowContent">
          <div class="config-item" v-for="city of cities" :key="city.id" v-on:click="itemSelected(city)">
            <span>{{ city.name }}</span>
          </div>
        </div>
      </transition>
    </div>
    <Modal v-if="showModal" :headerMessage="modalHeaderMessage" :submitMessage="'Añadir'" :isSubmitActive="isSubmitActive" v-on:close="closeModal" v-on:submit="onSubmit">
      <input type="text" name="city" placeholder="Nombre de la ciuad... " v-on:input="isSubmitActive = true" :value="selectedCity.name">
    </Modal>
  </div>
</template>

<script>
import Modal from '../../components/Modal';

export default {
  name: 'config-response',
  components: { Modal },
  props: ['items', 'canShowContent'],
  created(){
    this.cities = this.getFromLocalStorage('cities');
  },
  data(){
    return {
      cities: [],
      showModal: false,
      isSubmitActive: false,
      selectedCity: {},
      modalHeaderMessage: ''
    }
  },
  methods: {
    onSubmit(e){
      var city = e.target.querySelector('input').value;
      var params = {
        'name': city,
        'id': this.selectedCity.id
      };

      this.closeModal();
      this.insert('insertCity', (function() { 
        this.getCities((function(){
          this.cities = this.getFromLocalStorage('cities')
        }).bind(this));
      }).bind(this), params);
    },
    itemSelected(city){
      this.selectedCity = city;
      this.modalHeaderMessage = 'Modificar nombre de ciudad';
      this.showModal = true;
    },
    openModal(){
      this.modalHeaderMessage = 'Añadir ciudad';
      this.showModal = true;
    },
    closeModal(){
      this.showModal = false;
      this.selectedCity = {}
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
</style>