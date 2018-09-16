<template>
  <div id="game">
    <game :game="game" :round="round" :playing="true"></game>
    <div id="guesser" v-if="myTurn">
      <div id="guess-label">How much is this?</div>
      <input id="guess" type="number" placeholder="0.00" v-model="guess">
      <div id="button-container"><light-button @click="doGuess" label="Guess!"></light-button></div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
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
    doGuess: function() {
      this.makeGuess(this.guess)
      this.guess = undefined
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
      if (this.game === undefined || this.round === undefined) return false
      let currentPlayer = this.game.playerStart + Object.values(this.round.answers).filter(answer => answer !== null).length
      if (currentPlayer >= this.game.playerCount) {
        currentPlayer -= this.game.playerCount
      }
      return this.round !== undefined && this.playerIndex === currentPlayer
    },
    round: function() {
      if (this.game === undefined) return
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
