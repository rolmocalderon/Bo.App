<template>
  <div class="app-content">
    <div v-if="isLogged" class="container">
      <div class="greeting background-blue">Te damos la bienvenida <strong>{{ user.name }}</strong></div>
      <img class="logo" alt="Vue logo" src="../assets/logo.png" v-on:click="userNavigated('')">
      <Navigator v-if="navigateOption == ''" @navigated="userNavigated"/>
      <Albaran v-if="navigateOption == 'pickups'" :user="user" v-on:navigation="userNavigated" :title="'Recogidas'"/>
      <Delivery v-if="navigateOption == 'delivery'" :user="user" v-on:navigation="userNavigated" :title="'Repartos'"/>
      <div v-if="navigateOption == 'admin'">
        <Administration :user="user" v-on:navigation="userNavigated"/>
      </div>
    </div>
    <div v-if="!isLogged" class="login-container">
      <Login v-on:input="logIn"/>
    </div>
  </div>
</template>

<script>
import Login from './Login';
import Albaran from './Albaran';
import Navigator from './Navigator';
import Delivery from './Delivery';
import cookies from '../services/cookies';
import Administration from './Administration';

export default {
  name: 'Main',
  components: { Login, Albaran, Navigator, Delivery, Administration },
  created(){
    if(this.isUserLogged()){
      this.isLogged = true;
      this.user = JSON.parse(cookies.getCookie("user"));
      this.user = this.getFromLocalStorage('user');
      this.initCities();
      this.loginCheckin();
    }else{
      localStorage.cities = '';
    }

    if(sessionStorage.getItem('currentPage') === "pickups"){
      this.navigateOption = "pickups";
    }
  },
  data: function(){
    return {
      isLogged: false,
      user: {},
      navigateOption: '',
      isCheckin: false
    }
  },
  methods:{
    logIn(value){
      this.user = {
        'name': value[0].name,
        'category': value[0].category,
        'cityid': value[0].cityid
      }
      this.isLogged = value != undefined;
      cookies.createCookie('user', JSON.stringify(this.user));
      this.initCities();
      this.loginCheckin();
    },
    userNavigated(event){
      if(event === "pickups"){
        sessionStorage.setItem('currentPage', "pickups");
      }else{
        sessionStorage.setItem('currentPage', "");
      }
      this.navigateOption = event;
    },
    isUserLogged() {
      let cookie = cookies.getCookie("user");
      return cookie && cookie.name != '';
    },
    initCities(){
      let cities = this.getFromLocalStorage('cities');
      if(cities === ''){
        let self = this;
        this.getAll("getCities", function(res){
          self.updateLocalStorage('cities', res);
        });
      }
    },
    loginCheckin(){
      if(!this.isCheckin){
        var self = this;
        this.isCheckin = true;
        var interval = null;
        interval = setInterval(function(){
          if(cookies.getCookie("user") === "" || !cookies.getCookie("user")){
            self.isLogged = false;
            sessionStorage.clear();
            clearInterval(interval);
          }
        }, 1000);
      }
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
  background: #5d85c5 !important;
  color: white;
}
.greeting{
  width: 100%;
  padding: 0.5rem;
}
</style>
