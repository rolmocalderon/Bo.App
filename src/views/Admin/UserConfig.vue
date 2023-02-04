<template>
  <div class="configuration-container">
    <div class="configuration-content">
		<div class="configuration-header" v-on:click="$emit('showContent', 'user', $event)">
			<span>Usuarios</span>
			<font-awesome-icon icon="plus" class="right-icon" v-on:click="openModal" v-if="canShowContent"/>
      </div>
		<transition name="slide">
			<div class="configuration-values" v-if="canShowContent">
				<Dropdown v-if="defaultCity === ''" v-on:changeDropdown="onChangeCity" v-on:dropDownShown="changeDropdownStatus" :values="cities" :textMessage="'Selecciona una ciudad'" :isDropdownContentShown="isDropdownContentShown"></Dropdown>
				<div class="config-item flex-container" v-for="user of users" :key="user.id">
					<span class="config-item-content">{{ user.name }}</span>
					<span class="config-item-content">{{ user.category }}</span>
					<span class="config-item-content">{{ getCityName(user.cityid) }}</span>
					<div class="config-item-close" v-on:click="openCloseModal(user)" v-if="getUser().category === 'Admin'">
						<font-awesome-icon icon="times" />
					</div>
				</div>
			</div>
		</transition>
    </div>
    <Modal v-if="showModal" :headerMessage="modalHeaderMessage" :submitMessage="'Añadir'" :isSubmitActive="isSubmitActive" v-on:close="closeModal" v-on:submit="onSubmit">
		<input type="text" name="user" placeholder="Nombre de usuario... " v-on:keyup="isSubmitActive = true" :value="selectedUser.name" autocomplete="off" required>
		<input type="password" name="password" placeholder="Contraseña..." v-on:keyup="isSubmitActive = true" autocomplete="new-password" required>
		<Dropdown v-if="defaultCity === ''" v-on:changeDropdown="onFillCityInput" v-on:dropDownShown="changeDropdownStatus" :values="cities" :textMessage="'Selecciona una ciudad'" :isDropdownContentShown="isDropdownContentShown"></Dropdown>
		<input type="hidden" name="city" ref="cityInput">
    </Modal>
	<CloseModal v-if="showCloseModal" v-on:close="closeModal" v-on:delete="deleteUser"/>
	<Snackbar :canShow="canShowSnackbar" :isError="isSnackbarError" :isDeleting="isDeletingSnackbar"/>
  </div>
</template>

<script>
import Modal from '../../components/Modal';
import CloseModal from '../../components/modals/CloseModal';
import Dropdown from '../../components/Dropdown';
import Snackbar from '../../components/Snackbar';

export default {
  name: 'config-response',
  components: { CloseModal, Modal, Dropdown, Snackbar },
  props: ['items', 'canShowContent'],
  data(){
    return {
		users: [],
		cities: [],
		showModal: false,
		showCloseModal: false,
		isSubmitActive: false,
		selectedUser: {},
		modalHeaderMessage: '',
		defaultCity: '',
		city: '',
		isDropdownContentShown: false
    }
  },
  created(){
	let cities = this.getFromLocalStorage('cities');
	this.cities = this.prepend({id:'', name:'Todas las ciudades'}, cities);
	let user = this.getUser();
	if(user.cityid && user.cityid !== ''){
		this.defaultCity = this.cities.find(c => c.id === user.cityid);
		this.getUsers();
    }
  },
  methods: {
    onSubmit(e){
		var name = e.target.querySelector('input[name="user"]').value;
		var password = e.target.querySelector('input[name="password"]').value;
		var cityId = e.target.querySelector('input[name="city"]').value;
		var params = { name, password, cityId };

		this.closeModal();
		this.doPost('user', () => { 
			this.getUsers((res) => {
				this.users = res;
				this.showSnackbar();
			});
		}, params, this.showSnackbar);
    },
    openModal(){
      this.modalHeaderMessage = 'Añadir Usuario';
      this.showModal = true;
    },
    closeModal(){
      this.showModal = false;
      this.showCloseModal = false;
      this.selectedUser = {}
    },
    openCloseModal(user){
      this.showCloseModal = true;
      this.selectedUser = user;
    },
    getUsers(){
		let paramCity = this.defaultCity !== '' ? this.defaultCity : this.city;
		let params = {cityId: paramCity.id};
		this.getAll('users', (res) => {
          this.users = res;
        }, params);
    },
	onChangeCity(city){
      this.selectedCity = city;
      this.city = this.selectedCity;
      this.getUsers();
    },
    deleteUser(){
		this.doDelete(`user/${this.selectedUser.id}`, () => {
			this.getUsers((res) => {
				this.users = res;
				this.showSnackbar(true);
			});
			this.closeModal();
		}, undefined, this.showSnackbar);
    },
	changeDropdownStatus(value){
      this.isDropdownContentShown = value;
    },
	getCityName(cityId){
		if(cityId){
			let city = this.cities.find(city => city.id === cityId);
			return city.name;
		}
	},
	onFillCityInput(city){
		this.$refs.cityInput.value = city.id;
	}
  }
}
</script>

<style scoped>
.flex-container{
	justify-content: space-around;
}

.config-item-content{
	flex: 1;
}
</style>