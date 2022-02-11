<template>
  <div class="delivery=">
      <div class="delivery-selector">
          <HeaderBar v-on:backSelected="goBack" :added="onAdded" :user="user" :title="title" :subtitle="''" :icon="'calendar-plus'" :iconSubtitle="'Añadir reparto'"/>
      </div>
  </div>
</template>

<script>
import HeaderBar from './HeaderBar';
export default {
    name: 'delivery',
    props: ["title","user"],
    components: {HeaderBar},
    created(){
        console.log(this.title, this.user)
    },
    methods:{
        goBack(target = ''){
            this.$emit('navigation', target);
        },
        onAdded(){
            console.log("Aquest no pot ser");
        }
    }
}
</script>

<style scoped>

</style>