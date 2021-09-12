<template>
  <v-app>
    <div id="app">
      <div class="hidden-xs-only app-style-sm-and-up">
        <div class="tu-logo-container">
          <div class="tu-logo"></div>
          <div class="cls-banner-container">
            <img
              alt="Center for Scripture Engagement Logo"
              src="./assets/Cls+results+letter+banner+2+half+size.png"
            />
            <v-main>
              <router-view />
            </v-main>
          </div>
        </div>
      </div>
      <!-- https://v15.vuetifyjs.com/en/framework/display/ -->
      <div class="hidden-sm-and-up">
        <img
          alt="Center for Scripture Engagement Logo"
          src="./assets/Cls+results+letter+banner+2+half+size.png"
          width="100%"
        />
        <v-main>
          <router-view />
        </v-main>
      </div>
    </div>
  </v-app>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
}

.app-style-sm-and-up {
  //https://www.w3schools.com/cssref/playit.asp?filename=playcss_background-size&preval=200px
  height: 465px;
  //background-color: red; /* For browsers that do not support gradients */
  background-image: url(./assets/TU-striped-background.png); //linear-gradient(red, yellow); /* Standard syntax (must be last) */
  background-repeat: repeat-x;
  background-size: 100% 100%;
}

img {
  padding: 12px;
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
  background-size: 448px 128px;
}

.cls-banner-container {
  background: white;
  padding-top: 27px;
}

.button-colour {
  color: #4e2b4d;
}

.alt-button-colour {
  color: #846d82;
}
</style>
