import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

firebase.initializeApp({
  projectId: "the-pryce-is-ryght",
  authDomain: "the-pryce-is-ryght.firebaseapp.com",
  apiKey: "AIzaSyD8OrejztLLpLfCshpIRM8eb_hJjNIK7gs"
})

const firestore = firebase.firestore()
firestore.settings({
  timestampsInSnapshots: true
})

const state = {
  db: firestore,
  games: firestore.collection('/games'),
  userId: undefined,
  game: undefined,
  gameId: undefined,
  gameListener: undefined,
  ready: false,
  allReady: false
}

const getters = {
  isAuthenticated: state => state.userId != undefined,
  joiningGame: state => state.gameListener != undefined && state.game == undefined,
  inGame: state => state.game != undefined,
  gameOwner: state => state.game !== undefined && state.game.owner === state.userId
}

const mutations = {
  setUserId: (state, userId) => state.userId = userId,
  setGame: (state, game) => state.game = game,
  setGameId: (state, gameId) => state.gameId = gameId,
  setReady: (state, ready) => state.ready = ready,
  setAllReady: (state, allReady) => state.allReady = allReady,
  registerGameListener: (state, listener) => state.gameListener = listener,
  endGame: (state) => {
    state.gameListener()
    state.gameListener = undefined
    state.game = undefined
    state.gameId = undefined
  }
}

const actions = {
  firebaseInit: store => firebase.auth().onAuthStateChanged(user => {
    if (user) {
      store.commit('setUserId', user.uid)
      store.state.games.where('active', '==', true).where('players', 'array-contains', user.uid).limit(1).get().then(gamesRef => {
        if (!gamesRef.empty) { store.dispatch('joinGame', gamesRef.docs[0].id) }
      })
    }
  }),
  login: store => new Promise(resolve => {
    if (store.getters.isAuthenticated) { resolve() } else { firebase.auth().signInAnonymously().then(() => resolve()) }
  }),
  joinGame: (store, gameId) => {
    const listener = store.state.games.doc(gameId).onSnapshot(game => {
      const lastUpdate = store.state.game ? store.state.game.ownerAck : undefined
      const hasPlayerAlready = store.state.game ? store.state.game.players.includes(store.state.userId) : false
      const data = game.data()
      store.commit('setGame', data)

      if (data.playerData[store.state.userId] !== undefined) {
        store.commit('setReady', data.playerData[store.state.userId].ready ? true : false)
      }

      store.commit('setAllReady', Object.values(data.playerData).map(datum => datum.ready).reduce((a, b) => a && b, true))

      if (!data.players.includes(store.state.userId) && !hasPlayerAlready) {
        const newPlayerData = data.playerData
        const newPlayers = data.players
        newPlayers.push(store.state.userId)
        newPlayerData[store.state.userId] = { ready: false }
        store.dispatch('updateGame', { players: newPlayers, playerCount: newPlayers.length, playerData: newPlayerData })
      }

      if (store.getters.gameOwner && lastUpdate === data.ownerAck) {
        store.state.games.doc(game.id).update({ ownerAck: Date.now() })
      }
    })

    store.commit('registerGameListener', listener)
    store.commit('setGameId', gameId)
  },
  updateGame: (store, update) => store.state.games.doc(store.state.gameId).update(update),
  joinRandomGame: store => store.dispatch('login').then(() => {
    if (store.getters.joiningGame) return
    store.state.games.where('started', '==', false).where('playerCount', '<', 4).where('private', '==', false).where('active', '==', true).limit(1).get().then(gamesRef => {
      if (gamesRef.empty) { store.dispatch('startPublicGame') } else { store.dispatch('joinGame', gamesRef.docs[0].id) }
    })
  }),
  createGame: (store, isPrivate) => new Promise(resolve => {
    const doc = store.state.games.doc()
    doc.set({
      started: false,
      active: true,
      readyForNewRound: false,
      private: isPrivate,
      playerCount: 0,
      owner: store.state.userId,
      players: [],
      playerData: {},
      createdAt: new Date(),
      rounds: [],
      playerStart: 0
    }).then(() => {
      store.dispatch('joinGame', doc.id)
      resolve()
    })
  }),
  startPublicGame: store => store.dispatch('createGame', false),
  startPrivateGame: store => store.dispatch('createGame', true),
  toggleReady: (store, nickname) => {
    if (!nickname) nickname = "Anonymous"
    if (store.state.gameId === undefined || store.state.game === undefined) return
    const playerData = store.state.game.playerData

    playerData[store.state.userId].ready = !playerData[store.state.userId].ready
    playerData[store.state.userId].nickname = nickname
    store.dispatch('updateGame', { playerData: playerData })
  },
  startGame: store => {
    if (store.state.allReady) store.dispatch('updateGame', { started: true, readyForNewRound: true })
  },
  makeGuess: (store, guess) => {
    const rounds = store.state.game.rounds
    rounds[rounds.length - 1].answers[store.state.userId] = guess * 100

    const readyForNew = Object.values(rounds[rounds.length - 1].answers[store.state.userId]).filter(answer => answer === null).length === 0

    store.dispatch('updateGame', { rounds: rounds, readyForNewRound: readyForNew })
  },
  leaveGame: store => store.dispatch('updateGame', { active: false, started: true, result: 'Someone left' }).then(() => store.commit('endGame'))
}

export default {
  state,
  getters,
  mutations,
  actions
}