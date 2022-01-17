<template>
  <form ref="loginForm">
        <input type="text" v-model="name" name="name" placeholder="Insert name">
        <input type="password" v-model="password" name="password" placeholder="Insert password">
        <input type="submit" value="LogIn" v-on:click="submit">
      </form>
</template>

<script>
import axios from 'axios';
export default {
    name: "login",
    data: function(){
        return {
            name: "",
            password: ""
        }
    },
    methods:{
        submit(event){
            event.preventDefault();
            this.login(this.name, this.password);
        },
        login(name, password){
            axios({
                method: 'get',
                url: 'http://192.168.1.41:3000/login',
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                },
                params: {
                    name: name,
                    password: password
                }
            }).then(response => {
                if(response.data.data.length > 0){
                    this.updateValue(response.data.data);
                }
            });
        },
        updateValue: function (value) {
            this.$emit('input', value);
        }
    }
}
</script>