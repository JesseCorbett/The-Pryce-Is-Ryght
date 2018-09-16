<template>
  <div id="game">
    <game :game="game" :round="round"></game>
    <div id="guesser" v-if="myTurn">
      <div id="guess-label">How much is this?</div>
      <input id="guess" type="number" placeholder="0.00" v-model="guess">
      <div id="button-container"><light-button @click="doGuess" label="Guess!"></light-button></div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import LightButton from '@/components/LightButton'
import Game from '@/components/Game'

export default {
  name: 'Playing',
  components: {
    LightButton,
    Game
  },
  data: function() { return { guess: '' } },
  methods: {
    ...mapActions(['makeGuess']),
    ...mapMutations(['endGame']),
    doGuess: function() {
      this.makeGuess(this.guess)
      this.guess = undefined
    },
    close: function() {
      this.endGame()
      this.$router.push('/')
    }
  },
  computed: {
    ...mapState(['game', 'userId']),
    playerIndex: function() {
      let i 
      for (i = 0; i < this.game.players.length; i++) {
        if (this.game.players[i] === this.userId) return i
      }
    },
    myTurn: function() {
      return this.round !== undefined && this.playerIndex === (this.game.playerStart + Object.values(this.round.answers).filter(answer => answer !== null).length)
    },
    round: function() {
      return this.game.rounds[this.game.rounds.length - 1]
    }
  }
}
</script>

<style scoped>
#game {
  width: 100%;
  height: 100%;
}

.result {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  width: 400px;
  height: 120px;
  padding: 10px 0;
  background-color: rgb(26, 97, 26);
  color: white;
  text-align: center;
  font-size: 28px;
  line-height: 50px;
  box-shadow: 5px 7px 7px rgba(0, 0, 0, 0.7);
  border-radius: 5px;
  z-index: 999;
}

#back-to-menu {
  position: absolute;
  bottom: -35px;
  left: 0;
  right: 0;
  background-color: rgb(252, 122, 1);
  border-radius: 30px;
  margin: 0 auto;
  width: 250px;
  height: 60px;
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.5);
  text-decoration: none;
  color: white;
  line-height: 60px;
}

#spinner {
  width: 300px;
  height: 100px;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  color: white;
  font-size: 30px;
  font-weight: bold;
  text-align: center;
  line-height: 100px;
}

#guesser {
  display: block;
  width: 350px;
  margin: 30px auto 10px;
  padding: 1px;
  border-radius: 5px;
  background-color: rgb(252, 122, 1);
  box-shadow: 3px 4px yellow;
}

#guess-label {
  color: white;
  font-weight: bold;
  font-size: 24px;
  margin: 15px auto 0;
  text-align: center;
}

#guess {
  display: block;
  width: 120px;
  height: 40px;
  margin: 10px auto;
  font-size: 24px;
  line-height: 40px;
  border-radius: 10px;
  border-style: inset;
  border-color: rgb(255, 164, 79);
  text-align: center;
  font-weight: bold;
}

#guess::-webkit-outer-spin-button, #guess::-webkit-inner-spin-button {
    -webkit-appearance: none;
}

#button-container {
  margin: 20px;
}
</style>
