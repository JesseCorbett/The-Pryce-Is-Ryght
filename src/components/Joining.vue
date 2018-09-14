<template>
  <div id="modal-container">
    <div id="joining-modal">
      This game hasn't started yet.<br>Do you want to join?
      <light-button class="btn" label="Yes!" @click="joinGame(gameId)"></light-button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import LightButton from '@/components/LightButton'

export default {
  name: 'Joining',
  components: {
    LightButton
  },
  methods: mapActions(['joinGame']),
  props: {
    gameId: String,
    game: Object
  },
  computed: mapState(['userId']),
  watch: {
    game: function() {
      if (this.game !== undefined && this.game.players.includes(this.userId)) {
        this.joinGame(this.gameId)
      }
    }
  }
}
</script>

<style scoped>
#modal-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

#joining-modal {
  background-color: #FC7A01;
  border-radius: 7px;
  box-shadow: 4px 7px yellow;
  padding: 15px;
  color: white;
  text-align: center;
  font-size: 22px;
}

.btn {
  margin-top: 30px;
}
</style>
