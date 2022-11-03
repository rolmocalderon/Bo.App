<template>
  <div class="admin-container">
    <HeaderBar :user="user" :title="'Administración'" v-on:backSelected="goBack('')"/>
    <div v-if="isSelection" class="admin-content">
        <div class="admin-button" :class="{'disabled' : !hasDataToSync}" v-on:click="syncData">
            <font-awesome-icon class="admin-icon" :icon="icon" />
            <span>{{ syncText }}</span>
        </div>
        <span v-if="isErrorOnSync" class="sync-error-result">Error al intentar sincronizar</span>
        <div class="admin-button" v-on:click="isSelection = false">Mostrar reporte</div>
    </div>
    <div v-if="!isSelection" class="report">
        <div class="city-container">
            <Dropdown v-on:changeDropdown="onChangeCity" :values="cities" :textMessage="'Selecciona una ciudad'" :isDropdownContentShown="isDropdownContentShown"></Dropdown>
        </div>
        <div class="flex-container">
            <div class="date-selector" v-on:click="onCalendarOpen('startDate')" :class="{'disabled': this.cityId === ''}">{{ startDate === '' ? 'Fecha de inicio' : startDate}}</div>
            <div class="date-selector" v-on:click="onCalendarOpen('endDate')" :class="{'disabled': this.cityId === ''}">{{ endDate === '' ? 'Fecha de fin' : endDate}}</div>
        </div>
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
        <Calendar v-if="calendarOpen" v-on:changeDate="onChangeDate" v-on:hideCalendar="onHideCalendar" :dateSelected="date" :actualDay="actualDay"/>
    </div>
  </div>
</template>

<script>
import HeaderBar from './HeaderBar';
import Calendar from './Calendar';
import Dropdown from './Dropdown';
import * as moment from 'moment';

export default {
    name: 'administration',
    props: ['user'],
    components: {HeaderBar, Calendar, Dropdown},
    created() {
        this.isSyncDone = false;
        this.cities = this.getFromLocalStorage('cities')
    },
    data(){
        return {
            data: this.getFromLocalStorage('data'),
            isErrorOnSync: false,
            isSyncDone: false,
            isSelection: true,
            results: [],
            calendarDate: '',
            calendarOpen: false,
            startDate: '',
            endDate: '',
            selectableDates: [],
            actualDay: '',
            date: '',
            cities: [],
            isDropdownContentShown: false,
            cityId: ''
        }
    },
    methods: {
        goBack(target = ''){
			this.$emit('navigation', target);
		},
        syncData(){
            var productsData = [];
            var productMeasuresData = [];
            var productsPicked = [];
            for (const [pickup, value] of Object.entries(this.data)) {
                let products = value.products;
                for(const key in products){
                    let product = value.products[key];
                    productsData.push(this.getProductObj(product));
                    for(const measure of product.measures){
                        productMeasuresData.push(this.getProductMeasureObj(product,measure));
                        productsPicked.push(this.getMeasureObj(product,measure,pickup));
                    }
                }
            }

            this.insert('syncProducts', this.syncSuccess, { productsData,productMeasuresData,productsPicked }, this.syncError);
        },
        getMeasureObj(product, measure, pickup){
            return {
                'amount': measure.amount,
                'pickupid': Number(pickup),
                'productid':  product.subproductid === 0 ? product.id : null,
                'measureid': measure.id,
                'subproductid': product.subproductid,
                'isSubproduct': product.subproductid !== 0
            }
        },
        getProductMeasureObj(product, measure){
            return {
                'productid': product.id,
                'measureid': Number(measure.id),
                'subproductid': product.subproductid,
                'isSubproduct': product.subproductid !== 0
            };
        },
        getProductObj(product){
            return {
                'id': product.id,
                'name': product.name,
                'subproductid': product.subproductid,
                'isSubproduct': product.subproductid !== 0
            };
        },
        syncSuccess(){
            this.initLocalStorage();
            this.data = '';
            this.isSyncDone = true;
        },
        syncError(){
            this.isErrorOnSync = true;
        },
        showResult(){
            if(this.startDate !== '' && this.endDate !== ''){
                let self = this;
                let params =  { 'startDate': this.startDate, 'endDate': this.endDate, 'cityId': this.cityId };
                this.getAll('getPickupProductsByDate', function(res){
                    self.results = res;
                    self.isSelection = false;
                }, params);   
            }
        },
        onCalendarOpen(calendarDate){
            this.calendarDate = calendarDate;
            this.calendarOpen = true;
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
            this.cityId = e.valueId;
            this.showResult();
        }
    },
    computed:{
        hasDataToSync(){
            return this.data !== '';
        },
        icon(){
            return this.isSyncDone ? 'check-circle' : 'sync';
        },
        syncText(){
            return this.isSyncDone ? 'Sincronizado correctamente' : 'Sincronizar';
        }
    }
}
</script>

<style scoped>
    .admin-container{
        height: 80vh;
    }
    .admin-content{
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 1rem;
        flex-direction: column;
    }
    .admin-button{
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: white;
        width: 80%;
        height: 3rem;
        border-radius: 5px;
        font-size: 1rem;
        font-weight: bold;
        color: #06346f;
        margin-bottom: 1rem;
    }
    .admin-button span{
        margin-left: 0.725rem;
    }
    .sync-error-result{
        margin-top: 0.5rem;
        color: red;
        width: 80%;
        height: 1rem;
        align-items: center;
        display: flex;
        justify-content: center;
    }
    .admin-icon{
        font-size: 1.5rem;
    }

    /* REPORT */
    .report{
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .flex-container{
        display: flex;
        align-items: center;
        justify-content: center;
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

    .calendar{
        top: 4rem;
        position: absolute;
    }
    .city-container{
        width: 20rem;
        margin: 1rem 0 -10px 0px;
    }
</style>