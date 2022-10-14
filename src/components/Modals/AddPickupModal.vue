<template>
    <Modal :headerMessage="'Añadiendo recogida'" :submitMessage="'Añadir'" :isSubmitActive="isSubmitActive" v-on:close="$emit('close')" v-on:submit="onSubmit">
        <input type="text" value="" name="cityName" placeholder="Nombre de la ciudad" @keyup="handleButtonState($event)">
        <input type="text" value="" name="placeName" placeholder="Nombre del lugar" @keyup="handleButtonState($event)">
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

export default {
    name: "add-pickup-modal",
    components: { Calendar, Modal },
    props: ['cities'],
    data: function(){
        return {
            calendarOpen: false,
            date: undefined,
            isPlaceAndCitySelected: false,
            isSubmitActive: false
        }
    },
    methods:{
        onSubmit(e){
            let inputs = Array.from(e.target.querySelectorAll('input'));
            if(this.validations(inputs)){
                var input = document.createElement("input");
                input.setAttribute("type", "hidden");
                input.setAttribute("name", "date");
                input.setAttribute("value", this.date);
                e.target.appendChild(input);

                this.insertPickup({
                    'data': this.serializeForm(e.target)
                });
            }
        },
        insertPickup(params){
			let self = this;
			params.data.cityId = this.cityAlreadyExists(params.data.cityName);
			
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
        cityAlreadyExists(cityName){
			let city = this.cities.find(x => x.name === cityName);
			return city ? city.id : -1;
		}
    }
}
</script>

<style scoped>
.modal-body .date-box{
    text-align: left;
}
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