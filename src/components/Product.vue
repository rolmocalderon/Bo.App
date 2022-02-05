!<template>
    <div class="product" v-on:click="productSelected">
        <div class="product-info">
            <span class="product-name">{{ product.productName }}</span>
            <span class="">
                <span v-if="product.measureAlias != 'pack' && product.measureAlias != 'sixPack' && product.measureAlias != 'twelvePack'">
                    {{ product.weight }}
                </span> 
                {{ product.measureType}}</span>
            <span>Unidades: <span class="product-amount">{{ product.amount }}</span></span>
        </div>
        <div class="product-icon">
            <font-awesome-icon :icon="icon" />
        </div>
    </div>
</template>

<script>
export default {
    name: "product",
    props: ["product"],
    data(){
        return{
            icon: this.getIcon(this.product.alias)
        }
    },
    methods:{
        productSelected(){            
            this.$emit('productSelected', this.product);
        },
        getIcon(productType){
            let icon = '';
            switch(productType){
                case 'food':
                    icon = "apple-alt";
                    break;
                case 'hygieneProducts':
                    icon = "pump-soap";
                    break;
                case 'cleaningProducts':
                    icon = "cheese";
                    break;
            }

            return icon;
        }
    }
}
</script>

<style>
.product-container .product{
    width: 90%;
    display: flex;
    padding: 0.8rem 1.4rem;
    padding-left: 1.2rem;
    background: white;
    line-height: 1.3rem;
    box-shadow: 0 0 5px rgb(0 0 0 / 40%);
    margin-bottom: 0rem;
}
.product-container .product-info{
    display: flex;
    flex-direction: column;
    flex: 1;
    text-align: left;
}
.product-name{
    font-weight: 700;
    font-size: 1rem;
}
.product-amount{
    font-size: 1rem;
}
.product-icon{
    font-size: 2.5rem;
    display: flex;
    align-items: center;
    margin-right: 1rem;
    opacity: 0.7;
}
</style>