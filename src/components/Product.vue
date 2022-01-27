!<template>
    <div class="product">
        <div>{{ product.amount }} paquetes de {{ product.productName }}</div>
        <div> {{ product.weight }} gramos</div>
    </div>
</template>

<script>
export default {
    name: "product",
    props: ["product"]
}
</script>

<style>
.product-container .product{
    width: 100%;
    display: flex;
    border-bottom: 1px solid rgba(0,0,0,0.4);
    padding: 1.2rem;
    flex-direction: column;
    align-items: flex-start;
}
</style>