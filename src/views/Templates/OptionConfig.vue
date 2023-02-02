<template>
  <div class="configuration-container">
    <div class="configuration-content">
      <div class="configuration-header" v-on:click="$emit('showContent', 'xxx', $event)">
        <span>XXX</span>
        <font-awesome-icon icon="plus" class="right-icon" v-on:click="openModal" v-if="canShowContent"/>
      </div>
      <transition name="slide">
        <div class="configuration-values" v-if="canShowContent">
          <div class="config-item" v-for="xxx of xxxs" :key="xxx.id" v-on:click="itemSelected(xxx)">
            <span>{{ xxx.name }}</span>
            <div class="config-item-close" v-on:click="openCloseModal(xxx)" v-if="getUser().category === 'XXX'">
				<font-awesome-icon icon="times" />
            </div>
          </div>
        </div>
      </transition>
    </div>
    <Modal v-if="showModal" :headerMessage="modalHeaderMessage" :submitMessage="'Añadir'" :isSubmitActive="isSubmitActive" v-on:close="closeModal" v-on:submit="onSubmit">
      <input type="text" name="xxx" placeholder="Nombre de XXX... " v-on:keyup="isSubmitActive = true" :value="selectedXXX.name">
    </Modal>

	<CloseModal v-if="showCloseModal" v-on:close="closeModal" v-on:delete="deleteXXX"/>
  </div>
</template>

<script>
import Modal from '../../components/Modal';
import CloseModal from '../../components/modals/CloseModal';

export default {
  name: 'config-response',
  components: { CloseModal, Modal },
  props: ['items', 'canShowContent'],
  created(){
    this.xxxs = this.getXXX()
  },
  data(){
    return {
		xxxs: [],
		showModal: false,
		showCloseModal: false,
		isSubmitActive: false,
		selectedXXX: {},
		modalHeaderMessage: ''
    }
  },
  methods: {
    onSubmit(e){
      var xxx = e.target.querySelector('input').value;
      var params = {
        'name': xxx,
        'id': this.selectedXXX.id
      };

      this.closeModal();
      this.doPost('xxx', () => { 
        this.getXXX(() => {
          this.xxxs = this.getXXX()
        });
      }, params);
    },
    itemSelected(xxx){
		this.selectedXXX = xxx;
		this.modalHeaderMessage = 'Modificar nombre xxx';
		this.showModal = true;
    },
    openModal(){
      this.modalHeaderMessage = 'Añadir xxx';
      this.showModal = true;
    },
    closeModal(){
		this.showModal = false;
		this.showCloseModal = false;
		this.selectedXXX = {}
    },
	openCloseModal(xxx){
		this.showCloseModal = true;
		this.selectedXXX = xxx;
	},
	deleteXXX(){
		this.doDelete(`xxx/${this.selectedXXX.id}`, () => {
			this.getXXX(() => {
				this.xxxs = this.getXXX()
			});
			this.closeModal();
		});
	}
  }
}
</script>

<style>

</style>