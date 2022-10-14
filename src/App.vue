<template>
  <div id="app">
    <Main/>
  </div>
</template>

<script>
import Main from './components/Main.vue'

export default {
  name: 'App',
  components: {
    Main
  }
}
</script>

<style>
@import '../node_modules/typeface-roboto/index.css';
html,body{
  margin: 0;
  padding: 0;
  background: #06346f;
  color: #06346f;
  height: 100%;
  overflow-x: hidden;
}
#app {
  font-family: Roboto, Avenir, Helvetica, Arial, sans-serif;
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

input::-webkit-input-placeholder {
     color: black;
     opacity: 0.2;
}
</style>
