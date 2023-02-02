<template>
  <div class="report">
        <div v-if="!defaultCity" class="city-container">
            <Dropdown v-on:changeDropdown="onChangeCity" :values="cities" :textMessage="'Selecciona una ciudad'" :isDropdownContentShown="isDropdownContentShown"></Dropdown>
        </div>
        <div class="flex-container">
            <div class="date-selector" v-on:click="onCalendarOpen('startDate')" :class="{'disabled': this.cityId === ''}">{{ startDate === '' ? 'Fecha de inicio' : startDate}}</div>
            <div class="date-selector" v-on:click="onCalendarOpen('endDate')" :class="{'disabled': this.cityId === ''}">{{ endDate === '' ? 'Fecha de fin' : endDate}}</div>
        </div>
        <Calendar v-if="calendarOpen" v-on:changeDate="onChangeDate" v-on:hideCalendar="onHideCalendar" :dateSelected="date" :actualDay="actualDay" :isOpenCalendar="calendarOpen"/>
        <div class="flex-container result-container">
            <div class="flex-container title-row top">
                <div class="result-content-item">Producto</div>
                <div class="result-content-item">Cantidad</div>
                <div class="result-content-item">Peso</div>
            </div>
            <div v-for="(result, index) of results" :key="index" class="flex-container result-row">
                <div class="result-content-item">{{ result.name }}</div>
                <div class="result-content-item">{{ result.sum }}</div>
                <div class="result-content-item">{{ Number(result.weight).toLocaleString('es-ES', { maximumSignificantDigits: 1, minimumSignificantDigits: 1 }) }} Kg</div>
            </div>
            <div v-if="results.length > 0" class="flex-container title-row bottom">
                <div class="result-content-item">Total</div>
                <div class="result-content-item">{{ Object.values(results).reduce((a, b) => a + Number(b.sum), 0) }}</div>
                <div class="result-content-item">{{ Object.values(results).reduce((a, b) => a + Number(b.weight), 0)}} Kg</div>
            </div>
        </div>
    </div>
</template>

<script>
import Calendar from '../../components/Calendar';
import Dropdown from '../../components/Dropdown';
import * as moment from 'moment';

export default {
    name: "report",
    components: { Calendar, Dropdown },
    data(){
        return{
            cities: [],
            calendarDate: '',
            calendarOpen: false,
            startDate: '',
            endDate: '',
            actualDay: '',
            date: '',
            isDropdownContentShown: false,
            cityId: '',
            results: []
        }
    },
    created(){
        this.cities = this.getFromLocalStorage('cities');
        this.defaultCity = this.getUser().cityid;
        this.cityId = this.defaultCity;
    },
    methods: {
        onCalendarOpen(calendarDate){
            this.calendarDate = calendarDate;
            this.calendarOpen = !this.calendarOpen;
            if(this.calendarDate === 'startDate'){
                this.date = this.startDate;
            }else{
                this.date = this.endDate;
            }
        },
        onHideCalendar(){
            this.calendarOpen = false;
        },
        onChangeDate(e){
            let date = moment(e.date).format('DD/MM/YYYY');
            if(this.calendarDate === 'startDate'){
                this.startDate = date;
            }else{
                this.endDate = date;
            }

            this.showResult();
        },
        onChangeCity(e){
            this.cityId = e.id;
            this.showResult();
        },
        showResult(){
            if(this.startDate !== '' && this.endDate !== '' && this.cityId){
                let params =  { 'startDate': this.startDate, 'endDate': this.endDate, 'cityId': this.cityId };
                this.getAll('pickupProductsByDate', (res) => {
                    this.results = res;
                    this.isSelection = false;
                }, params);   
            }
        }
    }
}
</script>

<style scoped>
.report{
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.date-selector{
    padding: 1rem 1rem;
    width: 7rem;
    background-color: white;
    margin: 1rem;
    border-radius: 4px;
}
.title-row{
    background-color: #4065AD;
    font-weight: 700;
    color: white;
    width: 95%;
}
.title-row.top{
    border-radius: 5px 5px 0 0;
}

.title-row.bottom{
    border-radius: 0 0 5px 5px;
    margin-bottom: 1rem;
}
.result-container{
    width: 100%;
    flex-direction: column;
}
.result-row{
    width: 95%;
    background-color: white;
    border-bottom: 1px solid rgba(0,0,0,0.1);
}
.result-content-item{
    flex: 1;
    padding: 1rem 0;
}

.city-container{
    width: 20rem;
    margin: 1rem 0 -10px 0px;
}
</style>