<template>
  <div class="column-container">
    <CityConfig v-if="!defaultCity && canShow('cityConfig')" class="flex-container" :canShowContent="contentShown === 'city'" v-on:showContent="onShowContent"/>
    <ProductConfig v-if="canShow('productConfig')" class="flex-container" :canShowContent="contentShown === 'product'" v-on:showContent="onShowContent"/>
    <UrgentProductConfig v-if="canShow('urgentProductConfig')" class="flex-container" :canShowContent="contentShown === 'urgentProduct'" v-on:showContent="onShowContent"/>
    <PickupConfig v-if="canShow('pickupConfig')" class="flex-container" :canShowContent="contentShown === 'pickup'" v-on:showContent="onShowContent"/>
    <FamilyConfig v-if="canShow('familyConfig')" class="flex-container" :canShowContent="contentShown === 'family'" v-on:showContent="onShowContent"/>
    <MeasureConfig v-if="canShow('measureConfig')" class="flex-container" :canShowContent="contentShown === 'measure'" v-on:showContent="onShowContent"/>
    <UserConfig v-if="canShow('usersConfig')" class="flex-container" :canShowContent="contentShown === 'user'" v-on:showContent="onShowContent"/>
  </div>
</template>

<script>

import CityConfig from './CityConfig';
import ProductConfig from './ProductConfig';
import UrgentProductConfig from './UrgentProductConfig';
import PickupConfig from './PickupConfig';
import FamilyConfig from './FamilyConfig';
import MeasureConfig from './MeasureConfig';
import UserConfig from './UserConfig';
import switchKiller from '../../switchKiller.json';

export default {
    name: 'configuration',
    components: { CityConfig, ProductConfig, UrgentProductConfig, PickupConfig, FamilyConfig, MeasureConfig, UserConfig },
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

<style>
.column-container{
  flex-direction: column;
}

.config-item-close{
	position: absolute;
    right: 0;
    top: 0;
    color: rgb(51 51 51 / 41%);
    height: 100%;
    width: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>