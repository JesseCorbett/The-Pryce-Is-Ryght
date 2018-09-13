<template>
  <div id="game">
    <div id="scores">
      <div class="score" v-for="score in scores" :key="score.uid">
        <div class="nick">{{game.playerData[score.uid].nickname}}</div>
        <div class="scoreNumber">{{score.score}}</div>
      </div>
    </div>
    <div id="picture-container" v-if="round !== undefined">
      <img id="picture" :src="round.subjectImage" />
      <div id="title" v-html="round.subjectDescription"></div>
      <a id="link" target="_blank" :href="round.subjectUrl">Link to listing</a>
    </div>
    <div id="guesser" v-if="myTurn">
      <label for="guess">How much is this?</label>
      <input id="guess" type="number" placeholder="15.20" v-model="guess">
      <div id="button-container"><light-button @click="doGuess" label="Guess!"></light-button></div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import LightButton from '@/components/LightButton'

export default {
  name: 'Playing',
  components: {
    LightButton
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
    round: function() {
      return this.game.rounds[this.game.rounds.length - 1]
    },
    playerIndex: function() {
      let i 
      for (i = 0; i < this.game.players.length; i++) {
        if (this.game.players[i] === this.userId) return i
      }
    },
    myTurn: function() {
      return this.round !== undefined && this.playerIndex === (this.game.playerStart + Object.values(this.round.answers).filter(answer => answer !== null).length)
    },
    scores: function() {
      const scores = {}
      this.game.players.forEach(player => scores[player] = 0)
      
      let roundI
      for (roundI = 0; roundI < this.game.rounds.length - 1; roundI++) {
        let bestScore = -1
        let winner = undefined

        for (let player in this.game.players) {
          const score = this.game.rounds[roundI].subjectPrice - this.game.rounds[roundI].answers[this.game.players[player]]
          if (score >= 0 && (score < bestScore || bestScore < 0)) {
            bestScore = score
            winner = this.game.players[player]
          }
        }

        if (winner !== undefined) {
          scores[winner] += 100
        }
      }

      return this.game.players.map(player => { return { uid: player, score: scores[player] } })
    }
  }
}
</script>

<style scoped>
#game {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

#scores {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 0 25px;
}

.score {
  flex-basis: 150px;
  width: 150px;
  background-color: rgb(26, 97, 26);
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 3px;
  box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.466);
}

.scoreNumber {
  font-size: 18px;
  font-style: italic;
  margin: 10px 0 -10px;
  background-color: white;
  border-radius: 3px;
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.466);
  padding: 10px;
}

.nick {
  font-size: 22px;
  font-weight: bold;
  margin: 5px 0 0;
  color: white;
}

#picture-container {
  padding: 25px;
  border-radius: 15px;
  background-color: rgb(252, 122, 1);
  box-shadow: 6px 8px yellow;
}

#picture {
  width: 500px;
  max-width: 450px;
  border-radius: 15px;
}

#title {
  margin: 10px 0 0;
  width: 500px;
  font-size: 24px;
  font-weight: bold;
  color: white;
}

#link {
  font-size: 10px;
  color: black;
}

#guesser {
  width: 350px;
  margin: 25px 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 5px;
  background-color: rgb(252, 122, 1);
  box-shadow: 3px 4px yellow;
}

label {
  color: white;
  font-weight: bold;
  font-size: 24px;
  margin: 10px 0;
}

#guess {
  width: 100px;
  height: 40px;
  margin: 5px 0 0;
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
    margin: 0;
}

#button-container {
  margin: 20px;
}
</style>
