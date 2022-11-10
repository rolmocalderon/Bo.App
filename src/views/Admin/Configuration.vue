<template>
  <div class="container">
    <CityConfig class="flex-container" :canShowContent="contentShown === 'city'" v-on:showContent="onShowContent"/>
    <ProductConfig class="flex-container" :canShowContent="contentShown === 'product'" v-on:showContent="onShowContent"/>
    <UrgentProductConfig class="flex-container" :canShowContent="contentShown === 'urgentProduct'" v-on:showContent="onShowContent"/>
  </div>
</template>

<script>

import CityConfig from './CityConfig';
import ProductConfig from './ProductConfig';
import UrgentProductConfig from './UrgentProductConfig';

export default {
    name: 'configuration',
    components: { CityConfig, ProductConfig, UrgentProductConfig },
    data(){
      return {
        contentShown: ''
      }
    },
    methods: {
      onShowContent(itemType, event){
        if(event.target.nodeName !== "svg" && event.target.nodeName !== "path"){
          this.contentShown = this.contentShown === itemType ? '' : itemType;
        }
      }
    }
}
</script>

<style scoped>
.container{
  flex-direction: column;
}
</style>