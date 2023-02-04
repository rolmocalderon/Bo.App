<template>
  <div class="configuration-container">
    <div class="configuration-content">
      <div class="configuration-header" v-on:click="$emit('showContent', 'city', $event)">
        <span>{{title}}</span>
        <font-awesome-icon icon="plus" class="right-icon" v-on:click="openModal" v-if="canShowContent"/>
      </div>
      <transition name="slide">
        <div class="configuration-values" v-if="canShowContent">
          <div class="config-item" v-for="city of cities" :key="city.id" v-on:click="itemSelected(city)">
            <span>{{ city.name }}</span>
            <div class="config-item-close" v-on:click="openCloseModal(city)" v-if="getUser().category === 'Admin'">
				<font-awesome-icon icon="times" />
            </div>
          </div>
        </div>
      </transition>
    </div>
    <Modal v-if="showModal" :headerMessage="modalHeaderMessage" :submitMessage="'Añadir'" :isSubmitActive="isSubmitActive" v-on:close="closeModal" v-on:submit="onSubmit">
      <input type="text" name="city" placeholder="Nombre de la ciudad... " v-on:keyup="isSubmitActive = true" :value="selectedCity.name">
    </Modal>

	<CloseModal v-if="showCloseModal" v-on:close="closeModal" v-on:delete="deleteCity"/>
  <Snackbar :canShow="canShowSnackbar" :isError="isSnackbarError" :isDeleting="isDeletingSnackbar"/>
  </div>
</template>

<script>
import Modal from '../../components/Modal';
import CloseModal from '../../components/modals/CloseModal';
import Snackbar from '../../components/Snackbar';

export default {
  name: 'config-response',
  components: { CloseModal, Modal, Snackbar },
  props: ['items', 'canShowContent'],
  created(){
    this.cities = this.getFromLocalStorage('cities');
  },
  data(){
    return {
      title: 'Ciudades',
      cities: [],
      showModal: false,
      showCloseModal: false,
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
      this.doPost('city', () => { 
        this.getCities(() => {
          this.cities = this.getFromLocalStorage('cities');
          this.showSnackbar();
        });
      }, params, this.showSnackbar);
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
		this.showCloseModal = false;
		this.selectedCity = {}
    },
	openCloseModal(city){
		this.showCloseModal = true;
		this.selectedCity = city;
	},
	deleteCity(){
		this.doDelete(`city/${this.selectedCity.id}`, () => {
			this.getCities(() => {
				this.cities = this.getFromLocalStorage('cities');
        this.showSnackbar(false, true);
			});
			this.closeModal();
		}, undefined, this.showSnackbar);
	}
  }
}
</script>

<style>

</style>