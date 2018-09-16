<template>
  <div id="scores">
    <div class="score" v-for="score in scores" :key="score.uid">
      <div class="nick">{{game.playerData[score.uid].nickname}}: {{score.score}}</div>
      <div class="scoreNumber">{{score.guess ? ('$' + (score.guess / 100)) : score.uid === playerTurn ? 'Guessing' : ''}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Scores',
  props: {
    game: Object,
    round: Object
  },
  computed: {
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
    playerTurn: function() {
      const answerCount = Object.values(this.round.answers).filter(answer => answer !== null).length

      let playerIndex = answerCount + this.game.playerStart
      if (playerIndex >= this.game.playerCount) {
        playerIndex -= this.game.playerCount
      }
       return this.game.players[playerIndex]
    }
  }
}
</script>

<style scoped>
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
</style>
