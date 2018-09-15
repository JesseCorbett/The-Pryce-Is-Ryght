<template>
  <div id="page">
    <div id="logo-container"><img id="logo" alt="Game logo" src="@/assets/logo.png"></div>
    <div id="content">
      <div id="button-background"></div>
      <light-button class="start" @click="joinRandomGame" label="Join a random game"></light-button>
      <light-button class="start" @click="startPrivateGame" label="Start a private game"></light-button>
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
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  padding: 5px 0 25px;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
}

#logo-container {
  max-width: 400px;
  width: 90%;
}

#logo {
  width: 100%;
}

#content {
  position: relative;
  width: 300px;
  box-sizing: border-box;
}

#button-background {
  position: absolute;
  top: -20px;
  bottom: -20px;
  left: -25px;
  right: -25px;
  background-color: rgb(252, 122, 1);
  transform: skew(15deg);
  box-shadow: 6px 8px yellow;
  z-index: -1;
  border-radius: 4px;
}

.start {
  margin: 10px auto;
}
</style>
