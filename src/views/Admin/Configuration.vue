<template>
  <div class="container">
    <CityConfigResponse class="flex-container" :canShowContent="contentShown === 'city'" v-on:showContent="onShowContent"/>
    <ProductConfigResponse class="flex-container" :canShowContent="contentShown === 'product'" v-on:showContent="onShowContent"/>
  </div>
</template>

<script>

import CityConfigResponse from './CityConfigResponse';
import ProductConfigResponse from './ProductConfigResponse';
export default {
    name: 'configuration',
    components: { CityConfigResponse, ProductConfigResponse },
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