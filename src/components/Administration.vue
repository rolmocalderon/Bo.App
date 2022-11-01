<template>
  <div>
    <HeaderBar :user="user" :title="'Administración'" v-on:backSelected="goBack('')"/>
    <div class="admin-content">
        <div class="sync-button" :class="{'disabled' : !hasDataToSync}" v-on:click="syncData">
            <font-awesome-icon class="admin-icon" :icon="icon" />
            <span>{{ syncText }}</span>
        </div>
        <span v-if="isErrorOnSync" class="sync-error-result">Error al intentar sincronizar</span>
    </div>
  </div>
</template>

<script>
import HeaderBar from './HeaderBar';

export default {
    name: 'administration',
    props: ['user'],
    components: {HeaderBar},
    created() {
        this.isSyncDone = false;
    },
    data(){
        return {
            data: this.getFromLocalStorage('data'),
            isErrorOnSync: false,
            isSyncDone: false
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
                'measureid': measure.id,
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
            this.isErrorOnSync = false;
        },
        syncError(){
            this.isErrorOnSync = true;
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
    .admin-content{
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 1rem;
        flex-direction: column;
    }
    .sync-button{
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
    }
    .sync-button span{
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