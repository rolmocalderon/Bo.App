<template>
  <div class="chart-report-container">
    <div class="city-container">
        <Dropdown :values="cities" :textMessage="'Selecciona una ciudad'" v-on:changeDropdown="onChangeCity"></Dropdown>
    </div>

    <BarChart v-if="canShowChart" class="chart-report" :values="values"/>
  </div>
</template>

<script>
import BarChart from '../../components/BarChart';
import Dropdown from '../../components/Dropdown';

export default {
    name: 'chart-report',
    components: { BarChart, Dropdown },
    created(){
        this.cities = this.getFromLocalStorage('cities');
    },
    data(){
        return {
            cities: [],
            values: {},
            canShowChart: false
        }
    },
    methods: {
        onChangeCity(city){
            var self = this;
            this.canShowChart = false;
            this.getAll('getTopPickups', function(data){
                self.values = {
                    labels: data.map(d => d.name.split(' ')),
                    data: data.map(d => d.amount),
                    dates: data.map(d => d.date)
                };

                self.canShowChart = self.values.labels.length > 0;
            }, { 'cityId': city.valueId });
        }
    }
}
</script>

<style>
.chart-report-container{
    flex-direction: column;
}
.chart-report{
    width: 90%;
}
.city-container{
    width: 20rem;
    margin: 1rem;
}
</style>