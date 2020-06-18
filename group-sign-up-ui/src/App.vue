<template>
<v-app>
  <div id="app">
    <div class="tu-logo-container">
      <div class="tu-logo"></div>
    <!--<div class="gradient-bar"></div>-->
      <div class="cls-banner-container">
        <GroupSignUp msg="Welcome dude to Your Vue.js + TypeScript App"/>
      </div>
    </div>
  </div>
</v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from './components/HelloWorld.vue';
import GroupSignUp from './pages/GroupSignUp.vue';

@Component({
  components: {
    HelloWorld,
    GroupSignUp,
  },
})
export default class App extends Vue {}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
  //https://www.w3schools.com/cssref/playit.asp?filename=playcss_background-size&preval=200px
  height: 465px;
  //background-color: red; /* For browsers that do not support gradients */
  background-image: url(./assets/TU-striped-background.png); //linear-gradient(red, yellow); /* Standard syntax (must be last) */
  background-repeat: repeat-x;
  background-size: 100% 100%;
}

.tu-logo-container {
  width: 792px;
  height: 1000px;
  //background: white;
  // https://www.freecodecamp.org/news/how-to-center-things-with-style-in-css-dc87b7542689/
  display: inline-block;
}

.tu-logo {
  background-image: url(./assets/TU-logo.png);
  //width: 772px;
  height: 212px;
  background-size: 60% 60%;
}

.cls-banner-container {
  background: white;
  padding-top: 12px;
}

</style>
