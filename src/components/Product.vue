!<template>
    <div class="product">
        <div class="product-info">
            <span class="product-name">{{ product.name }}</span>
        </div>
        <div class="product-counter">
            <div class="product-counter-divisor">
                <div class="product-counter-item product-type">
                    <span>1 Kg</span>
                </div>
                <div class="product-icon product-counter-item" v-on:click="productUpdated(false)">
                    <font-awesome-icon :icon="'minus-circle'" />
                </div>
                <div class="product-count product-counter-item">
                    <span>{{ count }}</span>
                </div>
                <div class="product-icon product-counter-item" v-on:click="productUpdated(true)">
                    <font-awesome-icon :icon="'plus-circle'" />
                </div>
            </div>
            <div class="product-counter-divisor">
                <div class="product-counter-item product-type">
                    <span>1/2 Kg</span>
                </div>
                <div class="product-icon product-counter-item" v-on:click="productUpdated(false)">
                    <font-awesome-icon :icon="'minus-circle'" />
                </div>
                <div class="product-count product-counter-item">
                    <span>{{ count }}</span>
                </div>
                <div class="product-icon product-counter-item" v-on:click="productUpdated(true)">
                    <font-awesome-icon :icon="'plus-circle'" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: "product",
    props: ["product"],
    data(){
        return {
            count: 0
        }
    },
    created(){
        this.count = this.product.amount;
    },
    methods:{
        productSelected(){
            this.$emit('productSelected', this.product);
        },
        productUpdated(isAdding){
            if(isAdding){
                this.count = ++this.count;
            }else if(this.count > 0){
                this.count = --this.count;
            }
            
            var data = this.getFromLocalStorage('data');
            var product = data.products.find(p => p.id === this.product.id);
            product.amount = this.count;
            this.updateLocalStorage('data', data);
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
    font-size: 1.2rem;
}
.product-amount{
    font-size: 1rem;
}
.product-icon{
    opacity: 0.7;
    color: #06346f;
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
.product-count{

}
.product-type{
    color: lightgray;
    margin-right: 1rem;
    font-size: 1.2rem !important;
}
.product-counter-item{
    min-width: 3rem;
    font-size: 1.7rem;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>