<template>
  <div class="button-container"><div :class="{ button: true, disabled: disabled }" @click="doClick">{{label}}</div></div>
</template>

<script>
export default {
  name: 'LightButton',
  props: {
    label: String,
    disabled: Boolean
  },
  methods: {
    doClick: function() {
      if (this.disabled) return
      this.$emit('click')
    }
  }
}
</script>


<style scoped>
@keyframes blink { 
   50% { border-color: white; } 
}

.button-container {
  animation: blink .7s step-end infinite alternate;
  display: flex;
  flex-basis: 285px;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
  margin: 5px 10px;
  width: 285px;
  height: 85px;
  border-radius: 35px;
  border-color: yellow;
  border-width: 7px;
  border-style: dotted;
}

.button {
  user-select: none;
  cursor: pointer;
  width: 95%;
  height: 70px;
  background: linear-gradient(135deg, rgb(255, 51, 0) 0%, rgb(167, 33, 0) 100%);
  border-style: groove;
  border-color: rgb(255, 51, 0);
  border-radius: 25px;
  border-width: 5px;
  color: white;
  line-height: 70px;
  font-weight: bold;
  font-size: 26px;
  text-align: center;
}

.button.disabled {
  cursor: default;
  border-color: rgb(167, 154, 152);
  background: linear-gradient(135deg, rgb(167, 154, 152) 0%, rgb(124, 115, 112) 100%);
}
</style>
