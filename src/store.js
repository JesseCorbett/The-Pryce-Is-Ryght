import Vue from 'vue'
import Vuex from 'vuex'
import firebase from './firebase'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    ...firebase.state
  },
  getters: {
    ...firebase.getters
  },
  mutations: {
    ...firebase.mutations
  },
  actions: {
    ...firebase.actions
  }
})

store.dispatch('firebaseInit')

export default store