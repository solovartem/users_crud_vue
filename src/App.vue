<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="../assets/dummy-profile.jpg"> -->
    <!--  <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <User />
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import User from './views/User/Index'
export default {
  name: 'App',
  components: {
    // HelloWorld
    User
  }
}
</script>

<style>
#app {
  
}
</style>
