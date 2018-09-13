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
  games: firestore.collection('/games'),
  userId: undefined,
  game: undefined,
  gameListener: undefined
}

const getters = {
  isAuthenticated: state => state.userId != undefined,
  joiningGame: state => state.gameListener != undefined && state.game == undefined,
  inGame: state => state.game != undefined
}

const mutations = {
  setUserId: (state, userId) => state.userId = userId,
  setGame: (state, game) => state.game = game,
  registerGameListener: (state, listener) => state.gameListener = listener,
  endGame: (state) => {
    state.gameListener()
    state.gameListener = undefined
    state.game = undefined
  }
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
  joinRandomGame: store => store.dispatch('login').then(() => {
    if (store.getters.joiningGame) return
    store.state.games.where('active', '==', true).where('private', '==', false).where('playerCount', '<', 4).limit(1).get().then(gamesRef => {
      if (gamesRef.empty) {
        store.dispatch('startPublicGame')
      }
    })
  }),
  createGame: (store, isPrivate) => new Promise(resolve => {
    const doc = store.state.games.doc()
    doc.set({
      started: false,
      active: true,
      private: isPrivate,
      playerCount: 1,
      owner: store.state.userId,
      players: [ store.state.userId ],
      createdAt: new Date(),
      updatedAt: new Date(),
      rounds: []
    }).then(() => resolve())

    const listener = doc.onSnapshot(game => {
      store.commit('setGame', game)
    })

    store.commit('registerGameListener', listener)
  }),
  startPublicGame: store => store.dispatch('createGame', false).then(() => {
    console.log("Created public game")
  }),
  startPrivateGame: store => store.dispatch('createGame', true).then(() => {
    if (store.getters.joiningGame) return
    console.log("Created private game")
  })
}

export default {
  state,
  getters,
  mutations,
  actions
}