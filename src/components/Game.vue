<template>
  <div>
    <div class="result" v-if="allAnswered">
      <b>{{winnerName}} wins!</b><br>
      The real price was ${{round.subjectPrice / 100}}!
    </div>
    <div class="result" v-if="!game.active">
      <b>Game over!</b><br>
      {{game.result}}<br>
      <div @click="doClose" id="back-to-menu">Back to menu</div>
    </div>
    <scores :game="game"></scores>
    <div id="picture-container" v-if="round">
      <img id="picture" :src="round.subjectImage" />
      <div id="title" v-html="round.subjectDescription"></div>
      <a id="link" target="_blank" :href="round.subjectUrl">Listing</a>
    </div>
    <div id="spinner" v-else>Starting game...</div>
  </div>
</template>

<script>
import Scores from '@/components/Scores'

export default {
  name: 'Game',
  components: {
    Scores
  },
  props: {
    game: Object,
    round: Object
  },
  computed: {
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
</style>

