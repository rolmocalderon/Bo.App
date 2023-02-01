<template>
  <div class="purger-container">
    <CloseModal v-if="showCloseModal" v-on:close="closeModal" v-on:delete="deleteMeasure"/>
  </div>
</template>

<script>
import CloseModal from '../../components/modals/CloseModal';

export default {
    name: 'chart-report',
    components: { CloseModal },
    created(){
        this.showCloseModal = true;
    },
    data(){
        return {
            showCloseModal: false
        }
    },
    methods: {
        onChangeCity(city){
            var self = this;
            this.canShowChart = false;
            this.getAll('topPickups', function(data){
                self.values = {
                    labels: data.map(d => d.name.split(' ')),
                    data: data.map(d => d.amount),
                    dates: data.map(d => d.date)
                };

                self.canShowChart = self.values.labels.length > 0;
            }, { 'cityId': city.id });
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
}
</style>