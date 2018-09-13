<template>
  <div id="modal-container">
    <div v-if="game.private" id="private-instructions">
      Share this link to have your friends join you:<br>
      https://thepryceisryght.com/{{gameId}}
    </div>
    <div id="ready-modal">
      <label for="nickname">Nickname</label>
      <input id="nickname" maxlength="14" v-model="nickname" :readonly="ready">
      <div id="submit"><light-button @click="readyUp" :label="readyText"></light-button></div>
      <div id="ownerStart" v-if="gameOwner">
        <hr>
        <div v-if="allReady">Everyone is ready, click start!</div>
        <div v-if="!allReady">When eveyone is ready, click start!</div>
        <light-button @click="startGame" label="Start"></light-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import LightButton from '@/components/LightButton'

export default {
  name: 'Waiting',
  components: {
    LightButton
  },
  methods: {
    ...mapActions(['toggleReady', 'startGame']),
    readyUp: function() {
      if (this.debounce) return
      this.debounce = true
      this.toggleReady(this.nickname)
    }
  },
  data: function() {
    return {
      nickname: undefined,
      debounce: false,
      location: window.location
    }
  },
  watch: {
    ready: function() {
      this.debounce = false
    }
  },
  computed: {
    ...mapGetters(['gameOwner']),
    ...mapState(['game', 'gameId', 'userId', 'ready', 'allReady']),
    readyText: function() {
      return this.ready ? "I'm not ready!" : "I'm ready!"
    }
  }
}
</script>

<style scoped>
#modal-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

#private-instructions {
  margin: 0 0 10px;
  background-color: rgb(26, 97, 26);
  color: white;
  border-radius: 30px;
  width: 550px;
  height: 60px;
  font-size: 20px;
  line-height: 30px;
  text-align: center;
}

#ready-modal {
  width: 300px;
  background-color: #FC7A01;
  border-radius: 7px;
  box-shadow: 4px 7px yellow;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
}

label {
  font-size: 24px;
  font-weight: bold;
  font-style: italic;
  color: white;
}

#nickname {
  width: 70%;
  height: 40px;
  margin: 5px 0 25px;
  font-size: 24px;
  line-height: 40px;
  border-radius: 10px;
  border-style: inset;
  border-color: rgb(255, 164, 79);
  text-align: center;
  font-weight: bold;
}

#ownerStart {
  margin: 10px 0;
  color: white;
  font-size: 18px;
  font-stretch: condensed;
  text-align: center;
}
</style>