<template>
    <Modal :headerMessage="'Añadiendo recogida'" :submitMessage="'Añadir'" :isSubmitActive="isSubmitActive" v-on:close="$emit('close')" v-on:submit="onSubmit">
        <Dropdown dropdownName="cities" :values="cities" :textMessage="'Selecciona una ciudad'" v-on:changeDropdown="changeDropdown"></Dropdown>
        <input type="text" value="" class="date-box" name="placeName" placeholder="Nombre del lugar" @keyup="handleButtonState($event)">
        <div class="date-box" v-on:click="calendarStatusChanged">
            <span v-if="date">{{ date }}</span>
            <span v-if="!date">Escoge una fecha</span>
        </div>
        <Calendar v-if="calendarOpen" v-on:changeDate="onChangeDate" v-on:hideCalendar="calendarStatusChanged" :selectableDates="[]"/>
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
    props: ['cities'],
    data: function(){
        return {
            calendarOpen: false,
            date: undefined,
            isPlaceAndCitySelected: false,
            isSubmitActive: false,
            selectedCity: {}
        }
    },
    methods:{
        onSubmit(e){
            let inputs = Array.from(e.target.querySelectorAll('input'));
            if(this.validations(inputs)){              
                e.target.appendChild(this.createInput("hidden", "cityId", this.selectedCity.valueId));
                e.target.appendChild(this.createInput("hidden", "date", this.date));

                this.insertPickup({
                    'data': this.serializeForm(e.target)
                });
            }
        },
        createInput(type, name, value){
            var input = document.createElement("input");
            input.setAttribute("type", type);
            input.setAttribute("name", name);
            input.setAttribute("value", value);

            return input;
        },
        insertPickup(params){
			let self = this;		
			this.insert('insertPickup', function() { 
				self.$emit('pickupAdded');
			}, params);
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
            this.isSubmitActive = this.date && this.isPlaceAndCitySelected;
        },
        calendarStatusChanged(){
            this.calendarOpen = !this.calendarOpen;
        },
        handleButtonState(event){
            var inputs = event.srcElement.parentNode.querySelectorAll('input');
            for(let input of inputs){
                if(input.value == ""){
                    this.isPlaceAndCitySelected = false;
                    return;
                }
            }

            this.isPlaceAndCitySelected = true;
            this.isSubmitActive = this.date && this.isPlaceAndCitySelected;
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