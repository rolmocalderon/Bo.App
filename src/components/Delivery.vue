<template>
  <div class="delivery">
      <div class="delivery-selector">
          <HeaderBar v-on:backSelected="goBack" :added="onAdded" :user="user" :title="title" :subtitle="''" :icon="'calendar-plus'" :iconSubtitle="'Añadir reparto'"/>
          <ProductSelector v-if="!showFamilies" :user="user" v-on:dateChanged="onDateChanged" :selectorName="'delivery'"></ProductSelector>
          <div v-if="showFamilies" class="families-container">
              <div class="family" v-for="family of families" v-bind:key="family.alias">
                  {{ family.alias }}
              </div>
          </div>
      </div>
  </div>
</template>

<script>
import HeaderBar from './HeaderBar';
import ProductSelector from './ProductSelector.vue';
export default {
    name: 'delivery',
    props: ["title","user"],
    components: {HeaderBar,ProductSelector},
    data(){
        return {
            families: [
                {'alias': 'family1', 'members': 3, 'products': [{'id':1, 'quantity': 2},{'id':2, 'quantity': 1},{'id':3, 'quantity': 3}]},
                {'alias': 'family2', 'members': 2, 'products': [{'id':2, 'quantity': 1},{'id':2, 'quantity': 1},{'id':2, 'quantity': 2}]},
                {'alias': 'family3', 'members': 4, 'products': [{'id':4, 'quantity': 3},{'id':3, 'quantity': 2},{'id':3, 'quantity': 1}]}
            ],
            showFamilies: false
        }
    },
    created(){
        console.log(this.title, this.user)
    },
    methods:{
        goBack(target = ''){
            this.$emit('navigation', target);
        },
        onAdded(){
            console.log("Aquest no pot ser");
        },
        onDateChanged(){
            this.showFamilies = true;
        }
    }
}
</script>

<style scoped>
.delivery{
  display: flex;
  flex-direction: column;
  align-items: center;
}
.delivery-container{
  width: 100%;
}
.delivery-selector{
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.families-container{
    width: 100%;
    background: white;
}
.family{
    padding: 1rem;
}
</style>