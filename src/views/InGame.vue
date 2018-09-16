<template>
  <div id="page">
    <spectating v-if="spectating" :game="foundGame"></spectating>
    <joining v-if="joining" :gameId="pathGameId"></joining>
    <waiting v-if="starting"></waiting>
    <playing v-if="started"></playing>
    <div id="leave" v-if="gameId" @click="leave">‹ Leave Game</div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import Spectating from '@/components/Spectating'
import Waiting from '@/components/Waiting'
import Playing from '@/components/Playing'
import Joining from '@/components/Joining'

export default {
  name: 'InGame',
  components: {
    Spectating,
    Waiting,
    Playing,
    Joining
  },
  methods: {
    ...mapActions(['leaveGame']),
    ...mapMutations(['endGame']),
    leave: function() {
      this.leaveGame()
      this.$router.replace({ path: '/' })
    }
  },
  data: function() {
    return {
      foundGame: undefined,
      listener: undefined,
      spectating: false,
      joining: false
    }
  },
  computed: {
    ...mapState(['gameId', 'game', 'games', 'userId']),
    ...mapGetters(['joiningGame', 'inGame']),
    started: function() { return this.inGame && this.game && this.game.started },
    starting: function() { return this.game && !this.game.started && this.game.active },
    pathGameId: function() { return this.$route.params.gameId }
  },
  mounted: function() {
    if (this.game === undefined) {
      const listener = this.games.doc(this.pathGameId).onSnapshot(game => {
        this.foundGame = game.data()
        this.spectating = this.foundGame.started
        this.joining = !this.foundGame.started
      })
      this.listener = listener
    }
  },
  watch: {
    inGame: function() {
      if (this.listener) {
        this.listener()
      }

      if (this.game !== undefined) {
        this.listener = undefined
        this.foundGame = undefined
        this.spectating = false
        this.joining = false
      } else {
        const listener = this.games.doc(this.pathGameId).onSnapshot(game => {
          this.foundGame = game.data()
          this.spectating = this.foundGame.started
          this.joining = !this.foundGame.started
        })
        this.listener = listener
      }
    },
    game: function(newValue, oldValue) {
      if (newValue === undefined && oldValue !== undefined) {
        this.endGame()
        this.$router.push('/')
        alert("The game closed! Sorry!")
      }
    }
  }
}
</script>

<style scoped>
#page {
  width: 100%;
  height: 100%;
}

#leave {
  position: fixed;
  left: 5px;
  top: 5px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  cursor: pointer;
}
</style>
