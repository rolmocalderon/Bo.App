<template>
  <div class="app-content">
    <div v-if="isLogged" class="container">
		<div class="greeting background-blue">
			<span>Te damos la bienvenida <strong>{{ user.name }}</strong></span>
			<span class="log-off" v-on:click="logOff">Salir</span>
		</div>
		<img class="logo" alt="Vue logo" src="../assets/logo.png" v-on:click="userNavigated('')"/>
		<Navigator v-if="navigateOption == ''" @navigated="userNavigated"/>
		<Albaran v-if="navigateOption == 'pickups'" :user="user" v-on:navigation="userNavigated" :title="'Recogidas'"/>
		<Administration v-if="navigateOption == 'admin'" :user="user" v-on:navigation="userNavigated" />
    </div>
    <div v-if="!isLogged" class="login-container">
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

    if (sessionStorage.getItem("currentPage") === "pickups") {
      this.navigateOption = "pickups";
    }
  },
  data: function () {
    return {
      isLogged: false,
      user: {},
      navigateOption: "",
      isCheckin: false,
    };
  },
  methods: {
    logIn(value) {
		if(value){
			this.user = {
				name: value[0].name,
				category: value[0].category,
				cityid: value[0].cityid,
			};
			this.isLogged = true;
			cookies.createCookie("user", JSON.stringify(this.user));
			this.initCities();
			this.initMeasures();
			this.loginCheckin();
		}
    },
    userNavigated(event) {
      if (event === "pickups") {
        sessionStorage.setItem("currentPage", "pickups");
      } else {
        sessionStorage.setItem("currentPage", "");
      }
      this.navigateOption = event;
    },
    isUserLogged() {
      let cookie = cookies.getCookie("user");
      return cookie && cookie.name != '';
    },
    initCities() {
      let cities = this.getFromLocalStorage('cities');
      if(cities === '') {
        let self = this;
        this.getAll("getCities", function (res) {
          let cities = self.user.cityid ? res.filter((c) => c.id === self.user.cityid) : res;
          self.updateLocalStorage('cities', cities);
        });
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
}
.background-blue {
  background: #5d85c5 !important;
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
</style>
