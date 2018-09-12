<template>
  <svg class="svg" version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg" width="260px" height="260px">
    <path class="star" :fill="color ? color : 'yellow'" d="m55, 237 74-228 74, 228L9, 96h240"/>
  </svg>
</template>

<script>
export default {
  name: 'Star',
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
        transform: rotate(360deg);
    }
}

.svg {
  animation: rotation 20s infinite linear;
}

.star {
  filter: drop-shadow(4px 4px 4px rgba(0, 0, 0, 0.6));
}
</style>
