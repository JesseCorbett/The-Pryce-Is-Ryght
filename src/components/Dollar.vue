<template>
  <svg class="svg" version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg" width="250px" height="250px" viewBox="0 0 500 500">
    <path :stroke="color" d="m 145,312 c -2,69 31,100 104,102 78,1 113,-34 109,-101 -6,-58 -62,-73 -106,-79 -48,-17 -99,-25 -99,-95 0,-48 32,-79 99,-78 60,0 97,25 96,84" style="fill:none;stroke-width:40" />
    <path :stroke="color" d="m 250,15 0,470" style="stroke-width:30" />
  </svg>
</template>

<script>
export default {
  name: 'Dollar',
  props: {
    color: String
  }
}
</script>

<style scoped>
@keyframes rotation {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(-360deg);
    }
}

.svg {
  animation: rotation 15s infinite linear;
}

.star {
  filter: drop-shadow(6px 6px 6px rgba(0, 0, 0, 0.6));
}
</style>
