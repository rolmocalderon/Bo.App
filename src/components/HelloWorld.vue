<template>
  <div class="login">
    <div v-if="isLogged" class="hello">
      <Albaran v-bind:user="user"/>
    </div>
    <div v-if="!isLogged">
      <Login v-on:input="updateValue"/>
    </div>
  </div>
</template>

<script>
import Login from './Login';
import Albaran from './Albaran';
export default {
  name: 'HelloWorld',
  components: {
    Login: Login,
    Albaran: Albaran
  },
  data: function(){
    return {
      isLogged: false, //ToBeTakenFromCookie
      user: {}
    }
  },
  methods:{
    updateValue(value){
      this.user = {
        'name': value[0].name,
        'category': value[0].category
      }
      this.isLogged = value != undefined;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
