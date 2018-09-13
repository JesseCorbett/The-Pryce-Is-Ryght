<template>
  <div class="home">
    <star id="star-left" class="star" color="yellow"></star>
    <dollar id="star-right" class="star" color="yellow"></dollar>
    <dashboard></dashboard>
  </div>
</template>

<script>
import Dashboard from '@/components/Dashboard'
import Star from '@/components/Star'
import Dollar from '@/components/Dollar'

export default {
  name: 'Home',
  components: {
    Dashboard,
    Star,
    Dollar
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
    left: 5%;
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