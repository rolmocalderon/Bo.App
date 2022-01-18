<template>
  <div class="app-content">
    <div v-if="isLogged" class="container">
      <img class="logo" alt="Vue logo" src="../assets/logo.png">
      <Albaran v-bind:user="user"/>
    </div>
    <div v-if="!isLogged" class="login-container">
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

<style>
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

.app-content{
  height: 100%;
}

.login-container {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
.background-blue{
  background: #4386c9 !important;
}
</style>
