<template>
  <div id="app">
    <Main/>
  </div>
</template>

<script>
import Main from './views/Main.vue'

export default {
  name: 'App',
  components: {
    Main
  }
}
</script>

<style>
@import '../node_modules/typeface-roboto/index.css';
@font-face {
  font-family: "Montserrat-Regular";
  src: local("Montserrat-Regular"),   url(./assets/fonts/Montserrat-Regular.ttf) format("truetype");
}
@font-face {
  font-family: "Montserrat-Medium";
  src: local("Montserrat-Medium"),   url(./assets/fonts/Montserrat-Medium.ttf) format("truetype");
}
@font-face {
  font-family: "Montserrat-Bold";
  src: local("Montserrat-Bold"),   url(./assets/fonts/Montserrat-Bold.ttf) format("truetype");
}
html,body{
  margin: 0;
  padding: 0;
  background: #06346f;
  color: #06346f;
  height: 100%;
  overflow-x: hidden;
}
#app {
  font-family: 'Montserrat-Regular', Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  width: 100%;
}

.logo{
  width: 7rem;
  margin: 1rem;
}

.disabled{
  background-color: #dfdfdf !important;
  color: #9f9f9f !important;
  pointer-events: none;
}

input:focus::placeholder {
  color: transparent;
}

.hidden{
  display: none !important;
}

.flex-container{
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
