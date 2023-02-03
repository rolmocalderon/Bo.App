<template>
  <div class="configuration-container">
    <div class="configuration-content">
        <div class="configuration-header" v-on:click="$emit('showContent', 'measure', $event)">
            <span>{{title}}</span>
            <font-awesome-icon icon="plus" class="right-icon" v-on:click="openModal" v-if="canShowContent"/>
        </div>
        <transition name="slide">
            <div class="configuration-values" v-if="canShowContent">
                <div class="config-item" v-for="measure of measures" :key="measure.id" v-on:click="itemSelected(measure)">
                <span>{{ measure.type }}</span>
                <div class="config-item-close" v-on:click="openCloseModal($event, measure)" v-if="getUser().category === 'Admin'">
                    <font-awesome-icon icon="times" />
                </div>
                </div>
            </div>
        </transition>
    </div>
    <Modal v-if="showModal" :headerMessage="modalHeaderMessage" :submitMessage="'Añadir'" :isSubmitActive="true" v-on:close="closeModal" v-on:submit="onSubmit">
        <input type="text" name="measure" placeholder="Tipo de medida..." :value="selectedMeasure.type" autocomplete="off" required>
        <input type="text" name="weight" placeholder="Peso en kg..." :value="selectedMeasure.weight" autocomplete="off" required>
        <span class="weight-note">*La medida del peso es en Kg</span>
    </Modal>
	<CloseModal v-if="showCloseModal" v-on:close="closeModal" v-on:delete="deleteMeasure"/>
    <Snackbar :canShowSnackbar="canShowSnackbar" :isError="isSnackbarError"/>
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
    this.measures = this.getFromLocalStorage('measures');
  },
  data(){
    return {
        title: 'Medidas de producto',
		measures: [],
		showModal: false,
		showCloseModal: false,
		selectedMeasure: {},
		modalHeaderMessage: '',
        canShowSnackbar: false
    }
  },
  methods: {
    onSubmit(e){
        var params = {
            'type': e.target.querySelector('input[name="measure"]').value,
            'weight': e.target.querySelector('input[name="weight"]').value,
            'id': this.selectedMeasure.id
        };

        this.closeModal();
        this.doPost('measure', () => { 
            this.getMeasures(() => {
                this.measures = this.getFromLocalStorage('measures');
                this.showSnackbar();
            });
        }, params, this.showSnackbar);
    },
    itemSelected(measure){
		this.selectedMeasure = measure;
		this.modalHeaderMessage = 'Modificar Medida';
		this.showModal = true;
    },
    openModal(){
        this.modalHeaderMessage = 'Añadir Medida';
        this.showModal = true;
    },
    closeModal(){
		this.showModal = false;
		this.showCloseModal = false;
		this.selectedMeasure = {}
    },
	openCloseModal(e, measure){
        e.preventDefault();
        e.stopPropagation();
		this.showCloseModal = true;
		this.selectedMeasure = measure;
	},
	deleteMeasure(){
		this.doDelete(`measure/${this.selectedMeasure.id}`, () => {
            this.getMeasures(() => {
                this.measures = this.getFromLocalStorage('measures');
                this.closeModal();
            });
		});
	}
  }
}
</script>

<style scoped>
    .weight-note{
        font-size: 0.8rem;
    }
</style>