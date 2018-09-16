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
    <scores :game="game" :round="round"></scores>
    <div id="picture-container" v-if="round">
      <img id="picture" :src="round.subjectImage" />
      <div id="title" v-html="round.subjectDescription"></div>
      <a id="link" target="_blank" :href="round.subjectUrl">Listing</a>
    </div>
    <div id="spinner" v-else>Starting game...</div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import Scores from '@/components/Scores'

export default {
  name: 'Game',
  components: {
    Scores
  },
  props: {
    game: Object,
    round: Object,
    playing: Boolean
  },
  methods: {
    ...mapMutations(['endGame']),
    doClose: function() {
      if (this.playing) {
        this.endGame()
      }
      this.$router.push('/')
    }
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
  cursor: pointer;
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
</style>
