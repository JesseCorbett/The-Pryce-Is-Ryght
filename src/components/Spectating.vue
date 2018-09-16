<template>
  <div id="spectator">
    <game :game="game" :round="round" :playing="false"></game>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Game from '@/components/Game'

export default {
  name: 'Spectating',
  components: {
    Game
  },
  props: {
    game: Object
  },
  methods: mapActions(['login']),
  beforeMount: function() {
    this.login()
  },
  computed: {
    round: function() {
      return this.game.rounds[this.game.rounds.length - 1]
    }
  }
}
</script>

<style scoped>
#spectator {
  width: 100%;
  height: 100%;
}
</style>
