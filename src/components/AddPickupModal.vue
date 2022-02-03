<template>
    <transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container">
                    <form name="productModalForm" v-on:submit="productModified">
                        <div class="modal-header">
                            <div class="modal-header-message">
                                <span>{{ headerMessage }}</span>
                                <div class="close-icon" v-on:click="$emit('close')">
                                    <font-awesome-icon icon="window-close"/>
                                </div>
                            </div>
                        </div>

                        <div class="modal-body">
                            <input type="text" value="" name="city" placeholder="Nombre de la ciudad">
                            <input type="text" value="" name="productName" placeholder="Nombre del lugar">
                                <div class="date-box" v-on:click="calendarStatusChanged">
                                    <span v-if="date">{{ date }}</span>
                                    <span v-if="!date">Escoge una fecha</span>
                                </div>
                                <Calendar
                                    v-if="calendarOpen"
                                    v-on:changeDate="onChangeDate"
                                    v-on:hideCalendar="onHideCalendar"
                                    :selectableDates="[]"
                                />
                        </div>

                        <div class="modal-footer">
                            <slot name="footer">
                            <button class="modal-default-button">
                                {{ submitMessage }}
                            </button>
                            </slot>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
import * as moment from 'moment';
import Calendar from './Calendar';
export default {
    name: "add-pickup-modal",
    props: ['modalType'],
    components: { Calendar },
    created(){
        console.log("asdf")
    },
    data: function(){
        return {
            submitMessage: 'Añadir',
            headerMessage: 'Añadiendo recogida',
            calendarOpen: false,
            date: undefined
        }
    },
    methods:{
        productModified(e){
            e.preventDefault();
            let inputs = Array.from(e.target.querySelectorAll('input'));
            if(this.validations(inputs)){
                this.$emit('productModified', e.target);
            }
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
                console.log("date", this.date)
                //this.actualDay = moment(e.date).date();
                /*e.selectedPickup = this.selectedPickup;
                e.date = this.date;
                this.datechanged(e);*/
            },
            onHideCalendar(){
                this.calendarStatusChanged();
            },
            calendarStatusChanged(){
                this.calendarOpen = !this.calendarOpen;
            }
    }
}
</script>

<style>
.close-icon{
    font-size: 1.3rem;
    margin-right: 1rem;
}
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
    width: 300px;
    margin: 0px auto;
    padding: 20px 20px;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    transition: all 0.3s ease;
    font-family: Arial;
    display: flex;
    flex-direction: column;
    position: relative;
}

.modal-header {
    top: 0;
    left: 0;
    position: absolute;
    background: #3E5985;
    height: 3rem;
    display: flex;
    align-items: center;
    color: white;
    width: 100%;
}

.modal-header-message{
    display: flex;
    width: 100%;
    justify-content: center;
    position: relative;
    height: 100%;
    align-items: center;
}

.modal-header-message span{
    flex: 1;
    margin-left: 1rem;
    font-size: 1rem;
}

.modal-body {
    margin: 3rem 0 2rem 0;
}

.modal-default-button {
    background: #3E5985;
    color: white;
    font-weight: 400;
    padding: 0.8rem 2rem;
    border-radius: 3px;
}

.modal-footer{
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal-body input{
    border: none;
    padding: 1rem 1rem;
    margin-bottom: 1rem;
    box-shadow: 0 0 5px rgb(0 0 0 / 50%);
    border-radius: 2px;
    width: 89%;
    font-size: 14px;
}
.modal-body .date-box{
    text-align: left;
}
.modal-body input:focus, .modal-body select:focus{
    outline: #3E5985 solid 2px;
}

.modal-body select{
    width: 100%;
    box-shadow: 0 0 5px rgb(0 0 0 / 50%);
    border-radius: 2px;
    border: none;
    background: transparent;
}

.not-validated{
    outline: 1px solid #ff7c7c;
}

.not-validated::placeholder{
    color: #ff7c7c;
}

.measure-container{
    display: flex;
    margin-bottom: 1rem;
}

.measure-container input{
    margin-bottom: 0;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

</style>