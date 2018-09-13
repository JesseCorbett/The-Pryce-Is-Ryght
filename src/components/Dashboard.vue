<template>
  <div id="page">
    <div id="logo-container"><img id="logo" alt="Game logo" src="@/assets/logo.png"></div>
    <div id="content">
      <div id="button-background"></div>
      <light-button @click="joinRandomGame" label="Join a random game"></light-button>
      <light-button @click="startPrivateGame" label="Start a private game"></light-button>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import LightButton from '@/components/LightButton'

export default {
  name: 'Dashboard',
  components: {
    LightButton
  },
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
  overflow: hidden;
}

#logo-container {
  margin: 5% 0 0;
  max-width: 400px;
  width: 90%;
}

#logo {
  width: 100%;
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

@media only screen and (max-width: 600px) and (min-width: 401px) {
  #logo-container {
    margin-top: 5%;
  }

  #content {
    min-width: 410px;
    min-height: 220px;
    margin-bottom: 10%;
  }
}

@media only screen and (max-width: 400px) {
  #logo-container {
    margin-top: 3px;
  }

  #content {
    min-width: 410px;
    min-height: 220px;
    margin-bottom: 0;
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

.container:hover {
  border-color: white;
}
</style>
