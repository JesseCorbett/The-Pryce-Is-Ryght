<template>
  <div id="modal-container">
    <div v-if="game.private" id="private-instructions">
      Share this link to have your friends join you:<br>
      https://thepryceisryght.com/{{gameId}}
    </div>
    <div id="ready-modal">
      <div id="playerCount">
        {{playerCountText}}
        <hr>
      </div>
      <label for="nickname">Nickname</label>
      <input id="nickname" maxlength="14" v-model="nickname" :readonly="ready">
      <div id="submit"><light-button @click="readyUp" :label="readyText"></light-button></div>
      <div id="ownerStart" v-if="gameOwner">
        <hr>
        <div v-if="allReady">Everyone is ready, click start!</div>
        <div v-if="!allReady">When eveyone is ready, click start!</div>
        <light-button @click="startGame" :disabled="!allReady" label="Start"></light-button>
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
    },
    playerCountText: function() {
      let message
      if (this.game.players.length === 1) {
        message = "You're the only one here, you can start by yourself if you want"
      } else if (this.game.players.length === 2) {
        message = "There's one other player here"
      } else {
        message = "There are " + (this.game.players.length - 1) + " other players in your game"
      }

      if (this.game.players.length === 4 && !this.game.private) {
        message = message + ". That's the max for a public game. Go ahead and start!"
      }
      return message
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

#playerCount {
  width: 100%;
  font-size: 20px;
  font-weight: bold;
  color: white;
  text-align: center;
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

#nickname:read-only {
  background-color: lightgray;
}

#ownerStart {
  margin: 10px 0;
  color: white;
  font-size: 18px;
  font-stretch: condensed;
  text-align: center;
}
</style>