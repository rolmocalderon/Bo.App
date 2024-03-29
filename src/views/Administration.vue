<template>
  <div class="admin-container">
    <HeaderBar :title="'Administración'" v-on:backSelected="goBack()"/>
    <div v-if="isSelection" class="admin-content">
        <div class="admin-button" :class="{'disabled' : !hasDataToSync}" v-on:click="syncData">
            <font-awesome-icon class="admin-icon" :icon="icon" />
            <span>{{ syncText }}</span>
        </div>
        <span v-if="isErrorOnSync" class="sync-error-result">Error al intentar sincronizar</span>
        <div class="admin-button" v-on:click="showCloseModal = true" :class="{'disabled' : !hasDataToSync}" v-if="getUser().category === 'Admin'">Purgar datos</div>
        <div class="admin-button" v-on:click="onOptionSelected('config')">Configuration</div>
        <div class="admin-button" v-on:click="onOptionSelected('report')">Mostrar reporte</div>
        <div class="admin-button" v-on:click="onOptionSelected('chartReport')">Mostrar Gráficas</div>
    </div>
    <Report v-if="!isSelection && selectedOption === 'report'"/>
    <ChartReport v-if="!isSelection && selectedOption === 'chartReport'" class="flex-container"/>
    <Configuration v-if="!isSelection && selectedOption === 'config'" class="flex-container" :user="user"/>
    <CloseModal v-if="showCloseModal" v-on:close="showCloseModal = false" v-on:delete="purge"/>
  </div>
</template>

<script>
import HeaderBar from '../components/HeaderBar';
import Report from './Admin/Report';
import ChartReport from './Admin/ChartReport';
import Configuration from './Admin/Configuration';
import CloseModal from '../components/modals/CloseModal';

export default {
    name: 'administration',
    components: {HeaderBar, Report, ChartReport, Configuration, CloseModal},
    created() {
        this.isSyncDone = false;
    },
    data(){
        return {
            data: this.getFromLocalStorage('data'),
            isErrorOnSync: false,
            isSyncDone: false,
            isSelection: true,
            selectedOption: '',
            showCloseModal: false
        }
    },
    methods: {
        goBack(target = ''){
            if(this.selectedOption === ''){
                this.$emit('navigation', target);
            }else{
                this.selectedOption = '';
                this.isSelection = true;
            }
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

            this.doPost('syncProductPicked', this.syncSuccess, { productsData,productMeasuresData,productsPicked }, this.syncError);
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
        purge(){
            this.initLocalStorage();
            this.data = '';
            this.showCloseModal = false;
        },
        syncSuccess(){
            this.initLocalStorage();
            this.data = '';
            this.isSyncDone = true;
            this.isErrorOnSync = false;
        },
        syncError(){
            this.isErrorOnSync = true;
            this.isSyncDone = false;
        },
        onOptionSelected(option){
            this.isSelection = false;
            this.selectedOption = option;
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
</style>