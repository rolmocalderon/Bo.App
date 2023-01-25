<template>
  <div class="container">
    <CityConfig v-if="!defaultCity && canShow('cityConfig')" class="flex-container" :canShowContent="contentShown === 'city'" v-on:showContent="onShowContent"/>
    <ProductConfig v-if="canShow('productConfig')" class="flex-container" :canShowContent="contentShown === 'product'" v-on:showContent="onShowContent"/>
    <UrgentProductConfig v-if="canShow('urgentProductConfig')" class="flex-container" :canShowContent="contentShown === 'urgentProduct'" v-on:showContent="onShowContent"/>
    <PickupConfig v-if="canShow('pickupConfig')" class="flex-container" :canShowContent="contentShown === 'pickup'" v-on:showContent="onShowContent"/>
    <FamilyConfig v-if="canShow('familyConfig')" class="flex-container" :canShowContent="contentShown === 'family'" v-on:showContent="onShowContent"/>
  </div>
</template>

<script>

import CityConfig from './CityConfig';
import ProductConfig from './ProductConfig';
import UrgentProductConfig from './UrgentProductConfig';
import PickupConfig from './PickupConfig';
import FamilyConfig from './FamilyConfig';
import switchKiller from '../../switchKiller.json';

export default {
    name: 'configuration',
    components: { CityConfig, ProductConfig, UrgentProductConfig, PickupConfig, FamilyConfig },
    created(){
      this.defaultCity = this.getUser().cityid;
    },
    data(){
      return {
        contentShown: '',
        defaultCity: undefined,
        switchKillerConfig: switchKiller
      }
    },
    methods: {
      onShowContent(itemType, event){
        if(event.target.nodeName !== "svg" && event.target.nodeName !== "path"){
          this.contentShown = this.contentShown === itemType ? '' : itemType;
        }
      },
      canShow(configId){
        let switchKiller = this.switchKillerConfig.switchKillers.find(sk => sk.id === configId);
        return switchKiller.active;
      }
    }
}
</script>

<style scoped>
.container{
  flex-direction: column;
}
</style>