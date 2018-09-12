import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

firebase.initializeApp({
  projectId: "the-pryce-is-ryght",
  authDomain: "the-pryce-is-ryght.firebaseapp.com",
  apiKey: "AIzaSyD8OrejztLLpLfCshpIRM8eb_hJjNIK7gs"
})

const firestore = firebase.firestore();
firestore.settings({
  timestampsInSnapshots: true
})

const state = {
  db: firestore,
  userId: undefined,
  game: undefined
}

const getters = {
  isAuthenticated: state => state.userId != undefined,
  inGame: state => state.game != undefined
}

const mutations = {
  setUserId: (state, userId) => state.userId = userId
}

const actions = {
  firebaseInit: store => firebase.auth().onAuthStateChanged(user => {
    if (user) store.commit('setUserId', user.uid)
  }),
  login: store => new Promise(resolve => {
    if (store.getters.isAuthenticated) {
      resolve()
    } else {
      firebase.auth().signInAnonymously().then(() => resolve())
    }
  }),
  joinRandomGame: store => {
    store.state.db.collection('/games').where('active', '==', true).where('private', '==', false).where('playerCount', '<', 4).limit(1).get().then(gamesRef => {
      if (gamesRef.empty) {
        console.log("No open games found, creating our own")

      }
    })
  },
  startPrivateGame: store => console.log(store)
}

export default {
  state,
  getters,
  mutations,
  actions
}