<template>
  <div class="wrapper">
    <form action="#" v-on:submit="submit">
      <div class="row">
        <div class="login-icon">
          <font-awesome-icon icon="user" />
        </div>
        <input type="text" v-model="name" placeholder="Name" required />
      </div>
      <div class="row">
        <div class="login-icon">
          <font-awesome-icon icon="lock" />
        </div>
        <input type="password" v-model="password" placeholder="Password" required />
      </div>
      <div class="row button">
        <input v-if="!loading" type="submit" value="Login"/>
        <Spinner v-if="loading"/>
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import Spinner from "../components/Spinner";

export default {
  name: "login",
  components: { Spinner },
  data: function () {
    return {
      name: "",
      password: "",
      loading: false
    };
  },
  methods: {
    submit(event) {
      event.preventDefault();
      this.loading = true;
      this.login(this.name, this.password);
    },
    login(name, password) {
		const headers = {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
		};
		const params = {
          name: name,
          password: password,
        };
		axios.post(process.env.VUE_APP_WEBAPI_URL + "/login", params, {headers})
		.then((response) => {
			if (response.data.data.length > 0) {
        this.loading = false;
				this.updateValue(response.data.data);
			}
		});
    },
    updateValue: function (value) {
      this.$emit("input", value);
    },
  },
};
</script>

<style scoped>
.login-icon{
  position: absolute;
  top: 0.9rem;
  left: 1rem;
}
.login-form form {
  display: flex;
  flex-direction: column;
}

.login-form input,
.login-form label {
  text-align: left;
  margin: 0.3rem;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  background: #1abc9c;
  overflow: hidden;
}
::selection {
  background: rgba(26, 188, 156, 0.3);
}
.container {
  max-width: 440px;
  padding: 0 20px;
  margin: 170px auto;
}
.wrapper {
  width: 90%;
  background: #fff;
  border-radius: 5px;
  box-shadow: 0px 4px 10px 1px rgba(0, 0, 0, 0.1);
}
.wrapper .title {
  height: 90px;
  background: #4386c9;
  border-radius: 5px 5px 0 0;
  color: #fff;
  font-size: 30px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}
.wrapper form {
  padding: 30px 25px 25px 25px;
}
.wrapper form .row {
  height: 45px;
  margin-bottom: 15px;
  position: relative;
}
.wrapper form .row input {
  height: 100%;
  width: 100%;
  outline: none;
  padding-left: 60px;
  border-radius: 5px;
  border: 1px solid lightgrey;
  font-size: 16px;
  transition: all 0.3s ease;
}
form .row input:focus {
  border-color: #4386c9;
  box-shadow: inset 0px 0px 2px 2px rgba(26, 188, 156, 0.25);
}
form .row input::placeholder {
  color: #999;
}
.wrapper form .row i {
  position: absolute;
  width: 47px;
  height: 100%;
  color: #fff;
  font-size: 18px;
  background: #4386c9;
  border: 1px solid #4386c9;
  border-radius: 5px 0 0 5px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.wrapper form .pass {
  margin: -8px 0 20px 0;
}
.wrapper form .pass a {
  color: #4386c9;
  font-size: 17px;
  text-decoration: none;
}
.wrapper form .pass a:hover {
  text-decoration: underline;
}
.wrapper form .button input {
  color: #fff;
  font-size: 20px;
  font-weight: 500;
  padding-left: 0px;
  background: #4386c9;
  border: 1px solid #4386c9;
  cursor: pointer;
}
form .button input:hover {
  background: #12876f;
}
.wrapper form .signup-link {
  text-align: center;
  margin-top: 20px;
  font-size: 17px;
}
.wrapper form .signup-link a {
  color: #4386c9;
  text-decoration: none;
}
form .signup-link a:hover {
  text-decoration: underline;
}
</style>