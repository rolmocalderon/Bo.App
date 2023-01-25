<template>
  <div class="app-content">
    <div v-if="isLogged" class="container">
		<div class="greeting background-blue">
			<span>Te damos la bienvenida <strong>{{ user.name }}</strong></span>
			<span class="log-off" v-on:click="logOff">Salir</span>
		</div>
    <img class="logo" alt="Vue logo" src="../assets/logo.png" v-on:click="userNavigated('')"/>
		<Navigator v-if="navigateOption == ''" @navigated="userNavigated"/>
		<Albaran v-if="navigateOption.includes('pickups')" :user="user" v-on:navigation="userNavigated" :title="'Recogidas'"/>
		<Administration v-if="navigateOption.includes('admin')" v-on:navigation="userNavigated" :user="user"/>
    </div>
    <div v-if="!isLogged" class="login-container">
      <img class="logo" alt="Vue logo" src="../assets/logo.png"/>
      <Login v-on:input="logIn" />
    </div>
  </div>
</template>

<script>
import Login from "./Login";
import Albaran from "./Albaran";
import Navigator from "./Navigator";
import cookies from "../services/cookies";
import Administration from "./Administration";

export default {
  name: "Main",
  components: { Login, Albaran, Navigator, Administration },
  created() {
    if (this.isUserLogged()) {
      this.isLogged = true;
      this.user = cookies.getCookie("user");
      this.initCities();
      this.initMeasures();
      this.loginCheckin();
    } else {
      localStorage.cities = ""; 
    }

    this.navigateOption = this.navigation ? this.navigation.page : '';
  },
  data: function () {
    return {
      isLogged: false,
      navigateOption: "",
      isCheckin: false,
    };
  },
  methods: {
    logIn(value) {
      if(value){
        this.setUser(value);
        this.isLogged = true;
        cookies.createCookie("user", JSON.stringify(this.user));
        this.initCities();
        this.initMeasures();
        this.loginCheckin();
      }
    },
    userNavigated(event) {
      this.navigateOption = event;
      this.navigate(event);
    },
    isUserLogged() {
      let cookie = cookies.getCookie("user");
      return cookie && cookie.name != '';
    },
    initCities() {
      let cities = this.getFromLocalStorage('cities');
      if(cities === '') {
        this.getCities()
      }
    },
    initMeasures() {
      let measures = this.getFromLocalStorage("measures");
      if (measures === "") {
        let self = this;
        this.getAll("getMeasures", function (res) {
			self.updateLocalStorage("measures", res);
        });
      }
    },
    loginCheckin() {
      if(!this.isCheckin){
        var self = this;
        this.isCheckin = true;
        var interval = null;
        interval = setInterval(function() {
          if(cookies.getCookie("user") === "" || !cookies.getCookie("user")) {
            self.logOff();
            clearInterval(interval);
          }
        }, 1000);
      }
    },
    logOff() {
      this.isLogged = false;
      sessionStorage.clear();
      cookies.removeCookie('user');
      this.navigateOption = '';
      this.updateLocalStorage('cities', '');
      this.updateLocalStorage('measures', '');
    }
  }
};
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

.app-content {
  height: 100%;
}

.login-container {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.background-blue {
  background: #4065AD !important;
  color: white;
}
.greeting {
  width: 100%;
  padding: 0.5rem;
}
.log-off {
	float: right;
    margin-right: 1rem;
}
.log-off:hover {
  cursor: pointer;
  text-decoration: underline;
}

/* TRANSITIONS */ 
.slide-enter-active {
   -moz-transition-duration: 0.3s;
   -webkit-transition-duration: 0.3s;
   -o-transition-duration: 0.3s;
   transition-duration: 0.3s;
   -moz-transition-timing-function: ease-in;
   -webkit-transition-timing-function: ease-in;
   -o-transition-timing-function: ease-in;
   transition-timing-function: ease-in;
}

.slide-leave-active {
   -moz-transition-duration: 0.3s;
   -webkit-transition-duration: 0.3s;
   -o-transition-duration: 0.3s;
   transition-duration: 1s;
   -moz-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
   -webkit-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
   -o-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
   transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
}

.slide-enter-to, .slide-leave {
   max-height: 100vh;
   overflow: hidden;
}

.slide-enter, .slide-leave-to {
   overflow: hidden;
   max-height: 0;
}

/* CONFIGURATION */

.configuration-container{
  width: 100%;
  margin-top: 1rem;
}
.configuration-content{
  width: 90%;
}
.configuration-header{
  padding: 1rem;
  background-color: #4065AD;
  color: white;
  border-radius: 4px 4px 0 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: relative;
  font-size: 1rem;
  font-weight: 700;
}
.configuration-values{
  display: flex;
  flex-direction: column;
}
.config-item{
  padding: 1rem;
  background-color: white;
  border-bottom: 1px solid rgba(0,0,0,0.1);
  position: relative;
}
.config-item:last-child{
  border-radius: 0 0 4px 4px;
  margin-bottom: 1rem;
}
.configuration-header > .right-icon{
  position: absolute;
  right: 1rem;
  font-size: 1.5rem;
}

.config-item > .right-icon{
  position: absolute;
  right: 1rem;
  font-size: 1.2rem;
}

.checkbox-inline{
  position: relative;
  display: inline-block;
  padding-left: 20px;
  margin-bottom: 0;
  font-weight: 400;
  vertical-align: middle;
  cursor: pointer;
}
.item{
  flex: 1;
}
.item:first-child{
  flex: 2;
}
.item-selectable{
  height: 1.2rem;
  width: 1.2rem;
}
</style>
