<template>
    <Modal :headerMessage="'Añadiendo recogida'" :submitMessage="'Añadir'" :isSubmitActive="isSubmitActive" v-on:close="$emit('close')" v-on:submit="onSubmit">
        <Dropdown v-if="city === '' && defaultCity === ''" dropdownName="cities" :values="cities" :textMessage="'Selecciona una ciudad'" v-on:changeDropdown="changeDropdown"></Dropdown>
        <input type="text" :value="selectedPickup.name" class="date-box" name="placeName" placeholder="Nombre del lugar" @keyup="handleButtonState($event)">
        <Calendar v-on:changeDate="onChangeDate"/>
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
            isSubmitActive: false,
            selectedCity: this.city
        }
    },
    methods:{
        onSubmit(e){
            let inputs = Array.from(e.target.querySelectorAll('input'));
            if(this.validations(inputs)){              
                e.target.appendChild(this.createInput("hidden", "cityId", this.selectedCity.valueId));
                e.target.appendChild(this.createInput("hidden", "date", this.date));
                let self = this;		
                this.insert('insertPickup', function() { 
                    self.$emit('pickupAdded');
                }, { 'data': this.serializeForm(e.target) });
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
            this.isSubmitActive = this.date && this.isPlaceSelected;
        },
        calendarStatusChanged(){
            this.calendarOpen = !this.calendarOpen;
        },
        handleButtonState(event){
            var inputs = event.srcElement.parentNode.querySelectorAll('input');
            for(let input of inputs){
                if(input.value == ""){
                    this.isPlaceSelected = false;
                    return;
                }
            }

            this.isPlaceSelected = true;
            this.isSubmitActive = this.date && this.isPlaceSelected;
        },
        changeDropdown(data){
            this.selectedCity = data;
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