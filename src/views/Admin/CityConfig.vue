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
      <input type="text" name="city" placeholder="Nombre de la ciudad... " v-on:keyup="isSubmitActive = true" :value="selectedCity.name">
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

</style>