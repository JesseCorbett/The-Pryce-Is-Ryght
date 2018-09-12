<template>
  <div id="page">
    <img id="logo" alt="Game logo" src="@/assets/logo.png">
    <div id="content">
      <div id="button-background"></div>
      <div class="button-container"><div class="button" @click="joinRandomGame">Join a random game</div></div>
      <div class="button-container"><div class="button" @click="startPrivateGame">Start a private game</div></div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Dashboard',
  methods: mapActions(['joinRandomGame', 'startPrivateGame'])
}
</script>

<style scoped>
#page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  overflow-x: hidden;
  overflow-y: scroll;
}

#logo {
  margin: 5% 0 0;
  width: 400px;
  max-width: 95%;
  height: 400px;
}

#content {
  position: relative;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  margin: 10px 0 15%;
  box-sizing: border-box;
}

@media only screen and (max-width: 600px) {
  #content {
    min-width: 410px;
    min-height: 220px;
  }
}

#button-background {
  position: absolute;
  top: -10px;
  bottom: -10px;
  left: -10px;
  right: -10px;
  background-color: rgb(252, 122, 1);
  transform: skew(15deg);
  box-shadow: 6px 8px yellow;
  z-index: -1;
  border-radius: 4px;
}

@keyframes blink { 
   50% { border-color: white; } 
}

.button-container {
  animation: blink .75s step-end infinite alternate;
  display: flex;
  flex-basis: 285px;
  align-items: center;
  justify-content: center;
  margin: 5px 10px;
  width: 285px;
  height: 85px;
  border-radius: 35px;
  border-color: rgb(233, 233, 1);
  border-width: 7px;
  border-style: dotted;
}

.button {
  user-select: none;
  font-family: 'IBM Plex Sans', sans-serif;
  cursor: pointer;
  width: 270px;
  height: 70px;
  background: linear-gradient(135deg, rgb(255, 51, 0) 0%, rgb(167, 33, 0) 100%);
  border-style: groove;
  border-color: rgb(255, 51, 0);
  border-radius: 25px;
  border-width: 5px;
  color: white;
  line-height: 70px;
  font-weight: bold;
  font-size: 26px;
  text-align: center;
}

.container:hover {
  border-color: white;
}
</style>
