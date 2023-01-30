!<template>
    <div class="product-content" :class="{'selected-product': showSubproducts}">
        <div class="product" v-on:click="productSelected">
            <div class="product-info">
                <span class="product-name">{{ product.name.replace('¤', 'ñ') }}</span>
            </div>
            <div v-if="!subproducts || subproducts.length === 0" class="product-counter">
                <div v-for="(measure) in product.measures" :key="measure.id" class="product-counter-divisor">
                    <div class="product-counter-item product-type">
                        <span>{{ measure.type }}</span>
                    </div>
                    <div class="product-icon product-counter-item" v-on:click="productUpdated(false, measure.id)">
                        <font-awesome-icon :icon="'minus-circle'" />
                    </div>
                    <div class="product-count product-counter-item">
                        <span>{{ measure.amount }}</span>
                    </div>
                    <div class="product-icon product-counter-item" :class="{'disabled': !measure.id}" v-on:click="productUpdated(true, measure.id)">
                        <font-awesome-icon :icon="'plus-circle'" />
                    </div>
                </div>
            </div>
            <div v-if="subproducts && subproducts.length > 0" class="product-counter">
                <div class="product-counter-divisor">
                    <div class="product-counter-item">
                        <span>{{ sumSubproducts}}</span>
                    </div>
                    <div class="product-icon product-counter-item">
                        <font-awesome-icon :icon="showSubproducts ? 'chevron-up' : 'chevron-down'" />
                    </div>
                </div>
                
            </div>
        </div>
        <transition name="slide">
            <div v-if="subproducts && subproducts.length > 0 && showSubproducts" class="subproduct slide-up" :class="{'slide-down': showSubproducts}">
                <product v-for="(subproduct) in subproducts" :key="subproduct.subproductid" :pickupId="pickupId" :product="subproduct" :isSubproduct="true"/>
            </div>
        </transition>
    </div>
</template>

<script>

export default {
    name: "product",
    props: ["product", "pickupId", "subproducts", "isSubproduct"],
    created(){
        let measures = this.product.measures;
        if(measures.length > 2){
            this.product.measures = this.sortMeasures(measures);
        }
    },
    data(){
        return {
            showSubproducts: false
        }
    },
    methods:{
        productSelected(){
            if(!this.isSubproduct && this.subproducts.length > 0){
                this.showSubproducts = !this.showSubproducts;
            }
        },
        productUpdated(isAdding, measureId){
            var measure = this.product.measures.find(m => m.id === measureId);
            if(isAdding){
                measure.amount = ++measure.amount;
            }else if(measure.amount > 0){
                measure.amount = --measure.amount;
            }
            
            var data = this.getFromLocalStorage('data');
            var product = {};
            if(this.isSubproduct){
                product = data[this.pickupId].products.find(p => p.subproductid === this.product.subproductid);
            }else{
                product = data[this.pickupId].products.find(p => p.id === this.product.id);
            }

            product.measures = this.product.measures;
            this.updateLocalStorage('data', data);
        },
        sortMeasures(measures){
            let sortable = [];
            for(var measure of measures){
                sortable.push(measure.type)
            }
            sortable.sort();

            return sortable.map(s => measures.find(m => m.type === s));
        }
    },
    computed: {
        sumSubproducts(){
            let productsSum = 0;
            this.subproducts.forEach(item => {
                item.measures.forEach(measure => {
                    productsSum += measure.amount;
                });
            });

            return productsSum;
        }
    }
}
</script>

<style>
.product{
    display: flex;
    padding: 0.8rem 1.4rem;
    padding-left: 1.2rem;
    background: white;
    line-height: 1.3rem;
    box-shadow: 0 0 5px rgb(0 0 0 / 40%);
    margin-bottom: 0rem;
    min-height: 3rem;
}
.product-info{
    display: flex;
    flex-direction: column;
    flex: 1;
    text-align: left;
    justify-content: center;
}
.product-name{
    font-weight: 700;
    font-size: 1.1rem;
}
.product-amount{
    font-size: 1rem;
}
.product-icon{
    opacity: 0.7;
    color: #ec671a;
}
.product-counter{
    display: flex;
    flex: 3;
    flex-direction: column;
}
.product-counter-divisor{
    display: flex;
    justify-content: right;
    margin: 0.6rem 0 0.6rem 0;
}
.selected-product > .product{
    box-shadow: inset 0px 0px 3px 0px black;
}
.product-type{
    color: lightgray;
    margin-right: 1rem;
    font-size: 1rem !important;
}
.product-counter-item{
    min-width: 3rem;
    font-size: 1.7rem;
    display: flex;
    align-items: center;
    justify-content: center;
}
.subproduct > .product-content > .product{
    background-color: #f3f1f1;
    box-shadow: inset 0px 0px 3px 0px black;
}
</style>