<template>
  <div id="spectator">
    {{game}}
  </div>
</template>

<script>
export default {
  name: 'Spectating',
  components: {
    
  },
  props: {
    game: Object
  }
}
</script>

<style scoped>
#spectator {
  width: 100%;
  height: 100%;
}
</style>
