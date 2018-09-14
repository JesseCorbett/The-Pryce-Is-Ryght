<template>
  <div id="game">
    <div class="result" v-if="allAnswered">
      <b>{{winnerName}} wins!</b><br>
      The real price was ${{round.subjectPrice / 100}}!
    </div>
    <div class="result" v-if="!game.active">
      <b>Game over!</b><br>
      {{game.result}}<br>
      <div @click="doClose" id="back-to-menu">Back to menu</div>
    </div>
    <div id="scores">
      <div class="score" v-for="score in scores" :key="score.uid">
        <div class="nick">{{game.playerData[score.uid].nickname}}: {{score.score}}</div>
        <div class="scoreNumber">{{score.guess === null ? '' : ('$' + (score.guess / 100))}}</div>
      </div>
    </div>
    <div id="picture-container" v-if="round">
      <img id="picture" :src="round.subjectImage" />
      <div id="title" v-html="round.subjectDescription"></div>
      <a id="link" target="_blank" :href="round.subjectUrl">Listing</a>
    </div>
    <div id="spinner" v-else>Starting game...</div>
    <div id="guesser" v-if="myTurn">
      <div id="guess-label">How much is this?</div>
      <input id="guess" type="number" placeholder="15.20" v-model="guess">
      <div id="button-container"><light-button @click="doGuess" label="Guess!"></light-button></div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import LightButton from '@/components/LightButton'

export default {
  name: 'Playing',
  components: {
    LightButton
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

      return this.game.players.map(player => { return { uid: player, score: scores[player], guess: this.round === undefined ? '' : this.round.answers[player] } })
    },
    allAnswered: function() {
      if (this.round === undefined) return false
      return Object.values(this.round.answers).filter(answer => answer === null).length === 0
    },
    winnerName: function() {
      if (this.round === undefined) return "Nobody"
      let winnerScore = -1
      let winner = undefined
      for (let index in this.game.players) {
        const player = this.game.players[index]
        if (this.round.answers[player] !== null) {
          const score = this.round.subjectPrice - this.round.answers[player]
          if (score >= 0 && (score < winnerScore || winnerScore < 0)) {
            winnerScore = score
            winner = player
          }
        }
      }

      if (winner === undefined) {
        return "Nobody"
      }

      return this.game.playerData[winner].nickname
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

#scores {
  width: 100%;
  max-width: 800px;
  height: 125px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin: 0 auto;
  overflow-x: auto;
  overflow-y: visible;
}

.score {
  flex-shrink: 0;
  height: 75px;
  flex-basis: 150px;
  margin: 0 5px;
  padding: 5px;
  background-color: rgb(26, 97, 26);
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 3px;
  box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.466);
}

.scoreNumber {
  height: 40px;
  font-size: 18px;
  font-style: italic;
  margin: 10px 0 -10px;
  background-color: white;
  border-radius: 3px;
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.466);
  padding: 10px;
  font-weight: bold;
}

.nick {
  font-size: 22px;
  font-weight: bold;
  margin: 5px 0 0;
  color: white;
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

#picture-container {
  position: relative;
  width: 90%;
  max-width: 500px;
  padding: 25px;
  margin: 0 auto;
  border-radius: 15px;
  background-color: rgb(252, 122, 1);
  box-shadow: 6px 8px yellow;
}

#picture {
  width: 100%;
  max-width: 500px;
  border-radius: 15px;
  margin: auto;
}

#title {
  margin: 10px 0 0;
  width: 100%; 
  max-width: 500px;
  font-size: 24px;
  font-weight: bold;
  color: white;
}

#link {
  position: absolute;
  bottom: 3px;
  right: 10px;
  font-size: 10px;
  color: rgb(65, 65, 65);
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
