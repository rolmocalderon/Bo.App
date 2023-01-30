<template>
    <Modal :headerMessage="isPickupSelected ? 'Modificando recogida' : 'Añadiendo recogida'" :submitMessage="isPickupSelected ? 'Modificar' : 'Añadir'" :isSubmitActive="isSubmitActive" v-on:close="$emit('close')" v-on:submit="onSubmit">
        <Dropdown v-if="city === '' && defaultCity === ''" dropdownName="cities" :values="cities" :textMessage="'Selecciona una ciudad'" v-on:changeDropdown="changeDropdown"></Dropdown>
        <input type="text" :value="selectedPickupName" class="date-box" name="placeName" placeholder="Nombre del lugar" @keyup="handleButtonState($event)">
        <Calendar v-on:changeDate="onChangeDate" :dateSelected="selectedPickup.date"/>
    </Modal>
</template>

<script>
import * as moment from 'moment';
import Calendar from '../Calendar';
import Modal from '../Modal';
import Dropdown from '../Dropdown';

export default {
    name: "add-pickup-modal",
    components: { Calendar, Modal, Dropdown },
    props: ['city', 'selectedPickup', 'cities', 'defaultCity'],
    data: function(){
        return {
            calendarOpen: false,
            date: undefined,
            isPlaceSelected: false,
            isPickupSelected: Object.keys(this.selectedPickup).length > 0,
            isSubmitActive: Object.keys(this.selectedPickup).length > 0,
            selectedCity: this.defaultCity && this.defaultCity !== '' ? this.defaultCity : this.city,
            selectedPickupName: this.selectedPickup ? this.selectedPickup.name : ''
        }
    },
    methods:{
        onSubmit(e){
            let inputs = Array.from(e.target.querySelectorAll('input'));
            if(this.validations(inputs)){              
                e.target.appendChild(this.createInput("hidden", "cityId", this.selectedCity.id));
                e.target.appendChild(this.createInput("hidden", "date", this.date));
                if(this.selectedPickup.id){
                    e.target.appendChild(this.createInput('hidden', 'id', this.selectedPickup.id));
                }
                
                this.doPost('insertPickup', () => {
                    this.$emit('pickupAdded');
                    this.$emit('close');
                }, this.serializeForm(e.target));
            }
        },
        createInput(type, name, value){
            var input = document.createElement("input");
            input.setAttribute("type", type);
            input.setAttribute("name", name);
            input.setAttribute("value", value);

            return input;
        },
        validations(inputs){
            inputs.forEach(x => x.classList.remove('not-validated'));
            let canSubmit = true;
            for(var input of inputs){
                if(input.value == ""){
                    canSubmit = false;
                    input.classList.add("not-validated");
                }
            }

            return canSubmit;
        },
        onChangeDate(e){
            this.date = moment(e.date).format('DD/MM/YYYY');
            this.isPlaceSelected = this.selectedPickupName !==  '';
            this.isSubmitActive = this.date && this.isPlaceSelected && this.selectedCity !== '';
        },
        calendarStatusChanged(){
            this.calendarOpen = !this.calendarOpen;
        },
        handleButtonState(event){
            var input = event.srcElement.parentNode.querySelector('input');
            this.isPlaceSelected = input.value.length > 0;
            this.isSubmitActive = this.date && this.isPlaceSelected && this.selectedCity !== '';
            this.selectedPickupName = input.value;
        },
        changeDropdown(data){
            this.selectedCity = data;
            this.isPlaceSelected = this.selectedPickupName !==  '';
            this.isSubmitActive = this.date && this.isPlaceSelected && this.selectedCity !== '';
        }
    }
}
</script>

<style scoped>
.modal-body input:focus, .modal-body select:focus{
    outline: #3E5985 solid 2px !important;
}

.not-validated{
    outline: 1px solid #ff7c7c;
}

.not-validated::placeholder{
    color: #ff7c7c;
}
</style>