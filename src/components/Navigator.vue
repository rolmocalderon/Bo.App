<template>
  <div class="navigators-container">
      <div class="navigator" v-for="navigator of navigators" v-bind:key="navigator.title">
          <div class="navigator-element background-blue" v-on:click="navigatorSelected" :id="navigator.id">
              {{ navigator.title }}</div>
      </div>
  </div>
</template>

<script>
export default {
    name: "Navigator",
    data: function(){
        return {
            navigators: [
                {
                    title: 'Recogidas',
                    description: '',
                    icon: '',
                    color: '',
                    id: 'pickups'
                },
                {
                    title: 'Repartos',
                    description: '',
                    icon: '',
                    color: '',
                    id: 'deliveries'
                }
            ]
        }
    },
    methods: {
        navigatorSelected(event){
            this.$emit('navigated', event.target.id)
        }
    }
}
</script>

<style>
.navigator{
    display: flex;
    align-items: center;
    justify-content: center;
}

.navigator-element:active{
    background: #4386c9;
}

.navigator-element{
    width: 80%;
    padding: 1rem;
    margin: 1rem;
    color: white;
}

.navigator-icon{

}
</style>