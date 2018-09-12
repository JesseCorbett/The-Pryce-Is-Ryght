<template>
  <div class="home">
    <star id="star-left" class="star" color="yellow"></star>
    <star id="star-right" class="star" color="yellow"></star>
    <dashboard></dashboard>
  </div>
</template>

<script>
import Dashboard from '@/views/game/Dashboard'
import Star from '@/components/Star'

export default {
  name: 'Home',
  components: {
    Dashboard,
    Star
  }
}
</script>

<style scoped>
.home {
  height: 100%;
}

.star {
  display: none;
}

@media screen and (min-width: 1024px) {
  #star-left {
    display: block;
    position: fixed;
    left: 3%;
    top: 150px;
  }

  #star-right {
    display: block;
    position: fixed;
    right: 5%;
    top: 150px;
  }
}
</style>